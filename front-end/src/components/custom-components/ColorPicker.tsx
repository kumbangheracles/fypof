"use client";

import { useState, useCallback, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

interface ColorPickerProps {
  value: string;
  listCurrentColor: string[];
  onChange: (color: string) => void;
  disabled?: boolean;
  className?: string;
}

const isValidHex = (hex: string) => /^#[0-9A-Fa-f]{6}$/.test(hex);

export function ColorPicker({
  value,
  listCurrentColor,
  onChange,
  disabled,
  className,
}: ColorPickerProps) {
  const { toast } = useToast();
  const [inputVal, setInputVal] = useState(value);
  const [open, setOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value);
  const prevValue = useRef(value);
  if (prevValue.current !== value) {
    prevValue.current = value;
    setInputVal(value);
  }

  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value;
      if (!raw.startsWith("#")) raw = `#${raw}`;
      setInputVal(raw);
      if (isValidHex(raw)) setTempColor(raw);
    },
    [onChange],
  );

  const handlePickerChange = (color: string) => {
    setTempColor(color); // preview
    setInputVal(color);
  };
  const handleSelect = () => {
    const findOne = listCurrentColor.find((item) => item === tempColor);
    if (findOne) {
      toast(
        "This color is already added, please select different color",
        "info",
      );
      return;
    }

    if (isValidHex(tempColor)) {
      onChange(tempColor); // ← baru dipanggil di sini
      setOpen(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTempColor(value);
      setInputVal(value);
    }
    setOpen(next);
  };
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          className={cn(
            "bg-transparent w-10 border text-gold-abyss-end border-gold-abyss-end hover:bg-gold-abyss/25",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          {/* <span
            className="h-4 w-4 shrink-0 rounded-sm border border-gold-abyss/80"
            style={{ backgroundColor: isValidHex(value) ? value : "#000000" }}
          /> */}
          +
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3 bg-gold-high-end" align="start">
        <div className="flex flex-col justify-center items-center w-full gap-3">
          <HexColorPicker color={tempColor} onChange={handlePickerChange} />

          <div className="flex items-center gap-2">
            <span
              className="h-6 w-6 shrink-0 border border-gold-abyss/80"
              style={{
                backgroundColor: isValidHex(tempColor) ? tempColor : "#000000",
              }}
            />
            <Input
              value={inputVal}
              onChange={handleHexInput}
              maxLength={7}
              className="h-8 font-mono text-xs"
              placeholder="#000000"
            />
            <Button onClick={handleSelect}>Select</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
