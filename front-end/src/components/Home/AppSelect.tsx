import React, { ReactNode } from "react";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "../ui/select";

import { Select as SelectPrimitive } from "radix-ui";
import Image from "next/image";

interface PropTypes extends React.ComponentProps<typeof SelectPrimitive.Root> {
  options: {
    label: string;
    value: string | number | Date;
  }[];
  label: string;
  isIcon?: ReactNode;
  flag?: {
    png: string;
    svg: string;
    alt: string;
  };
}

const AppSelect = ({ label, flag, options, ...props }: PropTypes) => {
  const optionMap = options
    ?.map((item) => ({
      label: item?.label,
      value: item?.value,
    }))
    .sort((a, b) => {
      if (a?.label < b?.label) {
        return -1;
      }
      if (a?.label > b?.label) {
        return 1;
      }
      return 0;
    });

  return (
    <Select {...props}>
      <SelectTrigger className="w-[180px] text-gold-abyss-end/60!">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent
        className="
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=open]:fade-in-0
        data-[state=closed]:fade-out-0
        data-[state=open]:zoom-in-95
        data-[state=closed]:zoom-out-95
        data-[state=open]:slide-in-from-top-2
        data-[state=closed]:slide-out-to-top-2
        duration-150
      "
      >
        <SelectGroup>
          {optionMap?.map((item) => (
            <SelectItem
              className="text-gold-abyss-end/60! font-cormorant!"
              key={item.value.toString()}
              value={item.value.toString()}
            >
              <p>{item.label}</p>

              {flag && (
                <Image
                  width={100}
                  height={100}
                  alt={flag?.alt}
                  src={flag?.png}
                />
              )}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default AppSelect;
