// const { NextRequest, NextResponse } = require("next/server");
// const { ethers } = require("ethers");
// import { aesDecrypt } from "../../../utils/encryption";
// import FeelnHandleAbi from "../../libraries/FeelnHandle.json";
// import FeelnStorageAbi from "../../libraries/FeelnStorage.json";

// export const runtime = "edge";

// const node = process.env.NEXT_PUBLIC_RPC_NODE_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const contractAddress = process.env.NEXT_PUBLIC_FEELN_HANDLE_CONTRACT;

// async function initFeelnHandleContract() {
//   try {
//     const provider = new ethers.JsonRpcProvider(node);
//     const relayerAddress = new ethers.Wallet(PRIVATE_KEY, provider);
//     const contract = new ethers.Contract(
//       contractAddress,
//       FeelnHandleAbi,
//       relayerAddress
//     );

//     return contract;
//   } catch (error) {}
// }

// async function create(uid) {
//   try {
//     const contract = await initFeelnHandleContract();

//     const tx = await contract.create(uid);
//     await tx.wait();
//     let hash = tx.hash;

//     return { hash };
//   } catch (error) {
//     console.error("Error UID Creation:", error);
//     throw error;
//   }
// }

// async function bind(uid, wallet) {
//   try {
//     const contract = await initFeelnHandleContract();

//     const tx = await contract.bind(uid.toString(), wallet);
//     await tx.wait();
//     let hash = tx.hash;

//     return { hash };
//   } catch (error) {
//     console.error("Error Binding Wallet:", error);
//     throw error;
//   }
// }

// async function assignHandle(uid, handle) {
//   try {
//     const contract = await initFeelnHandleContract();

//     console.log("handling:", uid.toString(), handle);
//     const tx = await contract.assignHandle(uid.toString(), handle);
//     await tx.wait();
//     let hash = tx.hash;

//     return { hash };
//   } catch (error) {
//     console.error("Error Binding Wallet:", error);
//     throw error;
//   }
// }

// async function post(uid, emojis, image, note) {
//   try {
//     const contract = await initFeelnHandleContract();

//     console.log("posting:", uid.toString(), emojis, image, note);
//     const tx = await contract.post(uid.toString(), emojis, image, note);
//     await tx.wait();
//     let hash = tx.hash;

//     return { hash };
//   } catch (error) {
//     console.error("Error Posting:", error);
//     throw error;
//   }
// }

// export async function POST(request) {
//   try {
//     const { encryptedData } = await request.json();

//     const {
//       action,
//       uid,
//       wallet,
//       handle,
//       emojis,
//       image,
//       note,
//     } = await aesDecrypt(encryptedData);

//     console.log("Backend uid fetched:", uid);

//     let txhash;

//     if (action == "create") {
//       const { hash } = await create(uid);
//       txhash = hash;
//       console.log("Txn Hash:", hash);
//     } else if (action == "bind") {
//       const { hash } = await bind(uid, wallet);
//       txhash = hash;
//       console.log("Txn Hash:", hash);
//     } else if (action == "handle") {
//       const { hash } = await assignHandle(uid, handle);
//       txhash = hash;
//       console.log("Txn Hash:", hash);
//     } else if (action == "post") {
//       const { hash } = await post(uid, emojis, image, note);
//       txhash = hash;
//       console.log("Txn Hash:", hash);
//     } else {
//       return NextResponse.json(
//         { message: "Gasless Action Not Found" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { message: "success", txhash: txhash },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.toString() },
//       { status: 500 }
//     );
//   }
// }

// async function getData(uid) {
//   try {
//     const contract = await initFeelnHandleContract();

//     const [storageAccount, handle, wallets, analytics] = await Promise.all([
//       contract.getStorageAccount(uid.toString()),
//       contract.getHandle(uid.toString()),
//       contract.getWallets(uid.toString()),
//       contract.getAnalytics(),
//     ]);

//     console.log("Data:", storageAccount, handle);
//     return { storageAccount, handle, wallets, analytics };
//   } catch (error) {
//     console.error("Error Fetching:", error);
//     throw error;
//   }
// }

// export async function GET(request) {
//   try {
//     const encryptedData = request.nextUrl.searchParams.get("encryptedData");

//     if (!encryptedData) {
//       return NextResponse.json(
//         { message: "Missing encrypted data" },
//         { status: 400 }
//       );
//     }

//     const { uid } = await aesDecrypt(encryptedData);
//     console.log("Backend uid fetched:", uid);

//     const { storageAccount, handle, wallets, analytics } = await getData(
//       uid.toString()
//     );

//     if (!storageAccount) {
//       return NextResponse.json({ message: "No account yet" }, { status: 400 });
//     }

//     const [txnCounter, uidCounter, postCounter, handleCounter] = analytics.map(
//       String
//     );

//     console.log("Checked:", uid, storageAccount, handle, wallets, analytics);
//     return NextResponse.json(
//       {
//         message: "success",
//         storageAccount,
//         handle,
//         wallets,
//         analytics: {
//           txnCounter,
//           uidCounter,
//           postCounter,
//           handleCounter,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.toString() },
//       { status: 500 }
//     );
//   }
// }
