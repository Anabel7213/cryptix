import { X } from "lucide-react";
import { ReactElement, cloneElement } from "react";

interface Icon {
  icon?: ReactElement;
  size?: number;
  strokeWidth?: number;
  disabled?: boolean;
  danger?: boolean;
  success?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Icon({
  onClick,
  disabled,
  icon,
  danger,
  success,
  size = 16,
  strokeWidth = 2,
  className,
}: Icon) {
  const modifiedIcon = icon
    ? cloneElement(icon, {
        size,
        strokeWidth,
      })
    : null;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${className} p-1 pr-0 cursor-pointer rounded-standard text-[#758393] ${
        danger
          ? "hover:text-red-700"
          : success
          ? "hover:text-green-700"
          : "hover:text-[#1C1C1C]"
      } transition-all`}
    >
      {modifiedIcon}
    </button>
  );
}
