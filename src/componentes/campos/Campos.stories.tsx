import type { Meta, StoryObj } from "@storybook/react";
import Campos from "./Campos";

const meta: Meta<typeof Campos> = {
  title: "Componentes/Campos",
  component: Campos,
  tags: ["autodocs"],
  argTypes: {
    campos: { control: "object" },
    onChange: { action: "mudou" },
  },
};

export default meta;

type Story = StoryObj<typeof Campos>;

export const NomeIdadeLocal: Story = {
  args: {
    campos: ["nome", "idade", "local"],
  },
};

export const FamiliaCompleta: Story = {
  args: {
    campos: [
      "nome",
      "idade",
      "parentesco",
      "profissão",
      "religião",
      "escolaridade",
      "contato",
    ],
  },
};
