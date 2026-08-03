import CompanyForm from "./CompanyForm";

type Owner = {
  _id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any | null;
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
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-[650px] p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {initialData ? "Edit Company" : "Add Company"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            ✖
          </button>
        </div>

        <CompanyForm
          initialData={initialData}
          onSubmit={onSubmit}
          owners={owners}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CompanyModal;