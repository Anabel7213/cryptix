"use client";

import Categories from "@/components/categories";
import Passwords from "@/components/passwords";
import Create from "@/components/ui/create";
import Search from "@/components/ui/search";
import SettingsModal from "@/components/ui/settings";
import UnifiedForm from "@/components/unifiedForm";
import { handleDecryption } from "@/decrypt";
import { useUser } from "@clerk/nextjs";
import { List, LockIcon, Settings } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const items = [
  {
    id: 0,
    name: "My Passwords",
    icon: <LockIcon size={20} />,
  },
  {
    id: 1,
    name: "Categories",
    icon: <List size={20} />,
  },
];

interface Password {
  encrypted: string;
  iv: string;
  key: string;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [allItemsLength, setAllItemsLength] = useState(0);
  const [allItems, setAllItems] = useState<any>();
  const [searchResult, setSearchResult] = useState([]);
  const { user } = useUser();

  const exportToCSV = async () => {
    const csvRows: string[] = [];
    const headers = [
      "Type",
      "Category",
      "Service",
      "Username",
      "Email",
      "Phone",
      "Password",
      "Recovery Phrase",
      "Card Number",
      "CVV",
      "Expiration",
      "PIN",
      "Routing Number",
      "Account Number",
      "Billing Address",
      "ID Number",
      "Additional Info",
      "Issue Date",
      "Expiry Date",
      "Address",
    ];
    csvRows.push(headers.join(","));

    for (const item of allItems) {
      let values: string[] = [];

      if ("Username" in item) {
        const password = await new Promise<string>((resolve) => {
          handleDecryption({
            encryptedData: item.Password,
            setDecryptedData: resolve,
          });
        });

        const recoveryPhrase = await new Promise<string>((resolve) => {
          handleDecryption({
            encryptedData: item["Recovery Phrase"],
            setDecryptedData: resolve,
          });
        });

        values = [
          item.Type,
          item.Category,
          item.Service,
          item.Username,
          item.Email,
          item.Phone,
          password || "",
          recoveryPhrase || "",
          "",
          "",
        ];
      } else if ("CardNumber" in item) {
        const cvv = await new Promise<string>((resolve) => {
          handleDecryption({
            encryptedData: item.CVV,
            setDecryptedData: resolve,
          });
        });
        const pin = await new Promise<string>((resolve) => {
          handleDecryption({
            encryptedData: item.PIN,
            setDecryptedData: resolve,
          });
        });

        values = [
          item.Type,
          "",
          item.Service,
          "",
          "",
          "",
          "",
          "",
          item.CardNumber,
          cvv || "",
          item.Expiration,
          pin || "",
          item.RoutingNumber,
          item.AccountNumber,
          item.BillingAddress,
          "",
        ];
      } else if ("Number" in item) {
        values = [
          item.Type,
          "",
          item.Service,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          item.Number,
          item.AdditionalInfo,
          item.IssueDate,
          item.ExpiryDate,
          item.Address,
        ];
      }

      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "passwords.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  const [modal, setModal] = useState(false);
  return (
    <>
      <div className="p-4 flex flex-col items-center justify-center">
        {/* header */}
        <div className="flex justify-between items-center w-full text-[#758393]">
          <div className="flex gap-4 items-center text-sm">
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
            <div className="flex flex-col gap-0">
              <h1 className="font-bold text-[#1C1C1C]">
                Hello, {user?.firstName}
              </h1>
              <p>You have {allItemsLength} passwords.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Search allItems={allItems} setSearchResult={setSearchResult} />
            <SettingsModal
              exportToCSV={exportToCSV}
              setModal={setModal}
              modal={modal}
              trigger={
                <Settings
                  onClick={() => setModal(true)}
                  size={20}
                  className="hover:text-[#1C1C1C] transition-all cursor-pointer"
                />
              }
            />
          </div>
        </div>
        {/* header */}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-4 mt-32 w-fit items-end">
          <div className="flex items-center gap-4 text-[#758393]">
            {items.map((item) => (
              <div
                onClick={() => setActive(item.id)}
                className="hover:text-[#1C1C1C] transition-all cursor-pointer"
                key={item.name}
              >
                {item.icon}
              </div>
            ))}
          </div>
          {active === 0 ? (
            <Passwords
              setAllItemsLength={setAllItemsLength}
              setAllItems={setAllItems}
              searchResult={searchResult}
              exportToCSV={exportToCSV}
            />
          ) : (
            <Categories />
          )}
        </div>
      </div>
      <Create setSelectedType={setSelectedType} />
      {selectedType !== "" && (
        <UnifiedForm
          setSelectedType={setSelectedType}
          selectedType={selectedType}
        />
      )}
    </>
  );
}
