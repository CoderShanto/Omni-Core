import Button from "./Button";

const CompanyForm = () => {
  return (
    <form className="space-y-4">

      {/* Company Name */}
      <div>
        <label className="block mb-1 font-medium">
          Company Name
        </label>

        <input
          type="text"
          placeholder="Enter company name"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block mb-1 font-medium">
          Industry
        </label>

        <input
          type="text"
          placeholder="Software"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block mb-1 font-medium">
          Address
        </label>

        <input
          type="text"
          placeholder="Dhaka"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium">
          Company Email
        </label>

        <input
          type="email"
          placeholder="info@company.com"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block mb-1 font-medium">
          Phone
        </label>

        <input
          type="text"
          placeholder="017XXXXXXXX"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Owner */}
      <div>
        <label className="block mb-1 font-medium">
          Owner
        </label>

        <select
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Select Owner</option>
        </select>
      </div>

      {/* Submit */}
      <Button type="submit">
        Create Company
      </Button>

    </form>
  );
};

export default CompanyForm;