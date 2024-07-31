// export function MintModal({ isOpen, onOpen, onOpenChange }) {
//   const {
//     connectEthereumProvider,
//     userAddress,
//     countdown,
//     timeUpdated,
//     instances,
//     mint,
//     minting,
//   } = useContext(Context);
//   const fieldsRef = useRef(null);
//   const maxFields = 9;
//   const inputRef = useRef([]);
//   const [inputValues, setInputValues] = useState(Array(maxFields).fill(""));
//   const [activeFields, setActiveFields] = useState(3);

//   const handleMint = async () => {
//     if (inputValues.length >= 3) {
//       await mint(inputValues);
//     }
//   };

//   const handleChange = (event, index) => {
//     const value = event.target.value; // Get the last entered character
//     // Log the actual value and its Unicode code point
//     console.log(`New value: ${value}`);
//     setInputValues((prevValues) => {
//       const newValues = [...prevValues];
//       newValues[index] = value;
//       return newValues;
//     });

//     if (index < activeFields - 1 && value.length > 0) {
//       // Focus on next input if current input is filled and there are more inputs
//       inputRef.current[index + 1].focus();
//     } else if (
//       index === activeFields - 1 &&
//       value.length > 0 &&
//       activeFields < maxFields
//     ) {
//       // Add new input if current input is filled and there are less than 9 inputs
//       setActiveFields(activeFields + 1);
//       inputRef.current[index + 1].focus(); // Focus on new input
//     }
//   };

//   const handleKeyUp = (event, index) => {
//     if (
//       (event.key === "Delete" || event.key === "Backspace") &&
//       inputValues[index] === ""
//     ) {
//       if (index > 0) {
//         inputRef.current[index - 1].focus();
//       }
//       if (activeFields > 3) {
//         setActiveFields(activeFields - 1);
//       }
//     }
//   };

//   const renderInputFields = () => {
//     const inputFields = [];
//     for (let i = 0; i < maxFields; i++) {
//       inputFields.push(
//         <input
//           className="animate-appearance-in"
//           data-emoji-input="unicode"
//           key={i}
//           size="lg"
//           type="text"
//           data-index={i}
//           ref={(el) => (inputRef.current[i] = el)}
//           className={`w-12 h-12 placeholder:saturate-0 text-2xl text-center rounded-lg border-3 border-black outline-none focus:border-indigo-600 ${
//             i >= activeFields ? "hidden" : ""
//           }`}
//           onChange={(e) => {
//             const value = e.target.value;
//             const emoji = value.match(/[\p{Emoji}]/u);
//             if (emoji) {
//               e.target.value = emoji[0];
//             } else {
//               e.target.value = "";
//             }
//             handleChange(e, i);
//           }}
//           onKeyUp={(e) => handleKeyUp(e, i)}
//         />
//       );
//     }
//     return inputFields;
//   };

//   useEffect(() => {
//     if (!fieldsRef.current) {
//       return;
//     }
//     const elements = fieldsRef.current.children;
//     for (let i = 0; i < elements.length; i++) {
//       elements[i].style.display = i < activeFields ? "block" : "none";
//     }

//     if (activeFields > 3 && inputRef.current[activeFields - 1]) {
//       inputRef.current[activeFields - 1].focus();
//     }
//   }, [activeFields]);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onOpenChange={onOpenChange}
//       size="xl"
//       className="pt-6 pb-3 md:p-16"
//     >
//       <ModalContent>
//         {(onClose) => (
//           <>
//             <ModalHeader className="flex flex-col gap-1">
//               <label className="text-xl font-semibold tracking-tight text-center lowercase text-balance md:text-2xl">
//                 Enter the one-time emoji mood that universe gave you today
//               </label>
//             </ModalHeader>
//             <ModalBody>
//               {/* <p className="mt-4 text-xs text-center lowercase md:text-sm">
//                   Don&apos;t worry if your cosmic vibes change tomorrow... your
//                   NFT is always listening and so well-prepared to evolve alongside
//                   you! We&apos;ll provide you $MOOD token after nft mint to fuel
//                   your daily mood swings for the next hundred years! Your
//                   ever-changing feelings have finally found a match.
//                 </p> */}
//               {countdown !== "00:00:00" && (
//                 <p className="mx-auto text-lg font-semibold">{countdown}</p>
//               )}

//               <div className="flex flex-col items-center justify-center pb-6 space-y-4">
//                 <div
//                   ref={fieldsRef}
//                   className="grid grid-cols-3 gap-2 p-4 rounded-lg bg-white/80"
//                 >
//                   {renderInputFields()}
//                 </div>
//                 <label className="text-sm">(enter 3-9 emojis only)</label>
//               </div>
//             </ModalBody>
//             <ModalFooter className="flex justify-center w-full gap-2">
//               <Button
//                 startContent={
//                   <svg
//                     className="h-5"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       fill="currentColor"
//                       d="M17 9V7A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3M9 7a3 3 0 0 1 6 0v2H9Zm9 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1Z"
//                     />
//                   </svg>
//                 }
//                 size="lg"
//                 radius="full"
//                 variant="flat"
//                 className="text-white bg-black"
//                 onClick={handleMint}
//                 isLoading={minting}
//                 isDisabled
//               >
//                 minting soon 🪄
//               </Button>
//             </ModalFooter>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// }
