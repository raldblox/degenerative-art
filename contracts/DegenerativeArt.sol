// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IVisualEngine} from "./interfaces/IVisualEngine.sol";

contract Degeneratives is ERC721, Ownable(msg.sender) {
    uint public totalSupply;
    IVisualEngine public engine;

    mapping(uint256 => string[]) public emojis;
    mapping(bytes32 => bool) public emojiCombinations;

    uint256 public constant BASE_PRICE = 1 ether; // starting price
    uint256 public constant PRICE_FACTOR = 2; // multiplier for the exponent
    uint256 public constant SUPPLY_DIVISOR = 1000; // steepness of the curve

    event TokenMinted(uint256 indexed tokenID, address owner);

    constructor(address theme) payable ERC721("Degenerative Art", "DEGENART") {
        engine = IVisualEngine(theme);
    }

    function updateEngine(address newEngine) external onlyOwner {
        engine = IVisualEngine(newEngine);
    }

    function price() public view returns (uint256) {
        // Calculate Dynamic Mint Price (Exponential Curve)
        uint256 exponent = totalSupply / SUPPLY_DIVISOR;
        uint256 currentPrice = BASE_PRICE * PRICE_FACTOR ** exponent;
        return currentPrice;
    }

    function mint(string[] memory _emojis) public payable {
        require(msg.value >= price(), "Insufficient funds");
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
