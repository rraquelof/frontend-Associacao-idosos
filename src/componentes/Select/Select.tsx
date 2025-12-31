import type { ReactNode, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: ReactNode;
}

const Select = ({ className, children, ...props }: SelectProps) => {
  return (
    <select
      {...props}
      className={`border p-3 rounded-lg text-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;
