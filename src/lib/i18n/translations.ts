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
    requestPhotos: { es: "📸 Pedir fotos", it: "📸 Richiedi foto" },
    viewPhotos: { es: "🖼️ Ver fotos", it: "🖼️ Vedi foto" },
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
  usageGuide: {
    menuTitle: { es: "Guía de uso", it: "Guida d'uso" },
    add: { es: "+ Agregar", it: "+ Aggiungi" },
    newTitle: { es: "Nueva guía", it: "Nuova guida" },
    editTitle: { es: "Editar guía", it: "Modifica guida" },
    titleLabel: { es: "Título", it: "Titolo" },
    titlePlaceholder: {
      es: "Ej: Guía en español",
      it: "Es: Guida in italiano",
    },
    fileLabel: { es: "Archivo PDF", it: "File PDF" },
    fileLabelOptional: {
      es: "Archivo PDF (dejar vacío para mantener el actual)",
      it: "File PDF (lascia vuoto per mantenere quello attuale)",
    },
    empty: { es: "No hay guías cargadas.", it: "Nessuna guida caricata." },
    view: { es: "Ver", it: "Vedi" },
    deleteConfirm: {
      es: '¿Eliminar la guía "{title}"?',
      it: 'Eliminare la guida "{title}"?',
    },
  },
  tripMap: {
    menuTitle: { es: "Mapa de viaje", it: "Mappa del viaggio" },
    description: {
      es: "Este link se muestra al cliente en la página de fotos de entrega.",
      it: "Questo link viene mostrato al cliente nella pagina delle foto di consegna.",
    },
    urlLabel: { es: "Link de Google Maps", it: "Link di Google Maps" },
    saved: { es: "Guardado", it: "Salvato" },
  },
  bookingPhotos: {
    sheetTitle: { es: "Fotos y notas de la reserva", it: "Foto e note della prenotazione" },
    empty: {
      es: "El cliente todavía no subió fotos.",
      it: "Il cliente non ha ancora caricato foto.",
    },
    deleteConfirm: {
      es: "¿Eliminar esta foto?",
      it: "Eliminare questa foto?",
    },
    notesSectionTitle: { es: "Notas", it: "Note" },
    notesEmpty: {
      es: "El cliente todavía no escribió notas.",
      it: "Il cliente non ha ancora scritto note.",
    },
    noteDeleteConfirm: {
      es: "¿Eliminar esta nota?",
      it: "Eliminare questa nota?",
    },
    categories: {
      elises: { es: "Hélices", it: "Eliche" },
      combustible: { es: "Reloj de combustible", it: "Indicatore carburante" },
      exterior: { es: "Barca (vista general)", it: "Barca (vista generale)" },
      motor: { es: "Motor", it: "Motore" },
      debajo_motor: { es: "Debajo del motor", it: "Sotto il motore" },
      otros: { es: "Otras fotos", it: "Altre foto" },
    },
  },
  errors: {
    generic: {
      es: "Ocurrió un error inesperado. Intentá de nuevo.",
      it: "Si è verificato un errore imprevisto. Riprova.",
    },
  },
};
