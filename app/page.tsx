"use client";

import Categories from "@/components/categories";
import BankCardForm from "@/components/create/card";
import CredentialsForm from "@/components/create/credentials";
import IdentificationCard from "@/components/create/id";
import Passwords from "@/components/passwords";
import Switch from "@/components/ui/switch";
import { UserButton, auth } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs/app-beta";
import { useState } from "react";

const items = [
  {
    name: "Create New",
  },
  {
    name: "My Passwords",
  },
  {
    name: "My Categories",
  },
];
export default function Home() {
  const [active, setActive] = useState(1);
  const [selectedType, setSelectedType] = useState("Credentials");
  return (
    <>
    <div className="pt-4 px-4 justify-end flex items-end w-full">
    <UserButton />
    </div>
      <div className="flex justify-center flex-col items-center md:mt-16 gap-20">
        <Switch items={items} active={active} setActive={setActive} />
        {active === 0 ? (
          <div className="justify-center flex flex-col items-center gap-8">
            {selectedType === "Credentials" ? (
              <CredentialsForm setSelectedType={setSelectedType} />
            ) : selectedType === "Bank Card" ? (
              <BankCardForm setSelectedType={setSelectedType} />
            ) : selectedType === "Identification Card" ? (
              <IdentificationCard setSelectedType={setSelectedType} />
            ) : null}
          </div>
        ) : active === 2 ? (
          <Categories />
        ) : (
          <Passwords />
        )}
      </div>
    </>
  );
}
