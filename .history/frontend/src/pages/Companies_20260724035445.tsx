import { useEffect, useState } from "react";
import { getCompanies } from "../services/company.service";
import Card from "../components/Card";
import Button from "../components/Button";

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

      <h1 className="text-3xl font-bold mb-6">

        Companies

      </h1>

      {companies.map((company: any) => (

        <div
          key={company._id}
          className="bg-white shadow rounded-lg p-4 mb-4"
        >

         <h2 className="text-xl font-bold">
  {company.name}
</h2>

<p>
  <strong>Industry:</strong> {company.industry}
</p>

<p>
  <strong>Email:</strong> {company.email}
</p>

<p>
  <strong>Phone:</strong> {company.phone}
</p>

<p>
  <strong>Owner:</strong> {company.owner?.name}
</p>

<p>
  <strong>Owner Email:</strong> {company.owner?.email}
</p>
            

        </div>

      ))}

    </div>

  );

};

export default Companies;