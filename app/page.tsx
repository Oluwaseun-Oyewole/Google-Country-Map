"use client";
import Plus from "@/assets/plus.svg";
import Button from "@/components/button";
import City from "@/components/city";
import Spinner from "@/components/loader";
import MapTest from "@/components/map/mapTest";
import Modal, { IModalType } from "@/components/modal";
import GooglePlaceSearch from "@/components/search";
import CustomTable from "@/components/table";
import { useCountryData } from "@/context";
import selectRandomImage, { imageUrls, items, truncate } from "@/helper";
import Request from "@/services";
import { Endpoints } from "@/services/endpoints";
import { getWeatherForecasts } from "@/services/weather";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

let uploadRQSTController: AbortController | null = null;
type WeatherResponse = {
  day: string;
  high: string;
  low: string;
  text: string;
};
export default function Home() {
  const [countryData, setCountryData] = useState<any>();
  const [loading, setLoading] = useState(true);

  const {
    countries,
    value,
    setValue,
    createCountries,
    coordinate,
    countryName,
    place,
    allCountriesArray,
    tableArray,
  } = useCountryData();

  const cache = useRef<any>({});
  const countryCache = useRef<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const modalRef = useRef<IModalType>(null);
  const modal = useRef<IModalType>(null);
  const handleOpenModal = () => {
    modalRef?.current?.open();
  };
  const [weatherChartData, setWeatherChartData] = useState([]);
  const testRef = useRef(null);
  // get country for search autocomplete fields
  const countryRegex = /<span class="country-name">(.*?)<\/span>/;
  const match = countryName.match(countryRegex);
  const country = match ? match[1] : "";

  const fetchCountryInfo = async (country: string) => {
    setLoading(true);
    if (!country || (country === "" && !countryName)) {
      setLoading(false);
    } else {
      if (countryCache.current[country]) {
        const data = countryCache.current[country];
        setCountryData(data);
      } else {
        try {
          const res = await Request.get(`${Endpoints.country}${country}`);
          if (countryName && res) {
            setCountryData(res);
          }
        } catch (error) {
          console.log("error while fetching");
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCountryInfo(country);
  }, [countryName]);

  useEffect(() => {
    allCountriesArray(countryData);
  }, [countryData]);

  const handleSubmit = () => {
    if (!value) return;
    createCountries({
      country: value,
      image: selectRandomImage(imageUrls),
    });
    modalRef?.current?.close();
    setFile(null);
    setValue("");
    modal?.current?.open();

    // flor handling file submission

    // const formData = new FormData();
    // formData.append("file", file as File);
    // formData.append("upload_preset", "ml_default");

    // if (!uploadRQSTController) {
    //   uploadRQSTController = new AbortController();
    // }
    // try {
    //   const response = await axios({
    //     url: "https://api.cloudinary.com/v1_1/dcmifr1mx/image/upload",
    //     method: "POST",
    //     data: formData,
    //     signal: uploadRQSTController.signal,
    //   });
    //   console.log(response);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const columns = [
    {
      title: "Country",
      dataIndex: "name",
      key: "name",
      render: (text: any) => <p className="!text-sm">{text?.common}</p>,
    },
    {
      title: "Capital",
      dataIndex: "capital",
      key: "capital",
    },

    {
      title: "Capital Coords",
      dataIndex: "capitalInfo",
      key: "capitalInfo",
      render: (item: any) => (
        <p className="!text-sm">
          {item && item?.latlng[0]}, {item && item?.latlng[1]}
        </p>
      ),
    },

    {
      title: "Currency",
      dataIndex: "currencies",
      key: "currencies",
      render: (value: any) => {
        const values: any = Object.values(value ?? {});
        return (
          <p>
            {values[0]?.name} {values[0]?.symbol}{" "}
          </p>
        );
      },
    },

    {
      title: "Continent",
      dataIndex: "continents",
      key: "continents",
    },

    {
      title: "Sub Region",
      dataIndex: "subregion",
      key: "subregion",
    },

    {
      title: "Coat",
      dataIndex: "coatOfArms",
      key: "coatOfArms",
      render: (value: any) => (
        <Image src={value?.svg} alt="flag" width={20} height={20} />
      ),
    },
    {
      title: "Flag",
      dataIndex: "flags",
      key: "flags",
      render: (value: any) => (
        <Image src={value?.svg} alt="flag" width={20} height={20} />
      ),
    },
    {
      title: "Maps",
      dataIndex: "maps",
      key: "maps",
      render: (text: any) => (
        <a
          href={`${text?.googleMaps}`}
          target="_blank"
          className="text-blue-500"
        >
          {truncate(text?.googleMaps, 15)}
        </a>
      ),
    },

    {
      title: "Coordinates",
      dataIndex: "latlng",
      key: "latlng",
      render: (value: string) => (
        <p>
          lat-lng {value && value[0]},{value && value[1]}
        </p>
      ),
    },

    {
      title: "Timezone",
      dataIndex: "timezones",
      key: "timezones",
      render: (text: string) => {
        return <p>{truncate(text, 3)}</p>;
      },
    },
    {
      title: "Fifa",
      dataIndex: "fifa",
      key: "fifa",
    },
    {
      title: "Population",
      dataIndex: "Population",
      key: "population",
    },

    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
  ];

  const fetchChartWeatherForecast = async (location: string) => {
    setLoading(true);
    if (!location || location === "") {
      setLoading(false);
    } else {
      if (cache.current[location]) {
        const data = cache.current[location];
        setWeatherChartData(data);
      } else {
        const res = await getWeatherForecasts({ location: location });
        if (res) {
          cache.current[location] = res?.forecasts;
          setWeatherChartData(res?.forecasts);
        } else {
          setWeatherChartData([]);
        }
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    // fetchChartWeatherForecast(country);
  }, [country]);

  const weekDays = weatherChartData?.map(
    (weather: WeatherResponse) => weather?.day
  );
  const highWeekDay = weatherChartData?.map(
    (weather: WeatherResponse) => weather?.high
  );
  const lowWeekDay = weatherChartData?.map(
    (weather: WeatherResponse) => weather?.low
  );

  const areaSeries = [
    {
      name: "High",
      data: highWeekDay,
    },

    {
      name: "Low",
      data: lowWeekDay,
    },
  ];

  return (
    <>
      <Modal ref={modal} type="post" />
      <Modal ref={modalRef}>
        <div className="py-5 flex gap-5 flex-col max-w-[90%] mx-auto justify-center">
          <GooglePlaceSearch ref={testRef} />
          <div>
            <div
              className="cursor-pointer flex gap-2 justify-between items-center w-full"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <Button>Upload</Button>
              <p
                className={`text-[12px] w-[20%] flex justify-end ${
                  file?.name ? "text-green-500" : "text-red-500"
                }`}
              >
                {file ? truncate(file?.name, 10) : "No File"}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/jpeg, image/png, image/jpg, image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
        <Button
          className="!bg-primary"
          disabled={!value && true}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Modal>

      <main className="max-w-[92%] pl-0 md:pl-8 md:max-w-[100%] mx-auto lg:grid grid-flow-col lg:grid-cols-[55%_40%] lg:justify-between bg-dark text-white">
        <div className="lg:h-screen lg:overflow-y-scroll">
          <div className="pt-6 sticky top-0 left-0 bg-dark z-20">
            <div className="w-full md:w-[80%]">
              <GooglePlaceSearch isClassName ref={testRef} />
            </div>
          </div>
          <div className="relative pt-8 md:pt-14">
            <div className="w-full grid grid-flow-col grid-cols-[50%_45%] gap-2 md:grid-cols-[70%_25%] justify-between items-center">
              <City />
              <div
                className="bg-transparent border-2 border-secondary w-full flex flex-col gap-2 items-center justify-center h-[170px] md:h-[190px] rounded-xl cursor-pointer"
                onClick={handleOpenModal}
              >
                <Image src={Plus} alt="add city" />
                <p>Add City</p>
              </div>
            </div>

            <div>
              <div className="flex gap-2 justify-between w-full pt-2 md:pt-10 overflow-scroll">
                {items?.map((item, index) => {
                  return (
                    <motion.div
                      key={index}
                      className="bg-secondary px-5 py-3 flex items-center justify-center rounded-sm cursor-not-allowed"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Image src={item} alt="" className="w-7" />
                    </motion.div>
                  );
                })}
              </div>
              <div className="pt-4 md:pt-10">
                <div className="flex justify-between items-center text-sm text-[#ACAFC8] ">
                  <p className="">{country} Weather Forecast</p>{" "}
                  <p className="text-xs">Forecast for the month</p>
                </div>

                {/* <WeatherChart
                  id="area-chart"
                  type="line"
                  colors={["#B619A6", "#380ABB"]}
                  series={areaSeries}
                  categories={weekDays}
                  curve="smooth"
                  xaxisLabel={false}
                /> */}
              </div>
            </div>

            <div className="grid grid-flow-col grid-cols-[auto] items-start overflow-x-scroll gap-2 py-6 lg:pb-8">
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  {weatherChartData.length === 0 ? (
                    <p className="text-sm ">Weather forecast unavailable</p>
                  ) : (
                    weatherChartData?.map(
                      (weather: WeatherResponse, index: number) => {
                        return (
                          <div
                            key={index}
                            className="text-xs items-center gap-8"
                          >
                            <p className="text-[8px]">{weather?.day}</p>
                            <p className="text-[8px]">{weather?.text}</p>
                          </div>
                        );
                      }
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full sticky top-0 left-0 z-20 flex flex-col justify-between pb-8 h-[100vh] overflow-y-scroll">
          <div className="h-[55vh]">
            <MapTest />
          </div>

          <div className="md:h-[35vh] sticky top-0 left-0 z-10">
            <CustomTable cols={columns} rows={tableArray} isLoading={loading} />
          </div>
        </div>
      </main>
    </>
  );
}
