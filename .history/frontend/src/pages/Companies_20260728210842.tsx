import { useEffect, useState } from "react";

import Button from "../components/Button";
import CompanyModal from "../components/CompanyModal";

import type {
  CompanyData,
  CompanyFormData,
  Owner,
} from "../components/CompanyForm";

import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/company.service";

const Companies = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyData | null>(null);

  const owners: Owner[] = [];

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreate = () => {
    setSelectedCompany(null);
    setOpen(true);
  };

  const handleEdit = (company: CompanyData) => {
    setSelectedCompany(company);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Delete this company?"
    );

    if (!confirmDelete) return;

    await deleteCompany(id);

    fetchCompanies();
  };

  const handleSubmit = async (
    data: CompanyFormData
  ) => {
    try {
      if (selectedCompany) {
        await updateCompany(selectedCompany._id, data);
      } else {
        await createCompany(data);
      }

      setOpen(false);
      setSelectedCompany(null);

      fetchCompanies();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Companies
        </h1>

        <Button onClick={handleCreate}>
          Add Company
        </Button>

      </div>

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-200">

            <th className="border p-2">Name</th>

            <th className="border p-2">
              Industry
            </th>

            <th className="border p-2">
              Email
            </th>

            <th className="border p-2">
              Phone
            </th>

            <th className="border p-2">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {companies.map((company) => (

            <tr key={company._id}>

              <td className="border p-2">
                {company.name}
              </td>

              <td className="border p-2">
                {company.industry}
              </td>

              <td className="border p-2">
                {company.email}
              </td>

              <td className="border p-2">
                {company.phone}
              </td>

              <td className="border p-2 space-x-2">

                <Button
                  onClick={() =>
                    handleEdit(company)
                  }
                >
                  Edit
                </Button>

                <Button
                  onClick={() =>
                    handleDelete(company._id)
                  }
                >
                  Delete
                </Button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <CompanyModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedCompany(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedCompany}
        owners={owners}
        isLoading={false}
      />

    </div>
  );
};

export default Companies;