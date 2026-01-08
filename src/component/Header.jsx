import logo from "../assets/images/logo.png";
import Container from "./Container";
import SearchInput from "./SearchInput";
import { FaUserAlt } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { headerNavigation } from "../constant";
import { Link, NavLink } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import Title from "./Title";
import { IoMdClose } from "react-icons/io";
import SocialLinks from "./SocialLinks";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../config";

const Header = () => {
  const [searchResults, setSearchResults] = useState([]);

  // Search handler 
const handleSearch = async (query) => {
  try {
    const res = await axios.get(`${serverUrl}/api/product/search?query=${query}`);
    if (res.data.success) {
      setSearchResults(res.data.product);
      console.log("Search results:", res.data.product);
    }
  } catch (err) {
    console.error(err);
  }
};


  let [isOpen, setIsOpen] = useState(false);
  const { products } = useSelector((state) => state.digital);
  const token = localStorage.getItem("token");

  function close() {
    setIsOpen(false);
  }

  return (
    <div className="border-b-[1px] border-slate-300 sticky top-0 z-10 bg-white">
      <Container className="py-7 flex items-center gap-x-3 md:gap-x-7 justify-between">
        
          <Link to={"/"}>
          <img src={logo} alt="logo" className="h-[40px] w-[130px] lg:h-[50px] lg:w-[180px]" />
        </Link>
        <SearchInput onSearch={handleSearch} />

      

        <div className="hidden md:inline-flex items-center gap-5 lg:gap-7 text-sm uppercase font-medium text-black/70">
          {headerNavigation?.map((item) => (
            <NavLink
              key={item?.title}
              to={item.link}
              className="duration-300 cursor-pointer relative group overflow-hidden"
            >
              {item?.title}
              <span className="absolute bottom-0 left-0 inline-block w-full h-px bg-gray-700 -translate-x-[110%] group-hover:translate-x-0 overflow-hidden duration-300 ease-in-out"></span>
            </NavLink>
          ))}

          {token ? (
            <Link
              to={"/profile"}
              className="font-bold text-blue-500 text-[15px]"
            >
              Profile
            </Link>
          ) : (
            <Link
              to={"/signin"}
              className="text-2xl text hover:text-blue-300 hover:text-3xl duration-300 ease-in-out"
            >
              <FaUserAlt />
            </Link>
          )}

         
        </div>
         <Link
            to={"/cart"}
            className="text-2xl hover:text-red-300 hover:text-3xl duration-300 ease-in-out gray-700 relative group"
          >
            <FaShoppingCart />
            <span className="absolute -right-2 -top-1 w-3.5 h-3.5 rounded-full text-[9px] bg-gray-800 group-hover:to-black text-white flex items-center justify-center">
              {products?.length > 0 ? products?.length : 0}
            </span>
          </Link>

        <button
          onClick={() => setIsOpen(true)}
          className="text-2xl text md:hidden cursor-pointer"
        >
          <HiOutlineMenu />
        </button>

        {/* Dialog */}
        <Dialog
          open={isOpen}
          className="relative z-50 md:hidden text-white/80"
          onClose={close}
        >
          <div className="fixed inset-0 z-50 w-screen items-center justify-center p-4 bg-black/90">
            <DialogPanel
              transition
              className="w-[94%] space-y-4 bg-gray-600/50 p-6 border-1 rounded-md absolute top-10"
            >
              <div className="flex items-center justify-between gap-5">
                <Title className="text-xl text-white">Navigation Menu</Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white text-2xl cursor-pointer"
                >
                  <IoMdClose />
                </button>
              </div>

              <div className="flex flex-col gap-5 pt-5">
                {headerNavigation?.map((item) => (
                  <NavLink
                    onClick={() => setIsOpen(false)}
                    key={item?.title}
                    to={item?.link}
                    className="hover:text-white duration-300 relative group flex items-center gap-2"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-white/80 inline-flex group-hover:border-white duration-300" />
                    {item?.title}
                    <span className="absolute w-full h-[1px] bg-white/20 left-0 -bottom-1 group-hover:bg-white duration-300" />
                  </NavLink>
                ))}
                <NavLink
                  onClick={() => setIsOpen(false)}
                  to={"/signin"}
                  className="hover:text-white duration-300 relative group flex items-center gap-2"
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-white/80 inline-flex group-hover:border-white duration-300" />
                  Signin
                  <span className="absolute w-full h-[1px] bg-white/20 left-0 -bottom-1 group-hover:bg-white duration-300" />
                </NavLink>
              </div>
              <div>
                <SocialLinks />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Container>
    </div>
  );
};

export default Header;
