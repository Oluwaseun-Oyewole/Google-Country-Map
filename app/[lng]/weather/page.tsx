"use client";
import { useTranslation } from "@/app/i18n/client";
import { fallbackLng, languages } from "@/app/i18n/settings";
import Bell from "@/assets/notification-03.svg";
import Button from "@/components/button";
import Map from "@/components/map";
import Modal, { IModalType } from "@/components/modal";
import GooglePlaceSearch, { MyObject } from "@/components/search";
import { useCountryData } from "@/context";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { MdAttachEmail } from "react-icons/md";

export default function Home({ params: { lng } }: { params: { lng: string } }) {
  const {
    openNotification,
    toggleNotification,
    countryName,
    setCoordinate,
    setPlace,
    isNotificationOpen,
    handleIsNotificationClose,
    handleIsNotificationOpen,
  } = useCountryData();
  if (languages.indexOf(lng) < 0) lng = fallbackLng;
  const { t } = useTranslation(lng);
  const { i18n } = useTranslation(lng);
  const autoCompleteReference = useRef(null);
  const modalRef = useRef<IModalType>(null);
  const [countries, setCountries] = useState([]);
  const searchParams = useSearchParams();
  const { push, refresh } = useRouter();
  useEffect(() => {
    if (window && typeof window !== undefined) {
      const countries = localStorage.getItem("myCountries")!;
      setCountries(JSON.parse(countries));
    }
  }, [countryName]);
  const handleOpenModal = () => {
    modalRef?.current?.open();
  };
  const variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };
  const handleCoordinateChange = (
    countryName: string,
    lat: number,
    lng: number
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set("query", countryName);
    push(`?${params.toString()}`);
    setCoordinate({ lat, lng });
    setPlace({ country: countryName, lat, long: lng });
  };

  return (
    <>
      <div>
        {openNotification && (
          <motion.div
            className="absolute z-30 top-40 md:top-24 right-3 lg:w-[20%] bg-white text-xs shadow-lg p-4"
            variants={variants}
            initial="initial"
            animate="animate"
          >
            <p className="underline pb-2"> Recent Searches</p>
            <div className="flex gap-2 flex-col">
              {countries?.map((country: MyObject, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex gap-1 hover:text-blue-500 cursor-pointer"
                    onClick={() => {
                      handleCoordinateChange(
                        country.countryName,
                        country.coordinates.lat,
                        country.coordinates.lng
                      );
                    }}
                  >
                    <p>{country?.countryName} </p>
                    {country?.countryName && (
                      <div className="flex gap-2">
                        ( <p>{country.coordinates?.lat}</p>,
                        <p>{country.coordinates?.lng}</p>)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {countries?.length > 0 && (
              <p
                className="pt-5 text-red-500 cursor-pointer"
                onClick={() => {
                  if (window && typeof window !== undefined) {
                    localStorage.removeItem("myCountries");
                    window.location.reload();
                  }
                }}
              >
                Clear searches
              </p>
            )}
          </motion.div>
        )}
      </div>
      <Modal
        ref={modalRef}
        textObj={{ text: t("closeModal"), message: t("placeAdded") }}
      >
        <div className="flex items-center justify-center flex-col py-10 text-xs">
          <div className="w-[90%] flex flex-col gap-5">
            <Button className="!bg-white !text-black flex items-center justify-center">
              <BsGithub className="text-xl" /> Continue With Github
            </Button>
            <Button className="!bg-primary flex items-center justify-center">
              <FcGoogle className="text-2xl" />
              Continue With Google
            </Button>
            <Button className="!bg-white !text-black flex items-center justify-center">
              <MdAttachEmail className="text-2xl" />
              Continue With Email
            </Button>
          </div>
        </div>
      </Modal>
      <div className="h-screen">
        <div className="pt-6 absolute top-0 left-0 z-20 md:flex items-center justify-between gap-5 w-full md:w-[94%]">
          <div className="px-5 md:px-0 md:pl-5 w-full md:w-[40%]">
            <GooglePlaceSearch
              isClassName
              ref={autoCompleteReference}
              textObj={{
                search: t("searchPlace"),
                mapMessage: t("mapMessage"),
                clearValue: t("clear"),
                alert: t("alert"),
              }}
            />
          </div>
          <div className="flex gap-4 items-center justify-between md:mr-5  bg-white shadow-2xl py-3 px-5 ml-5 md:ml-0 w-[30%] md:w-fit">
            <p
              className="text-xs cursor-pointer hover:text-blue-400"
              onClick={handleOpenModal}
            >
              Explore
            </p>
            <div
              className="relative"
              onClick={() => {
                toggleNotification();
                handleIsNotificationClose();
              }}
            >
              <Image src={Bell} alt="bell" className="cursor-pointer" />

              {isNotificationOpen && (
                <div className="h-4 w-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold absolute -top-2 left-3"></div>
              )}
            </div>
          </div>
        </div>

        <Map
          coordinates={t("coordinates")}
          currentLocation={t("currentLocation")}
          locationDetails={t("locationDetails")}
          url={t("url")}
          website={t("website")}
          weatherInfo={t("weatherInfo")}
          summary={t("summary")}
          temperature={t("temperature")}
          pressure={t("pressure")}
          humidity={t("humidity")}
          dewPoint={t("dewPoint")}
          windChill={t("windChill")}
          mapOfflineMessage={t("mapOfflineMessage")}
          name={t("name")}
          noWeather={t("noWeather")}
          prep={t("prep")}
          width={100}
        />
      </div>
    </>
  );
}
