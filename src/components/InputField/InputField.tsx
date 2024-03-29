import { FormikProps } from "formik";
import { InputHTMLAttributes } from "react";
import { cx } from "../../utils/misc";
import { motion } from "framer-motion";

interface IInputField extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  formik: FormikProps<any>;
  label?: string;
}

const InputField: React.FC<IInputField> = ({
  name,
  value,
  onChange,
  label,
  formik,
  ...rest
}) => {
  let error = formik.errors[name];

  if (Array.isArray(error)) {
    error = error.join(",");
  }

  return (
    <label htmlFor={name} className="block w-full">
      {label && (
        <span className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </span>
      )}
      <input
        className={cx([
          "transition-border-text transition-text block w-full px-3 py-2 bg-surface/30 border border-neutral-300 rounded-md text-sm shadow-sm placeholder-slate-400",
          "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
          "disabled:bg-disabled disabled:text-disabled-text disabled:border-disabled-border disabled:shadow-none",
          "invalid:border-error invalid:text-error focus:invalid:border-error focus:invalid:ring-error",
          [
            "border-error text-error focus:border-error focus:ring-error",
            !!error,
          ],
        ])}
        {...formik.getFieldProps(name)}
        {...rest}
      />
      <div className="transition">
        {!!error && typeof error === "string" && (
          <motion.span
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ type: "spring", duration: 0.25 }}
            className="text-hint block px-2 py-1"
          >
            {error as string}
          </motion.span>
        )}
      </div>
    </label>
  );
};

export default InputField;
