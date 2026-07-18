export type Locale = "es" | "it";

export const LOCALES: { value: Locale; label: string }[] = [
  { value: "it", label: "Italiano" },
  { value: "es", label: "Español" },
];

export const DEFAULT_LOCALE: Locale = "it";

export const translations = {
  common: {
    save: { es: "Guardar", it: "Salva" },
    saving: { es: "Guardando...", it: "Salvataggio..." },
    cancel: { es: "Cancelar", it: "Annulla" },
    delete: { es: "Eliminar", it: "Elimina" },
    edit: { es: "Editar", it: "Modifica" },
    loading: { es: "Cargando...", it: "Caricamento..." },
    close: { es: "Cerrar", it: "Chiudi" },
  },
  auth: {
    appName: { es: "Gemelli Boat", it: "Gemelli Boat" },
    subtitle: { es: "Gestión de reservas", it: "Gestione delle prenotazioni" },
    languageLabel: { es: "Idioma", it: "Lingua" },
    nameLabel: { es: "Nombre de usuario", it: "Nome utente" },
    passwordLabel: { es: "Contraseña", it: "Password" },
    loginButton: { es: "Ingresar", it: "Accedi" },
    loggingIn: { es: "Ingresando...", it: "Accesso in corso..." },
    installApp: { es: "⬇ Descargar app", it: "⬇ Scarica app" },
    installIosHint: {
      es: "Tocá el ícono Compartir de Safari y elegí \"Agregar a inicio\".",
      it: "Tocca l'icona Condividi di Safari e scegli \"Aggiungi a Home\".",
    },
  },
  nav: {
    calendar: { es: "Calendario", it: "Calendario" },
    boats: { es: "Barcas", it: "Barche" },
    resources: { es: "Recursos", it: "Risorse" },
    logout: { es: "Salir", it: "Esci" },
  },
  calendar: {
    title: { es: "Calendario", it: "Calendario" },
    newBooking: { es: "+ Nueva reserva", it: "+ Nuova prenotazione" },
    loading: { es: "Cargando...", it: "Caricamento..." },
    noBookings: {
      es: "No hay reservas para este día.",
      it: "Nessuna prenotazione per questo giorno.",
    },
    weekdays: {
      es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
      it: ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"],
    },
  },
  booking: {
    newTitle: { es: "Nueva reserva", it: "Nuova prenotazione" },
    editTitle: { es: "Editar reserva", it: "Modifica prenotazione" },
    boatLabel: { es: "Barca", it: "Barca" },
    selectBoat: { es: "Seleccioná una barca", it: "Seleziona una barca" },
    dateLabel: { es: "Fecha", it: "Data" },
    checkingAvailability: {
      es: "Verificando disponibilidad...",
      it: "Verifica disponibilità...",
    },
    available: { es: "Disponible ✓", it: "Disponibile ✓" },
    notAvailable: {
      es: "Esta barca ya está reservada ese día.",
      it: "Questa barca è già prenotata quel giorno.",
    },
    clientLabel: { es: "Cliente (opcional)", it: "Cliente (opzionale)" },
    phoneLabel: { es: "Teléfono (opcional)", it: "Telefono (opzionale)" },
    channelLabel: { es: "Canal", it: "Canale" },
    hasDeposit: { es: "Hay depósito", it: "C'è un deposito" },
    depositAmount: {
      es: "Monto del depósito",
      it: "Importo del deposito",
    },
    notes: { es: "Notas (opcional)", it: "Note (opzionali)" },
    save: { es: "Guardar reserva", it: "Salva prenotazione" },
    saving: { es: "Guardando...", it: "Salvataggio..." },
    noClientName: { es: "Sin nombre de cliente", it: "Nessun nome cliente" },
    deposit: { es: "Depósito", it: "Deposito" },
    noDeposit: { es: "Sin depósito", it: "Nessun deposito" },
    isPaid: { es: "Ya pagó el alquiler", it: "Ha già pagato il noleggio" },
    amountDue: {
      es: "Monto que debe pagar",
      it: "Importo da pagare",
    },
    paid: { es: "Pagado", it: "Pagato" },
    pending: { es: "Pendiente de pago", it: "Pagamento in sospeso" },
    deleteConfirm: {
      es: "¿Eliminar la reserva de {target}?",
      it: "Eliminare la prenotazione di {target}?",
    },
    call: { es: "Llamar", it: "Chiama" },
    whatsapp: { es: "WhatsApp", it: "WhatsApp" },
    sendResource: { es: "Recursos", it: "Risorse" },
    sentResources: { es: "Ya enviado", it: "Già inviato" },
    channels: {
      directo: { es: "Directo", it: "Diretto" },
      samboat: { es: "SamBoat", it: "SamBoat" },
      clickandboat: { es: "Click&Boat", it: "Click&Boat" },
      otro: { es: "Otro", it: "Altro" },
    },
  },
  boat: {
    add: { es: "+ Agregar", it: "+ Aggiungi" },
    newTitle: { es: "Nueva barca", it: "Nuova barca" },
    editTitle: { es: "Editar barca", it: "Modifica barca" },
    nameLabel: { es: "Nombre", it: "Nome" },
    typeLabel: { es: "Tipo", it: "Tipo" },
    typePlaceholder: {
      es: "Lancha, Gomón, Catamarán...",
      it: "Barca, Gommone, Catamarano...",
    },
    capacityLabel: {
      es: "Capacidad (personas)",
      it: "Capacità (persone)",
    },
    photoLabel: { es: "Foto (opcional)", it: "Foto (opzionale)" },
    shareImage: { es: "Compartir imagen", it: "Condividi immagine" },
    people: { es: "personas", it: "persone" },
    fleetTitle: { es: "Flota", it: "Flotta" },
    deleteConfirm: {
      es: '¿Eliminar la barca "{name}"? Esto también elimina sus reservas asociadas.',
      it: 'Eliminare la barca "{name}"? Questo elimina anche le prenotazioni associate.',
    },
  },
  resource: {
    menuTitle: { es: "Recursos", it: "Risorse" },
    add: { es: "+ Agregar", it: "+ Aggiungi" },
    newTitle: { es: "Nuevo recurso", it: "Nuova risorsa" },
    editTitle: { es: "Editar recurso", it: "Modifica risorsa" },
    typeLabel: { es: "Tipo", it: "Tipo" },
    typeLink: { es: "Link", it: "Link" },
    typeImage: { es: "Imagen", it: "Immagine" },
    typeFile: { es: "Archivo", it: "File" },
    titleEnLabel: {
      es: "Título (inglés, opcional)",
      it: "Titolo (inglese, opzionale)",
    },
    titleItLabel: { es: "Título (italiano)", it: "Titolo (italiano)" },
    descriptionEnLabel: {
      es: "Descripción (inglés, opcional)",
      it: "Descrizione (inglese, opzionale)",
    },
    descriptionItLabel: {
      es: "Descripción (italiano, opcional)",
      it: "Descrizione (italiano, opzionale)",
    },
    urlLabel: { es: "Link", it: "Link" },
    fileLabel: { es: "Archivo", it: "File" },
    fileLabelOptional: {
      es: "Archivo (dejar vacío para mantener el actual)",
      it: "File (lascia vuoto per mantenere quello attuale)",
    },
    empty: { es: "No hay recursos cargados.", it: "Nessuna risorsa caricata." },
    reorderHandle: { es: "Arrastrar para reordenar", it: "Trascina per riordinare" },
    shareWhatsapp: { es: "Compartir por WhatsApp", it: "Condividi su WhatsApp" },
    deleteConfirm: {
      es: '¿Eliminar el recurso "{name}"?',
      it: 'Eliminare la risorsa "{name}"?',
    },
    sendSheetTitle: { es: "Enviar recurso", it: "Invia risorsa" },
    sendEmpty: {
      es: "No hay recursos para enviar.",
      it: "Nessuna risorsa da inviare.",
    },
  },
  errors: {
    generic: {
      es: "Ocurrió un error inesperado. Intentá de nuevo.",
      it: "Si è verificato un errore imprevisto. Riprova.",
    },
  },
};
