import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import { getFlights } from '../api/client';
import type { Flight } from '../types/flight';
import { Grid, Container, CircularProgress, Alert, TextField, MenuItem, Stack } from '@mui/material';
import { FlightCard } from '../components/FlightCard';

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'depart-asc' | 'depart-desc'>('price-asc');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getFlights();
        setFlights(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message ?? 'Помилка завантаження');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = flights.filter((f) =>
      [f.airline, f.from, f.to, f.terminal, f.gate, String(f.id)]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(q))
    );

    const parsePrice = (p: number | string | undefined) => {
      const n = Number(p);
      return Number.isFinite(n) ? n : 0;
    };

    const parseTime = (t?: string) => new Date(t ?? 0).getTime();

    list = list.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return parsePrice(a.price) - parsePrice(b.price);
        case 'price-desc':
          return parsePrice(b.price) - parsePrice(a.price);
        case 'depart-asc':
          return parseTime(a.departureTime) - parseTime(b.departureTime);
        case 'depart-desc':
          return parseTime(b.departureTime) - parseTime(a.departureTime);
        default:
          return 0;
      }
    });

    return list;
  }, [flights, query, sort]);

  if (loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction={{ sm: 'row', xs: 'column' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Пошук (авіакомпанія, з/в, термінал…)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Сортування"
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="price-asc">Ціна ↑</MenuItem>
          <MenuItem value="price-desc">Ціна ↓</MenuItem>
          <MenuItem value="depart-asc">Виліт ↑</MenuItem>
          <MenuItem value="depart-desc">Виліт ↓</MenuItem>
        </TextField>
      </Stack>

      <Grid container spacing={3}>
        {filtered.map((flight) => (
          <Grid item key={flight.id} xs={12} sm={6} md={4}>
            <FlightCard flight={flight} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
