import Head from "next/head";
import { useState } from "react";
import { ChangeEvent } from "react";

import styles from "@/styles/Home.module.css";

export default function Home() {
  let [progress, setProgress] = useState(-1);
  let [text, setText] = useState("");
  let [score, setScore] = useState(0);
  let [isFake, setIsFake] = useState(false);
  let [showDetection, setShowDetection] = useState(false);

  const analyzeText = async () => {
    console.log(process.env.API_URL);
    console.log(process.env.API_KEY);
    try {
      const response = await fetch(
        `${process.env.API_URL}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      let score = data[0][0].label === "Fake"
        ? (data[0][0].score * 100).toFixed(1)
        : (data[0][1].score * 100).toFixed(1);

      console.log(`AI Detection Score: ${score}%`);

      setScore(Number(score));
      setProgress(Number(score));
      setIsFake(data[0][0].label === "Fake");
      setShowDetection(true);
    } catch (error) {
      console.error(error);
      // Handle error in a user-friendly way here
    }
  };


  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  let textColor = "text-black";

  if (showDetection) {
    if (progress < 15) {
      textColor = "text-green-500";
    } else if (progress >= 15 && progress <= 45) {
      textColor = "text-black";
    } else {
      textColor = "text-red-500";
    }
  }

  return (
    <>
      <Head>
        <title>AI Content Detector</title>
        <meta name="description" content="Add some text and analyze it" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen flex flex-col items-center justify-center relative flex-col">
        <div className="absolute top-0 left-0 w-full h-full bg-[#e8f0f7]"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl p-4 pr-4 bg-white shadow-md sm:w-8/12 md:w-10/12 w-7/12 md:h-4/5">
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold mb-4 font-mons">
              AI Content Detector
            </h1>
            <p className="mb-2 font-mons">
              Please input your text and press the button to receive a
              percentage indicating the likelihood that your text was generated
              by AI.
            </p>
            <textarea
              className="h-40 p-4 rounded-lg shadow-md border border-gray-300 resize-none"
              placeholder="Enter some text..."
              onChange={handleInputChange}
            ></textarea>
            <button
              type="button"
              data-ripple-light="true"
              className="font-mons inline-block bg-blue-500 rounded mt-4 bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              onClick={analyzeText}
            >
              Analyze Content
            </button>
          </div>

          <div className="flex flex-col justify-center relative">
            <div className="md:absolute top-0 left-0 h-full w-0.5 bg-gray-300 drop-shadow-sm"></div>
            <div className="flex flex-col justify-center col-span-1 relative">
              <div className="md:absolute top-0 left-0 h-full w-0.5 bg-gray-300 drop-shadow-sm"></div>
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-10/12 ">
                  <div
                    className={`progress-text text-center text-xl font-bold ${textColor}`}
                  >
                    {progress === -1
                      ? ""
                      : `${progress}${progress === 10 ? "" : "%"}`}
                  </div>
                  <div className="progress-bar bg-gray-200 h-12 rounded-lg relative overflow-hidden">
                    <div
                      className={`progress-bar-fill bg-blue-500 h-full absolute left-0 top-0`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <div
                  className={`text-sm mt-4 font-mons ${textColor} ${
                    progress === -1 ? "hidden" : "block"
                  }`}
                >
                  {progress === 10
                    ? ""
                    : isFake
                    ? "Your text is likely AI generated"
                    : "Your text is likely human written"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
