import { RootState } from '@/stores/store';
import { useEffect, useState, useRef } from 'react';
import { HiMiniChevronUpDown } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@/components/Common/Loader';
import { setSelectedDepartment } from '@/api/companySlice';

const SidebarCompany = () => {
  const { company, isLoading, error, selectedDepartmentId } = useSelector(
    (state: RootState) => state.company
  );
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<string>(
    selectedDepartmentId || ''
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize default department
  useEffect(() => {
    const departments = company?.departments ?? [];
    if (departments.length > 0) {
      const firstDepartmentId = departments[0]?.id || '';
      setSelectedOption(firstDepartmentId);
      dispatch(setSelectedDepartment(firstDepartmentId));
    }
  }, [company, dispatch]);

  const handleSelect = (id: string) => {
    setSelectedOption(id);
    dispatch(setSelectedDepartment(id));
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {String(error)}</div>;

  const departments = company?.departments ?? [];
  const selectedDepartment = departments.find((d) => d.id === selectedOption);

  return (
    <div
      ref={dropdownRef}
      className="tabSelect p-2 shadow-sm cursor-pointer relative bg-[#303847] m-2 rounded-md transition-all duration-300"
    >
      <div
        className="flex justify-between items-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div>
          <p className="text-white text-[.9rem] leading-4 pt-1">
            Current department
          </p>
          <p className="text-title-xsm font-medium text-bodydark2 truncate max-w-[160px]">
            {selectedDepartment ? selectedDepartment.name : 'Not Found'}
          </p>
        </div>

        <span
          className={`transition-transform duration-300 text-bodydark2 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <HiMiniChevronUpDown className="text-lg" />
        </span>
      </div>

      {/* Dropdown with animation */}
      <div
        className={`absolute left-0 top-full mt-1 w-full rounded-md shadow-lg z-30 max-h-60 overflow-y-auto bg-[#303847] 
          transform transition-all duration-300 ease-in-out origin-top
          ${
            isOpen
              ? 'scale-y-100 opacity-100'
              : 'scale-y-0 opacity-0 pointer-events-none'
          }
        `}
      >
        {departments.map((department, index) => (
          <div
            key={`${department.id}-${index}`}
            onClick={() => {
              if (department.id) handleSelect(department.id);
            }}
            className={`px-3 py-2 text-sm text-bodydark2 transition-all duration-200 ease-in-out 
              hover:bg-[#3b4658] hover:text-white cursor-pointer
              ${
                department.id === selectedOption
                  ? 'font-semibold text-blue-400'
                  : ''
              }`}
          >
            {department.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarCompany;
