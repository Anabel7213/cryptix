"use client";

import { Dices, Eye } from "lucide-react";
import Dropdown from "../ui/dropdown";
import Input from "../ui/input";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import PrimaryButton, { SecondaryButton } from "../ui/buttons";
import { encrypt } from "@/encrypt";
import toast from "react-hot-toast";
import GeneratePassword from "@/passwordGenerator";
import { auth, useUser } from "@clerk/nextjs";

interface Category {
  user: string,
  id: string;
  name: string;
}

export default function CredentialsForm({ setSelectedType }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categories = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Category),
          id: doc.id,
        }));
        setCategories(categories);
      } catch (err) {
        console.error("Error fetching categories" + err);
      }
    };
    fetchCategories();
  }, []);
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealRecovery, setRevealRecovery] = useState(false);
  const types = [
    {
      name: "Credentials",
    },
    {
      name: "Bank Card",
    },
    {
      name: "Identification Card",
    },
  ];
  const [generatedPassword, setGeneratedPassword] = useState("");
  const handleGeneratePassword = async () => {
    const generatedPassword = GeneratePassword();
    console.log("Generated Password: ", generatedPassword);
    const newPassword = await encrypt(generatedPassword);
    setPassword(newPassword);
    setGeneratedPassword(generatedPassword);
  };
  const { user } = useUser()
  const formFields = [
    {
      name: "Type",
      type: "dropdown",
      width: "w-full md:w-[272px]",
    },
    {
      name: "Category",
      type: "dropdown",
      width: "w-full md:w-[272px]",
    },
    {
      name: "Service",
      type: "text",
      width: "w-full",
    },
    {
      name: "Username",
      type: "text",
      width: "w-full md:w-auto",
    },
    {
      name: "Password",
      type: revealPassword ? "text" : "password",
      showSecondaryIcon: true,
      secondaryIcon: <Eye />,
      onSecondaryIconClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault;
        e.stopPropagation();
        setRevealPassword((prev) => !prev);
      },
      icon: <Dices />,
      width: "w-full md:w-auto",
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleGeneratePassword();
      },
    },
    {
      name: "Email",
      type: "email",
      width: "w-full md:w-auto",
    },
    {
      name: "Phone",
      type: "tel",
      width: "w-full md:w-auto",
    },
    {
      name: "Recovery Phrase",
      type: revealRecovery ? "text" : "password",
      width: "w-full",
      icon: <Eye />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setRevealRecovery((prev) => !prev);
      },
    },
  ];
  const [password, setPassword] = useState({});
  const [recovery, setRecovery] = useState({});
  const [data, setData] = useState({
    user: user?.id,
    Type: "Credentials",
    Category: "",
    Service: "",
    Username: "",
    Email: "",
    Phone: "",
  });
  const handleInputChange = async (name: string, value: string) => {
    if (name === "Password") {
      setGeneratedPassword(value);
      const encryption = await encrypt(value);
      setPassword(encryption);
    } else if (name === "Recovery Phrase") {
      const encryption = await encrypt(value);
      setRecovery(encryption);
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const addCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "credentials"), {
        data: data,
        password: password,
        recovery: recovery,
      });
    } catch (err) {
      console.error("Error processing data as a credential type" + err);
      toast.error("Oh Snap! Didn't work.");
    } finally {
      toast.success("Saved!");
    }
  };
  const userCategories = categories.filter(category => category.user === user?.id);
  return (
    <>
      <form
        id="credentials"
        onSubmit={addCredentials}
        className="grid grid-cols-2 gap-4 w-screen px-4 md:w-fit"
      >
        {formFields.map((field, index) => (
          <div
            key={index}
            className={
              field.width === "w-full"
                ? "col-span-2"
                : "col-span-2 md:col-span-1"
            }
          >
            {field.type === "dropdown" ? (
              <Dropdown
                width={field.width}
                onSelect={(value) => {
                  handleInputChange(field.name, value);
                  if (field.name === "Type") {
                    setSelectedType(value);
                  }
                }}
                select={field.name === "Type" ? "Credentials" : ""}
                data={field.name === "Type" ? types : userCategories}
                name={field.name}
              />
            ) : (
              <Input
                value={
                  field.name === "Password"
                    ? generatedPassword
                    : (data as any)[field.name]
                }
                onSecondaryIconClick={field.onSecondaryIconClick}
                secondaryIcon={field.secondaryIcon}
                showSecondaryIcon={field.showSecondaryIcon}
                onClick={field.onClick}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                icon={field.icon}
                width={field.width}
                type={field.type}
                inputName={field.name}
              />
            )}
          </div>
        ))}
      </form>
      <div className="flex items-center gap-2 self-end p-4 pt-0">
        <SecondaryButton onClick={() => {}} name="Cancel" showIcon={false} />
        <PrimaryButton
          type="submit"
          form="credentials"
          name="Create"
          showIcon={false}
        />
      </div>
    </>
  );
}
