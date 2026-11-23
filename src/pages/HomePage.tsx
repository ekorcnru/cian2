import { useEffect, useRef, useState } from 'react';
import { Button, Icon, Input, Modal } from '@/ui';
import { trackHomeScenarioStep } from '@/analytics/metrika';
import s from './HomePage.module.css';

type UserState = 'new' | 'returning';
type Destination =
  | { kind: 'listing'; title: string; description: string }
  | { kind: 'results'; title: string; description: string }
  | { kind: 'contact'; title: string; description: string };

const verticals = [
  { title: 'Купить', subtitle: 'Квартиру или дом', tone: 'peach' },
  { title: 'Снять', subtitle: 'На долгий срок', tone: 'blue' },
  { title: 'Новостройки', subtitle: 'От застройщика', tone: 'violet' },
  { title: 'Посуточно', subtitle: 'На несколько дней', tone: 'mint' },
  { title: 'Коммерческая', subtitle: 'Для бизнеса', tone: 'yellow' },
] as const;

const homes = [
  {
    title: '2-комн. квартира, 54 м²',
    place: 'Москва, Даниловский район',
    price: '24,8 млн ₽',
    reason: 'Подходит к вашему поиску',
    tone: 'homeOne',
  },
  {
    title: '1-комн. квартира, 39 м²',
    place: 'Москва, Раменки',
    price: '18,2 млн ₽',
    reason: 'Цена снизилась на 600 тыс. ₽',
    tone: 'homeTwo',
  },
  {
    title: 'Евро-3, 68 м²',
    place: 'Москва, Хорошёво-Мнёвники',
    price: '29,5 млн ₽',
    reason: 'Новая квартира в подборке',
    tone: 'homeThree',
  },
] as const;

const collections = [
  ['Рядом с парками', 'Подборка квартир возле зелёных зон'],
  ['Квартиры с готовым ремонтом', 'Можно заехать сразу после сделки'],
  ['Новостройки Москвы', 'Проекты с ключами в 2027 году'],
] as const;

export function HomePage() {
  const [userState, setUserState] = useState<UserState>('returning');
  const query = 'Москва';
  const [destination, setDestination] = useState<Destination | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const hasTrackedHomeOpen = useRef(false);

  const title = userState === 'returning' ? 'Продолжить поиск' : 'Найдите недвижимость';

  useEffect(() => {
    if (!hasTrackedHomeOpen.current) {
      trackHomeScenarioStep('home_open', { user_state: userState });
      hasTrackedHomeOpen.current = true;
    }
  }, [userState]);

  function openResults(title: string, description: string, source = 'home') {
    trackHomeScenarioStep('results_open', { source, user_state: userState });
    setDestination({ kind: 'results', title, description });
  }

  function openListing(title: string, description: string, source = 'recommendations') {
    trackHomeScenarioStep('listing_open', { source, user_state: userState });
    setDestination({ kind: 'listing', title, description });
  }

  return (
    <main className={s.page}>
      <div className={s.phoneFrame}>
        <header className={s.header}>
          <button className={s.brand} aria-label="Циан, главная" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className={s.brandMark}>Ц</span>
            <span>Циан</span>
          </button>
          <div className={s.headerActions}>
            <button className={s.roundButton} aria-label="Сообщения">
              <Icon name="Message" size={21} />
            </button>
            <button className={s.avatar} aria-label="Профиль">ЕК</button>
          </div>
        </header>

        <div className={s.demoSwitch} role="group" aria-label="Состояние пользователя">
          <button className={userState === 'new' ? s.activeState : ''} onClick={() => setUserState('new')}>
            Новый
          </button>
          <button className={userState === 'returning' ? s.activeState : ''} onClick={() => setUserState('returning')}>
            Возвращается
          </button>
        </div>

        <section className={s.hero} aria-labelledby="home-heading">
          <h1 id="home-heading">{title}</h1>
          {userState === 'returning' ? (
            <button
              className={s.savedSearch}
              onClick={() => openResults('Покупка квартиры в Москве', '2 комнаты · до 27 млн ₽ · Даниловский и Раменки', 'saved_search')}
            >
              <span className={s.searchIcon}><Icon name="ActionSearch16" size={19} /></span>
              <span>
                <strong>Покупка квартиры в Москве</strong>
              </span>
              <Icon name="ActionChevronRight16" size={20} />
            </button>
          ) : null}
          <button className={s.searchButton} onClick={() => { trackHomeScenarioStep('search_open', { source: 'home_search', user_state: userState }); setDraft(query); setSearchOpen(true); }}>
            <Icon name="ActionSearch16" size={20} />
            <span>{userState === 'returning' ? 'Изменить поиск' : 'Город, район или метро'}</span>
          </button>
        </section>

        <section className={s.verticalSection} aria-label="Выберите направление">
          <div className={s.sectionTitleRow}>
            <h2>Что ищете?</h2>
            <span>Все направления</span>
          </div>
          <div className={s.verticalScroll}>
            {verticals.map((vertical) => (
              <button
                key={vertical.title}
                className={`${s.verticalCard} ${s[vertical.tone]}`}
                onClick={() => openResults(vertical.title, vertical.subtitle, 'vertical')}
              >
                <span className={s.verticalIllustration} aria-hidden="true"><i /><i /><i /></span>
                <strong>{vertical.title}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className={s.recommendations} aria-labelledby="recommendations-heading">
          <div className={s.sectionTitleRow}>
            <div>
              <p className={s.eyebrow}>ПОДБОРКА ДЛЯ ВАС</p>
              <h2 id="recommendations-heading">Рекомендуем</h2>
            </div>
            <button className={s.textAction} onClick={() => openResults('Все рекомендации', 'Подобрали квартиры по вашему интересу', 'recommendations_all')}>Все</button>
          </div>
          <div className={s.homeScroll}>
            {homes.map((home) => (
              <article className={s.homeCard} key={home.title}>
                <button className={`${s.homeImage} ${s[home.tone]}`} onClick={() => openListing(home.title, home.place)} aria-label={`Открыть ${home.title}`}>
                  <span className={s.favorite}><Icon name="Heart" size={19} /></span>
                  <span className={s.imageLabel}>На Циан</span>
                </button>
                <button className={s.homeDetails} onClick={() => openListing(home.title, home.place)}>
                  <strong>{home.price}</strong>
                  <span>{home.title}</span>
                  <small>{home.place}</small>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className={s.advertising} aria-label="Реклама">
          <span>РЕКЛАМА</span>
          <div>
            <p>Дом, в который хочется возвращаться</p>
            <small>Квартиры с отделкой рядом с метро</small>
          </div>
          <button onClick={() => openResults('Новые квартиры с отделкой', 'Рекламная подборка партнёра', 'advertising')}>Смотреть</button>
        </section>

        <section className={s.collections} aria-labelledby="collections-heading">
          <div className={s.sectionTitleRow}><h2 id="collections-heading">Идеи для поиска</h2></div>
          {collections.map(([title, text], index) => (
            <button className={s.collection} key={title} onClick={() => openResults(title, text, 'collection')}>
              <span className={`${s.collectionArt} ${s[`collection${index}`]}`} aria-hidden="true" />
              <span><strong>{title}</strong><small>{text}</small></span>
              <Icon name="ActionChevronRight16" size={20} />
            </button>
          ))}
        </section>

        <nav className={s.bottomNav} aria-label="Основная навигация">
          <button className={s.currentNav}><Icon name="MapLocation16" size={21} /><span>Главная</span></button>
          <button onClick={() => openResults('Поиск на карте', 'Откройте объявления на карте Москвы', 'navigation_map')}><Icon name="ActionMap16" size={21} /><span>Карта</span></button>
          <button onClick={() => openResults('Избранное', 'Сохранённые объявления и поиски', 'navigation_favorites')}><Icon name="Heart" size={21} /><span>Избранное</span></button>
          <button onClick={() => openResults('Профиль', 'Настройки и ваши объявления', 'navigation_profile')}><Icon name="ActionProfile24" size={21} /><span>Профиль</span></button>
        </nav>
      </div>

      <Modal open={searchOpen} title="Где ищем?" onClose={() => setSearchOpen(false)}>
        <form className={s.searchForm} onSubmit={(event) => { event.preventDefault(); setSearchOpen(false); openResults(`Поиск: ${draft || 'Москва'}`, 'Покажем объявления по выбранному месту', 'search_form'); }}>
          <Input label="Город, район или метро" value={draft} autoFocus leadingIcon="ActionSearch16" onChange={(event) => setDraft(event.target.value)} placeholder="Например, Даниловский" />
          <Button type="submit" fullWidth>Показать объявления</Button>
        </form>
      </Modal>

      <Modal open={!!destination} title={destination?.kind === 'listing' ? 'Объявление' : destination?.kind === 'contact' ? 'Заявка отправлена' : 'Выдача'} onClose={() => setDestination(null)}>
        {destination && <div className={s.destination}><span className={destination.kind === 'listing' ? s.destinationPhoto : destination.kind === 'contact' ? s.destinationSuccess : s.destinationMap} aria-hidden="true" /><p className={s.eyebrow}>{destination.kind === 'listing' ? 'ПРОСМОТР ОБЪЯВЛЕНИЯ' : destination.kind === 'contact' ? 'КОНТАКТ С ЗАСТРОЙЩИКОМ' : 'ПАРАМЕТРЫ ПОИСКА'}</p><h2>{destination.title}</h2><p>{destination.description}</p><Button fullWidth onClick={() => { if (destination.kind === 'listing') { trackHomeScenarioStep('contact_submitted', { source: 'listing', user_state: userState }); setDestination({ kind: 'contact', title: 'Заявка отправлена', description: 'Застройщик свяжется с вами в ближайшее время' }); } else if (destination.kind === 'results') { openListing(homes[0].title, homes[0].place, 'results'); } else { setDestination(null); } }}>{destination.kind === 'listing' ? 'Связаться с застройщиком' : destination.kind === 'contact' ? 'Готово' : 'Смотреть объявления'}</Button></div>}
      </Modal>
    </main>
  );
}
