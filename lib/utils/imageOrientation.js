export default function imageOrientation(aspectRatio) {
  const portrait = 'portrait';
  const landscape = 'landscape';
  const square = 'sqaure';

  if (aspectRatio < 1) return portrait;
  if (aspectRatio > 1) return landscape;
  return square;
}
