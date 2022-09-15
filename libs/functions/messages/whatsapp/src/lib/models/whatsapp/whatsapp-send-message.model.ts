import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";


export class SendWhatsAppMessageModel{
  constructor(_){ }
  async sendMessage(message?:StoryBlock){
    const authorizationHeader = process.env.AUTHORIZATION_HEADER;
    
    const PHONE_NUMBER = 103844892462329 //Refers to business number to be used
    const url = `https://graph.facebook.com/v14.0/${PHONE_NUMBER}/messages`
    const data = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": "254706165412",
      "type": "text",
      "text": { // the text object
        "preview_url": false,
        "body": "test"
      }
    }

    const response = await fetch(url,{
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin', 
      headers: {
        'Content-Type': 'application/json',
        //Requires cronjob to get new token every 24hrs
        //To be saved as environment variable
        'Authorization': 'EAAIoZBI2uyCMBAK6iwQ47N6WY9Rv3pMe5PbA7dijoJViudsBY3CDoBBQYZCXUeRDycpUjU9PqVrXtktJ7yhUgL1faLUTMJTNQYoQ9l2msb6Y4e2KLHYyYWFy1KFmvLIjr2XmIQzZAopHmEr0LiXwNqrfriaM6xVtx8s8ZAz8j0dcDZA7olCrqM1tz9W5dHCB4PTsXskqNoQAZCT2SZAk251paUbhIVGuZBEZD',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })

    return response.json();
    
  }

  


}