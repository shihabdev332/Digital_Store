// SocialLinks.jsx
import { FaFacebook, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const SocialLinks = () => {
  return (
    <div className="flex gap-4 pt-4">
      <Link to="/facebook" className="text-white  hover:text-blue-500 text-[20px]  hover:text-[25px]  duration-300 ">
        <FaFacebook />
      </Link>
      <Link to="/github" className="text-white text-[20px] hover:text-gray-500  hover:text-[25px]  duration-300">
        <FaGithub />
      </Link>
      <Link to="/linkedin" className="text-white text-[20px] hover:text-blue-700  hover:text-[25px]  duration-300">
        <FaLinkedin />
      </Link>
      <Link to="/youtube" className="text-white text-[20px] hover:text-red-500 hover:text-[25px]  duration-300">
        <FaYoutube />
      </Link>
    </div>
  );
};

export default SocialLinks;
