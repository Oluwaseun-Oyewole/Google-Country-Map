"use client";
import Plus from "@/assets/plus.svg";
import Button from "@/components/button";
import City from "@/components/city";
import Map from "@/components/map";
import Modal, { IModalType } from "@/components/modal";
import GooglePlaceSearch from "@/components/search";
import { useCountryData } from "@/context";
import selectRandomImage, { imageUrls, items, truncate } from "@/helper";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

let uploadRQSTController: AbortController | null = null;
export default function Home() {
  const { countries, value, createCountries } = useCountryData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const modalRef = useRef<IModalType>(null);
  const handleOpenModal = () => {
    modalRef?.current?.open();
  };
  const handleSubmit = (e: any) => {
    const formData = new FormData();
    formData.append("file", file as File);
    formData.append("upload_preset", "ml_default");
    if (!value) return;
    createCountries({
      country: value,
      image: selectRandomImage(imageUrls),
    });
    modalRef?.current?.close();

    // flor handling file submission
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

  return (
    <>
      <Modal ref={modalRef}>
        <div className="py-5 flex gap-5 flex-col max-w-[90%] mx-auto justify-center">
          <GooglePlaceSearch />
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

      <main className="grid grid-flow-col grid-cols-[55%_35%] justify-between bg-dark text-white">
        <div className="pl-8 pt-32">
          <div className="w-full grid grid-flow-col grid-cols-[70%_25%] justify-between items-center">
            <City />
            <div
              className="bg-transparent border-2 border-secondary w-full flex flex-col gap-2 items-center justify-center h-[190px] rounded-xl cursor-pointer"
              onClick={handleOpenModal}
            >
              <Image src={Plus} alt="add city" />
              <p>Add City</p>
            </div>
          </div>

          <div className="flex gap-2 justify-between w-full pt-10">
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
        </div>
        <div className="w-full">
          <Map />
        </div>
      </main>
    </>
  );
}
