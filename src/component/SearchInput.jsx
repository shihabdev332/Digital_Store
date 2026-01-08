import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Input value update
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  // Enter চাপলে navigate হবে
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // page reload prevent
      if (search.trim()) {
        navigate(`/search?query=${encodeURIComponent(search.trim())}`);
        setSearch(""); // input clear
      }
    }
  };

  // Clear button
  const clearSearch = () => {
    setSearch("");
  };

  // Click on search icon
  const handleClickSearch = () => {
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <div className="flex-1 h-10 relative">
      <input
        type="text"
        placeholder="Search your Product here..."
        className="w-full h-full border border-gray-400 rounded-full outline-none text-gray-600 pl-4 pr-10 focus-visible:border-blue-800"
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {search ? (
        <IoMdClose
          onClick={clearSearch}
          className="text-xl absolute top-2.5 right-4 cursor-pointer"
        />
      ) : (
        <IoSearchSharp
          onClick={handleClickSearch}
          className="text-xl absolute top-2.5 right-4 cursor-pointer hover:text-red-800 duration-300"
        />
      )}
    </div>
  );
};

export default SearchInput;
