/**
 * Generates a consistent, aesthetic pastel color from a string.
 * High lightness ensures contrast against dark backgrounds.
 */
export const stringToColor = (str: string, alpha: number = 1) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  // Using 70% saturation and 75% lightness for standard pastel look
  return `hsla(${h}, 70%, 75%, ${alpha})`;
};
