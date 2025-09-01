export interface FlightTicketsInfo {
  total?: number;
  remaining?: number;
}

export interface Flight {
  id: string;              // mockapi обычно возвращает id как string
  airline?: string;
  from?: string;
  to?: string;
  departureTime?: string;  // ISO или произвольная строка
  arrivalTime?: string;
  price?: number | string; // на всякий случай допускаем строку
  terminal?: string;
  gate?: string;
  tickets?: FlightTicketsInfo;
  // на случай дополнительных полей
  [key: string]: any;
}

export interface Seat {
  row: number; // 1..rows
  col: number; // 1..cols
  code: string; // напр. "A1"
  occupied: boolean;
}
