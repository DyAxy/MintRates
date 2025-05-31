import {
  Button,
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
import { hapticFeedback } from "@telegram-apps/sdk-react";
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
    const allCurrencies = Object.keys(currencyList);

    if (!search) {
      const prioritized = [
        ...currencies,
        ...allCurrencies.filter((item) => !currencies.includes(item)),
      ];
      setFiltered(prioritized);
      return;
    }

    const searchLower = search.toLowerCase();
    const result = allCurrencies.filter((item) => {
      const currency = currencyList[item];
      return (
        item.toLowerCase().includes(searchLower) ||
        currency.displayName.toLowerCase().includes(searchLower)
      );
    });

    const prioritizedResult = [
      ...result.filter((item) => currencies.includes(item)),
      ...result.filter((item) => !currencies.includes(item)),
    ];

    setFiltered(prioritizedResult);
  }, [search, currencyList, currencies]);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="left"
      radius="none"
      className="bg-[var(--tg-theme-secondary-bg-color)]"
      hideCloseButton
      size="full"
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="p-4 w-full items-center flex flex-col gap-3 justify-center bg-[var(--tg-theme-bg-color)]">
              <div className="flex items-center justify-center relative w-full">
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  onPress={() => {
                    hapticFeedback.impactOccurred("rigid");
                    onClose();
                  }}
                  className="absolute left-0"
                >
                  <Icon
                    icon="tabler:chevron-left"
                    width={24}
                    className="text-[var(--tg-theme-text-color)]"
                  />
                </Button>
                <span className="text-lg font-bold text-[var(--tg-theme-text-color)]">
                  选择货币
                </span>
              </div>
              <Input
                radius="lg"
                placeholder="搜索货币"
                startContent={
                  <Icon
                    icon="tabler:search"
                    className="text-[var(--tg-theme-text-color)]"
                  />
                }
                value={search}
                onValueChange={setSearch}
                classNames={{
                  input: cn(
                    "group-data-[has-value=true]:text-[var(--tg-theme-text-color)]",
                    "placeholder:text-[var(--tg-theme-hint-color)]"
                  ),
                  inputWrapper: cn(
                    "bg-[var(--tg-theme-secondary-bg-color)]",
                    "data-[hover=true]:bg-[var(--tg-theme-secondary-bg-color)]",
                    "group-data-[focus=true]:bg-[var(--tg-theme-secondary-bg-color)]"
                  ),
                }}
              />
            </DrawerHeader>
            <ScrollShadow>
              <DrawerBody className="p-4">
                <div className="flex flex-col">
                  {filtered.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "bg-[var(--tg-theme-header-bg-color)]",
                        "p-4 flex flex-row items-center justify-between cursor-pointer",
                        index < filtered.length - 1 &&
                          "border-b border-[var(--tg-theme-section-separator-color)]",
                        index === 0 && "rounded-t-large",
                        index === filtered.length - 1 && "rounded-b-large"
                      )}
                      onClick={() => {
                        if (currencies.includes(item))
                          return toast.error("已显示该货币");
                        hapticFeedback.impactOccurred("rigid");
                        setSearch("");
                        onClick(item);
                        onClose();
                      }}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <Image
                          radius="none"
                          src={
                            currencyList[item].icon ||
                            "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/2753.svg"
                          }
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
