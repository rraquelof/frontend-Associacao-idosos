import type { Meta, StoryObj } from "@storybook/react";
import Botao from "./Botao";
import { ChevronLeftIcon } from "lucide-react";

const meta: Meta<typeof Botao> = {
  title: "Componentes/Botao",
  component: Botao,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    className: { control: "text" },
    texto: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Botao>;

export const Padrao: Story = {
  args: {
    texto: "Clique aqui",
  },
};

// seta para voltar
export const ComIcone: Story = {
  args: {
    texto: "Voltar",
    tipo: "button",
    children: <ChevronLeftIcon />,
  },
};


export const CriarConta: Story = {
  args: {
    texto: "Criar conta",
    tipo: "button",
  },
};

export const Gradiente: Story = {
  args: {
    texto: "Cadastrar",
    className:
      "bg-gradient-to-r from-purple-400 via-blue-300 to-purple-400 rounded-full shadow-md hover:shadow-lg transition-all text-lg font-semibold px-6 py-2",
  },
  
};

export const Atualizar: Story = {
  args: {
    texto: "Atualizar",
    className: "bg-blue-500 text-white hover:bg-blue-600",
    onClick: () => console.log("Atualizar clicado!")
  },
};

export const Deletar: Story = {
  args: {
    texto: "Deletar",
    className: "bg-red-500 text-white hover:bg-red-600",
    onClick: () => console.log("Deletar clicado!")
  },
};
