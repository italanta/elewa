export interface FileLimit {
  size: number;
  unit: 'KB' | 'MB'; // Define the allowed units as a union type
  types: string[];
}

// Define the interface for the entire file limits object
export interface FileLimits {
  image: FileLimit;
  video: FileLimit;
  audio: FileLimit;
  document: FileLimit;
  sticker: FileLimit;
}