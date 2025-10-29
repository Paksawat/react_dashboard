import { useGetAllCompaniesQuery } from '@/api/apiSlice';
import CreateCompany from '@/components/Forms/CreateCompany';
import UpdateCompany from '@/components/Forms/UpdateCompany';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useState } from 'react';

const Companies = () => {
  const { data: companyData } = useGetAllCompaniesQuery();
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  const handleEditClick = (id: string) => {
    setEditingCompanyId(id);
  };

  return (
    <>
      <h2 className="text-title-lg font-semibold text-title my-2 3xl:text-title-xxl">
        Company manager
      </h2>
      <div className="grid md:grid-cols-2 gap-2">
        <Card className="md:order-2 max-w-4xl p-6 space-y-6">
          <CardHeader>
            <CardTitle className="text-title">Registered companies</CardTitle>
            <CardDescription>
              All the current companies registered in the database
            </CardDescription>
          </CardHeader>
          <CardContent className="scroll">
            {' '}
            <ul className="flex mb-8 flex-wrap gap-2 flex-col">
              {companyData?.map((company, index) => (
                <li
                  key={index}
                  className="p-2 bg-slate-50 mx-2 corner-rounded flex justify-between shadow-sm"
                >
                  {company.name}{' '}
                  <Settings
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => handleEditClick(company.id)}
                  />
                </li>
              )) ?? <p>No companies found.</p>}
            </ul>
          </CardContent>
        </Card>
        <div>
          {editingCompanyId && editingCompanyId !== null && (
            <p
              className="cursor-pointer hover:text-blue-600 flex justify-self-end"
              onClick={() => setEditingCompanyId(null)}
            >
              Close edit
            </p>
          )}
          {editingCompanyId && editingCompanyId !== null ? (
            <UpdateCompany companyId={editingCompanyId} />
          ) : (
            <CreateCompany />
          )}
        </div>
      </div>
    </>
  );
};

export default Companies;
