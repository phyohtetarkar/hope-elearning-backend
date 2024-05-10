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
      result = slug + '-' + generateRandomCode(5);
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
