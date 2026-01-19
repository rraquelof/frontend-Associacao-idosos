import type { Meta, StoryObj } from "@storybook/react";
import Select from "./Select";

const meta: Meta<typeof Select> = {
  title: "Componentes/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
    onChange: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;
export const Padrao: Story = {
  args: {
    children: (
      <>
        <option value="">Selecione</option>
        <option value="opcao1">opção1</option>
        <option value="opcao2">opção2</option>
      </>
    ),
  },
};

export const TipoDeUsuario: Story = {
  args: {
    children: (
      <>
        <option value="">Tipo de usuário</option>
        <option value="coordenador">Coordenador</option>
        <option value="voluntario">Voluntário</option>
        <option value="familiar">Familiar</option>
        <option value="enfermeiro">Enfermeiro</option>
      </>
    ),
  },
};

export const Sexo: Story = {
  args: {
    children: (
      <>
        <option value="">Sexo</option>
        <option value="feminino">Feminino</option>
        <option value="masculino">Masculino</option>
      </>
    ),
  },
};
