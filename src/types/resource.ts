export type ResourceType = "link" | "image" | "file";

export interface Resource {
  id: number;
  type: ResourceType;
  title_en: string | null;
  title_it: string;
  description_en: string | null;
  description_it: string | null;
  url: string | null;
  file_url: string | null;
  original_filename: string | null;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
}
