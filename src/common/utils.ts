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
) {
  let result = slug;
  let i = 1;
  while (await exists(result)) {
    result = slug + '-' + i;
    i += 1;
  }

  return result;
}
