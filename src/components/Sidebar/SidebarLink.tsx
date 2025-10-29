import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: ReactElement;
  title: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, to, title }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          "group relative flex items-center gap-2.5 py-2 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out " +
          (isActive
            ? "text-company bg-white font-semibold"
            : "hover:text-white")
        }
      >
        {icon}
        {title}
      </NavLink>
    </li>
  );
};

export default SidebarLink;
