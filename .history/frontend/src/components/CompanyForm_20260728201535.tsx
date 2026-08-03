import { useState, useEffect } from "react";
import Button from "./Button";

export type Owner = {
  _id: string;
  name: string;
};

export type CompanyFormData = {
  name: string;
  industry: string;
  address: string;
  email: string;
  phone: string;
  ownerId: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
  initialData?: CompanyData | null;
  owners: Owner[];
  isLoading?: boolean;
};

export type CompanyData = {
  _id: string;
  name: string;
  industry: string;
  address?: string;
  email: string;
  phone?: string;
  owner?: Owner | string;
};

const CompanyForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  owners,
  isLoading = false,
}: Props) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    industry: "",
    address: "",
    email: "",
    phone: "",
    ownerId: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        industry: initialData.industry || "",
        address: initialData.address || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        ownerId: typeof initialData.owner === "object" ? initialData.owner?._id || "" : initialData.owner || "",
      });
    } else {
      setFormData({
        name: "",
        industry: "",
        address: "",
        email: "",
        phone: "",
        ownerId: "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-[650px] p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {initialData ? "Edit Company" : "Add Company"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Software"
              required
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dhaka"
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Company Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="info@company.com"
              required
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="017XXXXXXXX"
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Owner */}
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Owner
            </label>
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Select Owner</option>
              {owners.map((owner) => (
                <option key={owner._id} value={owner._id}>
                  {owner.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading} className="w-full mt-4">
            {isLoading ? "Saving..." : initialData ? "Update Company" : "Create Company"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;