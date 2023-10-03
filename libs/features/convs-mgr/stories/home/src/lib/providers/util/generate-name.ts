import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

export function generateName() {
  const defaultName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });

  return defaultName;
}
