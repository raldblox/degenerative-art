// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {DegenerativesArtV2, IDegenerativesArt, IVisualEngine, IERC20, MoodData} from "./DegenerativesArtV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title degeneratives.art NFT contract
 * @author raldblox.eth | github.com/raldblox
 * @notice This contract manages the DegenerativesArt NFT collection, where each NFT represents a unique expression of emotions through emojis.
 * @dev The contract utilizes a dynamic pricing curve model for `mint`
 * Note: Mood pattern data is recorded by user address and not deletable by design.
 */

contract DegenerativesArtV3 is
    IDegenerativesArt,
    ERC721Enumerable,
    Ownable(msg.sender)
{
    DegenerativesArtV2 public degenerativesV2;
    IERC20 public MOOD;

    // Errors
    error InsufficientFunds();
    error NotTokenOwner();
    error ZeroAddressProvided();
    error EmojiCombinationAlreadyExists();
    error TransferFailed();
    error CooldownNotOver();
    error Paused();

    // Constants
    uint256 public cooldown = 1 minutes; // @note for mint/update cooldown

    // State Variables
    bool public migrated = false;
    bool public paused = true;
    uint public tokenIds;
    uint public totalMoodSwing;
    address payable public treasury;
    address public defaultTheme; // @note default theming engine

    // Mappings
    mapping(uint256 => string[]) private emojis;
    mapping(uint256 => uint256) private moodSwings;
    mapping(bytes32 => bool) public emojisTaken;
    mapping(address => uint256) private lastUpdateTimestamp;
    mapping(uint256 => address) private themes;
    mapping(uint256 => mapping(address => bool)) public themePaid;
    mapping(address => MoodData[]) private moodPatterns;

    // Events
    event TokenMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string[] emojis
    );
    event TokenUpdated(uint256 indexed tokenId, string[] newEmojis);
    event ThemeUpdated(uint256 indexed tokenId, address themeAddress);
    event TokenBurnt(uint256 indexed tokenId, address owner);
    event ThemePaid(uint256 indexed tokenId, address indexed themeAddress);
    event FundsRecovered(
        address indexed token,
        address indexed to,
        uint256 amount
    );

    constructor() ERC721("degeneratives.art", "DEGENARTV3") {
        degenerativesV2 = DegenerativesArtV2(
            0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F
        );
        treasury = payable(msg.sender);
        MOOD = IERC20(0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9); // mood token
        defaultTheme = 0x7defc5C23B46F8FC35A5dFD35Df6d1923774B857; // dynamic
    }

    modifier validEmojis(string[] memory _emojis) {
        require(_emojis.length == 9, "must be 3x3 emojis");
        _;
    }

    //***** PUBLIC FUNCTION *****//
    function mint(
        string[] memory _emojis,
        address themeAddress
    ) external payable validEmojis(_emojis) {
        if (paused) revert Paused();
        if (msg.value < price(tokenIds)) revert InsufficientFunds();
        if (treasury == address(0)) revert ZeroAddressProvided();

        // Check if cooldown have passed since the last mint/update
        if (lastUpdateTimestamp[msg.sender] + cooldown > block.timestamp) {
            revert CooldownNotOver();
        }

        bytes32 emojiHash_ = emojiHash(_emojis);
        if (emojisTaken[emojiHash_]) revert EmojiCombinationAlreadyExists();

        (address token, uint256 value) = IVisualEngine(themeAddress).getPrice();
        if (
            value != 0 &&
            token != address(0) &&
            IERC20(token).balanceOf(msg.sender) >= value
        ) {
            bool paid = IERC20(token).transferFrom(msg.sender, treasury, value);
            if (!paid) revert TransferFailed();
            themePaid[tokenIds][themeAddress] = true;
            emit ThemePaid(tokenIds, themeAddress);
        }

        (bool sent, ) = payable(treasury).call{value: msg.value}("");
        if (!sent) revert TransferFailed();

        mint(msg.sender, tokenIds);

        _updateEmojis(msg.sender, tokenIds, _emojis);
        _updateTheme(tokenIds, themeAddress);
        _dropMintReward(msg.sender);

        emit TokenMinted(tokenIds, msg.sender, _emojis);
    }

    function migrate(
        uint256 tokenId,
        string[] memory _emojis,
        uint256 moodSwingCount,
        bool toBurn
    ) external payable onlyOwner {
        require(!migrated, "Migration finished");
        require(_ownerOf(tokenId) == address(0), "Token already minted");

        address v2owner;

        if (toBurn) {
            v2owner = msg.sender;
        } else {
            v2owner = degenerativesV2.ownerOf(tokenId);
            if (v2owner == address(0)) {
                revert ZeroAddressProvided();
            }
        }

        mint(v2owner, tokenId);

        _updateEmojis(v2owner, tokenId, _emojis); // @note +1 moodswing
        _updateTheme(tokenId, defaultTheme);

        moodSwings[tokenId] = moodSwingCount;
        totalMoodSwing = totalMoodSwing + moodSwingCount - 1; // rebalance moodswing

        if (degenerativesV2.tokenIds() == tokenIds) {
            migrated = true;
        }
    }

    function mint(address owner, uint256 tokenId) internal {
        _safeMint(owner, tokenId);
        tokenIds++;
    }

    function burn(uint256 tokenId) public payable {
        _requireOwned(tokenId);
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();

        string[] memory emojis_ = getEmojis(tokenId);
        bytes32 emojiHash_ = emojiHash(emojis_);
        emojisTaken[emojiHash_] = false; // Mark the emoji combination as available again
        delete emojis[tokenId]; // Clear emojis

        _burn(tokenId);
        emit TokenBurnt(tokenId, msg.sender);
    }

    function update(
        uint256 tokenId,
        string[] memory newEmojis
    ) external payable validEmojis(newEmojis) {
        uint256 updatePayment = 100 * 10 ** 18; // @note update fees 100 MOOD
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (MOOD.balanceOf(ownerOf(tokenId)) < updatePayment)
            revert InsufficientFunds();

        if (
            lastUpdateTimestamp[ownerOf(tokenId)] + cooldown > block.timestamp
        ) {
            revert CooldownNotOver();
        }

        if (treasury == address(0)) revert ZeroAddressProvided();

        bool paid = MOOD.transferFrom(msg.sender, treasury, updatePayment);
        if (!paid) revert TransferFailed();

        _updateEmojis(ownerOf(tokenId), tokenId, newEmojis);
    }

    function upgrade(uint256 tokenId, address themeAddress) external payable {
        if (themeAddress == address(0)) revert ZeroAddressProvided();
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();

        if (!themePaid[tokenId][themeAddress]) {
            (address token, uint256 value) = IVisualEngine(themeAddress)
                .getPrice();
            if (value > 0) {
                require(
                    IERC20(token).transferFrom(msg.sender, treasury, value),
                    "Payment failed"
                );
                themePaid[tokenId][themeAddress] = true;
            }
        }

        _updateTheme(tokenId, themeAddress);
    }

    //***** HELPER FUNCTIONS *****//

    function price(uint256 supply) public pure returns (uint256) {
        return 10e12 * (supply ** 2); // @note with tokenSupply 10000, price = 1000 ether
    }

    function emojiHash(string[] memory emojis_) public pure returns (bytes32) {
        string memory emojiString = _concatEmojis(emojis_);
        return keccak256(abi.encodePacked(emojiString));
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory metadata = getMetadata(tokenId, getTheme(tokenId));
        return metadata;
    }

    //**** GETTER/INTERFACE FUNCTION *****/

    function getMoodSwing(uint256 tokenId) public view returns (uint256) {
        return moodSwings[tokenId];
    }

    function getEmojis(uint256 tokenId) public view returns (string[] memory) {
        return emojis[tokenId];
    }

    function getMetadata(
        uint256 tokenId,
        address themeAddress
    ) public view returns (string memory) {
        IVisualEngine engine = IVisualEngine(themeAddress);
        string memory metadata = engine.generateMetadata(
            tokenId,
            ownerOf(tokenId),
            getEmojis(tokenId),
            getMoodSwing(tokenId)
        );
        return metadata;
    }

    function getTheme(uint256 tokenId) public view returns (address) {
        return themes[tokenId];
    }

    function getMoodPattern(
        address owner
    ) public view returns (MoodData[] memory) {
        return moodPatterns[owner];
    }

    function getLastMoodUpdate(address owner) public view returns (uint256) {
        return lastUpdateTimestamp[owner];
    }

    //***** ADMIN FUNCTION *****//

    /// @notice Updates the Visual Engine contract address
    /// @dev Only callable by the contract owner
    /// @param themeAddress The address of the new Visual Engine contract
    function updateDefaultTheme(address themeAddress) external onlyOwner {
        defaultTheme = themeAddress;
    }

    /// @notice Allows the owner to update the treasury address
    /// @param newTreasury The address of the treasury
    function updateTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert ZeroAddressProvided();
        treasury = payable(newTreasury);
    }

    /// @notice Allows the owner to update the cooldown
    /// @param _cooldown The cooldown in seconds
    function updateCooldown(uint256 _cooldown) external onlyOwner {
        cooldown = _cooldown;
    }

    function pause(bool isPaused) external onlyOwner {
        paused = isPaused;
    }

    /// @notice Allows the owner to recover accidentally sent ERC20 tokens or ETH from the contract
    /// @param token The address of the ERC20 token (use address(0) for ETH)
    /// @param to The address to send the recovered funds to
    /// @param amount The amount of tokens to recover
    function recover(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        if (token == address(0)) {
            (bool sent, ) = payable(to).call{value: amount}("");
            if (!sent) revert TransferFailed();
        } else {
            bool sent = IERC20(token).transfer(to, amount);
            if (!sent) revert TransferFailed();
        }
        emit FundsRecovered(token, to, amount);
    }

    //***** INTERNAL FUNCTION *****//

    function _updateEmojis(
        address owner,
        uint256 tokenId,
        string[] memory _emojis
    ) internal returns (bool) {
        // Update emoji mappings
        bytes32 oldEmojiHash = emojiHash(getEmojis(tokenId));
        bytes32 newEmojiHash = emojiHash(_emojis);

        // Only make the old combination available again if it's different from the new one
        if (oldEmojiHash != newEmojiHash) {
            if (_ownerOf(tokenId) != address(0)) {
                emojisTaken[oldEmojiHash] = false;
            }

            // Mark the new emoji combination as used only if it's different
            emojisTaken[newEmojiHash] = true;
        }

        emojis[tokenId] = _emojis;

        // Update mood swing counter; record mood patterns
        moodSwings[tokenId]++; // Increase the counter for mood swings
        totalMoodSwing++;
        moodPatterns[owner].push(MoodData(tokenId, block.timestamp, _emojis));
        lastUpdateTimestamp[owner] = block.timestamp;

        emit TokenUpdated(tokenId, _emojis);

        return true;
    }

    function _updateTheme(uint256 tokenId, address theme) internal {
        themes[tokenId] = theme;
        emit ThemeUpdated(tokenId, theme);
    }

    function _concatEmojis(
        string[] memory emojis_
    ) internal pure returns (string memory emojiString) {
        for (uint256 i = 0; i < emojis_.length; i++) {
            emojiString = string.concat(emojiString, emojis_[i]);
        }
    }

    function _dropMintReward(address minter) internal {
        uint256 moodReward = 1000 * 10 ** 18;
        if (MOOD.balanceOf(address(this)) > moodReward) {
            bool success = MOOD.transfer(minter, moodReward);
            require(success, "Reward transfer failed");
        }
    }
}
