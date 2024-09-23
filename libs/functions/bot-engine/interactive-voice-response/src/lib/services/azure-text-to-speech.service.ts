import * as sdk from "microsoft-cognitiveservices-speech-sdk";

/**
 * Converts text to speech using Azure's Text-to-Speech service.
 *
 * @param {sdk.SpeechConfig} speechConfig - The Azure Speech SDK configuration object.
 * @param {string} text - The text message to be converted into speech.
 * @param {'male' | 'female'} voiceGender - The selected voice type ('male' or 'female').
 * @returns {Promise<ArrayBuffer>} A Promise that resolves with the generated audio data as an ArrayBuffer.
 * @throws Will throw an error if speech synthesis fails.
 */
export async function textToSpeech(
  speechConfig: sdk.SpeechConfig,
  text: string,
  voiceGender: 'male' | 'female'
): Promise<ArrayBuffer> {
  // Set the voice name based on the selected gender
  const voiceName = voiceGender === 'male' ? 'en-US-GuyNeural' : 'en-US-JennyNeural';
  speechConfig.speechSynthesisVoiceName = voiceName;

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  // Return a promise for speech synthesis
  return new Promise<ArrayBuffer>((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result: sdk.SpeechSynthesisResult) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(result.audioData); // Resolve with the synthesized audio data
        } else {
          reject(new Error(`Speech synthesis failed: ${sdk.ResultReason[result.reason]}`));
        }
        synthesizer.close(); // Always close the synthesizer after completion
      },
      (error: string) => {
        synthesizer.close();
        reject(new Error(`Error during speech synthesis: ${error}`));
      }
    );
  });
}
