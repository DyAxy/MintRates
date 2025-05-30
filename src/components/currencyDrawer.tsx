import {
  Chip,
  cn,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Image,
  Input,
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

  useEffect(() => {
    Object.keys(currencyList).forEach((key) => {
      if (!filtered.includes(key)) {
        setFiltered((prev) => [...prev, key]);
      }
    });
  }, [currencyList]);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      radius="none"
      className="min-h-[100%] bg-content1"
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="w-full items-center flex justify-center bg-content2">
              <span>更换货币</span>
            </DrawerHeader>
            <DrawerBody className="p-4 gap-4">
              <Input
                radius="lg"
                startContent={
                  <Icon icon="tabler:search" className="text-defualt-300" />
                }
                placeholder="搜索货币"
              />
              <div className="flex flex-col">
                {filtered.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "bg-content2 p-3 flex flex-row items-center justify-between cursor-pointer",
                      index < filtered.length - 1 &&
                        "border-b border-default-200",
                      index === 0 && "rounded-t-large",
                      index === filtered.length - 1 && "rounded-b-large"
                    )}
                    onClick={() => {
                      if (currencies.includes(item))
                        return toast.error("已显示该货币");
                      onClick(item);
                      onClose();
                    }}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        radius="none"
                        src={currencyList[item].icon}
                        alt={item}
                        width={32}
                        height={32}
                      />
                      <span className="text-md text-default-700 font-semibold">
                        {currencyList[item].displayName}
                      </span>
                      <span className="text-sm text-default-400">{item}</span>
                    </div>
                    {currencies.includes(item) && (
                      <Chip
                        size="sm"
                        classNames={{
                          base: "border border-primary-200 bg-primary-100",
                          content: "font-bold text-primary-400",
                        }}
                        startContent={
                          <Icon
                            icon="tabler:check"
                            className="text-primary-400"
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
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
