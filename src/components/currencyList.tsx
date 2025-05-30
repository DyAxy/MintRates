import { CurrencyUtil } from "@/libs/currency";
import {
  cn,
  Image,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
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
                  <div className="h-full flex items-center p-4 bg-primary">
                    <span className="text-nowrap text-content1">更换货币</span>
                  </div>
                </SwipeAction>
              </LeadingActions>
            }
          >
            <div
              className={cn(
                "flex items-center justify-between px-4 bg-white w-full h-20",
                "transition-all duration-200 ease-in-out",
                selectedIndex === index && "bg-default-100"
              )}
              onClick={() => setSelectedIndex(index)}
            >
              <div className="flex flex-row items-center gap-2">
                <Image
                  radius="none"
                  src={currencyUtil.currencyList[item].icon}
                  alt={item}
                  width={32}
                  height={32}
                />
                <span className="text-large">{item.toUpperCase()}</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex flex-row items-center text-default-600">
                  <span className={cn("text-lg cursor-default")}>
                    {numbers.length === currencies.length &&
                      numbers[index].toFixed(2)}
                  </span>
                  {selectedIndex === index && (
                    <span className="inline-block w-0.5 h-6 bg-default-800 animate-blink"></span>
                  )}
                </div>
                <span className="text-default-400 text-xs">
                  {currencyUtil.currencyList[item].displayName +
                    " " +
                    currencyUtil.currencyList[item].symbol}
                </span>
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
