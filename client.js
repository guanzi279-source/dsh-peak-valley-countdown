window.__ModuleLoader__.load({
  id: 'dsh-peak-valley-countdown',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useState } = React;

    const NS = 'deepseek-peak-valley-countdown';
    const DAY_MS = 24 * 60 * 60 * 1000;
    const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

    // DeepSeek peak windows in Beijing time (UTC+8), Monday through Friday.
    // Official pricing page: peak = 01:00-04:00 and 06:00-10:00 UTC, Mon-Fri,
    // excluding Chinese public holidays; everything else is off-peak.
    const PEAK_1_START = 9 * 60 * 60 * 1000; // 09:00
    const PEAK_1_END = 12 * 60 * 60 * 1000; // 12:00
    const PEAK_2_START = 14 * 60 * 60 * 1000; // 14:00
    const PEAK_2_END = 18 * 60 * 60 * 1000; // 18:00

    // Chinese public holidays for 2026, per 国办发明电〔2025〕7号.
    // DeepSeek bills weekends and Chinese public holidays as off-peak all day.
    // Extend this list when the next year's schedule is published.
    const HOLIDAY_RANGES = [
      ['2026-01-01', '2026-01-03'],
      ['2026-02-15', '2026-02-23'],
      ['2026-04-04', '2026-04-06'],
      ['2026-05-01', '2026-05-05'],
      ['2026-06-19', '2026-06-21'],
      ['2026-09-25', '2026-09-27'],
      ['2026-10-01', '2026-10-07'],
    ];

    const DICTS = {
      zh: {
        valleyPrefix: '距离梁文峰还有',
        peakPrefix: '距离梁文谷还有',
        valleyLabel: '谷时',
        peakLabel: '峰时',
        dayUnit: '天',
        ruleTip:
          '峰时：周一至周五 09:00–12:00、14:00–18:00（北京时间，法定节假日除外）；其余时间为谷时。',
      },
      en: {
        valleyPrefix: 'Liang Wenfeng arrives in',
        peakPrefix: 'Liang Wengu arrives in',
        valleyLabel: 'Off-peak',
        peakLabel: 'Peak',
        dayUnit: 'd',
        ruleTip:
          'Peak: Mon–Fri 09:00–12:00 and 14:00–18:00 (UTC+8, excluding Chinese public holidays). All other hours are off-peak.',
      },
    };

    const BADGE_STYLE = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      maxWidth: '100%',
      padding: '2px 10px 2px 8px',
      border: '1px solid var(--dsw-alias-border-l1)',
      borderRadius: '999px',
      background: 'var(--dsw-alias-bg-layer-1)',
      color: 'var(--dsw-alias-label-secondary)',
      fontFamily: 'inherit',
      fontSize: '12px',
      lineHeight: '18px',
      whiteSpace: 'nowrap',
      fontVariantNumeric: 'tabular-nums',
      userSelect: 'none',
    };

    const HOLIDAYS = buildHolidays(HOLIDAY_RANGES);

    function buildHolidays(ranges) {
      const keys = new Set();
      for (let i = 0; i < ranges.length; i += 1) {
        const start = Date.parse(ranges[i][0] + 'T00:00:00Z');
        const end = Date.parse(ranges[i][1] + 'T00:00:00Z');
        for (let time = start; time <= end; time += DAY_MS) {
          keys.add(new Date(time).toISOString().slice(0, 10));
        }
      }
      return keys;
    }

    function dayKey(date) {
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return date.getUTCFullYear() + '-' + month + '-' + day;
    }

    function isOffDay(date) {
      const weekday = date.getUTCDay();
      return weekday === 0 || weekday === 6 || HOLIDAYS.has(dayKey(date));
    }

    // Returns the current phase and the milliseconds until the next transition.
    // Works in a "Beijing wall clock" coordinate (epoch + 8h) so the local
    // time zone of the browser never changes the answer.
    function computePhase(now) {
      const beijing = now + BEIJING_OFFSET_MS;
      const dayStart = Math.floor(beijing / DAY_MS) * DAY_MS;
      const day = new Date(dayStart);
      const timeOfDay = beijing - dayStart;

      if (!isOffDay(day)) {
        if (timeOfDay >= PEAK_1_START && timeOfDay < PEAK_1_END) {
          return { valley: false, remainingMs: PEAK_1_END - timeOfDay };
        }
        if (timeOfDay >= PEAK_2_START && timeOfDay < PEAK_2_END) {
          return { valley: false, remainingMs: PEAK_2_END - timeOfDay };
        }
      }

      let target = null;
      if (!isOffDay(day)) {
        if (timeOfDay < PEAK_1_START) target = dayStart + PEAK_1_START;
        else if (timeOfDay < PEAK_2_START) target = dayStart + PEAK_2_START;
      }
      if (target === null) {
        let cursor = dayStart + DAY_MS;
        for (let i = 0; i < 400; i += 1) {
          const candidate = new Date(cursor);
          if (!isOffDay(candidate)) {
            target = cursor + PEAK_1_START;
            break;
          }
          cursor += DAY_MS;
        }
      }
      if (target === null) target = dayStart + DAY_MS + PEAK_1_START;
      return { valley: true, remainingMs: Math.max(0, target - beijing) };
    }

    function formatRemaining(ms, dayUnit) {
      const total = Math.max(0, Math.ceil(ms / 1000));
      const days = Math.floor(total / 86400);
      const hours = Math.floor((total % 86400) / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      const clock =
        String(hours).padStart(2, '0') +
        ':' +
        String(minutes).padStart(2, '0') +
        ':' +
        String(seconds).padStart(2, '0');
      return days > 0 ? days + dayUnit + ' ' + clock : clock;
    }

    function SunIcon(props) {
      return h(
        'svg',
        {
          viewBox: '0 0 16 16',
          width: 13,
          height: 13,
          'aria-hidden': true,
          style: { flex: 'none', color: props.color },
        },
        h('circle', { cx: 8, cy: 8, r: 3, fill: 'currentColor' }),
        h('path', {
          d:
            'M8 1.4v1.6M8 13v1.6M1.4 8h1.6M13 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.2,
          strokeLinecap: 'round',
        }),
      );
    }

    function MoonIcon(props) {
      return h(
        'svg',
        {
          viewBox: '0 0 16 16',
          width: 13,
          height: 13,
          'aria-hidden': true,
          style: { flex: 'none', color: props.color },
        },
        h('path', {
          d: 'M13 9.4A5.7 5.7 0 0 1 6.6 3 5.7 5.7 0 1 0 13 9.4Z',
          fill: 'currentColor',
        }),
      );
    }

    function createBadge(ctx) {
      const t = ctx.locale.bind(NS);
      const text = (key, fallback) => {
        const value = t(key);
        return typeof value === 'string' && value !== '' && value !== key ? value : fallback;
      };

      return function PeakValleyBadge() {
        const [now, setNow] = useState(() => Date.now());

        useEffect(() => {
          setNow(Date.now());
          const timer = setInterval(() => setNow(Date.now()), 1000);
          return () => clearInterval(timer);
        }, []);

        const phase = computePhase(now);
        const valley = phase.valley;
        const accent = valley
          ? 'var(--dsw-alias-brand-primary)'
          : 'var(--dsw-alias-state-warn-primary)';
        const modeLabel = valley ? text('valleyLabel', '谷时') : text('peakLabel', '峰时');
        const prefix = valley
          ? text('valleyPrefix', '距离梁文峰还有')
          : text('peakPrefix', '距离梁文谷还有');
        const clock = formatRemaining(phase.remainingMs, text('dayUnit', '天'));
        const rule = text(
          'ruleTip',
          '峰时：周一至周五 09:00–12:00、14:00–18:00（北京时间，法定节假日除外）；其余时间为谷时。',
        );

        return h(
          'div',
          {
            style: BADGE_STYLE,
            title: rule,
            'aria-label': modeLabel + ' ' + prefix + ' ' + clock,
            'data-dsw-peak-valley': valley ? 'valley' : 'peak',
          },
          valley
            ? h(MoonIcon, { color: accent, key: 'icon' })
            : h(SunIcon, { color: accent, key: 'icon' }),
          h('span', { style: { color: accent, fontWeight: 600 }, key: 'mode' }, modeLabel),
          h('span', { key: 'prefix' }, prefix),
          h(
            'span',
            {
              style: { color: 'var(--dsw-alias-label-primary)', fontWeight: 600 },
              key: 'clock',
            },
            clock,
          ),
        );
      };
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, 'zh', DICTS.zh));
        ctx.effect(() => ctx.locale.register(NS, 'en', DICTS.en));

        const Badge = createBadge(ctx);
        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.composer.dock',
              id: 'deepseek-peak-valley-countdown',
              order: 2,
            },
            Badge,
          ),
        );
      },
    };
  },
});
