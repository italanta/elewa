export const GET_RANDOM_COLOR = () => {
  let color;
  do {
    color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  } while (color === "#FFFFFF");
  return color;
};

export function GET_USER_AVATAR(name: string) {
  if (!name) return '';

  const splitName = name.split(' ');
  if (splitName.length > 1) {
    return `${splitName[0]?.charAt(0).toUpperCase()} ${splitName[1]?.charAt(0).toUpperCase()}`;
  }
    
  return `${name.charAt(0).toUpperCase()} ${name.charAt(1).toUpperCase()}`;
}
