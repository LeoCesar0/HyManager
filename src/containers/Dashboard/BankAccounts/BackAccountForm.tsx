import { useFormik } from "formik";
import Button from "../../../components/Button/Button";
import FormControl from "../../../components/FormControl/FormControl";
import InputField from "../../../components/InputField/InputField";

const BankAccountForm = () => {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: (values) => {
      
    },
  });

  return (
    <div className="max-w-2xl w-[42rem]">
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
        <div className="mt-auto flex gap-2 items-center justify-end ">
          <Button type="submit">Submit</Button>
          <Button theme="secondary" type="button">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default BankAccountForm;
