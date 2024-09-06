// SPDX-License-Identifier: MIT

import "./OnchainStorage.sol";
import "../interfaces/IOnchainStorage.sol";
import "../interfaces/IDegenerativesID.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.24;

contract DegenerativesID is Ownable(msg.sender), IDegenerativesID {
    address public relayer;

    address[] public accounts;

    mapping(string uid => address) private uidToAccount;
    mapping(address => string uid) private walletToUid;
    mapping(string uid => string) private handles;
    mapping(string handle => bool) private handleTaken;

    uint256 txnCounter;
    uint256 uidCounter;
    uint256 postCounter;
    uint256 handleCounter;

    error TransferFailed();

    event FundsRecovered(
        address indexed token,
        address indexed to,
        uint256 amount
    );

    constructor(address _relayer) {
        relayer = _relayer;
    }

    modifier onlyExistingUid(string memory uid) {
        require(uidExist(uid), "UID does not exist");
        _;
    }

    modifier onlyRelayer() {
        require(relayer == msg.sender, "Unauthorized");
        _;
    }

    modifier onlyAuthorized() {
        require(relayer == msg.sender || msg.sender == owner(), "Unauthorized");
        _;
    }

    function create(
        string memory uid,
        string memory name
    ) public payable onlyAuthorized {
        require(
            uidToAccount[uid] == address(0),
            "Account already exists for this UID"
        );

        OnchainStorage newStorage = new OnchainStorage(uid);
        uidToAccount[uid] = address(newStorage);
        accounts.push(address(newStorage));
        txnCounter++;
        uidCounter++;

        emit AccountCreated(uid, address(newStorage));
    }

    function bind(
        string memory uid,
        address wallet
    ) external payable onlyExistingUid(uid) onlyAuthorized {
        bool success = IFeelnStorage(uidToAccount[uid]).bind(wallet);
        require(success, "Binding failed");
        txnCounter++;
    }

    function post(
        string memory uid,
        string[] memory _emojis,
        string[] memory _image,
        string[] memory _notes
    ) external payable onlyExistingUid(uid) onlyAuthorized {
        bool success = IFeelnStorage(uidToAccount[uid]).post(
            _emojis,
            _image,
            _notes
        );
        require(success, "Posting failed");
        txnCounter++;
        postCounter++;
    }

    function assignHandle(
        string memory uid,
        string memory newName
    ) external payable onlyExistingUid(uid) onlyAuthorized {
        // Check if the new handle is already taken
        require(!handleTaken[newName], "Handle already taken");

        // Get the old handle (if any)
        string memory oldHandle = handles[uid];

        // Update handle mappings
        handles[uid] = newName;
        handleTaken[newName] = true;

        // If the user had an old handle, make it available again
        if (bytes(oldHandle).length != 0) {
            // Check if the string is empty
            handleTaken[oldHandle] = false;
        }

        txnCounter++;
        handleCounter++;
    }

    function getStorageAccount(
        string memory uid
    ) external view onlyExistingUid(uid) returns (address) {
        return uidToAccount[uid];
    }

    function getUidFromWallet(
        address wallet
    ) external view returns (string memory) {
        return walletToUid[wallet];
    }

    function getWallets(
        string memory uid
    ) external view returns (address[] memory wallets) {
        wallets = IFeelnStorage(uidToAccount[uid]).getWallets();
    }

    function getPrimaryWallet(
        string memory uid
    ) external view returns (address primaryWallet) {
        primaryWallet = IFeelnStorage(uidToAccount[uid]).getPrimaryWallet();
    }

    function getHandle(
        string memory uid
    ) external view onlyExistingUid(uid) returns (string memory) {
        return handles[uid];
    }

    function getAnalytics()
        external
        view
        returns (uint256, uint256, uint256, uint256)
    {
        return (txnCounter, uidCounter, postCounter, handleCounter);
    }

    function isWalletOfUid(
        string memory uid,
        address wallet
    ) external view returns (bool) {
        return IFeelnStorage(uidToAccount[uid]).uidWallet(wallet);
    }

    function uidExist(string memory uid) public view returns (bool) {
        return uidToAccount[uid] != address(0);
    }

    function updateRelayer(address newRelayer) external onlyOwner {
        relayer = newRelayer;
    }

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

    function deleteAccount(
        string memory uid
    ) external onlyExistingUid(uid) onlyAuthorized {
        address storageAccount = uidToAccount[uid];

        delete uidToAccount[uid];
        delete handles[uid];

        IFeelnStorage(storageAccount).destroy();
    }
}
