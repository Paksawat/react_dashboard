import { useGetCompanyLogoQuery } from "@/api/apiSlice";
import { Company } from "@/types";
import { useEffect } from "react";

interface CompanyDepartmentSelectorProps {
  companies: Company[];
  selection: {
    companyId: string;
    departmentId: string;
  };
  onSelectionChange: (
    field: "companyId" | "departmentId",
    value: string
  ) => void;
}

const CompanyDepartmentSelector = ({
  companies,
  selection,
  onSelectionChange,
}: CompanyDepartmentSelectorProps) => {
  const selectedCompany = companies.find((c) => c.id === selection.companyId);

  const { data: companyLogo } = useGetCompanyLogoQuery(selection.companyId, {
    skip: !selection.companyId,
  });

  useEffect(() => {
    const fetchAndStoreLogo = async () => {
      if (!companyLogo) return;

      const storedLogo = localStorage.getItem("company-logo");
      if (storedLogo) return; // already cached

      try {
        const res = await fetch(companyLogo);
        const blob = await res.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          localStorage.setItem("company-logo", base64);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Failed to fetch logo:", err);
      }
    };

    fetchAndStoreLogo();
  }, [companyLogo]);
  return (
    <div className="space-y-4 mb-6">
      <div>
        <label
          htmlFor="company-select"
          className="block text-sm font-semibold mb-2"
        >
          Company
        </label>
        <select
          id="company-select"
          value={selection.companyId}
          onChange={(e) => onSelectionChange("companyId", e.target.value)}
          className="block w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {selection.companyId && (
        <div>
          <label
            htmlFor="department-select"
            className="block text-sm font-semibold mb-2"
          >
            Department
          </label>
          <select
            id="department-select"
            value={selection.departmentId}
            onChange={(e) => onSelectionChange("departmentId", e.target.value)}
            className="block w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {selectedCompany?.departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CompanyDepartmentSelector;
