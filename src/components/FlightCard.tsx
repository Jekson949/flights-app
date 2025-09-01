import * as React from 'react';
import { Card, CardActions, CardContent, CardHeader, IconButton, Typography, Button, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import type { Flight } from '../types/flight';
import { Link as RouterLink } from 'react-router-dom';

function fmt(value?: string | number, fallback = '—') {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value);
}

export interface FlightCardProps {
  flight: Flight;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const priceNum = Number(flight.price ?? 0);
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={fmt(flight.airline, 'Авіакомпанія')}
        subheader={`${fmt(flight.from)} → ${fmt(flight.to)}`}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="body2">Виліт: {fmt(flight.departureTime)}</Typography>
          <Typography variant="body2">Приліт: {fmt(flight.arrivalTime)}</Typography>
          <Typography variant="body2">Термінал: {fmt(flight.terminal)}</Typography>
          <Typography variant="body2">Ворота: {fmt(flight.gate)}</Typography>
          <Typography variant="body2">
            Квитки: {flight.tickets?.remaining ?? '—'}/{flight.tickets?.total ?? '—'}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {priceNum ? `${priceNum.toFixed(2)} ₴` : 'Ціна не вказана'}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <IconButton aria-label="favorite" color="default">
          <FavoriteIcon />
        </IconButton>
        <Button
          component={RouterLink}
          to={`/flights/${flight.id}`}
          size="small"
          variant="contained"
          endIcon={<AirplaneTicketIcon />}
        >
          Деталі
        </Button>
      </CardActions>
    </Card>
  );
};
