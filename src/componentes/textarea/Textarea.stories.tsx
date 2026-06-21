import type { Meta, StoryObj } from "@storybook/react";
import Textarea from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Componentes/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Padrao: Story = {
  args: {
    placeholder: "Digite algo...",
    rows: 4,
  },
};