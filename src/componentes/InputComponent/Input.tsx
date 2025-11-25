import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={`border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300 ${className}`}
    />
  );
};

export default Input;
