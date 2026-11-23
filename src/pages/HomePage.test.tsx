import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HOME_SCENARIO_GOAL, METRIKA_COUNTER_ID } from '@/analytics/metrika';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  afterEach(() => {
    window.ym = undefined;
  });

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

  it('continues the search scenario from results to a listing and a contact confirmation', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /Покупка квартиры в Москве/ }));
    await user.click(screen.getByRole('button', { name: 'Смотреть объявления' }));
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Объявление');
    await user.click(screen.getByRole('button', { name: 'Связаться с застройщиком' }));
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Заявка отправлена');
  });

  it('sends scenario steps to the Metrika stub', async () => {
    const user = userEvent.setup();
    const ym = vi.fn();
    window.ym = ym;
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Изменить поиск' }));
    expect(ym).toHaveBeenCalledWith(METRIKA_COUNTER_ID, 'reachGoal', HOME_SCENARIO_GOAL, expect.objectContaining({ step: 'search_open' }));
  });
});
