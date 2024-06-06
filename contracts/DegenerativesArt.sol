// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IVisualEngine} from "./interfaces/IVisualEngine.sol";
import {IERC20} from "./interfaces/IERC20.sol";

contract DegenerativesArt is ERC721, Ownable(msg.sender) {
    uint public totalSupply;
    IVisualEngine public engine;
    IERC20 public emojiToken;

    mapping(uint256 => string[]) public emojis;
    mapping(bytes32 => bool) public emojiCombinations;

    uint256 public constant BASE_PRICE = 0.01 ether; // Starting price
    uint256 public constant LOG_BASE = 10; // The base of the logarithm (adjust for curve steepness)
    uint256 public constant PRICE_MULTIPLIER = 1; // Fine-tune price increase rate

    event TokenMinted(uint256 indexed tokenID, address owner);

    constructor(
        address theme,
        address _emojiToken
    ) payable ERC721("Degenerative Art", "DEGENART") {
        engine = IVisualEngine(theme);
        emojiToken = IERC20(_emojiToken);
    }

    function updateEngine(address newEngine) external onlyOwner {
        engine = IVisualEngine(newEngine);
    }

    function price(uint256 supply) public pure returns (uint256) {
        supply++;
        uint256 price_ = 1 ether * (((supply) * 2 ** 3));
        return price_;
    }

    function mint(string[] memory _emojis) public payable {
        require(msg.value >= price(totalSupply), "Insufficient funds");
        string memory emojiString = "";
        for (uint i = 0; i < _emojis.length; i++) {
            emojiString = string.concat(emojiString, _emojis[i]);
        }
        bytes32 emojiHash = keccak256(abi.encodePacked(emojiString));
        require(
            !emojiCombinations[emojiHash],
            "Emoji combination already exists"
        );
        (bool paid, ) = payable(owner()).call{value: msg.value}("");
        require(paid, "Failed to claim ether");
        emojis[totalSupply] = _emojis;
        emojiCombinations[emojiHash] = true;
        _safeMint(msg.sender, totalSupply);
        totalSupply++;
    }

    function update(uint256 tokenId, string[] memory newEmojis) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner of token");
        uint256 updateCost = 1 * 10 ** 18; // 1 $EMOJI per update
        emojiToken.transferFrom(msg.sender, address(this), updateCost);
        emojiToken.burn(updateCost); // Burn EMOJI tokens for the update
        emojis[tokenId] = newEmojis;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        address tokenOwner = _requireOwned(tokenId);
        string memory metadata = engine.generateMetadata(
            tokenId,
            tokenOwner,
            emojis[tokenId]
        );
        return metadata;
    }

    function claim(
        address _token,
        address _to,
        uint256 _amount,
        uint256 _value
    ) external onlyOwner {
        if (_amount > 0) {
            IERC20(_token).transfer(_to, _amount);
        }
        if (_value > 0) {
            (bool claimed, ) = payable(_to).call{value: _value}("");
            require(claimed, "Failed to claim ether");
        }
    }

    receive() external payable {}
}
