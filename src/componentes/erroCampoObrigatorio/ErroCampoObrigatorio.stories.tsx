import type { Meta, StoryObj } from "@storybook/react";
import ErroCampoObrigatorio from "./ErroCampoObrigatorio";
import Input from "../input/Input";

const meta: Meta<typeof ErroCampoObrigatorio> = {
  title: "Componentes/ErroCampoObrigatorio",
  tags: ["autodocs"],
  component: ErroCampoObrigatorio,
  argTypes: {
    valor: { control: "text" },
    obrigatorio: { control: "boolean" },
    envioVazio: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ErroCampoObrigatorio>;

export const SemErro: Story = {
  args: {
    valor: "João da Silva",
    obrigatorio: true,
    envioVazio: false,
    children: (
      <Input
        type="text"
        placeholder="Digite algo"
      />
    ),
  },
};

export const ComErroPorEnvio: Story = {
  args: {
    valor: "",
    obrigatorio: true,
    envioVazio: true,
    children: (
      <Input
        type="text"
        placeholder="Digite algo"
      />
    ),
  },
};

export const ComErroAoSairDoCampo: Story = {
  args: {
    valor: "",
    obrigatorio: true,
    envioVazio: false,
    children: (
      <Input
        type="text"
        placeholder="Clique e saia do campo"
      />
    ),
  },
};

export const CampoData: Story = {
  args: {
    valor: "",
    obrigatorio: true,
    envioVazio: true,
    children: (
      <Input
        type="date"
      />
    ),
  },
};

