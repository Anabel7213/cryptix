"use client";

import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import { Trash } from "lucide-react";
import CardDetails from "./details";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Icon from "./ui/icon";

interface Category {
  user: string;
  id: string;
  name: string;
}

interface Login {
  id: string;
  user: string;
  Type: string;
  Category: string;
  Service: string;
  Username: string;
  Email: string;
  Phone: string;
  password: Object;
  recovery: Object;
}

interface Card {
  id: string;
  user: string;
  Type: string;
  Category: string;
  Service: string;
  CardNumber: string;
  pin: Object;
  cvv: Object;
  AccountNumber: string;
  RoutingNumber: string;
  BillingAddress: string;
  Expiration: string;
}

interface ID {
  id: string;
  user: string;
  Type: string;
  Category: string;
  Service: string;
  Number: string;
  AdditionalInfo: string;
  IssueDate: string;
  ExpiryDate: string;
  Address: string;
}

interface PasswordsProps {
  setAllItemsLength: (length: number) => void;
  setAllItems: (items: (Login | Card | ID)[]) => void;
  searchResult: (Login | Card | ID)[];
}

export default function Passwords({
  setAllItemsLength,
  setAllItems,
  searchResult,
}: PasswordsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!user?.id) return;

      const q = query(
        collection(db, "categories"),
        where("user", "==", user.id)
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        let categoriesData = snapshot.docs.map((doc) => ({
          ...(doc.data() as Category),
          id: doc.id,
        }));

        const documentsCategoryExists = categoriesData.some(
          (category) => category.name === "Documents"
        );

        if (!documentsCategoryExists) {
          try {
            const docRef = await addDoc(collection(db, "categories"), {
              user: user.id,
              name: "Documents",
            });
            categoriesData = [
              { id: docRef.id, name: "Documents", user: user.id },
              ...categoriesData,
            ];
          } catch (error) {
            console.error("Error adding 'Documents' category:", error);
          }
        }

        setCategories(categoriesData);
      });

      return () => unsubscribe();
    }
  }, [user?.id]);

  const [login, setLogin] = useState<Login[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchCredentials = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "Login"));
          const login = querySnapshot.docs.map((doc) => ({
            ...(doc.data() as Login),
            id: doc.id,
          }));
          setLogin(login);
          setIsLoading(false);
        } catch (err) {
          console.log("Error fetching a credential type" + err);
        }
      };
      fetchCredentials();
    }
  }, []);
  const [cards, setCards] = useState<Card[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchBankCard = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "Card"));
          const cards = querySnapshot.docs.map((doc) => ({
            ...(doc.data() as Card),
            id: doc.id,
          }));
          setCards(cards);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching a bank card type: " + err);
        }
      };
      fetchBankCard();
    }
  }, []);
  const [idCards, setIdCards] = useState<ID[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchIdCard = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "ID"));
          const idCards = querySnapshot.docs.map((doc) => ({
            ...(doc.data() as ID),
            id: doc.id,
          }));
          setIdCards(idCards);
          setIsLoading(false);
        } catch (err) {
          toast.error("Error fetching an id card type" + err);
        }
      };
      fetchIdCard();
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Login | Card | ID | null>(
    null
  );
  const allItems = useMemo(() => {
    return [...cards, ...idCards, ...login];
  }, [cards, idCards, login]);

  const itemsToDisplay = searchResult.length > 0 ? searchResult : allItems;

  const deleteItem = async (itemId: string, collectionName: string) => {
    try {
      const itemRef = doc(db, collectionName, itemId);
      await deleteDoc(itemRef);
      toast.success("Item deleted successfully!");
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting item: ", error);
      toast.error("Failed to delete item: " + error.message);
    }
  };

  useEffect(() => {
    if (user) {
      const userItems = allItems.filter((item) => item.user === user.id);
      setAllItemsLength(userItems.length);
      setAllItems(allItems);
    }
  }, [setAllItems, allItems, setAllItemsLength, user?.id]);

  return (
    <>
      <div className="w-full flex flex-col md:justify-center lg:min-w-[700px] lg:max-w-[1000px] xl:max-w-[1200px]">
        {!isLoading ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-8 w-full lg:overflow-x-scroll">
            {categories
              ?.filter(
                (category) =>
                  category.user === user?.id || category.name === "Documents"
              )
              .map((category) => (
                <div key={category.id} className="flex flex-col gap-2">
                  <div className="flex shrink-0 w-full lg:w-[180px] mb-1 items-center justify-between gap-4">
                    <div className="flex items-center gap-8 justify-between w-full">
                      <h1 className="capitalize truncate font-medium px-2 py-1 rounded-md bg-[#f6f6f6] lg:text-sm whitespace-nowrap">
                        {category.name}
                      </h1>
                      <span className="text-[#758393]">
                        {
                          itemsToDisplay.filter(
                            (item) =>
                              item &&
                              item.Category === category.name &&
                              item.user === user?.id
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                  {itemsToDisplay
                    .filter((item) => {
                      const matchesCategory =
                        item?.Category === category.name &&
                        item?.user === user?.id;
                      return matchesCategory;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="truncate flex group hover:border-[#1C1C1C] transition-all cursor-pointer items-center justify-between border border-[#D5D5D5] rounded-lg pr-4"
                      >
                        <div
                          onClick={() => {
                            setSelectedItem(item);
                            setIsOpen(true);
                          }}
                          className="capitalize pl-4 mr-4 w-full py-2"
                        >
                          {item?.Service}
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Icon danger size={14} icon={<Trash />} />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const collectionName =
                                    item?.Type === "Card"
                                      ? "Card"
                                      : item?.Type === "ID"
                                      ? "ID"
                                      : "Login";
                                  deleteItem(item.id, collectionName);
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ) : (
          <div className="p-6 w-full lg:w-[700px] animate-pulse h-[300px] text-[#758393] flex items-center justify-center"></div>
        )}
      </div>
      <CardDetails setIsOpen={setIsOpen} isOpen={isOpen} data={selectedItem} />
    </>
  );
}
