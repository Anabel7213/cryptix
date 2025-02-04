import { CreditCard, KeySquare, Fingerprint, Plus } from "lucide-react";
import { useState } from "react";

const items = [
  {
    icon: <KeySquare size={20} />,
    name: "Login",
    position: "-translate-y-[64px] -translate-x-[40px]",
    bg: "bg-[#ECE2FF]",
  },
  {
    icon: <CreditCard size={20} />,
    name: "Card",
    position: "-translate-x-[124px] translate-y-[4px]",
    bg: "bg-[#F8E2FF]",
  },
  {
    icon: <Fingerprint size={20} />,
    name: "ID",
    position: "translate-x-[45px] translate-y-[4px]",
    bg: "bg-[#FFE2EA]",
  },
];

export default function Create({ showButton = true, setSelectedType }: any) {
  const [display, setDisplay] = useState(false);

  return (
    <>
      {showButton && (
        <>
          <div
            onClick={() => setDisplay((prev) => !prev)}
            className="hidden lg:absolute text-white cursor-pointer hover:bg-[#5e2ac5] transition-all w-fit bottom-24 left-1/2 -translate-x-1/2 bg-[#8656E4] shadow-[0px_6px_10px_0px_rgba(182,127,229,0.75)] p-4 rounded-full"
          >
            <Plus size={32} />
          </div>
          <div className="absolute bottom-48 left-1/2">
            {items.map((item) => (
              <div
                onClick={() => {
                  setSelectedType(item.name);
                  setDisplay(false);
                }}
                key={item.name}
                className={`cursor-pointer hover:brightness-95 absolute flex flex-col items-center ${
                  item.position
                } transition-all duration-300 ease-out ${
                  display ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <div
                  className={`${item.bg} font-medium p-4 w-20 h-20 flex flex-col gap-1 text-sm justify-center items-center rounded-full`}
                >
                  <div>{item.icon}</div>
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export function MobileCreate({ setSelectedType }: any) {
  return (
    <>
      <div className="lg:hidden lg:invisible flex flex-col gap-4">
        <h1 className="text-xl text-[#1c1c1c]">What do you want to save?</h1>
        <div className="gap-4 text-[#1c1c1c] grid grid-cols-3">
          {items.map((item) => (
            <div
              onClick={() => {
                setSelectedType(item.name);
              }}
              key={item.name}
            >
              <div
                className={`${item.bg} w-full font-medium p-4 flex flex-col gap-2 justify-center items-center rounded-lg`}
              >
                <div>{item.icon}</div>
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
