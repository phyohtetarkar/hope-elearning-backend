export function stringToSlug(value: string) {
  return value
    .trim()
    .replaceAll(/[^\w-\s]*/g, '')
    .replaceAll(/\s+/g, '-')
    .toLowerCase();
}

export async function normalizeSlug(
  slug: string,
  exists: (value: string) => Promise<boolean>,
  serial: boolean = true,
) {
  let result = stringToSlug(slug);
  let i = 1;
  while (await exists(result)) {
    if (serial) {
      result = slug + '-' + i;
      i += 1;
    } else {
      result = slug + '-' + generateRandomCode(6);
    }
  }

  return result;
}

export function generateRandomCode(length: number) {
  const randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = randomChars.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * charLength));
  }

  return result;
}
