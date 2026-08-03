import { useEffect, useState } from "react";
import Button from "./Button";

export type Owner = {
  _id: string;
  name: string;
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

export type CompanyFormData = {
  name: string;
  industry: string;
  address: string;
  email: string;
  phone: string;
  ownerId: string;
};

type Props = {
  onSubmit: (data: CompanyFormData) => void;
  initialData?: CompanyData | null;
  owners: Owner[];
  isLoading?: boolean;
};

const CompanyForm = ({
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
        ownerId:
          typeof initialData.owner === "object"
            ? initialData.owner?._id || ""
            : initialData.owner || "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block mb-1 font-medium">
          Company Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Industry
        </label>

        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Address
        </label>

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Owner
        </label>

        <select
          name="ownerId"
          value={formData.ownerId}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select Owner</option>

          {owners.map((owner) => (
            <option key={owner._id} value={owner._id}>
              {owner.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        className="w-full"
      >
        {isLoading
          ? "Saving..."
          : initialData
          ? "Update Company"
          : "Create Company"}
      </Button>

    </form>
  );
};

export default CompanyForm;