interface SwitchItem {
    name: string
}

interface Switch {
    items: SwitchItem[]
    active: number
    setActive: (index: number) => void
}

export default function Switch({items, active, setActive}: Switch) {
    return (
        <>
        <div className="border border-border rounded-full w-full md:w-[456px] mx-4 flex items-center p-1">
            {items.map((item, index) => (
                <div key={index} onClick={() => setActive(index)} className={active === index ? "border border-border rounded-standard whitespace-nowrap bg-secondary w-full text-center p-3" : "text-center cursor-pointer whitespace-nowrap border border-primary opacity-50 hover:opacity-100 transition-all p-3 w-full"}>
                    {item.name}
                </div>
            ))}
        </div>
        </>
    )
}