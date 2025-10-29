import { RootState } from "@/stores/store";
import { useEffect, useState } from "react";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/Common/Loader";
import { setSelectedDepartment } from "@/api/companySlice";

import hird from "@/assets/hird-logo.jpeg";
import omnium from "@/assets/omnium-logo.jpg";
import abacus from "@/assets/abacus-logo.jpg";
import nordicworkflow from "@/assets/nordic-workflow-logo.jpg";
import defaultLogo from "@/assets/default-logo.png";

const logo: Record<string, string> = {
  hird,
  omnium,
  abacus,
  nordicworkflow,
};

const SidebarCompany = () => {
  const { company, isLoading, error, selectedDepartmentId } = useSelector(
    (state: RootState) => state.company
  );
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<string>(
    selectedDepartmentId || ""
  );
  const logoSrc =
    company?.logo && logo[company.logo] ? logo[company.logo] : undefined;

  useEffect(() => {
    if (company && company.departments && company.departments.length > 0) {
      setSelectedOption(company.departments[0]?.id || "");
      dispatch(setSelectedDepartment(company.departments[0]?.id || ""));
    }
  }, [company, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    dispatch(setSelectedDepartment(selectedValue));
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="mb-4.5 bg-white p-2">
      <div className="relative z-20 bg-transparent dark:bg-form-input flex">
        <img
          src={logoSrc || defaultLogo}
          alt={company?.name || "Company Logo"}
          className="w-12 rounded-md"
        />
        <div className="w-full relative">
          <p className="pl-2 text-slate-500 text-[.9rem] leading-4 pt-1">
            Current department
          </p>
          {company && company.departments && company.departments.length > 0 ? (
            <select
              onChange={handleChange}
              value={selectedOption}
              className={`absolute z-20 w-full appearance-none rounded bg-transparent outline-none transition text-title-xsm pl-2 cursor-pointer leading-0 `}
            >
              {company.departments.map((department) => (
                <option
                  key={department.id}
                  value={department.id}
                  className="text-body text-base p-2 ml-2"
                >
                  {department.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-title-xsm pl-2">Not Found</div>
          )}
        </div>

        <span className="absolute top-1/2 right-0 z-30 -translate-y-1/2">
          <HiMiniChevronUpDown />
        </span>
      </div>
    </div>
  );
};
export default SidebarCompany;
