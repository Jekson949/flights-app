import * as React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import type { Seat } from '../types/flight';

export interface SeatGridProps {
  seats: Seat[];              // плоский массив seats
  rows: number;
  cols: number;
  selected: Set<string>;      // коды выбранных мест (например, "A1")
  onToggle: (seat: Seat) => void;
}

const seatColor = (s: Seat, selected: boolean) => {
  if (s.occupied) return 'error';
  if (selected) return 'primary';
  return 'success';
};

export const SeatGrid: React.FC<SeatGridProps> = ({ seats, rows, cols, selected, onToggle }) => {
  // отрендерим сеткой через CSS Grid
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 1,
        width: '100%',
        maxWidth: 480,
      }}
    >
      {seats.map((s) => {
        const isSelected = selected.has(s.code);
        return (
          <Tooltip key={s.code} title={`${s.code} ${s.occupied ? '(Зайнято)' : '(Вільно)'}`}>
            <span>
              <IconButton
                size="large"
                color={seatColor(s, isSelected) as any}
                onClick={() => !s.occupied && onToggle(s)}
                disabled={s.occupied}
              >
                <EventSeatIcon />
              </IconButton>
            </span>
          </Tooltip>
        );
      })}
    </Box>
  );
};
