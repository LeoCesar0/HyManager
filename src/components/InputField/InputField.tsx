import { FormikProps } from "formik";
import { InputHTMLAttributes } from "react";
import { cx } from "../../utils/misc";

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
        // className="bg-surface text-on-surface shadow-inner rounded-md px-2 text-base"
        className={cx([
          "transition-border-text transition-text block w-full px-3 py-2 bg-surface/30 border border-neutral-300 rounded-md text-sm shadow-sm placeholder-slate-400",
          "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
          "disabled:bg-surface/5 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
          "invalid:border-hint invalid:text-hint focus:invalid:border-hint focus:invalid:ring-hint",
        ])}
        {...formik.getFieldProps(name)}
        {...rest}
      />
      <div className="transition">
        {!!error && typeof error === "string" && (
          <span className="text-hint px-2 py-1">{error as string}</span>
        )}
      </div>
    </label>
  );
};

export default InputField;
