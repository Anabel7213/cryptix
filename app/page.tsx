"use client";

import Categories from "@/components/categories";
import Passwords from "@/components/passwords";
import Create from "@/components/ui/create";
import Header from "@/components/ui/header";
import UnifiedForm from "@/components/unifiedForm";
import { exportToCSV } from "@/lib/exportToCSV";
import { useUser } from "@clerk/nextjs";
import { List, LockIcon } from "lucide-react";
import { useState } from "react";

const items = [
  {
    id: 0,
    icon: <LockIcon size={20} />,
  },
  {
    id: 1,
    icon: <List size={20} />,
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [allItemsLength, setAllItemsLength] = useState(0);
  const [allItems, setAllItems] = useState<any>();
  const [searchResult, setSearchResult] = useState([]);

  const [modal, setModal] = useState(false);
  const { user } = useUser();
  const userId = user?.id;
  return (
    <>
      <div className="p-6 lg:p-4 flex flex-col items-center justify-center">
        <Header
          allItemsLength={allItemsLength}
          allItems={allItems}
          setSearchResult={setSearchResult}
          modal={modal}
          setModal={setModal}
          exportToCSV={() => exportToCSV({ allItems, userId })}
          setSelectedType={setSelectedType}
        />
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-4 px-6 lg:p-auto lg:mt-32 w-full lg:w-fit items-end">
          <div className="flex items-center justify-between lg:justify-end lg:mb-4 w-full">
            <h1 className="lg:hidden lg:invisible block text-xl text-[#1c1c1c]">
              My Passwords
            </h1>
            <div className="flex items-center gap-4 text-[#758393]">
              {items.map((item, i) => (
                <div
                  onClick={() => setActive(item.id)}
                  className="hover:text-[#1C1C1C] transition-all cursor-pointer"
                  key={i}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
          {active === 0 ? (
            <Passwords
              setAllItemsLength={setAllItemsLength}
              setAllItems={setAllItems}
              searchResult={searchResult}
            />
          ) : (
            <Categories />
          )}
        </div>
      </div>
      <Create setSelectedType={setSelectedType} />
      <UnifiedForm
        setSelectedType={setSelectedType}
        selectedType={selectedType}
      />
    </>
  );
}
