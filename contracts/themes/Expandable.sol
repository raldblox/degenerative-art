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

    function generateImage(
        uint256 tokenId,
        address owner,
        string[] memory emojis
    ) public view returns (string memory) {
        string memory svgImage = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" fill="none" viewBox="0 0 48 48">',
                '<text x="10" y="10" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[0],
                '</text><text x="24" y="10" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[1],
                "</text>",
                '<text x="38" y="10" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[2],
                '</text><text x="10" y="23.5" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[3],
                '</text><text x="24" y="23.5" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[4],
                '</text><text x="38" y="23.5" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[5],
                '</text><text x="10" y="37" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[6],
                '</text><text x="24" y="37" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[7],
                '</text><text x="38" y="37" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[8],
                "</text>",
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
        traits = string(
            abi.encodePacked(
                '{"trait_type": "G1", "value": "',
                emojis[0],
                '"},{"trait_type": "G2", "value": "',
                emojis[1],
                '"},{"trait_type": "G3", "value": "',
                emojis[2],
                '"},{"trait_type": "G4", "value": "',
                emojis[3],
                '"},{"trait_type": "G5", "value": "',
                emojis[4],
                '"},{"trait_type": "G6", "value": "',
                emojis[5],
                '"},{"trait_type": "G7", "value": "',
                emojis[6],
                '"},{"trait_type": "G8", "value": "',
                emojis[7],
                '"},{"trait_type": "G9", "value": "',
                emojis[8],
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
                '{"name":"degeneratives.art #',
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
