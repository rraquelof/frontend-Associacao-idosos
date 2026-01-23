interface LabelProps {
  htmlFor: string;
  texto: string;
  className?: string;
}

const Label = ({ htmlFor, texto, className = " " }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-black font-medium text-lg mb-1 transition-all duration-200 ${className}`}
    >
      {texto}
    </label>
  );
};

export default Label;
