import type { BookingNote } from "./bookingNote";

export type BookingPhotoCategory =
  | "elises"
  | "combustible"
  | "exterior"
  | "motor"
  | "debajo_motor"
  | "otros";

export const PHOTO_CATEGORY_VALUES: BookingPhotoCategory[] = [
  "elises",
  "combustible",
  "exterior",
  "motor",
  "debajo_motor",
  "otros",
];

export const REQUIRED_PHOTO_CATEGORIES: BookingPhotoCategory[] = [
  "elises",
  "combustible",
];

export interface BookingPhoto {
  id: number;
  category: BookingPhotoCategory;
  url: string;
  original_filename: string | null;
  created_at: string;
}

export interface PublicBookingInfo {
  boat_name: string;
  date: string;
  required_categories: BookingPhotoCategory[];
  photos_by_category: Partial<Record<BookingPhotoCategory, BookingPhoto[]>>;
  notes: BookingNote[];
}
