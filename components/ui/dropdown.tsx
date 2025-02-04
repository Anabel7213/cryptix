"use client";

import { ChevronDown } from "lucide-react";
import Input from "./input";
import { useEffect, useRef, useState } from "react";

interface DropdownItem {
  name: string;
}

interface Dropdown {
  data: DropdownItem[];
  name: string;
  select: string;
  width?: string;
  onSelect: (value: string) => void;
}

export default function Dropdown({
  data,
  name,
  select,
  onSelect,
  width,
}: Dropdown) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(select);
  return (
    <>
      <div
        ref={dropdownRef}
        className={`flex flex-col ${
          width || "md:w-[272px]"
        } relative items-center justify-center`}
      >
        <Input
          capitalize
          onFocus={() => setIsOpen(true)}
          width={width}
          value={selected}
          inputName={name}
          type="text"
          readOnly={true}
          placeholder="Select"
          icon={<ChevronDown className={isOpen ? "rotate-180 border-[#1c1c1c]" : ""} />}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
        />
        {isOpen && (
          <div
            className={`flex absolute z-[1000] flex-col border ${
              selected ? "border-[#d5d5d5]" : "border-[#1c1c1c]"
            } gap-1 p-4 rounded-lg bg-white w-full ${
              width || "md:w-[280px]"
            } top-[125%]`}
          >
            {data.map((item, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelected(item.name);
                  onSelect(item.name);
                }}
                className="flex items-center gap-2 hover:bg-[#f9f9f9] p-2 rounded-lg transition-all"
              >
                <div className="w-[16px] h-[16px] rounded-lg border border-[#D5D5D5] flex justify-center items-center">
                  {selected === item.name ? (
                    <>
                      {
                        <div className="w-[8px] h-[8px] rounded-lg bg-[#1c1c1c]"></div>
                      }
                    </>
                  ) : null}
                </div>
                <h1 className="capitalize">{item.name}</h1>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
