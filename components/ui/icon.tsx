import { ReactElement, cloneElement } from "react"

interface Icon {
    icon?: ReactElement
    size?: number
    strokeWidth?: number
    disabled?: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Icon({onClick, disabled, icon, size = 16, strokeWidth = 1.5}: Icon) {
    const modifiedIcon = icon ? cloneElement(icon, {
        size,
        strokeWidth,
      }) : null;
    return (
        <button type="button" disabled={disabled} onClick={onClick} className="p-1 cursor-pointer rounded-standard hover:bg-secondary transition-all">
            {modifiedIcon}
        </button>
    )
}