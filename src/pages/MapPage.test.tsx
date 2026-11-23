import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { MapPage } from './MapPage';

describe('MapPage', () => {
  it('shows the full scenario, event labels and the A/B plan', () => {
    render(<MemoryRouter><MapPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Карта сценария поиска квартиры' })).toBeVisible();
    expect(screen.getAllByText(/step: contact_submitted/)).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'A/B-тест' })).toBeVisible();
    expect(screen.getByText(/22 000 пользователей/)).toBeVisible();
  });
});
