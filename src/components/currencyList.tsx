import { CurrencyUtil } from "@/libs/currency";
import { cn, Image, Input, useDisclosure } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  Type,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { CurrencyDrawer } from "./currencyDrawer";

export const CurrencyList = ({ rateData }: { rateData: CurrencyRate }) => {
  const currencyUtil = new CurrencyUtil(rateData);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const list = ["CNY", "USD", "EUR", "JPY", "GBP"];
  const [currencies, setCurrencies] = useState<string[]>(list);
  const [numbers, setNumbers] = useState<number[]>([]);

  const [swipedIndex, setSwipedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<number>(100);

  useEffect(() => {
    if (numbers.length === 0) {
      const initialNumbers = currencies.map((item) => {
        return currencyUtil.getTargetRate({
          from: currencies[selectedIndex],
          to: item,
        });
      });
      setNumbers(initialNumbers);
    }
  }, [currencies, numbers]);

  useEffect(() => {
    const value = numbers[selectedIndex] || 100;
    setSelectedValue(value);
    setNumbers(
      currencyUtil.refreshNumbers({
        currencies,
        baseIndex: selectedIndex,
        baseValue: value,
      })
    );
  }, [selectedIndex, currencies]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <SwipeableList type={Type.ANDROID}>
        {currencies.map((item, index) => (
          <SwipeableListItem
            key={index}
            leadingActions={
              <LeadingActions>
                <SwipeAction
                  onClick={() => {
                    setSwipedIndex(index);
                    onOpen();
                  }}
                >
                  <div className="h-full flex items-center p-4 bg-[var(--tg-theme-button-color)]">
                    <span className="text-nowrap text-[var(--tg-theme-button-text-color)]">
                      更换货币
                    </span>
                  </div>
                </SwipeAction>
              </LeadingActions>
            }
          >
            <div
              className={cn(
                "flex items-center justify-between px-4 w-full h-20",
                "transition-all duration-200 ease-in-out",
                "bg-[var(--tg-theme-bg-color)]",
                selectedIndex === index &&
                  "bg-[var(--tg-theme-secondary-bg-color)]"
              )}
              onClick={() => {
                setSelectedIndex(index);
                setTimeout(() => {
                  if (inputRefs.current[index]) {
                    inputRefs.current[index]?.focus();
                  }
                }, 50);
              }}
            >
              <div className="flex flex-row items-center gap-2 max-w-[50%]">
                <Image
                  radius="none"
                  src={currencyUtil.currencyList[item].icon || "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/2753.svg"}
                  alt={item}
                  width={32}
                  height={32}
                />
                <span className="text-lg text-[var(--tg-theme-text-color)] font-semibold">
                  {currencyUtil.currencyList[item].displayName}
                </span>
              </div>
              <div className="flex flex-col items-end max-w-[50%]">
                {selectedIndex === index ? (
                  // 只有选中的项目显示可编辑的Input
                  <Input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    onFocus={(e) => {
                      // 聚焦时，如果小数点后超过2位，则截取到2位
                      const currentValue = parseFloat(e.target.value);
                      if (!isNaN(currentValue)) {
                        const decimalPlaces = (
                          currentValue.toString().split(".")[1] || ""
                        ).length;
                        if (decimalPlaces > 2) {
                          const truncatedValue =
                            Math.floor(currentValue * 10000) / 10000;
                          setSelectedValue(truncatedValue);
                          setNumbers(
                            currencyUtil.refreshNumbers({
                              currencies,
                              baseIndex: selectedIndex,
                              baseValue: truncatedValue,
                            })
                          );
                        }
                      }
                    }}
                    value={selectedValue.toString()}
                    onValueChange={(value) => {
                      const numericValue = parseFloat(value);
                      if (!isNaN(numericValue)) {
                        setSelectedValue(numericValue);
                        setNumbers(
                          currencyUtil.refreshNumbers({
                            currencies,
                            baseIndex: selectedIndex,
                            baseValue: numericValue,
                          })
                        );
                      }
                    }}
                    classNames={{
                      inputWrapper: cn(
                        "rounded-none shadow-none",
                        "bg-transparent pr-0",
                        "data-[hover=true]:bg-transparent",
                        "group-data-[focus=true]:bg-transparent"
                      ),
                      input: cn(
                        "text-large font-medium text-right",
                        "group-data-[has-value=true]:text-[var(--tg-theme-text-color)]"
                      ),
                    }}
                  />
                ) : (
                  <span className="w-full text-large font-medium pl-3 py-2 text-right text-[var(--tg-theme-subtitle-text-color)] truncate">
                    {numbers.length === currencies.length &&
                      numbers[index].toFixed(4)}
                  </span>
                )}
                <div className="flex flex-row items-center gap-1 text-xs">
                  <span className="text-[var(--tg-theme-text-color)] font-semibold">
                    {item}
                  </span>
                  <span className="text-[var(--tg-theme-subtitle-text-color)]">
                    {currencyUtil.currencyList[item].symbol}
                  </span>
                </div>
              </div>
            </div>
          </SwipeableListItem>
        ))}
      </SwipeableList>
      <CurrencyDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        currencyList={currencyUtil.currencyList}
        currencies={currencies}
        onClick={(currency) => {
          setCurrencies((prev) => {
            const newCurrencies = [...prev];
            if (!newCurrencies.includes(currency)) {
              newCurrencies[swipedIndex!] = currency;
            }
            return newCurrencies;
          });
        }}
      />
    </>
  );
};
