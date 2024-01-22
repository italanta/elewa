interface DialogflowCXIntent {
  // Basic properties
  name: string; // Unique identifier for the intent
  displayName: string; // Human-readable name for the intent
  priority: number; // Higher priority intents get chosen first
  fallbackIntent: string; // Intent triggered if no exact match found

  // Training data
  trainingPhrases: TrainingPhrase[]; // Array of user input examples

  // Entity extraction
  parameters: IntentParameter[]; // List of entities to extract from user input
  events: string[]; // Events triggered by extracted entities
}
