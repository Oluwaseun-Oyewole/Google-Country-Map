import { useCountryData } from "@/context";
import { truncate } from "@/helper";
import { deleteCity, getAllUserCities } from "@/services/city";
import { Toastify } from "@/utils/toast";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
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
import Spinner from "../spinner";

const City = () => {
  const {
    value,
    setCoordinate,
    coordinate,
    addPlace,
    setCountryName,
    setValue,
    handleIsNotificationOpen,
  } = useCountryData();
  const [countryData, setCountryData] = useState([]);
  const session = useSession();
  const { data } = session;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await getAllUserCities({ email: data?.user?.email! });
      if (res?.status === 200) {
        setCountryData(res?.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const deleteCountry = async (cityName: string) => {
    try {
      const res = await deleteCity({ email: data?.user?.email!, cityName });
      if (res?.status === 200) {
        setCountryData(res?.data);
        Toastify.success(res?.message);
      }
    } catch (error) {
      Toastify.error("An error occurred");
      return;
    }
    fetchCountries();
  };

  const updateURLFromSearchQuery = (query: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("query", query);
    router.push(`?${params.toString()}`);
    handleIsNotificationOpen();
  };

  const handleCoordinateChange = (place: string, lat: number, lng: number) => {
    const splitPlace = place?.split(",");
    const formattedPlace = splitPlace[splitPlace.length - 1];
    setCoordinate({
      ...coordinate,
      lat,
      lng,
    });
    addPlace({
      country: formattedPlace,
      lat,
      long: lng,
    });
    setCountryName(formattedPlace);
    // setValue(formattedPlace);
    updateURLFromSearchQuery(formattedPlace);
  };
  useEffect(() => {
    fetchCountries();
  }, [value]);

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
            delay: 4000,
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
          {loading ? (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div>
              {countryData?.length > 0 ? (
                <>
                  {countryData?.map((country: any, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div
                          key={index}
                          className={`flex w-full md:w-[170px] lg:w-[200px] min-h-[200px] pt-7 pb-5 rounded-lg justify-between hover:scale-105 transition-all ease-in-out duration-500 cursor-pointer`}
                        >
                          <div key={index}>
                            <p className="text-center text-xs !font-light flex gap-1 items-center">
                              <MdDelete
                                className="text-red-500 text-xl"
                                onClick={() => deleteCountry(country?.name)}
                              />
                              {truncate(country?.name, 17)}
                            </p>
                            <p
                              onClick={() =>
                                handleCoordinateChange(
                                  country?.name,
                                  country?.location?.coordinates[0],
                                  country?.location?.coordinates[1]
                                )
                              }
                            >
                              Image should be here{" "}
                            </p>

                            {/* <Image src={country?.image} alt="country image" /> */}
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </>
              ) : (
                <p className="text-center">No City Available</p>
              )}
            </div>
          )}
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
