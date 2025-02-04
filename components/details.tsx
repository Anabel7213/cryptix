import { handleDecryption } from "@/decrypt";
import { useEffect, useRef, useState } from "react";
import Input from "./ui/input";
import { Copy, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Link from "next/link";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

interface CardDetails {
  isOpen: boolean;
  setIsOpen: any;
  data: any;
}

interface EditData {
  [key: string]: string;
}

export default function CardDetails({ isOpen, setIsOpen, data }: CardDetails) {
  const [editData, setEditData] = useState<EditData>({});
  const [decryptedFields, setDecryptedFields] = useState<
    Record<string, string>
  >({});
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setEditData(data || {});
    if (data) {
      Object.keys(data).forEach((field) => {
        if (data[field]?.encrypted) {
          handleDecryption({
            encryptedData: data[field],
            setDecryptedData: (decrypted: string) =>
              setDecryptedFields((prev) => ({ ...prev, [field]: decrypted })),
          });
        }
      });
    }
  }, [data]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleUpdate = async (field: string) => {
    try {
      if (!data.Type || !data.id) {
        console.error("Missing Type or ID in data:", data);
        throw new Error("Invalid document reference");
      }
      await updateDoc(doc(db, data.Type, data.id), {
        [field]: editData[field] || "",
      });
      toast.success("Data successfully updated!");
      setIsEditing((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      console.error("Error updating data:", err);
      toast.error("Failed to update data.");
    }
  };

  const toggleVisibility = (field: string) => {
    setIsVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const formFieldsByType: Record<
    string,
    { name: string; type: string; private?: boolean; encrypted?: any }[]
  > = {
    Login: [
      { name: "Service", type: "text" },
      { name: "Username", type: "text" },
      { name: "Email", type: "email" },
      { name: "Phone", type: "tel" },
      {
        name: "Password",
        type: "password",
        private: true,
        encrypted: data?.password,
      },
      {
        name: "Recovery Phrase",
        type: "password",
        private: true,
        encrypted: data?.recovery,
      },
    ],
    Card: [
      { name: "Service", type: "text" },
      { name: "Card Number", type: "text" },
      { name: "CVV", type: "password", private: true, encrypted: data?.cvv },
      { name: "Expiration", type: "text" },
      { name: "PIN", type: "password", private: true, encrypted: data?.pin },
      { name: "Routing Number", type: "text" },
      { name: "Account Number", type: "text" },
      { name: "Billing Address", type: "text" },
    ],
    ID: [
      { name: "Service", type: "text" },
      { name: "Number", type: "text" },
      { name: "Additional Info", type: "text" },
      { name: "Issue Date", type: "date" },
      { name: "Expiry Date", type: "date" },
      { name: "Address", type: "text" },
    ],
  };

  const formFields = formFieldsByType[data?.Type] || [];
  //handle click outside to close the popup
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogContent ref={ref}>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
            {formFields.map((field, index) => (
              <div key={index} className="flex items-center">
                <Input
                  onBlurCapture={() => handleUpdate(field.name)}
                  onChange={(e) => handleInputChange(e, field.name)}
                  width={`w-full md:w-[${Math.max(
                    324,
                    (decryptedFields[field.name]?.length || 0) * 10
                  )}px]`}
                  showSecondaryIcon
                  secondaryIcon={
                    field.name !== "Additional Info" &&
                    field.name !== "Service" &&
                    field.name !== "Expiration" &&
                    field.name !== "Issue Date" &&
                    field.name !== "Expiry Date" ? (
                      <Copy />
                    ) : undefined
                  }
                  onSecondaryIconClick={() => {
                    const valueToCopy = isVisible[field.name]
                      ? decryptedFields[field.name]
                      : editData[field.name];
                    navigator.clipboard.writeText(valueToCopy || "");
                    toast.success("Copied to Clipboard");
                  }}
                  icon={field.private ? <Eye /> : undefined}
                  onClick={() => field.private && toggleVisibility(field.name)}
                  type={isVisible[field.name] ? "text" : field.type}
                  value={
                    isVisible[field.name]
                      ? decryptedFields[field.name] || ""
                      : editData[field.name] || ""
                  }
                  inputName={field.name}
                  onFocus={() =>
                    setIsEditing((prev) => ({
                      ...prev,
                      [field.name]: true,
                    }))
                  }
                  onBlur={() =>
                    setIsEditing((prev) => ({
                      ...prev,
                      [field.name]: false,
                    }))
                  }
                />
              </div>
            ))}
            {data?.files && data.files.length > 0 && (
              <div className="flex flex-col gap-2">
                {data.files.map(
                  (file: { name: string; url: string }, index: number) => (
                    <Link
                      key={index}
                      href={file.url}
                      target="_blank"
                      download={file.name}
                      rel="noopener noreferrer"
                      className="text-[#8656E4] hover:underline"
                    >
                      Download {file.name}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
