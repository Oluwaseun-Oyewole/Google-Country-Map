"use client";
import GooglePlaceSearch from "../search";

const Header = () => {
  return (
    <div className="text-white fixed w-full top-5 lg:flex justify-between items-center z-40">
      <div className="w-full grid grid-flow-col grid-cols-[auto_auto] items-center">
        <GooglePlaceSearch isClassName />
      </div>
      <div className="w-full flex items-center justify-end">
        <p className="pr-20">Notifications</p>
      </div>
    </div>
  );
};

export default Header;
