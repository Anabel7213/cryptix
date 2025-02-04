import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useClerk } from "@clerk/nextjs";
import { FileCode2, FolderUp, LogOut, Share2, X } from "lucide-react";
import Icon from "./icon";
import toast from "react-hot-toast";
import React from "react";

export default function SettingsModal({
  trigger,
  modal,
  setModal,
  exportToCSV,
}: {
  trigger: React.ReactNode;
  modal: boolean;
  setModal: (value: boolean) => void;
  exportToCSV: () => void;
}) {
  const { signOut } = useClerk();

  const actions = [
    {
      name: "Share",
      icon: <Share2 />,
      onClick: () => {
        navigator.clipboard.writeText("https://cryptix-woad.vercel.app/");
        toast.success("Link copied!");
      },
    },
    {
      name: "Export as CSV",
      icon: <FolderUp />,
      onClick: () => {
        exportToCSV();
        setModal(false);
      },
    },
    {
      name: "About Devs",
      icon: <FileCode2 />,
      onClick: () => window.open("https://www.by-anabel.com/"),
    },
    {
      name: "Log Out",
      icon: <LogOut />,
      onClick: () => {
        signOut();
        setModal(false);
      },
    },
  ];

  return (
    <>
      <AlertDialog open={modal} onOpenChange={setModal}>
        <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between items-center">
              Settings
              <Icon size={20} icon={<X />} onClick={() => setModal(false)} />
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actions.map((item) => (
                <div
                  onClick={item.onClick}
                  key={item.name}
                  className={`group flex items-center gap-4 text-[16px] transition-all cursor-pointer ${
                    item.name.includes("Out")
                      ? "hover:text-red-700"
                      : "hover:text-[#1c1c1c]"
                  } py-2 border-b last-of-type:border-0`}
                >
                  <Icon
                    className={
                      item.name.includes("Out")
                        ? "group-hover:text-red-700"
                        : "group-hover:text-[#1c1c1c]"
                    }
                    size={20}
                    icon={item.icon}
                  />
                  <h1>{item.name}</h1>
                </div>
              ))}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
