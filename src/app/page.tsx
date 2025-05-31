"use client";

import useSWR from "swr";
import axios from "axios";
import { CurrencyList } from "@/components/currencyList";
import { RateFooter } from "@/components/rateFooter";
import { useState } from "react";
import { AppHeader } from "@/components/appHeader";

export default function Home() {
  const [rateId, setRateId] = useState<string>("default");
  const { data, isLoading } = useSWR(
    `rate?base=${rateId}`,
    async (url: string) => {
      try {
        const { data } = await axios.get(url);
        return data;
      } catch (e) {
        throw e;
      }
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-start h-dvh bg-[var(--tg-theme-bg-color)]">
      <div className="flex flex-col w-full">
        {data && <CurrencyList rateData={data} />}
      </div>
      <footer className="w-full">
        <RateFooter rateId={rateId} setRateId={setRateId} />
      </footer>
    </div>
  );
}
