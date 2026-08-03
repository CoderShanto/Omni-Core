import CompanyForm, {
  CompanyData,
  CompanyFormData,
  Owner,
} from "./CompanyForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
  initialData?: CompanyData | null;
  owners: Owner[];
  isLoading?: boolean;
};

const CompanyModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  owners,
  isLoading = false,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-xl w-full max-w-[650px] p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {initialData ? "Edit Company" : "Add Company"}
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✖
          </button>

        </div>

        <CompanyForm
          onSubmit={onSubmit}
          initialData={initialData}
          owners={owners}
          isLoading={isLoading}
        />

      </div>

    </div>
  );
};

export default CompanyModal;