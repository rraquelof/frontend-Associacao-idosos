import type { Meta, StoryObj } from "@storybook/react";
import Mensagem from "./Mensagem";

// decorator para posicionar corretamente
const meta: Meta<typeof Mensagem> = {
  title: "Componentes/Mensagem",
  component: Mensagem,
  tags: ["autodocs"],
  argTypes: {
    texto: { control: "text" },
    tipo: {
      control: "radio",
      options: ["sucesso", "erro", "informacao"],
    },
    onClose: { action: "fechou" },
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[200px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Mensagem>;;

// Template que impede auto-close no Storybook
const Template = (args: any) => (
  <Mensagem
    {...args}
    onClose={() => console.log("Fechou mensagem")}
  />
);

export const Sucesso: Story = {
  render: Template,
  args: {
    texto: "Operação realizada com sucesso!",
    tipo: "sucesso",
  },
};

export const Erro: Story = {
  render: Template,
  args: {
    texto: "Erro ao cadastrar idoso.",
    tipo: "erro",
  },
};
