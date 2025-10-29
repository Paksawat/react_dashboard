/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import SidebarCompany from './SidebarCompany';
import SidebarLink from './SidebarLink';
import { BsGridFill, BsFillGearFill } from 'react-icons/bs';
import Hird from '@/assets/hird_logo.svg';
import RoleBasedRender from '@/components/Common/RoleBasedRender';
import { SiLimesurvey } from 'react-icons/si';
import { BsBuildingFillAdd } from 'react-icons/bs';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-99 flex h-screen w-60 flex-col overflow-y-hidden bg-black duration-300 ease-linear  lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="">
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden p-4"
        >
          <svg
            className="fill-white"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
        <SidebarCompany />
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-2 py-2 px-2 lg:mt-7 lg:px-2">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-0 text-sm font-semibold text-bodydark2">
              GENERAL
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLink
                to="/overview"
                title="Overview"
                icon={<BsGridFill />}
              />
            </ul>
            <h3 className="mb-4 text-sm font-semibold text-bodydark2">
              SUPPORT
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLink
                to="/settings"
                title="Settings"
                icon={<BsFillGearFill />}
              />
            </ul>
            <RoleBasedRender allowedRoles={['2', 'SystemAdmin']}>
              <h3 className="mb-4 ml-0 text-sm font-semibold text-bodydark2">
                ADMIN
              </h3>
              <ul>
                <SidebarLink
                  to="/companies"
                  title="Companies"
                  icon={<BsBuildingFillAdd />}
                />
                <SidebarLink
                  to="/survey"
                  title="Surveys"
                  icon={<SiLimesurvey />}
                />
              </ul>
            </RoleBasedRender>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
      <div className="place-self-center absolute bottom-4 flex border-t-[1px] border-[#5D718E] pt-2">
        <p className="font-medium text-bodydark2">Powered by:</p>
        <img className="w-14 ml-2" src={Hird} alt="" />
      </div>
    </aside>
  );
};

export default Sidebar;
