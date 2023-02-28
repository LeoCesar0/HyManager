interface IProps {}

const FormControl: React.FC<IProps> = ({ ...rest }) => {
  return <div className="py-2 w-full" {...rest}></div>;
};

export default FormControl;
