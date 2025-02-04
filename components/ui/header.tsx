import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Search from "./search";
import SettingsModal from "./settings";
import { Settings } from "lucide-react";
import { MobileCreate } from "./create";

export default function Header({
  allItemsLength,
  allItems,
  setSearchResult,
  exportToCSV,
  modal,
  setModal,
  setSelectedType,
}: any) {
  const { user } = useUser();
  const mediaQuery = window.matchMedia("(max-width: 768px)");
  return (
    <>
      <div className="flex gap-4 flex-col lg:flex-row lg:justify-between lg:items-center w-full text-[#758393]">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center lg:text-sm">
            <div className="bg-[#F9F9F9] rounded-full w-10 h-10 border border-[#D5D5D5]">
              {user?.imageUrl && (
                <Image
                  className="rounded-full"
                  src={user.imageUrl}
                  alt="Profile"
                  width={40}
                  height={40}
                />
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-[#1C1C1C]">
                Hello, {user?.firstName}
              </h1>
              <p>You have {allItemsLength} passwords.</p>
            </div>
          </div>
          <SettingsModal
            exportToCSV={exportToCSV}
            setModal={setModal}
            modal={modal}
            trigger={
              <Settings
                onClick={() => setModal(true)}
                size={24}
                className="lg:invisible lg:hidden block visible hover:text-[#1C1C1C] transition-all cursor-pointer"
              />
            }
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <Search allItems={allItems} setSearchResult={setSearchResult} />
          <SettingsModal
            exportToCSV={exportToCSV}
            setModal={setModal}
            modal={modal}
            trigger={
              <Settings
                onClick={() => setModal(true)}
                size={20}
                className="hidden invisible lg:block lg:visible hover:text-[#1C1C1C] transition-all cursor-pointer"
              />
            }
          />
          <MobileCreate setSelectedType={setSelectedType} />
        </div>
      </div>
    </>
  );
}
