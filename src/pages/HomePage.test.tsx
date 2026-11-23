import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('switches between returning and new-user home states', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getByRole('button', { name: /Покупка квартиры в Москве/ })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Новый' }));
    expect(screen.getByRole('heading', { name: 'Найдите недвижимость' })).toBeVisible();
    expect(screen.queryByRole('button', { name: /Покупка квартиры в Москве/ })).not.toBeInTheDocument();
  });

  it('opens a result destination from a vertical', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Купить' }));
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Выдача');
    expect(screen.getByRole('heading', { name: 'Купить' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Смотреть объявления' })).toBeVisible();
  });
});
