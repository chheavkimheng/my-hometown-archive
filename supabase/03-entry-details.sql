begin;

alter table entries
  add column category text
    check (category in ('ritual', 'food', 'game', 'music', 'other')),
  add column festival_day text
    check (festival_day in ('day1', 'day2', 'day3', 'before', 'any')),
  add column source text
    check (char_length(source) <= 150),
  add column tags text[] not null default '{}'
    check (
      tags <@ array['family', 'buddhism', 'food', 'games', 'blessing', 'pagoda', 'offering', 'music', 'elders', 'children']::text[]
      and cardinality(tags) <= 10
    ),
  add column title_km text
    check (char_length(title_km) <= 100),
  add column description_km text
    check (char_length(description_km) <= 1000);

commit;