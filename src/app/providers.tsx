"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      {children}
      <Toaster position="top-center" richColors/>
    </HeroUIProvider>
  );
}
