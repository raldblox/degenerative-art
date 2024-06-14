// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IDegenerativesArt.sol";
import "./interfaces/IVisualEngine.sol";
import "./interfaces/IPricer.sol";
import "./interfaces/IERC20.sol";

/**
 * @title degeneratives.art NFT contract
 * @author raldblox.eth | github.com/raldblox
 * @notice This contract manages the DegenerativesArt NFT collection, where each NFT represents a unique expression of emotions through emojis.
 * @dev The contract utilizes a dynamic pricing curve model for `mint`, emojihash combination check, and
 * allows for token updates with various ERC20 tokens (managed on pricer contract).
 * Note: Mood pattern data is recorded by user address and not deletable by design.
 */

contract DegenerativesArt is IDegenerativesArt, ERC721, Ownable(msg.sender) {
    // Errors
    error InsufficientFunds();
    error NotTokenOwner();
    error ZeroAddressProvided();
    error EmojiCombinationAlreadyExists();
    error InvalidPricer();
    error TransferFailed();
    error CooldownNotOver();

    // Constants
    uint256 public constant UPDATE_COOLDOWN = 4 hours; // @note for mint/update coolfdown

    // State Variables
    uint public tokenIds;
    uint public totalSupply;
    IVisualEngine public engine;
    address payable public treasury; // @note can set to owner or liquidity pool contract

    // Mappings
    mapping(uint256 => string[]) private emojis;
    mapping(uint256 => uint256) private moodSwings;
    mapping(bytes32 => bool) public emojisTaken;
    mapping(address => uint256) private lastUpdateTimestamp;
    mapping(address => MoodData[]) private moodPatterns;
    mapping(address => bool) public validPricers;

    // Events
    event TokenMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string[] emojis
    );
    event TokenUpdated(uint256 indexed tokenId, string[] newEmojis);
    event EngineUpdated(address indexed newEngine);
    event TokenBurnt(uint256 indexed tokenId, address owner);
    event FundsRecovered(
        address indexed token,
        address indexed to,
        uint256 amount
    );
    event PricerUpdated(address indexed pricer, bool isValid);

    constructor(address _engine) ERC721("degeneratives.art", "DEGENART") {
        engine = IVisualEngine(_engine);
        treasury = payable(msg.sender);
    }

    //***** PUBLIC FUNCTION *****//

    /// @notice Mints a new Degenerative Art NFT based on a combination of emojis
    /// @dev Requires sufficient ETH payment and a unique emoji combination
    /// @param _emojis An array of emoji strings representing the mood
    function mint(address to, string[] memory _emojis) external payable {
        if (to == address(0)) revert ZeroAddressProvided();
        if (msg.value < price(totalSupply)) revert InsufficientFunds();

        // Check if 4 hours have passed since the last mint/update (for `to` address)
        if (lastUpdateTimestamp[to] + UPDATE_COOLDOWN > block.timestamp) {
            revert CooldownNotOver();
        }

        bytes32 emojiHash_ = emojiHash(_emojis);
        if (emojisTaken[emojiHash_]) revert EmojiCombinationAlreadyExists();

        if (treasury == address(0)) revert ZeroAddressProvided();
        (bool sent, ) = payable(treasury).call{value: msg.value}("");
        if (!sent) revert TransferFailed();

        _updateEmojis(to, totalSupply, _emojis);
        _safeMint(to, totalSupply);

        emit TokenMinted(totalSupply, to, _emojis);
        totalSupply++;
        tokenIds++;
    }

    /// @notice Burns a Degenerative Art NFT and removes its associated token data
    /// @dev Requires ownership of the token
    /// @param tokenId The ID of the token to burn
    function burn(uint256 tokenId) external payable {
        _requireOwned(tokenId);
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();

        string[] memory emojis_ = getEmojis(tokenId);
        bytes32 emojiHash_ = emojiHash(emojis_);
        emojisTaken[emojiHash_] = false; // Mark the emoji combination as available again
        delete emojis[tokenId]; // Clear emojis

        _burn(tokenId);
        emit TokenBurnt(tokenId, msg.sender);
        totalSupply--;
    }

    /// @notice Updates the emojis associated with an existing Degenerative Art NFT
    /// @dev Requires token ownership and payment in the specified ERC20 token
    /// @param tokenId The ID of the token to update
    /// @param newEmojis The new array of emoji strings
    /// @param pricerAddress The address of the Pricer contract for dynamic pricing
    /// @param tokenAddress The address of the ERC20 token to be used for payment
    function update(
        uint256 tokenId,
        string[] memory newEmojis,
        address pricerAddress,
        address tokenAddress
    ) external payable {
        if (pricerAddress == address(0)) revert ZeroAddressProvided();
        if (tokenAddress == address(0)) revert ZeroAddressProvided();
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (!validPricers[pricerAddress]) revert InvalidPricer();

        // Check if 4 hours have passed since the last update
        if (
            lastUpdateTimestamp[ownerOf(tokenId)] + UPDATE_COOLDOWN >
            block.timestamp
        ) {
            revert CooldownNotOver();
        }

        // Fetch price from the Pricer contract and also get the status if token is allowed
        (bool tokenAllowed, uint256 tokenValue) = IPricer(pricerAddress).price(
            tokenId,
            tokenAddress
        );

        if (tokenAllowed && tokenValue > 0) {
            bool paid = IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                tokenValue
            );
            if (!paid) revert TransferFailed();
        }

        // Update and log emojis
        _updateEmojis(ownerOf(tokenId), tokenId, newEmojis);
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

        // If the new emoji combination is different from the old one, make the old one available again
        if (oldEmojiHash != newEmojiHash) {
            if (_ownerOf(tokenId) != address(0)) {
                emojisTaken[oldEmojiHash] = false;
            }
        }

        emojis[tokenId] = _emojis;

        // Update mood swing counter; record mood patterns
        moodSwings[tokenId]++; // Increase the counter for mood swings
        moodPatterns[owner].push(
            MoodData(totalSupply, block.timestamp, _emojis)
        );

        //Mark the current emoji combination as used
        emojisTaken[newEmojiHash] = true;
        lastUpdateTimestamp[owner] = block.timestamp;

        emit TokenUpdated(tokenId, _emojis);

        return true;
    }

    //***** HELPER FUNCTIONS *****//

    /// @notice Calculates the mint price based on current supply
    /// @dev Uses a quadratic curve to increase price as supply increases
    /// @param supply The current total supply of minted tokens
    function price(uint256 supply) public pure returns (uint256) {
        return 10e12 * (supply ** 2); // @note with tokenSupply 10000, price = 1000 ether
    }

    /// @notice Hashes a combination of emojis for uniqueness check
    /// @param emojis_ An array of emoji strings to be hashed
    function emojiHash(string[] memory emojis_) public pure returns (bytes32) {
        string memory emojiString = concatEmojis(emojis_);
        return keccak256(abi.encodePacked(emojiString));
    }

    function concatEmojis(
        string[] memory emojis_
    ) public pure returns (string memory emojiString) {
        for (uint256 i = 0; i < emojis_.length; i++) {
            emojiString = string.concat(emojiString, emojis_[i]);
        }
    }

    /// @notice Returns the metadata URI for a given token ID
    /// @dev Generates metadata dynamically using the Visual Engine
    /// @param tokenId The ID of the token to fetch metadata for
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        return
            engine.generateMetadata(
                tokenId,
                ownerOf(tokenId),
                getEmojis(tokenId),
                getMoodSwing(tokenId)
            );
    }

    //**** GETTER/INTERFACE FUNCTION *****/

    function getMoodSwing(uint256 tokenId) public view returns (uint256) {
        return moodSwings[tokenId];
    }

    function getEmojis(uint256 tokenId) public view returns (string[] memory) {
        return emojis[tokenId];
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
    /// @param newEngine The address of the new Visual Engine contract
    function updateEngine(address newEngine) external onlyOwner {
        engine = IVisualEngine(newEngine);
        emit EngineUpdated(newEngine);
    }

    /// @notice Allows the owner to update the validity of a pricer contract
    /// @param pricer The address of the pricer contract
    /// @param isValid Whether the pricer is valid or not
    function updatePricer(address pricer, bool isValid) external onlyOwner {
        validPricers[pricer] = isValid;
        emit PricerUpdated(pricer, isValid);
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
}
