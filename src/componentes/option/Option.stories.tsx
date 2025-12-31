import type { Meta, StoryObj } from "@storybook/react";
import Option from "./Option";

const meta: Meta<typeof Option> = {
  title: "Componentes/Option",
  component: Option,
  tags: ["autodocs"],
  argTypes: {
    texto: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Option>;

const Template = (args: any) => (
  <select className="border p-2 rounded text-black">
    
    <Option {...args} />
  </select>
);

export const Padrao: Story = {
  render: Template,
  args: {
    texto: "Opção padrão",
    value: "padrao",
  },
};

