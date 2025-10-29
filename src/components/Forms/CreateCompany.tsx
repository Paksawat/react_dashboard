import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useCreateCompanyMutation,
  useUploadCompanyLogoMutation,
  useUpdateCompanyColorMutation,
} from '@/api/apiSlice';
import { CreateDepartmentRequest } from '@/types';
import { ChangeEvent, useState } from 'react';

const CreateCompany = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [departments, setDepartments] = useState<CreateDepartmentRequest[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cvr: '',
    email: '',
    color: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [createCompany, { isLoading: isCreating, isError: isCreateError }] =
    useCreateCompanyMutation();

  const [
    uploadCompanyLogo,
    { isLoading: isUploading, isError: isUploadError },
  ] = useUploadCompanyLogoMutation();

  const [
    updateCompanyColor,
    { isLoading: isUpdatingColor, isError: isColorUpdateError },
  ] = useUpdateCompanyColorMutation();

  // Add department to list
  const handleAdd = () => {
    if (inputValue.trim() !== '') {
      setDepartments([...departments, { name: inputValue.trim() }]);
      setInputValue('');
    }
  };
  // Set department value
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  // add department trigger
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  // remove department from list
  const handleRemove = (indexToRemove: number): void => {
    setDepartments(departments.filter((_, index) => index !== indexToRemove));
  };

  // add input value to dataset
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // set logo input
  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.files?.[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createCompany({
        name: formData.name,
        address: formData.address || null,
        supportEmail: formData.email,
        color: formData.color,
        cvr: formData.cvr,
        departments: [{ name: 'Overview' }, ...departments],
      }).unwrap();

      if (response?.companyId) {
        await updateCompanyColor({
          companyId: response.companyId,
          color: formData.color,
        });

        if (logoFile) {
          await uploadCompanyLogo({
            companyId: response.companyId,
            logo: logoFile,
          });
        }
      }

      alert('Company created and logo uploaded successfully!');
      // Reset form data
      setFormData({
        name: '',
        address: '',
        cvr: '',
        email: '',
        color: '',
      });
      setDepartments([]);
      setInputValue('');
      setLogoFile(null);

      // reset the file input
      const fileInput = document.getElementById('logo') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Error creating company or uploading logo', err);
      alert('Something went wrong. Check the console.');
    }
  };
  return (
    <Card className="max-w-4xl p-6 space-y-6">
      <CardHeader>
        <CardTitle className="text-title">Create company</CardTitle>
        <CardDescription>
          Register a new company to the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">
                Name<span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Name of company"
                value={formData.name}
                onChange={handleFieldChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="departments">Departments</Label>
              <div className="flex text-sm text-gray-500">
                <p>Add one at a time - Press "Enter" to add</p>
              </div>
              <Input
                id="departments"
                placeholder="Add a department"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
              />
              <ul className="flex flex-wrap">
                {departments.map((department, index) => (
                  <li
                    key={index}
                    className="text-gray-700 mr-2 flex align-middle"
                  >
                    {department.name}
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="text-red-500 hover:text-red-700 text-[.7rem] font-bold px-1"
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Address of company"
                value={formData.address}
                onChange={handleFieldChange}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="cvr">CVR</Label>
              <Input
                id="cvr"
                placeholder="CVR of company"
                value={formData.cvr}
                onChange={handleFieldChange}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">
                Support Email<span className="text-red-600">*</span>
              </Label>
              <div className="flex text-sm text-gray-500">
                <p>Required to set company email domain for recognition</p>
              </div>
              <Input
                required
                id="email"
                placeholder="Support email for company"
                value={formData.email}
                onChange={handleFieldChange}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="color">Color</Label>
              <div className="flex text-sm text-gray-500">
                <p>Tool to get hex color:</p>
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
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="logo">Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
              />
            </div>

            {(isCreating || isUploading) && (
              <p className="text-sm text-gray-500">Submitting...</p>
            )}
            {(isCreateError || isUploadError) && (
              <p className="text-sm text-red-500">
                Something went wrong uploading logo
              </p>
            )}
            {isColorUpdateError && (
              <p className="text-sm text-red-500">
                Something went wrong adding color
              </p>
            )}

            <Button
              type="submit"
              className="text-white mt-2"
              disabled={isCreating || isUploading}
            >
              {isCreating || isUploading || isUpdatingColor
                ? 'Creating...'
                : 'Create company'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCompany;
