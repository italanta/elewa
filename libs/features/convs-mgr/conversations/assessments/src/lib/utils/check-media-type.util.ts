/** Determine the media type based on the file extension */
export function getMediaType(fileUrl?: string): string | undefined {
  if (!fileUrl) {
    return undefined;
  }

  const fileExtension = getFileExtensionFromUrl(fileUrl)?.toLowerCase();

  if (!fileExtension) {
    return undefined;
  }

  if (isImageExtension(fileExtension)) {
    return 'image';
  }

  if (isVideoExtension(fileExtension)) {
    return 'video';
  }

  return 'unknown';
}

function isImageExtension(extension: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  return imageExtensions.includes(extension);
}

function isVideoExtension(extension: string): boolean {
  const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
  return videoExtensions.includes(extension);
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
