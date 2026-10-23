const MAX_SIDE = 1400;

/** Verkleinert ein Foto im Browser (max. 1400 px) und speichert es als WebP. So bleibt der Gratis-Speicher lange ausreichend. */
export async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => null);
  if (!bitmap) throw new Error('Dieses Bildformat kann nicht gelesen werden. Bitte ein JPEG, PNG oder WebP wählen.');
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
  if (blob && blob.type === 'image/webp') return blob;
  const jpeg = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
  if (!jpeg) throw new Error('Das Bild konnte nicht verarbeitet werden.');
  return jpeg;
}
