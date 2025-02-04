import { Check, PencilLine, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Icon from "./ui/icon";
import { useUser } from "@clerk/nextjs";

interface Category {
  user: string | undefined;
  id: string;
  name: string;
}

export default function Categories() {
  const { user } = useUser();
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editedId, setEditedId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  const addCategory = async () => {
    try {
      await addDoc(collection(db, "categories"), {
        user: user?.id,
        name: category,
      });
      setCategory("");
    } catch (err) {
      console.error("Error saving a category" + err);
    }
  };
  const startEditing = (category: Category) => {
    setEditedId(category.id);
    setEditedText(category.name);
  };
  const stopEditing = () => {
    setEditedId(null);
    setEditedText("");
  };
  const updateCategory = async (id: string) => {
    try {
      await updateDoc(doc(db, "categories", id), {
        name: editedText,
      });
      stopEditing();
    } catch (err) {
      console.error("Error updating a category" + err);
    }
  };
  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (err) {
      console.error("Error deleting a category" + err);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = onSnapshot(
        collection(db, "categories"),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            ...(doc.data() as Category),
            id: doc.id,
          }));
          const modifiedToIncludeDefault = [
            { id: "documents", name: "Documents", user: user?.id },
            ...data,
          ];
          setCategories(modifiedToIncludeDefault);
        }
      );
      return () => unsubscribe();
    }
  }, [user?.id]);

  const categoryRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <div className="flex w-full flex-col lg:w-[700px]">
        <div className="flex w-full lg:min-w-[300px] gap-2 pl-6 py-2 pr-2 justify-between rounded-lg bg-[#f6f6f6]">
          <input
            className="bg-transparent outline-none capitalize w-full"
            type="text"
            placeholder="Name your category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCategory();
              }
            }}
          />
          <button
            disabled={category.trim() === ""}
            onClick={addCategory}
            className="disabled:bg-[#dfdfdf] disabled:text-[#afafaf] whitespace-nowrap bg-black py-2 px-4 rounded-lg text-white"
          >
            Create New
          </button>
        </div>
        {categories.length > 0 && (
          <>
            <div
              ref={categoryRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4"
            >
              {[...categories]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <div
                    key={category.id}
                    className={`${
                      editedId === category.id && "border border-[#1C1C1C]"
                    } py-2 pl-4 pr-3 flex items-center justify-between border border-[#D5D5D5] rounded-lg`}
                  >
                    {editedId === category.id ? (
                      <input
                        className="outline-none bg-transparent lg:w-[148px]"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                    ) : (
                      <div className="capitalize">{category.name}</div>
                    )}
                    <div className="items-center flex">
                      {editedId === category.id ? (
                        <Icon
                          success
                          icon={<Check />}
                          onClick={() => updateCategory(category.id)}
                        />
                      ) : (
                        <Icon
                          icon={<PencilLine />}
                          onClick={() => startEditing(category)}
                        />
                      )}
                      <Icon
                        danger
                        icon={<X />}
                        onClick={() => deleteCategory(category.id)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
