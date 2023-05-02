export interface MessengerOutgoingMessage {
  recipient: {
    id: string;
  };
  messaging_type: string;
}