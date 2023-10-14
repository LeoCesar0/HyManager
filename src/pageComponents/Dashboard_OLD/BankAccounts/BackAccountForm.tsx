import { createBankAccount } from "@models/BankAccount/create/createBankAccount";
import { CreateBankAccount } from "@models/BankAccount/schema";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import FormControl from "../../../components/FormControl/FormControl";
import InputField from "../../../components/InputField/InputField";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";

const initialValues: CreateBankAccount = {
  balance: "0",
  description: "",
  name: "",
  users: [],
  imageUrl: "",
};

const BankAccountForm = () => {
  const { currentUser } = useGlobalAuth();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (inputs) => {
      if (!currentUser?.id) return;
      const values: CreateBankAccount = {
        ...inputs,
        users: [{ id: currentUser!.id }],
        balance: "0",
        imageUrl: null,
      };
      const toastId = toast.loading("Creating Bank Count");
      const results = await createBankAccount({ values: values });
      if (results.done) {
        toast.update(toastId, {
          render: "Success!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
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
    <div className="component__modal-form">
      <form onSubmit={formik.handleSubmit} className="w-full">
        <FormControl>
          <InputField formik={formik} name={"name"} label="Title" />
        </FormControl>
        <FormControl>
          <InputField
            formik={formik}
            name={"description"}
            label="Description"
          />
        </FormControl>
        <div className="mt-auto flex gap-2 items-center justify-end">
          <Button type="submit">Submit</Button>
          <Button theme="secondary" type="button">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BankAccountForm;
