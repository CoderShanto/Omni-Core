import CompanyForm from "../CompanyForm";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CompanyModal = ({
  open,
  onClose,
}: Props) => {

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white rounded-xl w-[650px] p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Add Company
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✖
          </button>

        </div>

        <CompanyForm />

      </div>

    </div>

  );
};

export default CompanyModal;