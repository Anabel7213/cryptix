import { KeyboardEventHandler, ReactElement, useEffect, useRef, useState } from "react"
import Icon from "./icon"

interface Input {
    inputName?: string
    type: string
    capitalize?: boolean
    value?: any
    placeholder?: string
    icon?: ReactElement
    width?: string
    disabled?: boolean
    onBlurCapture?: React.FocusEventHandler<HTMLInputElement>
    showSecondaryIcon?: boolean
    secondaryIcon?: ReactElement
    onSecondaryIconClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}
export default function Input({inputName, capitalize, showSecondaryIcon, onBlurCapture, secondaryIcon, onSecondaryIconClick, onKeyDown, onClick, value, onChange, icon, disabled, type, placeholder, width = "w-[272px]"}: Input) {
    const [ focus, setFocus ] = useState(false)

    const inputRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setFocus(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    })
    return (
        <>
        <div className={`${width}`}>
            <h1 className="mb-2">{inputName}</h1>
            <div ref={inputRef} className={`flex items-center justify-between border rounded-standard p-3 pl-4 ${focus ? "shadow-xl border-[#477CBF]" : "border-border"}`}>
                <input onBlurCapture={onBlurCapture} onClick={() => setFocus(true)} tabIndex={0} onKeyDown={onKeyDown} value={value} onChange={onChange} className={`outline-none border-none ${capitalize && "capitalize"} bg-transparent w-full`} type={type} name={inputName} placeholder={placeholder} />
                <div className="flex items-center">
                    {showSecondaryIcon && (
                        <Icon icon={secondaryIcon} onClick={onSecondaryIconClick} />
                    )}
                <Icon icon={icon} onClick={onClick} disabled={disabled}/>
                </div>
            </div>
        </div>
        </>
    )
}