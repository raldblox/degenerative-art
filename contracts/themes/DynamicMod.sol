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
import {DegenerativesArtV3} from "../v3/DegenerativesArtV3.sol";

contract DynamicMod is IVisualEngine, Ownable(msg.sender) {
    string public theme = "Dynamic";
    string public network;
    IERC20 public moodToken;
    IERC20 public tachyLP;
    LPStaking public staking;
    DegenerativesArtV3 public v3;

    constructor(string memory networkName) {
        network = networkName;
        tachyLP = IERC20(0xC6D0AafDe70058EDA2E4F3DD17200dabD350A8D5);
        moodToken = IERC20(0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9);
        staking = LPStaking(0xc79F872f6be863b943bD2DF567541315278f8494);
        v3 = DegenerativesArtV3(0x5F440745E21D2F0388F7360586e8d92a9058BccC);
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

    function calcOpacity(address user) public view returns (string memory) {
        // Calculate opacity as a decimal between 0 and 1
        uint256 balance = moodToken.balanceOf(user);

        string memory opacity;
        if (balance >= 1000000 ether) {
            opacity = "1"; // If balance is 1M or more, set opacity to 1
        } else {
            // Calculate decimal value if balance is less than 1M
            uint256 opacityValue = (balance * 100) / 1000000 ether;
            opacity = string.concat("0.", Strings.toString(opacityValue));
        }

        return
            string(
                abi.encodePacked(
                    '<path fill="#2940d7" d="M0 0h48v48H0z" opacity="',
                    opacity,
                    '"/>',
                    ""
                )
            );
    }

    function hasLP(address user) public view returns (bool) {
        if (tachyLP.balanceOf(user) == 0) {
            return false;
        } else {
            return true;
        }
    }

    function indicators(
        uint256,
        address owner
    ) public view returns (string memory) {
        string
            memory blink = '<path fill="#7eff7e" d="M0 0h48v48H0z"><animate attributeName="fill" values="#ff005c;#ffbf00;#0000ff;#00ffb1;#ff5e00;#faff00;#68ff00;#00f3ff;#ff005c;" dur="1.5s" repeatCount="indefinite"/></path>';
        string
            memory party = '<defs><linearGradient id="a" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="red"/><stop offset="100%" stop-color="#2fa9e5"/></linearGradient><linearGradient id="b" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c839ee"/><stop offset="100%" stop-color="#f0aa23"/></linearGradient><linearGradient id="c" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#a8ec31"/><stop offset="100%" stop-color="#ec1a8e"/></linearGradient></defs><path fill="url(#a)" d="M0 0h48v48H0z"><animate attributeName="fill-opacity" values="0;0.8;0" dur="1s" repeatCount="indefinite"/></path><path fill="url(#b)" d="M0 0h48v48H0z"><animate attributeName="fill-opacity" values="0.8;0;0.8" dur="1.3s" repeatCount="indefinite"/></path><path fill="url(#c)" d="M0 0h48v48H0z"><animate attributeName="fill-opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite"/></path>';

        string memory balanceIndicator = calcOpacity(owner);

        bool staked = stakedToken(owner);
        bool liquityProvider = hasLP(owner);

        return
            string(
                abi.encodePacked(
                    balanceIndicator,
                    liquityProvider ? blink : "",
                    staked ? party : ""
                )
            );
    }

    function generateImage(
        uint256 tokenId,
        address owner,
        string[] memory emojis
    ) public view returns (string memory) {
        string memory indicator = indicators(tokenId, owner);
        string memory svgImage = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" fill="none" viewBox="0 0 48 48">',
                indicator,
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
        string[] memory correctedEmojis;

        if (tokenId > 1038 && v3.getMoodSwing(tokenId) == 1) {
            correctedEmojis = v3.getEmojis(tokenId + 1);
        } else {
            correctedEmojis = emojis;
        }

        // generate image
        string memory image = generateImage(tokenId, owner, correctedEmojis);
        // get mode
        string memory mode = theme;
        string memory externalUrl = string(
            abi.encodePacked(
                "https://degeneratives.art/id/",
                Strings.toString(tokenId),
                "?network=",
                network
            )
        );

        string memory gridTraits = generateGridTraits(correctedEmojis);

        string memory metadata = string(
            abi.encodePacked(
                '{"name":"degeneratives.art #',
                Strings.toString(tokenId),
                unicode'","description":"Degenerative.art is a collection of unpredictable human expressions. Each token is a reflection of its owner`s mood, visualized by onchain algorithms.", "image": "',
                image,
                '","external_url": "',
                externalUrl,
                '","attributes": [',
                gridTraits,
                ',{"trait_type": "Mood Swing", "value": "',
                Strings.toString(moodSwing),
                '"},{"trait_type": "Theme", "value": "',
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

    function getPrice() external view returns (address, uint256) {
        return (address(moodToken), 0);
    }
}
