export interface Boat {
  id: number;
  name: string;
  type: string;
  capacity: number;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BoatFormValues {
  name: string;
  type: string;
  capacity: number;
  photo?: File | null;
}
