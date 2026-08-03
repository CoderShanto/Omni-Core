const CompanyForm = () => {

  return (

    <form className="space-y-4">

      <input
        placeholder="Company Name"
        className="border w-full p-3 rounded"
      />

      <input
        placeholder="Industry"
        className="border w-full p-3 rounded"
      />

      <input
        placeholder="Address"
        className="border w-full p-3 rounded"
      />

      <input
        placeholder="Email"
        className="border w-full p-3 rounded"
      />

      <input
        placeholder="Phone"
        className="border w-full p-3 rounded"
      />

      <input
        placeholder="Owner ID"
        className="border w-full p-3 rounded"
      />

      <button
        className="bg-blue-600 text-white w-full py-3 rounded"
      >
        Create Company
      </button>

    </form>

  );

};

export default CompanyForm;