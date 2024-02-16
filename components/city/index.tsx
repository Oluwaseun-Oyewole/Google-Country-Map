import { useCountryData } from "@/context";
import { truncate } from "@/helper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Autoplay,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const City = () => {
  const { countries } = useCountryData();

  return (
    <div className={` overflow-scroll`}>
      <div>
        <Swiper
          modules={[Navigation, Pagination, Keyboard, Mousewheel, Autoplay]}
          mousewheel={{
            forceToAxis: true,
          }}
          keyboard={true}
          centeredSlides={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 5 },

            640: {
              slidesPerView: 2,
              spaceBetween: 5,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1440: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
          }}
        >
          <div className="flex gap-4">
            {countries?.map((country, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    key={index}
                    className={` flex flex-col  w-full md:w-[170px] lg:w-[200px] min-h-[200px] pt-7 pb-5 rounded-lg justify-between hover:scale-105 transition-all ease-in-out duration-500 cursor-pointer`}
                  >
                    <div key={index}>
                      <p className="flex items-center justify-center  text-xs !font-light">
                        {truncate(country.country, 17)}
                      </p>

                      <Image src={country.image} alt="country image" />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default City;

/* {file ? (
                      <di>
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="country image"
                          width={100}
                          height={150}
                          className=""
                        />
                      
                        */
