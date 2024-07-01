export function getPlatformURL(endUserId: string) {
  const idArr = endUserId.split('_');
  const platformID = idArr[idArr.length-1];
  const platform = idArr[0];

  switch (platform) {
    case 'w':
      return `https://wa.me/${platformID}`;
    default:
      return `https://wa.me/${platformID}`;
  }
}