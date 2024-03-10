import { Dices, Eye, File, Paperclip } from "lucide-react";
import PrimaryButton, { SecondaryButton } from "../ui/buttons";
import Dropdown from "../ui/dropdown";
import Icon from "../ui/icon";
import Input from "../ui/input";
import { useEffect, useState } from "react";
import { encrypt } from "@/encrypt";
import toast from "react-hot-toast";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import GeneratePassword from "@/passwordGenerator";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, useUser } from "@clerk/nextjs";

interface Filedata {
  name: string;
  url: string;
}

export default function BankCardForm({ setSelectedType }: any) {
  const { user } = useUser()
  const [revealPin, setRevealPin] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealRecovery, setRevealRecovery] = useState(false);
  const [revealCvv, setRevealCvv] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
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
  const formFields = [
    {
      identifier: "Type",
      name: "Type",
      type: "dropdown",
    },
    {
      identifier: "Service",
      name: "Service",
      type: "text",
    },
    {
      identifier: "PIN",
      name: "PIN",
      type: revealPin ? "text" : "password",
      icon: <Eye />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setRevealPin((prev) => !prev);
      },
    },
    {
      identifier: "Password",
      name: "Password",
      type: revealPassword ? "text" : "password",
      icon: <Dices />,
      showSecondaryIcon: true,
      secondaryIcon: <Eye />,
      onSecondaryIconClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setRevealPassword((prev) => !prev);
      },
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleGeneratePassword();
      },
    },
    {
      identifier: "Email",
      name: "Email",
      type: "email",
    },
    {
      identifier: "Phone",
      name: "Phone",
      type: "tel",
    },
    {
      identifier: "cardDetails",
      name: "Card Details",
      type: "group",
      fields: [
        {
          identifier: "CardNumber",
          name: "Card Number",
          type: "number",
          width: "w-full",
        },
        {
          identifier: "CVV",
          name: "CVV",
          type: revealCvv ? "number" : "password",
          width: "w-full md:w-1/2",
          icon: <Eye />,
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setRevealCvv((prev) => !prev);
          },
        },
        {
          identifier: "Expiration",
          name: "Expiration",
          type: "month",
          width: "w-full md:w-1/2",
        },
      ],
    },
    {
      identifier: "Recovery Phrase",
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
    {
      identifier: "Documents",
      name: "Documents",
      type: "file",
      width: "w-full",
      column: "2nd",
    },
    {
      identifier: "RoutingNumber",
      name: "Routing Number",
      type: "number",
      column: "2nd",
    },
    {
      identifier: "AccountNumber",
      name: "Account Number",
      type: "number",
      column: "2nd",
    },
    {
      identifier: "BillingAddress",
      name: "Billing Address",
      type: "text",
      width: "w-full",
      column: "2nd",
    },
  ];
  const [pin, setPin] = useState({});
  const [password, setPassword] = useState({});
  const [recovery, setRecovery] = useState({});
  const [cvv, setCvv] = useState({});
  const [files, setFiles] = useState<Filedata[]>([]);
  const [data, setData] = useState({
    user: user?.id,
    Type: "Bank Card",
    Category: "Documents",
    Service: "",
    Email: "",
    Phone: "",
    CardNumber: "",
    Expiration: "",
    RoutingNumber: "",
    AccountNumber: "",
    BillingAddress: "",
  });

  const handleInputChange = async (name: string, value: string) => {
    if (name === "PIN") {
      const encryption = await encrypt(value);
      setPin(encryption);
    } else if (name === "Password") {
      setGeneratedPassword(value);
      const encryption = await encrypt(value);
      setPassword(encryption);
    } else if (name === "Recovery Phrase") {
      const encryption = await encrypt(value);
      setRecovery(encryption);
    } else if (name === "CVV") {
      const encryption = await encrypt(value);
      setCvv(encryption);
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `documents/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("File Uploaded", snapshot);

      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        console.log("File available at", downloadUrl);
        setFiles((prevFiles) => [
          ...prevFiles,
          { name: file.name, url: downloadUrl },
        ]);
      });
    });
  };
  const addBankCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bankCard"), {
        data: data,
        files: files,
        password: password,
        recovery: recovery,
        pin: pin,
        cvv: cvv,
      });
    } catch (err) {
      console.error("Error processing data as a bank card type" + err);
      toast.error("Oh Snap! Didn't work.");
    } finally {
      toast.success("Saved!");
    }
  };
  return (
    <>
      <form
        onSubmit={addBankCard}
        id="bank-card"
        className="grid grid-cols-2 gap-4 w-screen px-4 md:px-0 md:w-full"
      >
        {formFields.map((field, index) => {
          if (field.type === "group") {
            return (
              <div
                key={index}
                className="col-span-2 flex flex-col md:flex-row gap-4"
              >
                {field.fields?.map((subField, subIndex) => (
                  <Input
                    onClick={subField.onClick}
                    icon={subField.icon}
                    key={subIndex}
                    type={subField.type}
                    inputName={subField.name}
                    width={subField.width}
                    onChange={(e) =>
                      handleInputChange(subField.identifier, e.target.value)
                    }
                  />
                ))}
              </div>
            );
          } else {
            return (
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
                    width={field.width || "w-full"}
                    select={field.name === "Type" ? "Bank Card" : ""}
                    name={field.name}
                    data={types}
                    onSelect={(value) => {
                      handleInputChange(field.identifier, value);
                      setSelectedType(value);
                    }}
                  />
                ) : field.type === "file" ? (
                  <div
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    className="border border-dashed border-border h-[200px] bg-secondary rounded-standard text-center flex flex-col gap-2 justify-center items-center"
                  >
                    <input
                      type={field.type}
                      id={"file-upload"}
                      onChange={handleFileUpload}
                      multiple
                      className="hidden"
                    />
                    {fileUploaded ? (
                      <>
                        {files.map((file, i) => {
                          <div key={i}>
                            <a
                              target="_blank"
                              href={file.url}
                              rel="noopener noreferrer"
                            >
                              {file.name}
                            </a>
                          </div>;
                        })}
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1 font-medium text-border">
                        <Icon icon={<Paperclip />} disabled />
                        {field.name}
                      </div>
                    )}
                  </div>
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
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    icon={field.icon}
                    width={field.width || "w-full"}
                    type={field.type}
                    inputName={field.name}
                  />
                )}
              </div>
            );
          }
        })}
      </form>
      <div className="flex items-center gap-2 self-end p-4 pt-0">
        <SecondaryButton onClick={() => {}} name="Cancel" showIcon={false} />
        <PrimaryButton
          type="submit"
          form="bank-card"
          name="Create"
          showIcon={false}
        />
      </div>
    </>
  );
}
