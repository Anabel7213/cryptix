import { handleDecryption } from "@/decrypt";
import { useEffect, useState } from "react";
import Input from "../ui/input";
import { Copy, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import Icon from "../ui/icon";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

interface CardDetails {
  isOpen: boolean;
  setIsOpen: any;
  data: any;
}

interface EditData {
  Type: string;
  Category: string;
  Service: string;
  Username: string;
  Email: string;
  Phone: string;
  Password: string;
  Recovery: string;
}

export default function CardDetails({ isOpen, setIsOpen, data }: CardDetails) {
  const formatDate = (date: any) => {
    if (date === simplifiedDate) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } else {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }
  };
  const simplifiedDate = data?.data.Expiration;
  const formatPhone = (phone: string) => {
    const digits = phone?.replace(/\D/g, "");
    const match = digits?.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return null;
  };
  const [decryptedPassword, setDecryptedPassword] = useState("********");
  const [decryptedRecovery, setDecryptedRecovery] = useState("********");
  const [decryptedPin, setDecryptedPin] = useState("****");
  const [decryptedCvv, setDecryptedCvv] = useState("***");
  const encryptedPassword = {
    encrypted: data?.password?.encrypted,
    iv: data?.password?.iv,
    key: data?.password?.key,
  };
  const encryptedRecovery = {
    encrypted: data?.recovery?.encrypted,
    iv: data?.recovery?.iv,
    key: data?.recovery?.key,
  };
  const encryptedPin = {
    encrypted: data?.pin?.encrypted,
    iv: data?.pin?.iv,
    key: data?.pin?.key,
  };
  const encryptedCvv = {
    encrypted: data?.cvv?.encrypted,
    iv: data?.cvv?.iv,
    key: data?.cvv?.key,
  };
  const formData = [
    {
      id: 1,
      name: "Service",
      value: data?.data.Service,
      type: "text",
      capitalize: true,
      useCase: [
        {
          id: 1,
          usage: "Credentials",
        },
        {
          id: 2,
          usage: "Bank Card",
        },
        {
          id: 3,
          usage: "Identification Card",
        },
      ],
    },
    {
      id: 2,
      name: "Username",
      value: data?.data.Username,
      type: "text",
      useCase: [
        {
          id: 1,
          usage: "Credentials",
        },
      ],
    },
    {
      id: 3,
      name: "Email",
      value: data?.data.Email,
      type: "email",
      useCase: [
        {
          id: 1,
          usage: "Credentials",
        },
        {
          id: 2,
          usage: "Bank Card",
        },
      ],
    },
    {
      id: 4,
      name: "Phone",
      value: formatPhone(data?.data.Phone),
      type: "phone",
      useCase: [
        {
          id: 1,
          usage: "Credentials",
        },
        {
          id: 2,
          usage: "Bank Card",
        },
      ],
    },
    {
      id: 5,
      name: "PIN",
      icon: <Eye />,
      value: decryptedPin,
      onReveal: () => {
        if (decryptedPin === "****") {
          handleDecryption({
            encryptedData: encryptedPin,
            setDecryptedData: setDecryptedPin,
          });
        } else {
          setDecryptedPin("****");
        }
      },
      type: decryptedPin !== "****" ? "text" : "password",
      useCase: [
        {
          id: 2,
          usage: "Bank Card",
        },
      ],
    },
    {
      id: 6,
      name: "Password",
      value: decryptedPassword,
      type: decryptedPassword !== "********" ? "text" : "password",
      icon: <Eye />,
      onReveal: () => {
        if (decryptedPassword === "********") {
          handleDecryption({
            encryptedData: encryptedPassword,
            setDecryptedData: setDecryptedPassword,
          });
        } else {
          setDecryptedPassword("********");
        }
      },
      useCase: [
        {
          id: 1,
          usage: "Credentials",
        },
        {
          id: 2,
          usage: "Bank Card",
        },
      ],
    },
    {
      id: 7,
      name: "Card Number",
      value: data?.data.CardNumber,
      type: "text",
      useCase: [
        {
          id: 2,
          usage: "Bank Card",
        },
      ],
    },
    {
      id: 8,
      name: "CVV",
      icon: <Eye />,
      value: decryptedCvv,
      onReveal: () => {
        if (decryptedCvv === "***") {
          handleDecryption({
            encryptedData: encryptedCvv,
            setDecryptedData: setDecryptedCvv,
          });
        } else {
          setDecryptedCvv("***");
        }
      },
      type: decryptedCvv !== "***" ? "text" : "password",
      useCase: [
        {
          id: 2,
          usage: "Bank Card",
        },
      ],
    },
    {
      id: 9,
      name: "Number",
      value: data?.data.Number,
      type: "text",
      useCase: [
        {
          id: 3,
          usage: "Identification Card",
        },
      ],
    },
    {
      id: 10,
      name: "Date of Issue",
      value: formatDate(data?.data.IssueDate),
      type: "text",
      useCase: [
        {
          id: 3,
          usage: "Identification Card",
        },
      ],
    },
    {
      id: 11,
      name: "Expiration",
      value: formatDate(data?.data.Expiration || data?.data.ExpiryDate),
      type: "text",
      useCase: [
        {
          id: 2,
          usage: "Bank Card",
        },
        {
          id: 3,
          usage: "Identification Card",
        },
      ],
    },
    {
      id: 12,
      name: "Recovery",
      value: decryptedRecovery,
      type: decryptedRecovery !== "********" ? "text" : "password",
      icon: <Eye />,
      onReveal: () => {
        if (decryptedRecovery === "********") {
          handleDecryption({
            encryptedData: encryptedRecovery,
            setDecryptedData: setDecryptedRecovery,
          });
        } else {
          setDecryptedRecovery("********");
        }
      },
      useCase: [
        {
          id: 1,
          usage: "Credentials",
        },
      ],
    },
    {
      id: 13,
      name: "Routing Number",
      value: data?.data?.['Routing Number'],
      type: "number",
      useCase: [
        {
          id: 2,
          usage: "Bank Card",
        },
      ],
    },
    {
      id: 14,
      name: "Account Number",
      value: data?.data?.['Account Number'],
      type: "number",
      useCase: [
        {
          id: 2,
          usage: "Bank Card",
        },
      ],
    },
    {
      id: 15,
      name: "Address",
      capitalize: true,
      value: data?.data?.['Billing Address'] || data?.data.Address,
      type: "text",
      useCase: [
        {
          id: 2,
          usage: "Bank Card",
        },
        {
          id: 3,
          usage: "Identification Card",
        },
      ],
    },
    //documents must be added too
  ];

  const [editData, setEditData] = useState<EditData>({
    Type: "",
    Category: "",
    Service: "",
    Username: "",
    Email: "",
    Phone: "",
    Password: "",
    Recovery: "",
  });
  useEffect(() => {
    setEditData({
      Type: data?.data.Type,
      Category: data?.data.Category,
      Service: data?.data.Service || "",
      Username: data?.data.Username || "",
      Email: data?.data.Email || "",
      Phone: data?.data.Phone || "",
      Password: decryptedPassword || "",
      Recovery: decryptedRecovery || "",
    });
  }, [data, decryptedPassword, decryptedRecovery]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof EditData
  ) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const updateData = async () => {
    try {
      await updateDoc(doc(db, "Credentials", data.id), {
        data: editData,
      });
      console.log("Data successfully updated:" + data);
    } catch (err) {
      console.error("Error updating Credentials:" + err);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 items-center justify-center flex p-[24px] backdrop-blur-xl border-border shadow-2xl`}
        >
          <div className="flex flex-col gap-4 justify-end">
            <div
              onClick={() => setIsOpen(false)}
              className="self-end text-border hover:text-white"
            >
              <Icon icon={<X />} />
            </div>
            {/* <button onClick={() => console.log(decryptedPin)}>test</button> */}
            <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
              {formData
                .filter((item) =>
                  item.useCase.some(
                    (useCaseItem) => data.data.Type === useCaseItem.usage
                  )
                )
                .map((item, index) => (
                  <Input
                    onBlurCapture={updateData}
                    onChange={(e) =>
                      handleInputChange(e, item.name as keyof EditData)
                    }
                    width={`${
                      item.id === 15 ? "w-full col-span-2" : ""
                    } w-[348px] md:w-auto`}
                    showSecondaryIcon={item.id === 1 ? false : true}
                    secondaryIcon={<Copy />}
                    onSecondaryIconClick={() => {
                      navigator.clipboard.writeText(item.value);
                      toast.success("Copied to Clipboard");
                    }}
                    icon={
                      item.id === 5 ||
                      item.id === 6 ||
                      item.id === 8 ||
                      item.id === 12
                        ? item.icon
                        : undefined
                    }
                    capitalize={item.capitalize}
                    key={index}
                    onClick={item.onReveal}
                    type={item.type}
                    value={item.value}
                    inputName={item.name}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}