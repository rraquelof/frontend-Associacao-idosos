import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      {...props}
      className={`border p-3 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200 ${className}`}
    />
  );
};

export default Textarea;
