import type { Boat } from "./boat";

export type BookingChannel = "samboat" | "clickandboat" | "directo" | "otro";

export const BOOKING_CHANNEL_VALUES: BookingChannel[] = [
  "directo",
  "samboat",
  "clickandboat",
  "otro",
];

export interface Booking {
  id: number;
  boat_id: number;
  boat: Boat;
  date: string;
  client_name: string | null;
  client_phone: string | null;
  channel: BookingChannel | null;
  has_deposit: boolean;
  deposit_amount: string | null;
  is_paid: boolean;
  amount_due: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingFormValues {
  boat_id: number | "";
  date: string;
  client_name: string;
  client_phone: string;
  channel: BookingChannel | "";
  has_deposit: boolean;
  deposit_amount: string;
  is_paid: boolean;
  amount_due: string;
  notes: string;
}
