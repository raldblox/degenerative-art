// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.1;

struct Asset {
    string assetType;
    string assetData;
    uint256 timeCreated;
    bool isBase64Encoded;
}

interface ISmartAsset {
    function viewAsset() external view returns (string memory);

    function viewUser() external view returns (address[] memory);

    function requestAccess() external payable returns (bool);

    function addUser(address userAddress) external payable returns (bool);

    function getAsset()
        external
        view
        returns (
            string memory data,
            address createdBy,
            uint256 timeCreated,
            bool isBase64Encoded
        );
}
