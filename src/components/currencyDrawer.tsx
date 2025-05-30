import {
  Chip,
  cn,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Image,
  Input,
  ScrollShadow,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const CurrencyDrawer = ({
  isOpen,
  onOpenChange,
  currencyList,
  onClick,
  currencies,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currencyList: CurrencyList;
  onClick: (currency: string) => void;
  currencies: string[];
}) => {
  const [filtered, setFiltered] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!search) return setFiltered(Object.keys(currencyList));
    const searchLower = search.toLowerCase();
    const result = Object.keys(currencyList).filter((item) => {
      const currency = currencyList[item];
      return (
        item.toLowerCase().includes(searchLower) ||
        currency.displayName.toLowerCase().includes(searchLower)
      );
    });
    setFiltered(result);
  }, [search]);

  useEffect(() => {
    setFiltered(Object.keys(currencyList));
  }, [currencyList]);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      radius="none"
      className="min-h-[100%] bg-[var(--tg-theme-secondary-bg-color)]"
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="w-full items-center flex justify-center bg-[var(--tg-theme-header-bg-color)]">
              <span className="text-[var(--tg-theme-text-color)]">
                更换货币
              </span>
            </DrawerHeader>
            <div className="sticky top-0 z-50 p-4 bg-[var(--tg-theme-header-bg-color)]">
              <Input
                radius="lg"
                placeholder="搜索货币"
                startContent={
                  <Icon icon="tabler:search" className="text-defualt-300" />
                }
                value={search}
                onValueChange={setSearch}
              />
            </div>
            <ScrollShadow>
              <DrawerBody className="p-4">
                <div className="flex flex-col">
                  {filtered.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "bg-[var(--tg-theme-header-bg-color)]",
                        "p-3 flex flex-row items-center justify-between cursor-pointer",
                        index < filtered.length - 1 &&
                          "border-b border-[var(--tg-theme-section-separator-color)]",
                        index === 0 && "rounded-t-large",
                        index === filtered.length - 1 && "rounded-b-large"
                      )}
                      onClick={() => {
                        if (currencies.includes(item))
                          return toast.error("已显示该货币");
                        setSearch("");
                        onClick(item);
                        onClose();
                      }}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <Image
                          radius="none"
                          src={currencyList[item].icon || "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/2753.svg"}
                          alt={item}
                          width={32}
                          height={32}
                        />
                        <span className="text-md text-[var(--tg-theme-text-color)] font-semibold">
                          {currencyList[item].displayName}
                        </span>
                        <span className="text-sm text-[var(--tg-theme-subtitle-text-color)]">
                          {item}
                        </span>
                      </div>
                      {currencies.includes(item) && (
                        <Chip
                          size="sm"
                          classNames={{
                            base: "border border-[var(--tg-theme-link-color)] bg-[var(--tg-theme-button-color)]",
                            content:
                              "font-bold text-[var(--tg-theme-button-text-color)]",
                          }}
                          startContent={
                            <Icon
                              icon="tabler:check"
                              className="text-[var(--tg-theme-button-text-color)]"
                            />
                          }
                        >
                          已显示
                        </Chip>
                      )}
                    </div>
                  ))}
                </div>
              </DrawerBody>
            </ScrollShadow>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
