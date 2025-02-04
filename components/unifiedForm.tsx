"use client";

import { Dices, Eye, Paperclip } from "lucide-react";
import Dropdown from "./ui/dropdown";
import Input from "./ui/input";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import { encrypt } from "@/encrypt";
import toast from "react-hot-toast";
import GeneratePassword from "@/passwordGenerator";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/nextjs";

interface Category {
  user: string;
  id: string;
  name: string;
}

interface FileData {
  name: string;
  url: string;
}

export default function UnifiedForm({ selectedType, setSelectedType }: any) {
  const { user } = useUser();
  const formConfigurations: Record<string, any[]> = {
    Login: [
      { name: "Category", type: "dropdown" },
      { name: "Service", type: "text" },
      { name: "Username", type: "text" },
      {
        name: "Password",
        type: "password",
        icon: <Eye />,
        secondaryIcon: <Dices />,
      },
      { name: "Email", type: "email" },
      { name: "Phone", type: "tel" },
      {
        name: "Recovery Phrase",
        type: "password",
        icon: <Eye />,
      },
    ],
    Card: [
      { name: "Service", type: "text" },
      { name: "Card Number", type: "number" },
      { name: "CVV", type: "password", icon: <Eye /> },
      { name: "Expiration", type: "month" },
      { name: "PIN", type: "password", icon: <Eye /> },
      { name: "Routing Number", type: "number" },
      { name: "Account Number", type: "number" },
      { name: "Billing Address", type: "text" },
      { name: "Documents", type: "file" },
    ],
    ID: [
      { name: "Service", type: "text" },
      { name: "Number", type: "text" },
      { name: "Additional Info", type: "text" },
      { name: "Issue Date", type: "date" },
      { name: "Expiry Date", type: "date" },
      { name: "Address", type: "text" },
      { name: "Documents", type: "file" },
    ],
  };

  const [data, setData] = useState<Record<any, any>>({});
  const [sensitiveFields, setSensitiveFields] = useState({
    Password: "",
    CVV: "",
    PIN: "",
    "Recovery Phrase": "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [revealFields, setRevealFields] = useState<Record<string, boolean>>({});
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
  }, [selectedType]);

  const handleGeneratePassword = async () => {
    const password = GeneratePassword();
    setSensitiveFields((prev) => ({ ...prev, Password: password }));
    const encryptedPassword = await encrypt(password);
    setData((prev) => ({ ...prev, Password: encryptedPassword }));
  };

  const handleSensitiveFieldChange = async (name: string, value: string) => {
    setSensitiveFields((prev) => ({ ...prev, [name]: value }));
    const encrypted = await encrypt(value);
    setData((prev) => ({ ...prev, [name]: encrypted }));
  };

  const handleInputChange = (name: string, value: string) => {
    if (name in sensitiveFields) {
      handleSensitiveFieldChange(name, value);
    } else {
      setData((prev) => ({ user: user?.id, ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `documents/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        setFiles((prevFiles) => [
          ...prevFiles,
          { name: file.name, url: downloadUrl },
        ]);
        setUploadedFileName(file.name);
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const category =
        selectedType === "Card" || selectedType === "ID"
          ? "Documents"
          : data.Category;
      await addDoc(collection(db, selectedType), {
        ...data,
        Type: selectedType,
        Category: category,
        files,
      });
      toast.success("Saved!");
      setSelectedType("");
      window.location.reload();
    } catch (err) {
      console.error("Error saving data: ", err);
      toast.error("Save failed");
    }
  };

  const formFields = formConfigurations[selectedType] || [];
  const userCategories = categories.filter(
    (category) => category.user === user?.id
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white rounded-3xl border border-[#D5D5D5] transition-all duration-300 ${
          selectedType === "Login" ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <div className="p-12 relative">
          <form
            onSubmit={handleSubmit}
            className="h-[400px] overflow-scroll flex flex-col gap-4"
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-4">
                {formFields.length > 0 ? (
                  formFields.map((field, index) => (
                    <div key={index}>
                      {field.type === "dropdown" ? (
                        <Dropdown
                          width="w-full md:w-[400px]"
                          data={userCategories}
                          select={field.name === "Type" ? selectedType : ""}
                          onSelect={(v: string) =>
                            handleInputChange(field.name, v)
                          }
                          name={field.name}
                        />
                      ) : field.type === "file" ? (
                        <div
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                          className="group border border-dashed border-[#D5D5D5] h-[200px] bg-secondary rounded-standard text-[#758393] text-center flex flex-col gap-2 justify-center items-center"
                        >
                          <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <div className="group-hover:text-[#1C1C1C] flex flex-col items-center gap-1 font-medium text-[#758393]">
                            <Paperclip
                              size={20}
                              className="group-hover:text-[#1C1C1C1]"
                            />
                            {uploadedFileName || "Documents"}
                          </div>
                        </div>
                      ) : (
                        <Input
                          showSecondaryIcon
                          width="w-full md:w-[400px]"
                          type={revealFields[field.name] ? "text" : field.type}
                          inputName={field.name}
                          value={
                            field.name in sensitiveFields
                              ? sensitiveFields[
                                  field.name as keyof typeof sensitiveFields
                                ]
                              : (data as any)[field.name]
                          }
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.value)
                          }
                          icon={field.icon}
                          secondaryIcon={field.secondaryIcon}
                          onSecondaryIconClick={
                            field.name === "Password"
                              ? handleGeneratePassword
                              : undefined
                          }
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setRevealFields((prev) => ({
                              ...prev,
                              [field.name]: !prev[field.name],
                            }));
                          }}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p>Please select a valid type.</p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center gap-4 mt-4">
              <button
                onClick={() => setSelectedType("")}
                className="text-[#758393] hover:text-[#1C1C1C] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-8 font-medium py-3 ${"bg-[#8656E4] hover:bg-[#5e2ac5] text-white"} rounded-lg transition-colors w-fit`}
              >
                Save {selectedType}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
