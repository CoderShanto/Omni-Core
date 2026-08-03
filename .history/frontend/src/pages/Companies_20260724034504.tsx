import { useEffect, useState } from "react";
import { getCompanies } from "../services/company.service";

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

          <p>{company.industry}</p>

          <p>{company.email}</p>

              <p>{company.phone}</p>
            

        </div>

      ))}

    </div>

  );

};

export default Companies;