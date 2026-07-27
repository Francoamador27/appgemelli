export function buildPhotoRequestMessage(link: string): string {
  return [
    "*ES* - Antes de irte, por favor subí las fotos de la barca (hélices, motor, reloj de combustible, etc.) acá:",
    "*IT* - Prima di andare via, carica le foto della barca (eliche, motore, indicatore carburante, ecc.) qui:",
    link,
  ].join("\n\n");
}
