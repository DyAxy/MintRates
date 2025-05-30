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

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(100); // 初始高度百分比

  // 添加事件处理函数
  const handleStart = (clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = startY - clientY;
    const windowHeight = window.innerHeight;
    const heightChange = (deltaY / windowHeight) * 100;

    let newHeight = currentHeight + heightChange;
    newHeight = Math.max(0, Math.min(100, newHeight)); // 限制在0%-100%之间

    setCurrentHeight(newHeight);
    setStartY(clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);

    if (currentHeight <= 50) {
      // 如果高度小于等于50%，自动关闭抽屉
      onOpenChange(false);
      // 重置高度为满屏
      setTimeout(() => {
        setCurrentHeight(100);
      }, 300); // 延迟重置，等待关闭动画完成
    } else {
      // 如果高度大于50%，返回到100%
      setCurrentHeight(100);
    }
  };
  useEffect(() => {
    if (isOpen) {
      setCurrentHeight(100);
    }
  }, [isOpen]);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
    const handleMouseUp = () => handleEnd();
    const handleTouchEnd = () => handleEnd();

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startY, currentHeight]);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      radius="none"
      className="bg-[var(--tg-theme-secondary-bg-color)] max-h-[100%]"
      style={{ height: `${currentHeight}%` }}
      hideCloseButton
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="p-4 w-full items-center flex flex-col justify-center bg-[var(--tg-theme-bg-color)]">
              <div
                className="flex justify-center items-center w-full pb-4 cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => handleStart(e.clientY)}
                onTouchStart={(e) => handleStart(e.touches[0].clientY)}
              >
                <div
                  className={cn(
                    "bg-[var(--tg-theme-hint-color)] h-1.5 w-40 rounded-full transition-opacity",
                    isDragging ? "opacity-70" : "opacity-50 hover:opacity-70"
                  )}
                />
              </div>
              <Input
                radius="lg"
                placeholder="搜索货币"
                startContent={
                  <Icon icon="tabler:search" className="text-defualt-300" />
                }
                value={search}
                onValueChange={setSearch}
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
