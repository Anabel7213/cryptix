"use client"

import { ChevronDown } from "lucide-react";
import Input from "./input";
import { useEffect, useRef, useState } from "react";

interface DropdownItem {
    name: string
}

interface Dropdown {
    data: DropdownItem[]
    name: string
    select: string
    width?: string
    onSelect: (value: string) => void
}

export default function Dropdown({data, name, select, onSelect, width}: Dropdown) {
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    })

    const [ isOpen, setIsOpen ] = useState(false)
    const [ selected, setSelected ] = useState(select)
    return (
        <>
        <div ref={dropdownRef} className={`flex flex-col ${width || "md:w-[272px]"} gap-2 relative items-center justify-center`}>
        <Input width={width} value={selected} inputName={name} type="text" placeholder="Select" icon={<ChevronDown className={isOpen ? "rotate-180" : ""}/>} onClick={(e) => {e.preventDefault(); setIsOpen(prev => !prev)}}/>
        {isOpen && (
        <div className="flex absolute z-[1000] flex-col gap-2 p-4 rounded-standard bg-secondary w-full md:w-[280px] top-24">
            {data.map((item, index) => (
                <div key={index} onClick={(e) => {e.stopPropagation(); e.preventDefault(); setSelected(item.name); onSelect(item.name)}} className="flex items-center gap-2 hover:bg-primary p-3 rounded-standard transition-all">
                    <div className="w-[20px] h-[20px] rounded-full border bg-transparent flex justify-center items-center">{selected === item.name ? <>{<div className="w-[8px] h-[8px] rounded-full bg-[#EDECF9]"></div>}</> : null}</div>
                    <h1 className="capitalize">{item.name}</h1>
                </div>
            ))}
        </div>
        )}
        </div>
        </>
    )
}