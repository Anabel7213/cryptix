import { Paperclip } from "lucide-react";
import Dropdown from "../ui/dropdown";
import Icon from "../ui/icon";
import Input from "../ui/input";
import PrimaryButton, { SecondaryButton } from "../ui/buttons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

export default function IdentificationCard({ setSelectedType }: any) {
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
  const formFields = [
    {
      identifier: "Type",
      name: "Type",
      type: "dropdown",
    },
    {
      identifier: "Service",
      name: "Name",
      type: "text",
      width: "w-full md:w-auto",
    },
    {
      identifier: "Number",
      name: "Number",
      type: "string",
    },
    {
      identifier: "AdditionalInfo",
      name: "Additional Info",
      type: "text",
      width: "w-full md:w-auto",
    },
    {
      identifier: "IssueDate",
      name: "Date of Issue",
      type: "date",
      width: "w-full md:w-auto",
    },
    {
      identifier: "ExpiryDate",
      name: "Expiry Date",
      type: "date",
    },
    {
      identifier: "Address",
      name: "Address",
      type: "text",
      width: "w-full",
    },
    {
      identifier: "Documents",
      name: "Documents",
      type: "file",
      width: "w-full",
    },
  ];
  const { user } = useUser()
  const [data, setData] = useState({
    user: user?.id,
    Type: "Identification Card",
    Category: "Documents",
    Service: "",
    Number: "",
    AdditionalInfo: "",
    IssueDate: "",
    ExpiryDate: "",
    Address: "",
  });
  const handleInputChange = async (name: string, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const addIdCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "idCard"), {
        data: data,
      });
    } catch (err) {
      console.error(
        "Error processing data as an identification card type" + err
      );
      toast.error("Oh Snap! Didn't work.");
    } finally {
      toast.success("Saved!");
    }
  };
  return (
    <>
      <form
        onSubmit={addIdCard}
        id="id-card"
        className="grid grid-col-2 gap-4 w-screen md:w-full px-4"
      >
        {formFields.map((field, index) => {
          if (field.type === "dropdown") {
            return (
              <div
                key={index}
                className={
                  field.width === "w-full"
                    ? "col-span-2"
                    : "col-span-2 md:col-span-1"
                }
              >
                <Dropdown
                  width={field.width || "w-full"}
                  data={types}
                  name={field.name}
                  select={field.name === "Type" ? "Identification Card" : ""}
                  onSelect={(value) => {
                    handleInputChange(field.identifier, value);
                    setSelectedType(value);
                  }}
                />
              </div>
            );
          } else if (field.type === "file") {
            return (
              <div
                key={index}
                onClick={() => document.getElementById("file-upload")?.click()}
                className="border border-dashed border-border h-[200px] bg-secondary rounded-standard text-center flex flex-col gap-2 justify-center items-center col-span-2 mb-4 md:mb-0"
              >
                <input
                  type={field.type}
                  id={"file-upload"}
                  onChange={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1 font-medium text-border">
                  <Icon icon={<Paperclip />} disabled />
                  {field.name}
                </div>
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
                <Input
                  onChange={(e) =>
                    handleInputChange(field.identifier, e.target.value)
                  }
                  width={field.width}
                  type={field.type}
                  inputName={field.name}
                />
              </div>
            );
          }
        })}
      </form>
      <div className="flex items-center gap-2 self-end p-4 pt-0">
        <SecondaryButton onClick={() => {}} name="Cancel" showIcon={false} />
        <PrimaryButton
          type="submit"
          form="id-card"
          name="Create"
          showIcon={false}
        />
      </div>
    </>
  );
}
