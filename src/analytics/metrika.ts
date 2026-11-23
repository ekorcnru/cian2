/**
 * Заглушка интеграции Яндекс Метрики для сценария главной.
 * Перед запуском на боевом окружении замените значение на настоящий номер счётчика.
 */
export const METRIKA_COUNTER_ID = 99999999;
export const HOME_SCENARIO_GOAL = 'home_scenario_step';

export type HomeScenarioStep =
  | 'home_open'
  | 'search_open'
  | 'results_open'
  | 'listing_open'
  | 'contact_submitted';

type ScenarioParams = {
  step: HomeScenarioStep;
  source?: string;
  user_state?: 'new' | 'returning';
};

declare global {
  interface Window {
    ym?: (counterId: number, method: 'reachGoal', goal: string, params: ScenarioParams) => void;
  }
}

export function trackHomeScenarioStep(step: HomeScenarioStep, params: Omit<ScenarioParams, 'step'> = {}) {
  // ym появится после подключения реального скрипта Метрики. До этого вызов безопасно остаётся no-op.
  window.ym?.(METRIKA_COUNTER_ID, 'reachGoal', HOME_SCENARIO_GOAL, { step, ...params });
}
