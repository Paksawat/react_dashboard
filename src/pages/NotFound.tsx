import { NavLink } from "react-router-dom";
import errorImg from "@/assets/404_robot.png";

const NotFound = () => {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center">
      <img className="max-w-96" src={errorImg} alt="" />
      <h2 className="text-title-xl font-semibold">
        Couldn't find what you're looking for..
      </h2>
      <p className="text-xl py-2">
        Looks like we're off grid here. Let's get you back on track!
      </p>
      <NavLink
        className="bg-company text-white py-2 px-4 rounded-md shadow-card mt-8"
        to="/overview"
      >
        Back to overview
      </NavLink>
    </div>
  );
};

export default NotFound;
