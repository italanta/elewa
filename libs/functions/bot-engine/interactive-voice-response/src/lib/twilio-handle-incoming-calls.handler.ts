import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler, RestResult } from '@ngfi/functions';
import twilio from 'twilio';
import { twiml } from 'twilio';

export class TwilioIncomingCallHandler extends FunctionHandler<any, RestResult> {
  private twilioClient: twilio.Twilio;

  constructor() {
    super();
    // Initialize Twilio client with credentials (for outbound requests)
    // this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  public async execute(data: any, context: FunctionContext, tools: HandlerTools): Promise<RestResult> {
    // Validate the incoming request is from Twilio
    if (!this.validateRequest(data, context)) {
      return {
        status: 400,
        message: 'Invalid Twilio signature'
      };
    }

    return this.handleCall(data);
  }

  private validateRequest(data: any, context: any): boolean {
    const twilioSignature = context.headers['x-twilio-signature'];
    const url = context.url; // Assume FunctionContext provides the full URL of the request

    return twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN!,
      twilioSignature,
      url,
      data
    );
  }

  async handleCall(req: any): Promise<RestResult> {
    const twimlResponse = new twiml.VoiceResponse();

    // Check if there's user input
    const digits = req.body?.Digits;

    if (!digits) {
      // Initial greeting and options
      twimlResponse.say('Welcome to FarmBetter IVR! Please select your preferred voice option to continue:');
      twimlResponse.gather({
        numDigits: 1,
        action: '/voice-selection', // This should be the URL of your function that handles the selection
        method: 'POST'
      }).say('Press 1 for Male or Press 2 for Female.');
    } else {
      // Handle user input
      switch (digits) {
        case '1':
          twimlResponse.say({ voice: 'man' }, 'You have selected the male voice. How can I assist you today?');
          break;
        case '2':
          twimlResponse.say({ voice: 'woman' }, 'You have selected the female voice. How can I assist you today?');
          break;
        default:
          twimlResponse.say('Invalid selection. Please try again.');
          twimlResponse.redirect('/voice'); // Redirect to the initial greeting
      }
    }

    // Create and return the RestResult
    const result: RestResult = {
      status: 200,
      data: {
        twimlResponse: twimlResponse.toString(),
        contentType: 'text/xml'
      }
    };

    return result;
  }
}