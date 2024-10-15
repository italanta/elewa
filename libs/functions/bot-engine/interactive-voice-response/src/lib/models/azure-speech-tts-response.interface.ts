/**
 * Interface representing the response from Microsoft Azure Speech TTS API.
 */
interface AzureSpeechTTSResponse {
    /**
     * A unique identifier for the speech synthesis request.
     * Helps track or debug the request within Azure services.
     * @type {string}
     * @example "cf4f5b8b-9f7e-4b14-b91d-7d6d2a431fc6"
     */
    requestId: string;
  
    /**
     * The synthesized speech audio stream returned by the API.
     * This is typically in a binary format (e.g., MP3, WAV).
     * @type {Blob | Buffer}
     * @example new Blob([data], { type: 'audio/mp3' })
     */
    audioContent: Blob | Buffer;
  
    /**
     * The language used for the text-to-speech synthesis.
     * This will match the language specified in the request.
     * @type {string}
     * @example "en-US"
     */
    language: string;
  
    /**
     * The voice name used to synthesize the text.
     * It corresponds to the selected voice in the request.
     * @type {string}
     * @example "en-US-JennyNeural"
     */
    voice: string;
  
    /**
     * The format of the synthesized audio returned in the response.
     * @type {string}
     * @example "audio-16khz-128kbitrate-mono-mp3"
     */
    format: string;
  
    /**
     * The duration of the synthesized speech in seconds.
     * This indicates how long the audio is in real-time.
     * @type {number}
     * @example 5.24
     */
    duration: number;
  
    /**
     * The time when the speech synthesis was completed.
     * This is typically in ISO 8601 format.
     * @type {string}
     * @example "2024-09-23T10:20:30Z"
     */
    timestamp: string;
  
    /**
     * Status code indicating the success or failure of the request.
     * - 200: Success
     * - 400: Bad request
     * - 500: Server error
     * @type {number}
     * @example 200
     */
    statusCode: number;
  
    /**
     * Detailed error message if the request failed.
     * Only present in case of an error (non-200 status code).
     * @type {string}
     * @example "Invalid language code"
     * @optional
     */
    errorMessage?: string;
  }
  