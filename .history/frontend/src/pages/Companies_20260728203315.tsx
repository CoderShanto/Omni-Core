import { useEffect, useState } from "react";
import type { CompanyFormData } from "../components/CompanyForm";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/company.service";


import CompanyModal from "../components/CompanyModal";
;
import Button from "../components/Button";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    const data = await getCompanies();
    setCompanies(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filtered = companies.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>

        <Button onClick={() => setOpen(true)}>
          Add Company
        </Button>
      </div>

      <CompanyStats companies={companies} />

      <CompanySearch
        value={search}
        onChange={setSearch}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map((company) => (
          <CompanyCard
            key={company._id}
            company={company}
            onEdit={() => {
              setSelectedCompany(company);
              setOpen(true);
            }}
            onDelete={async () => {
              await deleteCompany(company._id);
              fetchCompanies();
            }}
          />
        ))}
      </div>

      <CompanyModal
        open={open}
        company={selectedCompany}
        onClose={() => {
          setOpen(false);
          setSelectedCompany(null);
        }}
        onSuccess={fetchCompanies}
      />
    </div>
  );
};

export default Companies;