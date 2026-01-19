import type { Meta, StoryObj } from "@storybook/react";
import Label from "../label/Label";

const meta: Meta<typeof Label> = {
  title: "Componentes/Label",
  tags: ["autodocs"],
  component: Label,
  argTypes: {
    htmlFor: { control: "text" },
    texto: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Padrao: Story = {
  args: {
    htmlFor: "nome",
    texto: "Nome completo",
  },
};
