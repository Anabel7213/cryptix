import { Check, PencilLine, Plus, X } from "lucide-react";
import Input from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, where, query } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Icon from "./ui/icon";
import { useUser } from "@clerk/nextjs";

interface Category {
    user: string | undefined,
    id: string
    name: string
}

export default function Categories() {
    const { user } = useUser()
    const [ category, setCategory ] = useState("")
    const [ categories, setCategories ] = useState<Category[]>([])
    const [ editedId, setEditedId ] = useState<string | null>(null)
    const [ editedText, setEditedText ] = useState("")

    const addCategory = async () => {
        try {
            await addDoc(collection(db, "categories"), {
                user: user?.id,
                name: category
            })
            setCategory("")
        } catch(err) {
            console.error("Error saving a category" + err)
        }
    }
    const startEditing = (category: Category) => {
        setEditedId(category.id)
        setEditedText(category.name)
    }
    const stopEditing = () => {
        setEditedId(null)
        setEditedText("")
    }
    const updateCategory = async (id: string) => {
        try {
            await updateDoc(doc(db, "categories", id), {
                name: editedText
            })
            stopEditing()
        } catch(err) {
            console.error("Error updating a category" + err)
        }
    }
    const deleteCategory = async (id: string) => {
        try {
            await deleteDoc(doc(db, "categories", id))
        } catch(err) {
            console.error("Error deleting a category" + err)
        }
    }
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data() as Category, id: doc.id}))
            const modifiedToIncludeDefault = [{id: "documents", name: "Documents", user: user?.id}, ...data]
            setCategories(modifiedToIncludeDefault)
        })
        return () => unsubscribe()
    }, [user?.id])

    const categoryRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!user?.id) return;
    
        const q = query(collection(db, "categories"), where("user", "==", user.id));
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            let categoriesData = snapshot.docs.map(doc => ({ ...doc.data() as Category, id: doc.id }));
    
            // Check if "Documents" is already in the categories from the snapshot
            const documentsCategoryExists = categoriesData.some(category => category.name === "Documents");
    
            if (!documentsCategoryExists) {
                // "Documents" doesn't exist, so add it to Firestore
                try {
                    const docRef = await addDoc(collection(db, "categories"), {
                        user: user.id,
                        name: "Documents"
                    });
                    // Add the new "Documents" category to the state array
                    categoriesData = [{ id: docRef.id, name: "Documents", user: user.id }, ...categoriesData];
                } catch (error) {
                    console.error("Error adding 'Documents' category:", error);
                    // Handle the error, e.g., show an error message to the user
                }
            }
    
            // Set the local state with the updated categories list
            setCategories(categoriesData);
        });
    
        return () => unsubscribe();
    }, [user?.id]);
    
    return (
        <>
        <div className="flex flex-col w-full md:w-[700px]">
            <Input disabled={category.trim() === ""} value={category} width="w-full" icon={<Plus />} placeholder="New..." type="text" onChange={(e) => setCategory(e.target.value)} onClick={addCategory} onKeyDown={(e) => {if(e.key === "Enter") {e.preventDefault(); addCategory}}} />
            {categories.length > 0 && (
                <>
                <div className="border-b border-border mt-8"></div>
                <div ref={categoryRef} className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                {[...categories].sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
                    <div key={category.id} className={`${editedId === category.id && "shadow-xl border-[#53B3B8]"} p-3 pl-4 flex items-center justify-between border border-border rounded-full`}>
                    {editedId === category.id ? (
                        <input className="outline-none bg-transparent md:w-[148px]" type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                    ) : (
                        <div>{category.name}</div>
                    )}
                    <div className="items-center flex">
                        {editedId === category.id ? (
                            <Icon icon={<Check />} onClick={() => updateCategory(category.id)} />
                        ) : (
                            <Icon icon={<PencilLine />} onClick={() => startEditing(category)} />
                        )}
                        <Icon icon={<X />} onClick={() => deleteCategory(category.id)} />
                    </div>
                    </div>
                ))}
                </div>
                </>
            )}
        </div>
        </>
    )
}