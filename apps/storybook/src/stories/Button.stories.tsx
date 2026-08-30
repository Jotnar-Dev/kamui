import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@jotnardev/core';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Botón primario',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Botón secundario',
    variant: 'secondary',
  },
};
