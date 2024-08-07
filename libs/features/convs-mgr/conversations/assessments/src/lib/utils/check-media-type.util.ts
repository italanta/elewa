/** Determine the media type based on the file extension */
export function getMediaType(fileUrl?: string): string | undefined 
{
  if (!fileUrl) {
    return undefined;
  }

  const fileExtension = getFileExtensionFromUrl(fileUrl)?.toLowerCase();

  if (!fileExtension) {
    return undefined;
  }

  switch (fileExtension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
    case 'webp':
      return 'image';
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'wmv':
    case 'flv':
    case 'mkv':
      return 'video';
    default:
      return 'unknown';
  }
}

/** Helper method to extract the file extension from the URL gotten back from firebase */
function getFileExtensionFromUrl(url: string): string | undefined 
{
  // Remove the query parameters and fragment identifier
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  // Extract the file extension by splitting the clean URL by '.' and taking the last part
  const fileExtension = cleanUrl.split('.').pop();
  
  return fileExtension;
}
