export function buildPhotoRequestMessage(link: string): string {
  return [
    "*IT* - Prima di andare via, carica le foto della barca (eliche, motore, indicatore carburante, ecc.) qui:",
    "*EN* - Before you leave, please upload the boat photos (propellers, engine, fuel gauge, etc.) here:",
    "*ES* - Antes de irte, por favor subí las fotos de la barca (hélices, motor, reloj de combustible, etc.) acá:",
    link,
  ].join("\n\n");
}
