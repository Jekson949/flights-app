import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFlightById } from '../api/client';
import type { Flight, Seat } from '../types/flight';
import { Container, Stack, Typography, Alert, CircularProgress, Button } from '@mui/material';
import { SeatGrid } from '../components/SeatGrid';
import { useAppDispatch } from '../app/hooks';
import { addTicket } from '../features/cart/cartSlice';

const ROWS = 10;
const COLS = 6;

function codeFromRC(r: number, c: number) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return `${letters[r - 1]}${c}`;
}

function generateSeats(rows: number, cols: number): Seat[] {
  const seats: Seat[] = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seats.push({ row: r, col: c, code: codeFromRC(r, c), occupied: false });
    }
  }
  // случайно занимаем ~30% мест
  const total = seats.length;
  const toOccupy = Math.floor(total * 0.3);
  const taken = new Set<number>();
  while (taken.size < toOccupy) {
    taken.add(Math.floor(Math.random() * total));
  }
  taken.forEach((i) => (seats[i].occupied = true));
  return seats;
}

export default function FlightDetailsPage() {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSeats(generateSeats(ROWS, COLS));
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getFlightById(id);
        setFlight(data);
      } catch (e: any) {
        setError(e?.message ?? 'Помилка завантаження');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const price = useMemo(() => {
    const n = Number(flight?.price ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [flight]);

  const onToggle = (seat: Seat) => {
    const next = new Set(selected);
    if (next.has(seat.code)) next.delete(seat.code);
    else next.add(seat.code);
    setSelected(next);
  };

  const onAddToCart = () => {
    if (!flight) return;
    selected.forEach((code) => {
      dispatch(addTicket({ flightId: String(flight.id), seatCode: code, price }));
    });
    setSelected(new Set());
  };

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

  if (!flight) return null;

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h5">Рейс #{flight.id} — {flight.airline ?? 'Авіакомпанія'}</Typography>
        <Typography variant="body1">Маршрут: {flight.from ?? '—'} → {flight.to ?? '—'}</Typography>
        <Typography variant="body2">Виліт: {flight.departureTime ?? '—'} | Приліт: {flight.arrivalTime ?? '—'}</Typography>
        <Typography variant="body2">Термінал: {flight.terminal ?? '—'} | Ворота: {flight.gate ?? '—'}</Typography>
        <Typography variant="h6">Ціна за місце: {price ? `${price.toFixed(2)} ₴` : '—'}</Typography>
        <Typography variant="body2">
          Квитки: {flight.tickets?.remaining ?? '—'}/{flight.tickets?.total ?? '—'}
        </Typography>
      </Stack>

      <SeatGrid
        seats={seats}
        rows={ROWS}
        cols={COLS}
        selected={selected}
        onToggle={onToggle}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" disabled={selected.size === 0} onClick={onAddToCart}>
          Додати у корзину ({selected.size})
        </Button>
        <Button variant="text" disabled={selected.size === 0} onClick={() => setSelected(new Set())}>
          Скинути вибір
        </Button>
      </Stack>
    </Container>
  );
}
