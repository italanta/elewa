/**
 * Enum for voice gender options.
 */
enum VoiceGender {
    Male = 'male',
    Female = 'female'
}

/**
 * Interface for audio data.
 * 
 * @property {ArrayBuffer} audioBuffer - The buffer containing audio data.
 * @property {string} storyId - The ID of the story associated with the audio.
 * @property {string} blockId - The ID of the block associated with the audio.
 * @property {VoiceGender} voiceGender - The gender of the voice used for audio (male or female).
 */
interface AudioData {
    audioBuffer: ArrayBuffer;
    storyId: string;
    blockId: string;
    voiceGender: VoiceGender;
}