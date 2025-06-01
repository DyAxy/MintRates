"use client";

import useSWR from "swr";
import axios from "axios";
import { CurrencyList } from "@/components/currencyList";
import { RateFooter } from "@/components/rateFooter";
import { useEffect, useState } from "react";

export default function Home() {
  const [rateId, setRateId] = useState<string>("");
  useEffect(() => {
    const database = localStorage.getItem("database");
    if (database) {
      setRateId(database);
    } else {
      setRateId("default");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("database", rateId);
  }, [rateId]);

  const { data, isLoading } = useSWR(
    rateId ? `rate?base=${rateId}` : null,
    async (url: string) => {
      try {
        const { data } = await axios.get(url);
        return data;
      } catch (e) {
        throw e;
      }
    }
  );

  if (isLoading || !rateId) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--tg-theme-bg-color)]">
        <div className="w-10 h-10 border-4 border-t-[var(--tg-theme-accent-text-color)] border-[var(--tg-theme-hint-color)] rounded-full animate-spin"></div>
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
