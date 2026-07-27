import type { BookingPhotoCategory } from "@/types/bookingPhoto";

export interface Trilingual {
  it: string;
  en: string;
  es: string;
}

export const PUBLIC_UI = {
  pageTitle: {
    it: "Foto di consegna",
    en: "Delivery photos",
    es: "Fotos de entrega",
  },
  intro: {
    it: "Prima di andartene, carica le foto della barca seguendo questa guida.",
    en: "Before you leave, please upload the boat photos following this guide.",
    es: "Antes de irte, subí las fotos de la barca siguiendo esta guía.",
  },
  required: {
    it: "Obbligatorio",
    en: "Required",
    es: "Obligatorio",
  },
  addPhotos: {
    it: "+ Aggiungi foto",
    en: "+ Add photos",
    es: "+ Agregar fotos",
  },
  uploading: {
    it: "Caricamento...",
    en: "Uploading...",
    es: "Subiendo...",
  },
  loading: {
    it: "Caricamento...",
    en: "Loading...",
    es: "Cargando...",
  },
  allDone: {
    it: "Fatto! Ora puoi chiudere questa pagina.",
    en: "Done! You can now close this page.",
    es: "¡Listo! Ya podés cerrar esta página.",
  },
  invalidLink: {
    it: "Questo link non è valido o è scaduto.",
    en: "This link is invalid or has expired.",
    es: "Este link no es válido o expiró.",
  },
} satisfies Record<string, Trilingual>;

export const PUBLIC_CATEGORIES: Record<
  BookingPhotoCategory,
  { label: Trilingual; instructions: Trilingual }
> = {
  elises: {
    label: { it: "Eliche", en: "Propellers", es: "Hélices" },
    instructions: {
      it: "Importante! Fai diverse foto delle eliche, ben da vicino.",
      en: "Important! Take several close-up photos of the propellers.",
      es: "¡Importante! Sacá varias fotos de las hélices, bien de cerca.",
    },
  },
  combustible: {
    label: {
      it: "Indicatore carburante",
      en: "Fuel gauge",
      es: "Reloj de combustible",
    },
    instructions: {
      it: "Foto dell'indicatore del carburante.",
      en: "Photo of the fuel gauge.",
      es: "Foto del reloj/indicador de gasolina.",
    },
  },
  exterior: {
    label: {
      it: "Barca (vista generale)",
      en: "Boat (general view)",
      es: "Barca (vista general)",
    },
    instructions: {
      it: "Foto generali dello stato della barca.",
      en: "General photos of the boat's condition.",
      es: "Fotos generales del estado de la barca.",
    },
  },
  motor: {
    label: { it: "Motore", en: "Engine", es: "Motor" },
    instructions: {
      it: "Foto del motore.",
      en: "Photos of the engine.",
      es: "Fotos del motor.",
    },
  },
  debajo_motor: {
    label: {
      it: "Sotto il motore",
      en: "Under the engine",
      es: "Debajo del motor",
    },
    instructions: {
      it: "Foto sotto il motore.",
      en: "Photo under the engine.",
      es: "Foto de debajo del motor.",
    },
  },
  otros: {
    label: { it: "Altre foto", en: "Other photos", es: "Otras fotos" },
    instructions: {
      it: "Qualsiasi altra foto che vuoi aggiungere (urti, danni, ecc.).",
      en: "Any other photo you'd like to add (bumps, damage, etc.).",
      es: "Cualquier otra foto que quieras agregar (golpes, daños, etc.).",
    },
  },
};
