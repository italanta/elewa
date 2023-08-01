export const FILE_LIMITS = {
  image: [{
    size: 5,
    unit: 'MB',
    types: ['image/jpeg', 'image/png'],
    platform: 'WhatsApp'
  }
  ],
  video: [{
    size: 16,
    unit: 'MB',
    types: ['video/mp4', 'video/3gp'],
    platform: 'WhatsApp'
  }
  ],
  audio: [{
    size: 16,
    unit: 'MB',
    types: ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/amr', 'audio/ogg'],
    platform: 'WhatsApp'
  }
  ],
  document: [{
    size: 100,
    unit: 'MB',
    types: ['text/plain', 'application/pdf',
      'application/vnd.ms-powerpoint', 'application/msword', 'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    platform: 'WhatsApp'
  }
  ],
  sticker: [{
    size: 500,
    unit: 'KB',
    type: ['image/webp'],
    platform: 'WhatsApp'
  }
  ],
};