import type { OptionHTMLAttributes } from "react";


interface OptionProps extends OptionHTMLAttributes<HTMLOptionElement> {
  texto: string;
}

const Option = ({ texto, ...props }: OptionProps) => {
  return <option {...props}>{texto}</option>;
};

export default Option;
