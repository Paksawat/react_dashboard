import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-title-xl font-semibold">
        You don't have permission to view this
      </h2>
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
