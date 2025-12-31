import type { Meta, StoryObj } from "@storybook/react";
import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "Componentes/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Padrao: Story = {
  args: {
    type: "text",
    placeholder: "Digite algo...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Digite seu e-mail",
  },
};

export const Senha: Story = {
  args: {
    type: "password",
    placeholder: "Digite sua senha",
  },
};

export const Telefone: Story = {
  args: {
    type: "tel",
    placeholder: "Digite seu telefone",
  },
};

export const Data: Story = {
  args: {
    type: "date",
  },
};

export const Radio: Story = {
  args: {
    type: "radio",
    name: "opcao",
  },
};

export const Checkbox: Story = {
  args: {
    type: "checkbox",
    name: "aceite",
  },
};
