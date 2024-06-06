"use client";

import React, { useState } from "react";
import { Card } from "@aws-amplify/ui-react";
import { callBedRock, getImage } from "./actions";

const gender_map = {
  Womens: "of a female ",
  Mens: "of a male "
}

export default function Home() {
  const [result, setResult] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setloading] = useState(false);
  // I am a male consultant in my 30s traveling to New York next week. What kind of outfit should I wear on my first day in the office?
  const [customerInput, setCustomerInput] = useState("");

  const suggestStyles = async (e: any) => {
    setloading(true);
    e.preventDefault();
    try {
      const entityExtraction = `Find person age group, gender, season and the location in the customer input.
        Instructions:
        The age group can be one of the following: 10-20, 20-30, 30-50, 50+
        The gender can be one of the following: Mens, Womens, Other
        The gender can also be derived from the name if not explicitly mentioned
        The season can be one of the following: summer, winter, spring, fall
        The output must be in JSON format inside the tags <attributes></attributes>
        
        If the information of an entity is not available in the input then don't include that entity in the JSON output
        
        Begin!
        
        Customer input: ${customerInput}.`;
      const entityExtractionData = await callBedRock(entityExtraction);
      const entityExtractionRegEx = entityExtractionData.replace(/(\r\n|\n|\r)/gm, "")?.match('<attributes>(.*?)</attributes>')[1];
      const entities = entityExtractionRegEx ? JSON.parse(entityExtractionRegEx) : "";

      const styleRecommendation = `Use the following pieces of context to generate 5 style recommendations for the customer input at the end.
        <context>
        {context}
        </context>
        <example>A navy suit with a light blue dress shirt, conservative tie, black oxford shoes, and a leather belt.</example>
        <example>A lehenga choli set with a crop top, flowing skirt, and dupatta scarf in lively colors and metallic accents.</example>
        
        Customer Input: ${customerInput}
        Each style recommendation must be inside the tags <style></style>.
        Do not output product physical IDs.
        Skip the preamble.`;
      const styleData = await callBedRock(styleRecommendation);
      const styles = styleData?.replace(/(\r\n|\n|\r)/g, "")?.match(/<style>(.*?)<\/style>/g)?.map((val: string) => val.replace(/<\/?style>/g,''));
      setloading(false);
      setResult(styles);

      const imageBase64s = []
      for (let i = 0; i < styles.length; i++) {
        const imageGenration = "Full body view for " + entities["gender"] + " without a face in " + styles[i] + "dslr, ultra quality, dof, film grain, Fujifilm XT3, crystal clear, 8K UHD";
        const imageBase64 = await getImage(imageGenration);
        imageBase64s.push(imageBase64);
      }
      setImages(imageBase64s);

    } catch (e) {
      alert(`An error occurred: ${e}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center  p-24  m-auto ">
      <div className=" pb-10 mx-auto text-center flex flex-col items-start -center max-w-3xl">
        <h1 className=" text-4xl  font-bold  text-gray-900 sm:text-6xl ">
          Meet Your Personal <br /><span className=" text-blue-600"> AI stylist </span>
          <p className=" mt-10 font-medium   text-lg  max-w-prose text-gray-900 ">
            Create an outfit tailored to your needs.
          </p>
        </h1>
      </div>

      <section className="   w-1/2  mx-auto ">
        <form
          // onSubmit={onSubmit}
          className=" p-4 flex flex-col items-center gap-4  max-w-full mx-auto"
        >
          <input
            type="text"
            id="prompts"
            name="prompts"
            required
            value={customerInput}
            onChange={(e) => setCustomerInput(e.currentTarget.value)}
            placeholder="Describe your need..."
            className="border border-black  text-gray-900 p-4 rounded-lg max-w-full w-full text-xl "
          />
          <button
            onClick={e => suggestStyles(e)}
            className="text-white p-2 rounded-lg bg-blue-500 w-1/2 text-xl"
          >
            Generate
          </button>
        </form>
      </section>
      {loading ? (
        <div className="flex flex-col items-center gap-4 w-1/2  mx-auto">
          <h2 className="m-10 font-medium   text-xl   max-w-prose text-blue-600">
            Wait for it...
          </h2>

        </div>
      ) : (
        <div>
          {result?.map((item, index) => (
            <section className="p-2 mt-2 border border-black  bg-gray-50  rounded-xl w-1/2 items-left inline-block">
              <Card className="p-4 flex flex-col items-center gap-4  max-w-full mx-auto text-xl  font-semibold">
                <h2 className="whitespace-pre-wrap">{item.trim()}</h2>
                {images[index] && <img src={"data:image/png;base64, " + images[index]} width="200px" />}
                <button onClick={e => alert(e)} className="text-white p-2 rounded-lg bg-blue-500 text-xl">
                  Select
                </button>
              </Card>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
