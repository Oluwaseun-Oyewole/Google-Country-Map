import GooglePlaceSearch from "../search";

const Header = () => {
  return (
    <div className="text-white fixed w-full top-5 lg:flex justify-between items-center z-40">
      <div className="w-full grid grid-flow-col grid-cols-[auto_auto] items-center">
        <GooglePlaceSearch isClassName />
        {/* <p>Search places by</p> */}
      </div>
      <div className="w-full flex items-center">
        <p className="w-full">Notifications</p>
        <p className="w-full flex  items-end justify-end pr-20">Profile</p>
      </div>
    </div>
  );
};

export default Header;
