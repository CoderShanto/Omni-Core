type Props = {
  open: boolean;
  onClose: () => void;
};

const CompanyModal = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-lg p-6 w-[500px]">

        <h2 className="text-2xl font-bold mb-5">
          Add Company
        </h2>

        <p>Company Form Coming...</p>

        <button
          onClick={onClose}
          className="mt-5 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>

      </div>

    </div>
  );
};

export default CompanyModal;