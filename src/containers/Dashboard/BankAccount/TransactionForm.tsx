import Button from "@components/Button";
import FormControl from "@components/FormControl/FormControl";
import InputField from "@components/InputField/InputField";
import { useGlobalCache } from "@contexts/GlobalCache";
import { useGlobalModal } from "@contexts/GlobalModal";
import { Timestamp } from "firebase/firestore";

import { FormikProps, useFormik } from "formik";
import { toast } from "react-toastify";
import { FirebaseCollection } from "src/models";
import { createTransaction } from "src/models/Transaction/create";
import {
  CreateTransaction,
  createTransactionSchema,
  TransactionType,
} from "src/models/Transaction/schema";
import { cx, dateToIsoString } from "src/utils/misc";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface ITransactionForm {
  bankAccountId: string;
}

const initialValues: CreateTransaction = {
  amount: 1,
  description: "",
  creditor: "",
  type: TransactionType.credit,
  date: dateToIsoString(new Date(), { withTimeZone: false }),
  color: "#ffffff",
  slug: "",
  bankAccountId: "",
};

export const TransactionForm: React.FC<ITransactionForm> = ({
  bankAccountId,
}) => {
  const { setModalProps } = useGlobalModal();
  const { refetchCollection } = useGlobalCache();
  const formik = useFormik({
    validationSchema: toFormikValidationSchema(createTransactionSchema),
    initialValues: initialValues,
    onSubmit: async (inputs) => {
      if (!bankAccountId) return;

      const toastId = toast.loading("Creating Transaction");
      const results = await createTransaction({
        values: inputs,
        bankAccountId,
      });
      if (results.done) {
        toast.update(toastId, {
          render: "Success!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        formik.resetForm();
        refetchCollection([
          FirebaseCollection.transactions,
          FirebaseCollection.transactionReports,
        ]);
      } else {
        toast.update(toastId, {
          render: "Error: Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
  });
  console.log("formik.errors -->", formik.errors);

  return (
    <div className="component__modal-form">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Add New Transaction</h2>
      </div>
      <form onSubmit={formik.handleSubmit} className="w-full">
        <FormControl>
          <InputField
            formik={formik}
            type="number"
            name={"amount"}
            label="Amount"
          />
        </FormControl>
        <FormControl>
          <InputField
            formik={formik}
            type="text"
            name={"creditor"}
            label="Creditor"
          />
        </FormControl>
        <FormControl>
          <InputField
            formik={formik}
            name={"description"}
            label="Description"
          />
        </FormControl>
        <FormControl>
          <InputField
            formik={formik}
            name={"date"}
            label="Date"
            type={"datetime-local"}
          />
        </FormControl>
        <FormControl>
          <TypeButtons formik={formik} />
        </FormControl>
        <div className="mt-auto flex gap-2 items-center justify-end">
          <Button
            theme="secondary"
            type="button"
            onClick={() => {
              setModalProps({ isOpen: false, children: null });
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

interface ITypeButtons {
  formik: FormikProps<any>;
}
const TypeButtons = ({ formik }: ITypeButtons) => {
  const currentType = formik.values.type;
  console.log("currentType -->", currentType);
  return (
    <div>
      <button
        name="debit"
        type="button"
        className={cx([
          "bg-red-300 text-white rounded-tl rounded-bl py-2 px-8 transition-colors",
          ["!bg-red-500 shadow-inner", currentType === "debit"],
        ])}
        onClick={() => {
          formik.setFieldValue("type", "debit");
        }}
      >
        Debit
      </button>
      <button
        name="credit"
        type="button"
        className={cx([
          "bg-blue-300 text-white rounded-tr rounded-br py-2 px-8 transition-colors",
          ["!bg-blue-600 shadow-inner", currentType === "credit"],
        ])}
        onClick={() => {
          formik.setFieldValue("type", "credit");
        }}
      >
        Credit
      </button>
    </div>
  );
};
