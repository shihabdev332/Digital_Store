import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import { bannerData } from "../constant";
import Container from "../component/Container";
import { useNavigate } from "react-router-dom";
const Banner = () => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    accessibility: false,
    pauseOnFocus: false,
    pauseOnHover: false,
  };
  return (
    <div className=" w-[100%] overflow-hidden">
      <Slider
        {...settings}
        beforeChange={() => document.activeElement.blur()} 
      >
        {bannerData?.map((item, index) => (
          <div key={index} className="relative" tabIndex={-1}>
            <img
              src={item.image}
              alt="bannerImage"
              className="h-[300px] lg:h-[600px] w-full object-cover"
            />

            <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-10 flex items-center">
              <Container className="flex flex-col justify-center gap-2 sm:ml-10 md:ml-20 lg:mr-52 md:gap-3 h-full">
                <p className="w-24 py-1 bg-red-600 text-white text-xs uppercase text-center font-medium tracking-wide rounded-md">
                  {item?.sale}
                </p>
                <h2 className="text-xl md:text-5xl max-w-sm md:max-w-xl font-bold md:leading-[55px] capitalize">
                  {item?.title}
                </h2>
                <p className="text-xs md:text-base uppercase font-medium">
                  {item?.discount}
                </p>
                <p>
                  From <span>{item?.from}</span>
                </p>
                <button
                  onClick={() => navigate("/shop")}
                  tabIndex={-1}
                  className="w-24 md:w-44 py-2 md:py-0 md:h-12 bg-black text-white cursor-pointer"
                >
                  Shop Now
                </button>
              </Container>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
