import { useFormik } from "formik";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import FormControl from "../../../components/FormControl/FormControl";
import InputField from "../../../components/InputField/InputField";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";
import { CreateBankAccountMutationVariables } from "../../../graphql/generated";
import { createBankAccount } from "../../../models/BankAccount/mutate";
import { slugify } from "../../../utils/app";

const BankAccountForm = () => {
  const { currentUser } = useGlobalAuth();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: async (inputs) => {
      if (!currentUser?.uid) return;
      const values: CreateBankAccountMutationVariables = {
        ...inputs,
        balance: 0,
        userUid: currentUser!.uid,
        slug: slugify(inputs.title),
      };
      const toastId = toast.loading("Creating Bank Count");
      const results = await createBankAccount(values);
      if (results.done) {
        toast.update(toastId, {
          render: "Success!",
          type: "success",
          isLoading: false,
          autoClose: 5000
        });
      } else {
        toast.update(toastId, {
          render: 'Error: Something went wrong',
          type: "error",
          isLoading: false,
          autoClose: 5000
        });
      }
    },
  });

  return (
    <div className="global_modal-form">
      <form onSubmit={formik.handleSubmit} className="w-full">
        <FormControl>
          <InputField formik={formik} name={"title"} label="Title" />
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
