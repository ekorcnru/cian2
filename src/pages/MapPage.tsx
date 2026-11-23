import { Link } from 'react-router-dom';
import { HOME_SCENARIO_GOAL, METRIKA_COUNTER_ID } from '@/analytics/metrika';
import s from './MapPage.module.css';

type Screen = {
  title: string;
  subtitle: string;
  step: string;
  content: 'home' | 'search' | 'results' | 'listing' | 'contact';
};

const screens: Screen[] = [
  { title: 'Главная', subtitle: 'Продолжить поиск', step: 'home_open', content: 'home' },
  { title: 'Поиск', subtitle: 'Город, район или метро', step: 'search_open', content: 'search' },
  { title: 'Выдача', subtitle: 'Квартиры в Москве', step: 'results_open', content: 'results' },
  { title: 'Объявление', subtitle: '2-комн. квартира, 54 м²', step: 'listing_open', content: 'listing' },
  { title: 'Заявка', subtitle: 'Контакт с застройщиком', step: 'contact_submitted', content: 'contact' },
];

function ScreenPreview({ content }: Pick<Screen, 'content'>) {
  return (
    <div className={s.preview} aria-hidden="true">
      <span className={s.previewStatus} />
      {content === 'home' && <><b>Циан</b><i className={s.previewHero}>Продолжить поиск</i><i className={s.previewButton}>Покупка квартиры</i><span className={s.previewCards}><i /><i /><i /></span></>}
      {content === 'search' && <><b>Где ищем?</b><i className={s.previewInput}>Москва</i><i className={s.previewCta}>Показать</i></>}
      {content === 'results' && <><b>Квартиры в Москве</b><i className={s.previewMap} /><span className={s.previewList}><i /><i /><i /></span></>}
      {content === 'listing' && <><i className={s.previewPhoto} /><b>24,8 млн ₽</b><small>2-комн. квартира</small><i className={s.previewCta}>Связаться</i></>}
      {content === 'contact' && <><i className={s.previewSuccess}>✓</i><b>Заявка отправлена</b><small>Продавец свяжется с вами</small></>}
    </div>
  );
}

function EventChip({ step }: { step: string }) {
  return <code>{HOME_SCENARIO_GOAL} · step: {step}</code>;
}

export function MapPage() {
  return (
    <main className={s.page}>
      <header className={s.header}>
        <Link to="/" className={s.brand}><span>Ц</span>Циан</Link>
        <Link to="/" className={s.back}>Открыть прототип →</Link>
      </header>

      <section className={s.intro} aria-labelledby="map-title">
        <p className={s.eyebrow}>ПРОТОТИП · HOME SCENARIO</p>
        <h1 id="map-title">Карта сценария поиска квартиры</h1>
        <p>Основной путь возвращающегося пользователя: от главной до заявки застройщику. На карточках — просмотр экрана, на переходах — цель Метрики, которая срабатывает при действии.</p>
        <p className={s.counter}>Яндекс Метрика: счётчик-заглушка <strong>№ {METRIKA_COUNTER_ID}</strong></p>
      </section>

      <section className={s.section} aria-labelledby="flow-title">
        <div className={s.sectionHeading}>
          <div><p className={s.eyebrow}>ОСНОВНОЙ ПУТЬ</p><h2 id="flow-title">Экраны и события</h2></div>
          <p>Все пять целей передают параметр <code>step</code>.</p>
        </div>
        <div className={s.flow}>
          {screens.map((screen, index) => (
            <div className={s.flowPair} key={screen.content}>
              <article className={s.screen}>
                <div className={s.screenNumber}>0{index + 1}</div>
                <ScreenPreview content={screen.content} />
                <div className={s.screenText}><h3>{screen.title}</h3><p>{screen.subtitle}</p></div>
                <EventChip step={screen.step} />
              </article>
              {index < screens.length - 1 && (
                <div className={s.connector} aria-label={`Переход: ${screens[index + 1].step}`}>
                  <span><EventChip step={screens[index + 1].step} /></span>
                  <i aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={s.ab} aria-labelledby="ab-title">
        <div className={s.sectionHeading}>
          <div><p className={s.eyebrow}>ПЛАН ЭКСПЕРИМЕНТА</p><h2 id="ab-title">A/B-тест</h2></div>
          <span className={s.status}>К запуску</span>
        </div>
        <div className={s.abGrid}>
          <article><h3>Гипотеза</h3><p>Если сделать продолжение сохранённого поиска главным действием на главной, возвращающиеся пользователи чаще дойдут до контакта с застройщиком.</p></article>
          <article><h3>Вариант B</h3><p>Вместо нейтрального первого экрана показываем блок «Продолжить поиск» с сохранёнными параметрами и ближайшими рекомендациями. Вариант A — текущая главная без этого акцента.</p></article>
          <article><h3>Основная метрика</h3><p><strong>Contact conversion</strong> — доля пользователей, отправивших заявку застройщику в течение сессии.</p></article>
          <article><h3>Ограничивающая метрика</h3><p><strong>Search-to-listing rate</strong> не должен снизиться больше чем на 1 п.п.: акцент не должен уводить пользователей от просмотра объявлений.</p></article>
          <article><h3>Размер выборки</h3><p><strong>22 000 пользователей</strong>: по 11 000 в вариантах A и B. Этого достаточно, чтобы заметить рост contact conversion с 6% до 7% при α = 5% и мощности 80%.</p></article>
          <article><h3>Длительность</h3><p><strong>Минимум 14 дней</strong> и до набора 11 000 пользователей в каждой группе — чтобы захватить полный недельный цикл.</p></article>
        </div>
      </section>

      <section className={s.implementation} aria-labelledby="implementation-title">
        <h2 id="implementation-title">Разметка в прототипе</h2>
        <p>Цели уже вызываются в действиях сценария через <code>window.ym?.({METRIKA_COUNTER_ID}, 'reachGoal', '{HOME_SCENARIO_GOAL}', {'{'} step {'}'})</code>. Номер счётчика оставлен заглушкой и не отправляет данные, пока не подключён скрипт Метрики.</p>
      </section>
    </main>
  );
}
