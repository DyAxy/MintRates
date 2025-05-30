"use client";

import useSWR from "swr";
import axios from "axios";
import { CurrencyList } from "@/components/currencyList";
import { Button } from "@heroui/react";

export default function Home() {
  const { data, isLoading } = useSWR("rate", async (url: string) => {
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      throw e;
    }
  });

  const keyboards = [
    ["7", "8", "9", "+"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "*"],
    ["0", ".", "DEL", "/"],
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-between h-dvh">
      <div className="flex flex-col w-full h-[65%]">
        {data && <CurrencyList rateData={data} />}
      </div>
      {/* <div className="flex flex-col items-center justify-center w-full">
        {keyboards.map((row, rowIndex) => (
          <div key={rowIndex} className="flex w-full">
            {row.map((key, keyIndex) => (
              <Button
                key={keyIndex}
                radius="none"
                disableRipple
                size="lg"
                className="w-full"
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
      </div> */}
    </div>
  );
}
