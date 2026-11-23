# Продолжить поиск · Циан

Промо-ролик о фиче «Продолжить поиск», собран скиллом `product-motion`.

- Статус: готов к пересборке; итоговый MP4 не хранится в Git.
- Формат: 16:9, 15 секунд, 1920×1080, без озвучки.
- Музыка: оригинальная инструментальная фанк-подложка из `funk_music.py`; акценты привязаны к открытиям интерфейса.
- Бренд-профиль: `brand/` — Lato и токены из локального прототипа Циан.

## Бриф

- Фича: сохранённый поиск для возвращающегося пользователя.
- Сценарий: сохранённый поиск → выдача → карточка квартиры → заявка застройщику.
- Реальные экраны: `assets/01-home.png` … `assets/04-contact.png`, снятые из локального прототипа.
- Музыкальные акценты: 2,60, 5,80 и 9,40 с — на кликах и открытии следующего состояния.

## Пересборка

Путь к локальным ffmpeg и ffprobe должен быть доступен в `PATH`.

```bash
python3 funk_music.py
python3 ../../.agents/skills/product-motion/scripts/render.py video.html video --fmt h --out build/h.mp4
ffmpeg -y -v error -i build/funk.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 build/funk_loud.wav
python3 ../../.agents/skills/product-motion/scripts/assemble.py --video build/h.mp4 --audio build/funk_loud.wav --out out/home-promo_16x9.mp4
```

`build/` и `out/` — локальные результаты рендера и не входят в Git.
