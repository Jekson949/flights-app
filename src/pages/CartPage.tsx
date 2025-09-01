import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { removeTicket, clearCart } from '../features/cart/cartSlice';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CartPage() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();

  const total = items.reduce((sum, x) => sum + (Number(x.price) || 0), 0);

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Корзина</Typography>
        {items.length > 0 && (
          <Button variant="text" color="warning" onClick={() => dispatch(clearCart())}>
            Очистити
          </Button>
        )}
      </Stack>

      {items.length === 0 ? (
        <Typography variant="body1">Пусто</Typography>
      ) : (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Рейс</TableCell>
                <TableCell>Місце</TableCell>
                <TableCell align="right">Ціна</TableCell>
                <TableCell align="center">Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.uid} hover>
                  <TableCell>{it.flightId}</TableCell>
                  <TableCell>{it.seatCode}</TableCell>
                  <TableCell align="right">{Number(it.price).toFixed(2)} ₴</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => dispatch(removeTicket(it.uid))}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Typography variant="h6">Разом: {total.toFixed(2)} ₴</Typography>
          </Stack>
        </>
      )}
    </Container>
  );
}
