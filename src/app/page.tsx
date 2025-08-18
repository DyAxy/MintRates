"use client";

import useSWR from "swr";
import { CurrencyList } from "@/components/currencyList";
import { RateFooter } from "@/components/rateFooter";
import { useEffect, useState } from "react";

export default function Home() {
  const [rateId, setRateId] = useState<string>("");
  useEffect(() => {
    const database = localStorage.getItem("database");
    if (database) {
      // removed default
      if (database !== "default") {
        setRateId(database);
      } else {
        setRateId("neutrino");
      }
    } else {
      setRateId("neutrino");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("database", rateId);
  }, [rateId]);

  const endpoint =
    "https://raw.githubusercontent.com/DyAxy/NewExchangeRatesTable/refs/heads/main/data/";
  const { data, isLoading } = useSWR(
    rateId ? `${endpoint}${rateId}.json` : null
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
        {data && data.data && (
          <CurrencyList key={rateId} rateData={data.data} />
        )}
      </div>
      <footer className="w-full">
        <RateFooter rateId={rateId} setRateId={setRateId} />
      </footer>
    </div>
  );
}
