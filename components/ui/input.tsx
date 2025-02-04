import {
  KeyboardEventHandler,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import Icon from "./icon";

interface Input {
  inputName?: string;
  type: string;
  capitalize?: boolean;
  value?: any;
  placeholder?: string;
  icon?: ReactElement;
  width?: string;
  disabled?: boolean;
  onBlurCapture?: React.FocusEventHandler<HTMLInputElement>;
  showSecondaryIcon?: boolean;
  secondaryIcon?: ReactElement;
  onSecondaryIconClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: any;
  style?: any;
  onBlur?: any;
}
export default function Input({
  inputName,
  style,
  capitalize,
  showSecondaryIcon,
  onBlurCapture,
  secondaryIcon,
  onSecondaryIconClick,
  onKeyDown,
  onClick,
  value,
  onChange,
  icon,
  disabled,
  type,
  onFocus,
  onBlur,
  placeholder,
  width = "w-[272px]",
}: Input) {
  const [focus, setFocus] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
          setFocus(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  });
  return (
    <>
      <div className={`${width}`}>
        <h1 className="mb-2 font-medium text-[#748393] text-sm">{inputName}</h1>
        <div
          ref={inputRef}
          className={`flex items-center justify-between border rounded-lg transition-all py-2 pl-4 pr-2 ${
            focus ? "border-[#1C1C1C]" : "border-[#D5D5D5]"
          }`}
        >
          <input
            style={style}
            onBlurCapture={onBlurCapture}
            onClick={() => setFocus(true)}
            tabIndex={0}
            onKeyDown={onKeyDown}
            value={value}
            onChange={onChange}
            className={`outline-none border-none ${
              capitalize && "capitalize"
            } bg-transparent w-full truncate`}
            type={type}
            name={inputName}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <div className="flex items-center">
            {showSecondaryIcon && (
              <Icon icon={secondaryIcon} onClick={onSecondaryIconClick} />
            )}
            <Icon icon={icon} onClick={onClick} disabled={disabled} />
          </div>
        </div>
      </div>
    </>
  );
}
