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
              <div className="flex flex-row items-center gap-2">
                <Image
                  radius="none"
                  src={currencyUtil.currencyList[item].icon}
                  alt={item}
                  width={32}
                  height={32}
                />
                <span className="text-large text-[var(--tg-theme-text-color)] font-semibold">
                  {currencyUtil.currencyList[item].displayName}
                </span>
                <span className="text-medium text-[var(--tg-theme-subtitle-text-color)]">
                  {item}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex flex-row items-center">
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
                              Math.floor(currentValue * 100) / 100;
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
                          "bg-transparent",
                          "data-[hover=true]:bg-transparent",
                          "group-data-[focus=true]:bg-transparent",
                        ),
                        input: cn("text-large font-medium text-right",
                          "group-data-[has-value=true]:text-[var(--tg-theme-text-color)]",
                        ),
                      }}
                    />
                  ) : (
                    // 其他项目显示只读的数值
                    <span className="text-large font-medium px-3 py-2 min-w-24 text-right text-[var(--tg-theme-subtitle-text-color)]">
                      {numbers.length === currencies.length &&
                        numbers[index].toFixed(2)}
                    </span>
                  )}
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
