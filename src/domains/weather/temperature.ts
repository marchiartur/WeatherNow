export function renderTemperature(value: any, isCelsius: boolean) {
  if (!value) return '';

  if (isCelsius) {
    return value + '°';
  }

  return value + '℉';
}
