import { ReactElement } from "react";
import Icon from "./icon";

interface Button {
    width?: string
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    name?: string
    showIcon: boolean
    icon?: ReactElement
    form?: string
    type?: "submit" | "reset" | "button" | undefined
}

export default function PrimaryButton({form, type, showIcon, width = "w-[116px]", onClick, name, icon}: Button) {
    return (
      <>
        <button
          form={form}
          type={type}
          onClick={onClick}
          className={`${width} bg-gradient-to-r from-[#477CBF] flex gap-1 items-center to-[#53B3B8] hover:from-[#1C5296] justify-center hover:to-[#2D949A] hover:bg-gradient-to-r transition-all py-3 px-4 capitalize rounded-full border-r-[.5px] border-t-[.1px] border-l-[.5px] border-l-[#53B3B8] border-b-[.5px] border-b-[#53B3B8] hover:border-t-[#53B3B8] hover:border-r-[#53B3B8] hover:border-l-[#477CBF] hover:border-b-[#477CBF]`}
        >
          {name}
          {showIcon && (
            <Icon icon={icon} />
          )}
        </button>
      </>
    );
  }

export function SecondaryButton({showIcon, width = "w-[116px]", onClick, name, icon}: Button) {
    return (
        <>
        <button
          onClick={onClick}
          className={`${width} flex gap-1 border border-primary hover:border-secondary items-center justify-center hover:to-[#2D949A] hover:bg-secondary transition-all py-3 px-4 capitalize rounded-full`}
        >
          {name}
          {showIcon && (
            <Icon icon={icon} />
          )}
        </button>
      </>
    )
}