"use client";

import { HeroUIProvider } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <SWRConfig
        value={{
          fetcher: async (url: string) => {
            try {
              const { data } = await axios.get(url);
              return data;
            } catch (e) {
              throw e;
            }
          },
        }}
      >
        {children}
      </SWRConfig>
      <Toaster position="top-center" richColors />
    </HeroUIProvider>
  );
}
