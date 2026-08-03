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