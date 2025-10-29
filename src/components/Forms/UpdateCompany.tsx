import {
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
} from '@/api/apiSlice';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateDepartmentRequest } from '@/types';

interface updateCompanyProps {
  companyId: string;
}

interface FormData {
  name: string;
  address: string;
  cvr: string;
  email: string;
  color: string;
  departments: CreateDepartmentRequest[];
}

const UpdateCompany = ({ companyId }: updateCompanyProps) => {
  const {
    data: company,
    isLoading,
    error,
    refetch,
  } = useGetCompanyByIdQuery(companyId);
  const [updateCompany, { isLoading: isUpdatingCompany }] =
    useUpdateCompanyMutation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    cvr: '',
    email: '',
    color: '',
    departments: [],
  });
  const [originalData, setOriginalData] = useState<typeof formData | null>(
    null
  );
  //const [departments, setDepartments] = useState<CreateDepartmentRequest[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [departmentInput, setDepartmentInput] = useState<string>('');

  useEffect(() => {
    if (company) {
      const initial = {
        name: company.name || '',
        address: company.address || '',
        cvr: company.cvr || '',
        email: company.supportEmail || '',
        color: company.color || '',
        departments: company.departments || [],
      };
      setFormData(initial);
      setOriginalData({ ...initial, departments: [...initial.departments] });
    }
  }, [company]);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isChanged =
    formData.name !== originalData?.name ||
    formData.address !== originalData?.address ||
    formData.cvr !== originalData?.cvr ||
    formData.email !== originalData?.email ||
    formData.color !== originalData?.color ||
    formData.departments.length !== (originalData?.departments.length || 0) ||
    formData.departments.some(
      (dep, i) => dep.name !== originalData?.departments[i]?.name
    );
  const isFormValid =
    formData.name.trim() !== '' && formData.email.trim() !== '';

  const handleUpdate = async () => {
    if (!company) return;

    const payload = {
      name: formData.name,
      address: formData.address,
      cvr: formData.cvr,
      supportEmail: formData.email,
      color: formData.color,
      departments:
        formData.departments.length > 0
          ? formData.departments
          : [{ name: 'Overview' }],
    };

    try {
      await updateCompany({ id: companyId, updates: payload }).unwrap();
      toast.success('Company updated successfully');
      setOriginalData({ ...formData });
      await refetch();
    } catch (err) {
      console.error('Failed to update company:', err);
      toast.error('Failed to update company');
    }
  };

  // Add department
  const handleAdd = () => {
    if (departmentInput.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        departments: [...prev.departments, { name: departmentInput.trim() }],
      }));
      setDepartmentInput('');
    }
  };

  // Remove department
  const handleRemove = (indexToRemove: number): void => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // Set department value
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDepartmentInput(e.target.value);
  };

  // add department trigger
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };
  if (isLoading || !company || error) return null;

  return (
    <>
      <Card className="max-w-4xl p-6 space-y-6">
        <CardHeader>
          <CardTitle className="text-title">Update {company.name}</CardTitle>
          <CardDescription>
            Update a company's information in the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsConfirmDialogOpen(true); // Show dialog
            }}
          >
            <div className="grid w-full items-center gap-4">
              {['name', 'address', 'cvr', 'email', 'color'].map((field) => (
                <div key={field} className="flex flex-col space-y-1.5">
                  <Label htmlFor={field}>
                    {field === 'name' || field === 'email' ? (
                      <>
                        {field[0].toUpperCase() + field.slice(1)}
                        <span className="text-red-600">*</span>
                      </>
                    ) : (
                      field[0].toUpperCase() + field.slice(1)
                    )}
                  </Label>
                  {field === 'color' ? (
                    <>
                      <div className="flex text-sm text-gray-500">
                        <p>Tool to get hex color:&nbsp;</p>
                        <a
                          className="underline text-blue-400"
                          href="https://g.co/kgs/kSccPcC"
                          target="_blank"
                        >
                          Google color
                        </a>
                      </div>
                      <Input
                        id="color"
                        placeholder='Company color as HEX with - "#"'
                        value={formData.color}
                        onChange={handleFieldChange}
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                        title="Must be a valid hex color, like #ff6600 or #abc"
                      />
                    </>
                  ) : (
                    <Input
                      id={field}
                      placeholder={`Enter ${field}`}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      value={(formData as any)[field]}
                      onChange={handleFieldChange}
                      required={field === 'name' || field === 'email'}
                    />
                  )}
                  {field === 'email' && (
                    <div className="text-sm text-gray-500">
                      Confirm with backend dev, before changing domain
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="departments">Departments</Label>
                <div className="flex text-sm text-gray-500">
                  <p>Add one at a time - Press "Enter" to add</p>
                </div>
                <Input
                  id="departments"
                  placeholder="Add a department"
                  value={departmentInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                />
                <ul className="flex flex-wrap">
                  {formData.departments.map((department, index) => (
                    <li
                      key={index}
                      className="text-gray-700 mr-2 flex align-middle"
                    >
                      {department.name}
                      {department.name !== 'Overview' && (
                        <button
                          type="button"
                          onClick={() => handleRemove(index)}
                          className="text-red-500 hover:text-red-700 text-[.7rem] font-bold px-1"
                        >
                          X
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="submit"
                className="text-white mt-2"
                disabled={!isFormValid || !isChanged || isUpdatingCompany}
              >
                {isUpdatingCompany ? 'Updating...' : 'Update company'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ✅ Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Company?</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this company's details? This will
              overwrite current data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={async () => {
                setIsConfirmDialogOpen(false);
                await handleUpdate();
              }}
              disabled={isUpdatingCompany}
            >
              {isUpdatingCompany ? 'Updating...' : 'Yes, Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateCompany;
