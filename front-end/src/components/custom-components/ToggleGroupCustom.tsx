"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { toggleVariants } from "@/components/ui/toggle";
import { VariantProps } from "class-variance-authority";
import { Dispatch, SetStateAction, useState } from "react";
type ToggleGroupListProps = React.ComponentProps<
  typeof ToggleGroupPrimitive.Root
> &
  VariantProps<typeof toggleVariants> & {
    listItem: string[];
    selectedItem: string[];
    setSelectedItem: Dispatch<SetStateAction<string[]>>;
  };
export default function ToggleGroupCustom({
  listItem,
  selectedItem,
  setSelectedItem,
  ...props
}: ToggleGroupListProps) {
  return (
    <ToggleGroup {...props}>
      {listItem.map((item) => (
        <ToggleGroupItem
          className="border-gold-mid/50 border text-gold-abyss-end/70 font-light"
          key={item}
          value={item}
          onClick={() =>
            setSelectedItem((prev) =>
              prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item],
            )
          }
        >
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
