import type { Meta, StoryObj } from "@storybook/react";
import CampoDetalhesIdoso from "./CampoDetalhesIdoso";

const meta: Meta<typeof CampoDetalhesIdoso> = {
  title: "Componentes/CampoDetalhesIdoso",
  component: CampoDetalhesIdoso,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    valor: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof CampoDetalhesIdoso>;

export const Nome: Story = {
  args: {
    label: "Nome",
    valor: "Maria da Silva",
  },
};

export const CPF: Story = {
  args: {
    label: "CPF",
    valor: "123.456.789-00",
  },
};

export const DataNascimentoString: Story = {
  args: {
    label: "Data de nascimento",
    valor: "20/05/1950",
  },
};