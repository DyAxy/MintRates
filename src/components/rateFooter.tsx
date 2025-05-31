import {
  Button,
  Chip,
  cn,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  ScrollShadow,
  useDisclosure,
} from "@heroui/react";
import { useMemo } from "react";
import rates from "@/json/rates.json";
import { Icon } from "@iconify/react/dist/iconify.js";
import { hapticFeedback } from "@telegram-apps/sdk-react";

export const RateFooter = ({
  rateId,
  setRateId,
}: {
  rateId: string;
  setRateId: (id: string) => void;
}) => {
  const rate = useMemo(
    () => rates.find((item) => item.id === rateId),
    [rateId]
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div
        className={cn(
          "text-[var(--tg-theme-hint-color)]",
          "text-sm p-2 w-full",
          "flex items-center border-t justify-end gap-1",
          "border-[var(--tg-theme-section-separator-color)]",
          "bg-[var(--tg-theme-secondary-bg-color)]"
        )}
        onClick={() => {
          hapticFeedback.impactOccurred("rigid");
          onOpen();
        }}
      >
        <span>汇率数据来自 </span>
        <span className="text-[var(--tg-theme-accent-text-color)]">
          {rate?.name}
        </span>
        <Icon icon="tabler:caret-up-down-filled" className="inline-block" />
      </div>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        radius="none"
        className="bg-[var(--tg-theme-secondary-bg-color)] min-h-[90%]"
        hideCloseButton
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="p-4 w-full items-center flex flex-col justify-center bg-[var(--tg-theme-bg-color)]">
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
                      icon="tabler:chevron-down"
                      width={24}
                      className="text-[var(--tg-theme-text-color)]"
                    />
                  </Button>
                  <span className="text-lg font-bold text-[var(--tg-theme-text-color)]">
                    选择数据源
                  </span>
                  <div />
                </div>
              </DrawerHeader>
              <ScrollShadow>
                <DrawerBody className="p-4">
                  <div className="flex flex-col">
                    <div
                      className={cn(
                        "bg-[var(--tg-theme-header-bg-color)]",
                        "p-4 flex flex-row items-center justify-between cursor-pointer",
                        "rounded-t-large",
                        "rounded-b-large"
                      )}
                      onClick={() => {
                        hapticFeedback.impactOccurred("rigid");
                        setRateId("default");
                        onClose();
                      }}
                    >
                      <div className="flex flex-row items-center gap-2">
                        {/* <Image
                          radius="none"
                          src={
                            currencyList[item].icon ||
                            "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/2753.svg"
                          }
                          alt={item}
                          width={32}
                          height={32}
                        /> */}
                        <span className="text-md text-[var(--tg-theme-text-color)] font-semibold">
                          默认汇率
                        </span>
                      </div>
                      {true && (
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
                  </div>
                </DrawerBody>
              </ScrollShadow>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
