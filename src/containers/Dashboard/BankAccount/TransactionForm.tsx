import Button from "@components/Button";
import FormControl from "@components/FormControl/FormControl";
import InputField from "@components/InputField/InputField";
import { useGlobalAuth } from "@contexts/GlobalAuth";
import { useGlobalModal } from "@contexts/GlobalModal";
import { CreateTransactionMutationVariables } from "@graphql-folder/generated";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { createTransaction } from "src/models/Transaction/mutate";
import { toISOStringWithTimezone } from "src/utils/misc";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

interface ITransactionForm {
  bankAccountId: string;
}

const validationSchema = z.object({
  amount: z.number({
    invalid_type_error: "Insert a number",
    required_error: "This field is required!",
  }),
  date: z.string({
    invalid_type_error: "Insert a date",
    required_error: "This field is required!",
  }),
});

export const TransactionForm: React.FC<ITransactionForm> = ({
  bankAccountId,
}) => {
  const { setModalProps } = useGlobalModal();
  const formik = useFormik({
    validationSchema: toFormikValidationSchema(validationSchema),
    initialValues: {
      amount: 0,
      description: "",
      date: toISOStringWithTimezone(new Date()),
      color: {
        hex: "#ffffff",
      },
    },
    onSubmit: async (inputs) => {
      if (!bankAccountId) return;
      const values: CreateTransactionMutationVariables = {
        ...inputs,
        bankAccountId: bankAccountId,
        date: new Date(inputs.date),
      };
      const toastId = toast.loading("Creating Transaction");
      const results = await createTransaction(values);
      if (results.done) {
        toast.update(toastId, {
          render: "Success!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        formik.resetForm();
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

  return (
    <div className="global_modal-form">
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
