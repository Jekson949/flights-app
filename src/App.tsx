import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import FlightsPage from './pages/FlightsPage';
import FlightDetailsPage from './pages/FlightDetailsPage';
import CartPage from './pages/CartPage';
import { AppBar, Badge, Box, Container, IconButton, Toolbar, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useAppSelector } from './app/hooks';

export default function App() {
  const count = useAppSelector((s) => s.cart.items.length);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar>
          <FlightTakeoffIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component={Link} to="/" color="inherit" sx={{ textDecoration: 'none', flexGrow: 1 }}>
            Flights
          </Typography>
          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={count} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" disableGutters>
        <Routes>
          <Route path="/" element={<FlightsPage />} />
          <Route path="/flights/:id" element={<FlightDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
