import { FileLimits } from "./file-limits.interface";

export const FILE_LIMITS = {
  whatsapp: {
    image: {
      size: 5,
      unit: 'MB',
      types: ['image/jpeg', 'image/png']
    },
    video: {
      size: 16,
      unit: 'MB',
      types: ['video/mp4', 'video/3gp']
    },
    audio: {
      size: 16,
      unit: 'MB',
      types: ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/amr', 'audio/ogg']
    },
    document: {
      size: 100,
      unit: 'MB',
      types: ['text/plain', 'application/pdf',
        'application/vnd.ms-powerpoint', 'application/msword', 'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    },
    sticker: {
      size: 500,
      unit: 'KB',
      types: ['image/webp']
    }
  } as FileLimits
};

