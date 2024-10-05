// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IMoodBank.sol";
import "../interfaces/IVisualEngine.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

contract DegenerativesNFT is Ownable(msg.sender), ERC721Enumerable, Pausable {
    uint256 public immutable chainId;

    uint256 public tokenIds = 0;
    IMoodBank public bank;
    IVisualEngine public engine;

    address public treasury;
    address public relayer;

    mapping(bytes32 => bool) public tokenized;
    mapping(uint256 tokenId => uint) public moodIds;
    mapping(uint256 tokenId => uint256) public expansionLevels;

    error NotOwner();
    error ZeroAddress();
    error Tokenized();
    error Failed();

    event MetadataUpdate(uint256 _tokenId);
    event TokenBurnt(uint256 _tokenId);
    event TokenMinted(uint256 _tokenId);

    constructor(
        uint256 _chainId,
        address _moodBank,
        address _relayer,
        address _engine
    ) ERC721("MOODART By Degeneratives", "MOODART") {
        chainId = _chainId;
        bank = IMoodBank(_moodBank);
        engine = IVisualEngine(_engine);
        treasury = msg.sender;
        relayer = _relayer;
    }

    modifier valid(string[] memory characters, uint256 expansionLevel) {
        if (expansionLevel == 0) {
            require(
                characters.length == 1,
                "Expansion level 0 requires 1 character"
            );
        } else if (expansionLevel == 1) {
            require(
                characters.length == 9,
                "Expansion level 1 requires 9 characters"
            );
        } else if (expansionLevel == 2) {
            require(
                characters.length == 25,
                "Expansion level 2 requires 25 characters"
            );
        } else if (expansionLevel == 3) {
            require(
                characters.length == 49,
                "Expansion level 3 requires 49 characters"
            );
        } else {
            revert("Invalid expansion level");
        }
        _;
    }

    function mint(
        address receiver,
        string[] memory characters,
        uint256 expansionLevel,
        bool payNative,
        uint256 value,
        address token
    )
        external
        payable
        valid(characters, expansionLevel)
        whenNotPaused
        returns (uint256)
    {
        require(
            !tokenized[hash(characters)] &&
                (payNative ? msg.value >= price(tokenIds) : true),
            "Invalid mint conditions"
        );

        if (payNative) {
            (bool success, ) = payable(treasury).call{value: msg.value}("");
            require(success, "Native payment failed");
        } else {
            require(
                msg.sender == relayer &&
                    IERC20(token).transferFrom(receiver, treasury, value),
                "Payment failed"
            );
        }

        uint256 moodId = bank.addMood(chainId, receiver, characters);
        uint256 newTokenId = generateTokenId();
        _safeMint(receiver, newTokenId);

        bytes32 charHash = hash(characters);
        tokenized[charHash] = true;

        moodIds[newTokenId] = moodId;
        tokenIds++;

        emit TokenMinted(newTokenId);
        return newTokenId;
    }

    function update(
        address owner,
        uint256 tokenId,
        string[] memory characters,
        uint256 expansionLevel
    ) external payable valid(characters, expansionLevel) whenNotPaused {
        if (ownerOf(tokenId) != owner) revert NotOwner();

        // check
        bytes32 newMoodHash = hash(characters);
        require(!tokenized[newMoodHash], "tokenized");
        string[] memory oldMood = getMood(tokenId);
        bytes32 oldMoodHash = hash(oldMood);
        require(newMoodHash != oldMoodHash, "same");

        // if (payNative) {
        //     (bool success, ) = payable(treasury).call{value: msg.value}("");
        //     require(success, "Native payment failed");
        // } else {
        //     require(
        //         msg.sender == relayer &&
        //             IERC20(token).transferFrom(owner, treasury, value),
        //         "Payment failed"
        //     );
        // }

        uint256 newMoodId = bank.addMood(chainId, owner, characters);

        tokenized[oldMoodHash] = false;
        tokenized[newMoodHash] = true;

        moodIds[tokenId] = newMoodId;

        emit MetadataUpdate(tokenId);
    }

    function burn(uint256 tokenId) external payable whenNotPaused {
        _requireOwned(tokenId);
        if (ownerOf(tokenId) != msg.sender) revert NotOwner();

        uint256 moodId = moodIds[tokenId];
        string[] memory mood = bank.getMoodById(moodId);
        bytes32 moodHash = hash(mood);
        tokenized[moodHash] = false;
        delete moodIds[tokenId];

        _burn(tokenId);
        emit TokenBurnt(tokenId);
    }

    function updateTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function updateRelayer(address _relayer) external onlyOwner {
        relayer = _relayer;
    }

    function updateBank(address _moodBank) external onlyOwner {
        bank = IMoodBank(_moodBank);
    }

    function updateVisualEngine(address _visualEngine) external onlyOwner {
        engine = IVisualEngine(_visualEngine);
    }

    function price(uint256 supply) public pure returns (uint256 value) {
        value = 1 ether + 10e12 * (supply ** 2);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory metadata = getMetadata(tokenId);
        return metadata;
    }

    function generateTokenId() public view returns (uint256 result) {
        result = (chainId * 10 ** 17) + tokenIds;
    }

    function getMetadata(uint256 tokenId) public view returns (string memory) {
        string memory metadata = engine.generateMetadata(
            tokenId,
            ownerOf(tokenId),
            getMood(tokenId),
            getExpansionLevel(tokenId)
        );
        return metadata;
    }

    function getMoodId(uint256 tokenId) public view returns (uint256) {
        return moodIds[tokenId];
    }

    function getMood(uint256 tokenId) public view returns (string[] memory) {
        uint256 moodId = moodIds[tokenId];
        string[] memory mood = bank.getMoodById(moodId);
        return mood;
    }

    function getExpansionLevel(uint256 tokenId) public view returns (uint256) {
        return expansionLevels[tokenId];
    }

    function recover(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        if (token == address(0)) {
            (bool sent, ) = payable(to).call{value: amount}("");
            if (!sent) revert Failed();
        } else {
            bool sent = IERC20(token).transfer(to, amount);
            if (!sent) revert Failed();
        }
    }

    function hash(string[] memory characters) public pure returns (bytes32) {
        string memory chars;
        for (uint256 i = 0; i < characters.length; i++) {
            chars = string.concat(chars, characters[i]);
        }
        return keccak256(abi.encodePacked(chars));
    }
}
