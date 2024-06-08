export function stringToSlug(value: string) {
  return value
    .trim()
    .replaceAll(/[^\w-\s]*/g, '')
    .replaceAll(/\s+/g, '-')
    .toLowerCase();
}

/**
 * Normalize slug to be unique.
 * @param slug - Initial value
 * @param exists -  A function to check each slug variant
 * @param serial -  Default true
 * @param separator -  Default '-'
 * @returns A promise that contains unique slug.
 */
export async function normalizeSlug({
  value,
  exists,
  serial = true,
  separator = '-',
}: {
  value: string;
  exists: (value: string) => Promise<boolean>;
  serial?: boolean;
  separator?: string;
}) {
  const slug = stringToSlug(value);
  let result = slug;
  let i = 1;
  while (await exists(result)) {
    if (serial) {
      result = slug + separator + i;
      i += 1;
    } else {
      result = slug + separator + generateRandomCode(4);
    }
  }

  return result;
}

export function generateRandomCode(length: number) {
  const randomChars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charLength = randomChars.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * charLength));
  }

  return result;
}

export function transformToArray<T>(value: T | T[] | undefined) {
  if (!value) {
    return undefined;
  }

  if (value instanceof Array) {
    return value;
  }

  return [value];
}

export function splitFileExtension(value: string) {
  const dotIndex = value.lastIndexOf('.');
  if (dotIndex > 0) {
    return {
      name: value.substring(0, dotIndex),
      extension: value.substring(dotIndex),
    };
  }

  return {
    name: value,
    extension: undefined,
  };
}
