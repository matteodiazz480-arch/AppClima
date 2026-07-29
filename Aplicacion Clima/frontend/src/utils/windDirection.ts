const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

export function degreesToCompass(degrees: number): string {
  const index = Math.round(degrees / 45) % 8;
  return DIRECTIONS[index];
}
