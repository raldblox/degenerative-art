// SPDX-License-Identifier: MIT
// OnChainVision Contracts

pragma solidity ^0.8.24;

import {SmartCodec} from "../utils/SmartCodec.sol";
import {IVisualEngine} from "../interfaces/IVisualEngine.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IStaking {
    function staked(uint256 tokenId) external view returns (bool);
}

contract Dynamic is IVisualEngine, Ownable(msg.sender) {
    string public theme = "Dynamic";
    string public network;
    IERC20 public moodToken;
    IERC20 public tachyLP;
    IStaking public staking;

    constructor(string memory networkName) {
        network = networkName;
        tachyLP = IERC20(0xC6D0AafDe70058EDA2E4F3DD17200dabD350A8D5);
        moodToken = IERC20(0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9);
    }

    function updateStakingContract(address _staking) public onlyOwner {
        staking = IStaking(_staking);
    }

    function stakedToken(uint256 tokenId) public view returns (bool) {
        if (address(staking) == address(0)) {
            return false;
        } else {
            return staking.staked(tokenId);
        }
    }

    function calcOpacity(address user) public view returns (string memory) {
        string memory opacity = Strings.toString(
            moodToken.balanceOf(user) / 1 ether / 1000000
        );

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
        uint256 tokenId,
        address owner
    ) public view returns (string memory) {
        string
            memory blink = '<path fill="#ff0" d="M0 0h48v48H0z"><animate attributeName="fill-opacity" values="0.5;0;0" dur="1s" repeatCount="indefinite"/></path><path fill="#0ff" d="M0 0h48v48H0z"><animate attributeName="fill-opacity" values="0.5;0;0" dur="1.5s" repeatCount="indefinite"/></path><path fill="#f0f" d="M0 0h48v48H0z"><animate attributeName="fill-opacity" values="0.5;0;0" dur="2s" repeatCount="indefinite"/></path>';
        string
            memory party = '<path fill="#7eff7e" d="M0 0h48v48H0z"><animate attributeName="fill" values="#ff005c;#ffbf00;#0000ff;#00ffb1;#ff5e00;#faff00;#68ff00;#00f3ff;#ff005c;" dur="1.5s" repeatCount="indefinite"/></path>';

        string memory balanceIndicator = calcOpacity(owner);

        bool staked = stakedToken(tokenId);
        bool liquityProvider = hasLP(owner);

        return
            string(
                abi.encodePacked(
                    staked ? blink : balanceIndicator,
                    liquityProvider ? party : ""
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
                '<text x="10" y="11" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[0],
                '</text><text x="24" y="11" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[1],
                "</text>",
                '<text x="38" y="11" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[2],
                '</text><text x="10" y="24" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[3],
                '</text><text x="24" y="24" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[4],
                '</text><text x="38" y="24" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[5],
                '</text><text x="10" y="37" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[6],
                '</text><text x="24" y="37" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[7],
                '</text><text x="38" y="37" fill="#bbb" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" text-anchor="middle">',
                emojis[8],
                "</text></svg>"
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
                network
            )
        );

        string memory metadata = string(
            abi.encodePacked(
                '{"name":"degeneratives.art #',
                Strings.toString(tokenId),
                unicode'","description":"[degenerative.art](',
                externalUrl,
                ') is a collection of unpredictable human expressions. each token is a reflection of its owner`s mood, visualized by onchain algorithms.", "image": "',
                image,
                '","external_url": "',
                externalUrl,
                '","attributes": [{"trait_type": "Impression", "value": "',
                emojis[0],
                '"},{"trait_type": "Vibe", "value": "',
                emojis[1],
                '"},{"trait_type": "Aura", "value": "',
                emojis[2],
                '"},{"trait_type": "Mood Swing", "value": "',
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
}
