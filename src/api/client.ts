import axios from 'axios';
import type { Flight } from '../types/flight';

const api = axios.create({
  baseURL: 'https://679d13f487618946e6544ccc.mockapi.io/testove/v1',
  timeout: 15000,
});

export async function getFlights() {
  const { data } = await api.get<Flight[]>('/flights');
  return data;
}

export async function getFlightById(id: string) {
  const { data } = await api.get<Flight>(`/flights/${id}`);
  return data;
}
