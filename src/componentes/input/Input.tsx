import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className, type, ...props }: InputProps) => {
  const isRadio = type === "radio";
  const isCheckboxOuRadio = type === "checkbox" || isRadio;

  const estiloBase = isCheckboxOuRadio
    ? `w-5 h-5 shrink-0 accent-blue-600 cursor-pointer outline-offset-2 focus-visible:outline-2 focus-visible:outline-orange-300 ${
        isRadio ? "rounded-full" : "rounded"
      }`
    : "border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-300";

  return (
    <input
      type={type}
      {...props}
      className={`${estiloBase} ${className || ""}`}
    />
  );
};

export default Input;
