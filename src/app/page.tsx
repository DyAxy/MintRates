"use client";

import useSWR from "swr";
import axios from "axios";
import { CurrencyList } from "@/components/currencyList";
import {
  initDataRaw as _initDataRaw,
  initDataState as _initDataState,
  useSignal,
} from "@telegram-apps/sdk-react";

export default function Home() {
  const initDataRaw = useSignal(_initDataRaw);
  const initDataState = useSignal(_initDataState);
  console.log("initDataRaw", initDataRaw);
  console.log("initDataState", initDataState);
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
    <div className="flex flex-col items-center justify-between h-dvh bg-[var(--tg-theme-bg-color)]">
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
