import { useEffect, useState } from "react";
import { getCompanies } from "../services/company.service";
import Card from "../components/Card";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";

const Companies = () => {

  const [companies, setCompanies] = useState([]);

  useEffect(() => {

    fetchCompanies();

  }, []);

  const fetchCompanies = async () => {

    const data = await getCompanies();

    setCompanies(data);

  };

  return (

    <div>
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">
      Companies
    </h1>

    <Button>
      + Add Company
    </Button>
  </div>

  <div className="grid gap-5">

    {companies.map((company: any) => (

      <Card key={company._id}>

        <h2 className="text-xl font-bold">
          {company.name}
        </h2>

        <p>
          <strong>Industry:</strong> {company.industry}
        </p>

        <p>
          <strong>Owner:</strong> {company.owner?.name || "No Owner"}
        </p>

        <p>{company.email}</p>

        <p>{company.phone}</p>

        <div className="flex gap-3 mt-4">

          <Button>View</Button>

          <Button>Edit</Button>

          <Button>Delete</Button>

        </div>

      </Card>

    ))}

  </div>
</div>

  );

};

export default Companies;