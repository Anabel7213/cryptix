"use client"

import { db } from "@/firebaseConfig"
import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import Icon from "./ui/icon"
import { Eye, Filter, MoreHorizontal, Plus, Search } from "lucide-react"
import CardDetails from "./modals/details"
import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"

interface Category {
    user: string,
    id: string
    name: string
}

interface CredentialsData {
    user: string,
    Type: string
    Category: string
    Email: string
    Phone: string
    Service: string
    Username: string
}

interface Credentials {
    id: string
    data: CredentialsData
    password: Object
    recovery: Object
}

interface BankCardData {
    user: string,
    Type: string
    Category: string
    Service: string
    Email: string
    Phone: string
    CardNumber: string
    AccountNumber: string
    BillingAddress: string
    Expiration: string
    RoutingNumber: string
}

interface BankCards {
    id: string
    data: BankCardData
    pin: Object
    cvv: Object
    password: Object
    recovery: Object
}

interface IdCardData {
    user: string,
    Type: string,
    Category: string
    Service: string
    Number: string
    AdditionalInfo: string
    IssueDate: string
    ExpiryDate: string
    Address: string
}

interface IdCards {
    id: string
    data: IdCardData
}

export default function Passwords() {
    const [ categories, setCategories ] = useState<Category[]>([])
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "categories"))
                const categories = querySnapshot.docs.map(doc => ({
                    ...doc.data() as Category,
                    id: doc.id
                }))
                setCategories(categories)
            } catch(err) {
                console.error("Error fetching categories" + err)
            }
        }
        fetchCategories()
    }, [])
    const [ credentials, setCredentials ] = useState<Credentials[]>([])
    useEffect(() => {
        const fetchCredentials = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "credentials"))
                const credentials = querySnapshot.docs.map(doc => ({
                    ...doc.data() as Credentials,
                    id: doc.id
                }))
                setCredentials(credentials)
            } catch(err) {
                console.log("Error fetching a credential type" + err)
            }
        }
        fetchCredentials()
    }, [])
    const [ bankCards, setBankCards ] = useState<BankCards[]>([])
    useEffect(() => {
        const fetchBankCard = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "bankCard"))
                const bankCards = querySnapshot.docs.map(doc => ({
                    ...doc.data() as BankCards,
                    id: doc.id
                }))
                setBankCards(bankCards)
            } catch(err) {
                console.error("Error fetching a bank card type" + err)
            }
        }
        fetchBankCard()
    }, [])
    const [ idCards, setIdCards ] = useState<IdCards[]>([])
    useEffect(() => {
        const fetchIdCard = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "idCard"))
                const idCards = querySnapshot.docs.map(doc => ({
                    ...doc.data() as IdCards,
                    id: doc.id
                }))
                setIdCards(idCards)
            } catch(err) {
                toast.error("Error fetching an id card type" + err)
            }
        }
        fetchIdCard()
    }, [])
    const [ isOpen, setIsOpen ] = useState(false)
    const [ selectedItem, setSelectedItem ] = useState<Credentials | BankCards | IdCards | null>(null)
    const allItems = [...bankCards, ...idCards]; //calculate the items under "Documents"
    const { user } = useUser()
    return (
        <>
        <div className="flex flex-col md:justify-center w-full md:max-w-[1200px]">
        <div className="flex items-center justify-between">
        <Icon icon={<Search />} onClick={() => {}} />
        <Icon icon={<Filter />} onClick={() => {}} />
        </div>
        {/* <button onClick={() => console.log(selectedItem)}>test</button> */}
        <div className="border-b border-border my-3"></div>
        <div className="flex gap-20 w-full overflow-x-scroll mx-2">
        <>
        {categories?.filter(category => category.user === user?.id).map((category) => (
            <div key={category.id} className="flex flex-col gap-2">
                <div className="flex shrink-0 min-w-[200px] items-center justify-between gap-4 hover:bg-secondary py-1 px-3 rounded-full">
                    <div className="flex items-center gap-4">
                        <h1 className="capitalize font-medium whitespace-nowrap">{category.name}</h1>
                        <span>{credentials?.filter((credential) => credential?.data?.Category === category?.name).length || category.name === "Documents" && allItems?.filter(item => item.data?.user === user?.id).length || 0}</span>
                    </div>
                    <div className="flex items-center">
                        <Icon icon={<MoreHorizontal />} onClick={() => {}} />
                        <Icon icon={<Plus />} onClick={() => {}} />
                    </div>
                </div>
                {/* <button onClick={() => console.log(allItems?.filter(item => item.data?.user === user?.id).length)}>test</button>  */}
                {[...credentials, ...bankCards, ...idCards]
                    .filter((item) => item.data.Category === category.name && item?.data?.user === user?.id)
                    .map((item) => (
                    <div key={item.id} onClick={() => {setSelectedItem(item); setIsOpen(true);}} className="flex group hover:shadow-xl cursor-pointer hover:bg-[#3a4461] min-h-[52px] items-center justify-between border border-border rounded-full p-[12px]">
                        <div className="">{item.data.Service}</div>
                        <div className="group-hover:block hidden"><Icon icon={<Eye />} onClick={() => {}} /></div>
                    </div>
                ))}
            </div>
        ))}
        </>
        {/* <button onClick={() => console.log(idCards)}>test</button> */}
        </div>
        </div>
        <CardDetails setIsOpen={setIsOpen} isOpen={isOpen} data={selectedItem} />
        </>
    )
}