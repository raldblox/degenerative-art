"use client";

import {
  Button,
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [preview, setPreview] = useState(null);

  const [shuffledContent, setShuffledContent] = useState({
    headline: [
      "mint your mood before it's gone 🤕",
      "Your Feels, Immortalized (But Only for a Limited Time)",
      "Don't Let Your Mood Go to Waste 🗑️",
      "Mint Your Mood Before It's More Volatile Than Bitcoin 📉",
      "Your Emotional State, Tokenized (It's Art, i Swear)",
    ],
    label: [
      "One-Time Mood Check. 3-9 Emojis Only",
      "The Universe Demands Your Emotional Input: 3-9 Emojis Only",
      "Seriously Though, Enter 3-9 Emojis That Define Your Existence",
      "One-Time Mood Code Required: 3-9 Emojis, Please",
      "Don't Overthink, Just Drop Your Most Recent Emojis (3-9)",
    ],
    placeholders: ["🤒", "🤪", "🤕", "😠", "😭", "😂", "😎", "🚀", "🔥"],
  });

  useEffect(() => {
    setShuffledContent({
      headline: shuffleArray([...shuffledContent.headline]),
      label: shuffleArray([...shuffledContent.label]),
      placeholders: shuffleArray([...shuffledContent.placeholders]),
    });
    setMounted(true);
  }, []);

  const fieldsRef = useRef(null);
  const [activeFields, setActiveFields] = useState(3);
  const maxFields = 9;
  const inputRef = useRef([]);
  const [inputValues, setInputValues] = useState(Array(maxFields).fill(""));

  const [htmlContent, setHtmlContent] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await fetch("./render.html");
        const data = await response.text();
        setHtmlContent(data);
      } catch (error) {
        console.error("Error fetching HTML:", error);
      }
    };
    fetchHtml();
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(htmlContent);
      iframeDocument.close();
    }
  }, [htmlContent]);

  useEffect(() => {
    const elements = fieldsRef.current.children;
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = i < activeFields ? "block" : "none";
    }

    if (activeFields > 3 && inputRef.current[activeFields - 1]) {
      inputRef.current[activeFields - 1].focus();
    }
  }, [activeFields]);

  const handleChange = (event, index) => {
    const value = event.target.value.slice(-1); // Get the last entered character
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    if (index < activeFields - 1 && value.length > 0) {
      // Focus on next input if current input is filled and there are more inputs
      inputRef.current[index + 1].focus();
    } else if (
      index === activeFields - 1 &&
      value.length > 0 &&
      activeFields < maxFields
    ) {
      // Add new input if current input is filled and there are less than 9 inputs
      setActiveFields(activeFields + 1);
      inputRef.current[index + 1].focus(); // Focus on new input
    }
  };

  const handleKeyUp = (event, index) => {
    if (
      (event.key === "Delete" || event.key === "Backspace") &&
      inputValues[index] === ""
    ) {
      if (index > 0) {
        inputRef.current[index - 1].focus();
      }
      if (activeFields > 3) {
        setActiveFields(activeFields - 1);
      }
    }
  };

  const renderInputFields = () => {
    const inputFields = [];
    for (let i = 0; i < maxFields; i++) {
      inputFields.push(
        <input
          key={i}
          size="lg"
          type="text"
          data-index={i}
          placeholder={shuffledContent.placeholders[i]}
          ref={(el) => (inputRef.current[i] = el)}
          className={`w-16 h-16 placeholder:saturate-0 text-2xl text-center rounded-lg border-3 border-black outline-none focus:border-indigo-600 ${
            i >= activeFields ? "hidden" : ""
          }`}
          onChange={(e) => handleChange(e, i)}
          onKeyUp={(e) => handleKeyUp(e, i)}
        />
      );
    }
    return inputFields;
  };

  return (
    <main className="w-full h-screen overflow-hidden">
      <Navbar position="sticky" className="z-50">
        <NavbarBrand>
          <p className="text-2xl font-bold">
            degen<span className="opacity-50">eratives</span>
          </p>
        </NavbarBrand>
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem>
            <Button color="foreground" variant="flat" className="font-bold">
              konek welet
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <section className="grid">
        <section
          className={`${
            mounted ? "flex" : "hidden"
          } absolute z-20 flex-col p-4 items-center h-[90vh] justify-center md:p-24 space-y-16"`}
        >
          <div className="text-4xl font-bold leading-tight tracking-tight text-center lowercase drop-shadow-md text-balance md:text-7xl max-w-7xl">
            {shuffledContent.headline[0]}
          </div>
          <div className="mt-8">
            <div className="flex flex-col items-center">
              <label className="text-2xl font-bold tracking-tight text-center lowercase">
                {shuffledContent.label[0]}
              </label>
              <div className="flex flex-col items-center justify-center pt-8 pb-8 space-y-4">
                <div
                  ref={fieldsRef}
                  className="flex flex-wrap items-center justify-center gap-2"
                >
                  {renderInputFields()}
                </div>
              </div>
              <Button size="lg" className="dark">
                let&apos;s mint this 🪄
              </Button>
            </div>
          </div>
        </section>
        <section className="fixed top-0 w-screen h-screen !overflow-hidden">
          <iframe
            ref={iframeRef}
            title="Rendered Document"
            width="100%"
            className="h-screen overflow-hidden"
          />
        </section>
      </section>
    </main>
  );
}
