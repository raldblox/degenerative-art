// SPDX-License-Identifier: MIT
// OnChainVision Contracts

pragma solidity ^0.8.24;

import "../staking/TokenStaking.sol";
import {SmartCodec} from "../utils/SmartCodec.sol";
import {IVisualEngine} from "../interfaces/IVisualEngine.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Expandable is IVisualEngine, Ownable(msg.sender) {
    using Strings for uint256;
    string public theme = "Dynamic";
    string public networkName;
    uint256 public networkId;

    LPStaking public staking;

    constructor(string memory _networkName, uint256 _networkId) {
        networkName = _networkName;
        networkId = _networkId;
    }

    function updateStakingContract(address _staking) public onlyOwner {
        staking = LPStaking(_staking);
    }

    function stakedToken(address owner) public view returns (bool) {
        if (staking.balanceOf(owner) == 0) {
            return false;
        } else {
            return true;
        }
    }

    function generateTextElement(
        string[] memory emojis
    ) public pure returns (string memory) {
        uint256 gridSize = sqrt(emojis.length);
        uint256 cellWidth = (48 * 1000) / gridSize; // Keep precision by multiplying by 1000
        string memory result = "";

        for (uint256 i = 0; i < emojis.length; i++) {
            uint256 row = i / gridSize;
            uint256 col = i % gridSize;

            // Calculate x and y with decimals
            uint256 x = (col * cellWidth + cellWidth / 2);
            uint256 y = (row * cellWidth + cellWidth / 2);

            // Convert to string with 3 decimal places (manual formatting)
            string memory xStr = string.concat(
                Strings.toString(x / 1000),
                ".",
                Strings.toString((x % 1000) / 100)
            );
            string memory yStr = string.concat(
                Strings.toString(y / 1000),
                ".",
                Strings.toString((y % 1000) / 100)
            );

            result = string.concat(
                result,
                '<text x="',
                xStr,
                '" y="',
                yStr,
                '" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="',
                (cellWidth / 1300).toString(),
                '" text-anchor="middle">',
                emojis[i],
                "</text>"
            );
        }

        return result;
    }

    // Helper function to calculate the square root of a number
    function sqrt(uint256 x) private pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function generateImage(
        uint256 tokenId,
        address owner,
        string[] memory emojis
    ) public view returns (string memory) {
        string memory texts = generateTextElement(emojis);
        string memory svgImage = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" fill="none" viewBox="0 0 48 48">',
                '<defs><linearGradient id="a" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="red"/><stop offset="100%" stop-color="#2fa9e5"/></linearGradient><linearGradient id="b" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c839ee"/><stop offset="100%" stop-color="#f0aa23"/></linearGradient><linearGradient id="c" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#a8ec31"/><stop offset="100%" stop-color="#ec1a8e"/></linearGradient></defs><path fill="url(#a)" d="M0 0h48v48H0z"><animate attributeName="fill-opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/></path><path fill="url(#b)" d="M0 0h48v48H0z"><animate attributeName="fill-opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/></path><path fill="url(#c)" d="M0 0h48v48H0z"><animate attributeName="fill-opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite"/></path>',
                '<g transform="translate(2.5, 2.5) scale(0.9)">',
                texts,
                "</g>",
                "</svg>"
            )
        );

        string memory base64Image = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                SmartCodec.encode(bytes(svgImage))
            )
        );

        return base64Image;
    }

    function generateGridTraits(
        string[] memory emojis
    ) public pure returns (string memory traits) {
        uint256 len = emojis.length;
        string memory expansionLevel;

        if (len == 1) {
            expansionLevel = "1";
        } else if (len == 9) {
            expansionLevel = "2";
        } else if (len == 25) {
            expansionLevel = "3";
        } else if (len == 49) {
            expansionLevel = "4";
        } else {
            expansionLevel = "Invalid";
        }

        traits = string(
            abi.encodePacked(
                '{"trait_type": "Expansion Level", "value": "',
                expansionLevel,
                '"}'
            )
        );
    }

    function generateMetadata(
        uint256 tokenId,
        address owner,
        string[] memory emojis,
        uint256 moodSwing
    ) public view returns (string memory) {
        // generate image
        string memory image = generateImage(tokenId, owner, emojis);
        // get mode
        string memory mode = theme;
        string memory externalUrl = string(
            abi.encodePacked(
                "https://degeneratives.art/id/",
                Strings.toString(tokenId),
                "?network=",
                networkName
            )
        );

        string memory gridTraits = generateGridTraits(emojis);

        string memory metadata = string(
            abi.encodePacked(
                '{"name":"MOODART #',
                Strings.toString(tokenId),
                unicode'","description":"Mood Art by Degeneratives is a collection of unpredictable human expressions. Each token is a reflection of its owner`s mood, visualized by onchain algorithms.", "image": "',
                image,
                '","external_url": "',
                externalUrl,
                '","attributes": [',
                gridTraits,
                ',{"trait_type": "Theme", "value": "',
                mode,
                '"}]}'
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    SmartCodec.encode(bytes(metadata))
                )
            );
    }

    function generateEmojis(
        string[] memory emojis
    ) public pure returns (string memory) {
        bytes memory result = "[";
        for (uint256 i = 0; i < emojis.length; i++) {
            result = abi.encodePacked(result, "'", (emojis[i]), "'");
            if (i < emojis.length - 1) {
                result = abi.encodePacked(result, ", ");
            }
        }
        result = abi.encodePacked(result, "]");
        return string(result);
    }
}
