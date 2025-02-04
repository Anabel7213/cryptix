import { SearchIcon } from "lucide-react";
import { useState } from "react";

export default function Search({ allItems, setSearchResult }: any) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const result = allItems.filter((item: any) =>
      item.Service.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResult(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    const result = allItems.filter((item: any) =>
      item.Service.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResult(result);
  };

  return (
    <div className="flex w-full lg:min-w-[300px] gap-2 py-3 lg:py-2 lg:text-sm px-4 rounded-lg bg-[#f6f6f6]">
      <SearchIcon size={20} />
      <input
        className="bg-transparent outline-none"
        type="text"
        placeholder="Search passwords..."
        value={query}
        onChange={handleChange} 
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
