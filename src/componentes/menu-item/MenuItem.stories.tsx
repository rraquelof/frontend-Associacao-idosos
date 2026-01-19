import type { Meta, StoryObj } from "@storybook/react";
import MenuItem from "./MenuItem";
import { MemoryRouter } from "react-router-dom";
import idososImg from "../../img/idosos.png";

const meta: Meta<typeof MenuItem> = {
  title: "Componentes/MenuItem",
  component: MenuItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    route: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof MenuItem>;

export const Idosos: Story = {
  args: {
    route: "/idosos",
    icon: <img src={idososImg} className="w-full h-full object-cover p-2" />,
  },
};
