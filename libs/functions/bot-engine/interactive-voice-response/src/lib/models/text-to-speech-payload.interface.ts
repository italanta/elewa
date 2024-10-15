/**
 * Interface representing the payload for converting text to speech.
 */
export interface TextToSpeechPayload {
    /**
     * The text that needs to be converted to speech.
     * @type {string}
     */
    text: string;

    /**
     * The gender of the voice for the speech. Should be either 'male' or 'female'.
     * @type {'male' | 'female'}
     */
    voiceGender: 'male' | 'female';
}
