import { twiml } from "twilio/lib";
import { Twilio, validateRequest } from "twilio/lib";

import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler, HttpsContext, RestResult } from '@ngfi/functions';

import { TwilioIVRRequest } from './models/twilio-ivr-request.interface';


export class TwilioIncomingCallHandler extends FunctionHandler<any, any> {
  private twilioClient: Twilio;

  public async execute(data: TwilioIVRRequest, context: HttpsContext, tools: HandlerTools): Promise<RestResult> {
    // Validate the incoming request is from Twilio
    tools.Logger.debug(() => `Twilio handler hit with dat ${JSON.stringify(context.eventContext.request.query)}`);
    // if (!this.validateRequest(data, context)) {
    //   return {
    //     status: 400,
    //     message: 'Invalid Twilio signature'
    //   };
    // }
    return this.handleCall(data, tools, context);
  }

  private validateRequest(data: any, context: any): boolean {
    const twilioSignature = context.headers['x-twilio-signature'];
    const url = context.url;

    return validateRequest(
      process.env['TWILIO_AUTH_TOKEN']!,
      twilioSignature,
      url,
      data
    );
  }

  async handleCall(req: any, tools: HandlerTools, context: any): Promise<any> {
    const twimlResponse = new twiml.VoiceResponse();
    tools.Logger.debug(() => `Twilio handler hit with dat ${JSON.stringify(req.body)}`);
    // Check if there's user input
    // const digits = req.body.Digits;
    const digits = context.eventContext.request.query.digits;

    if (!digits) {
      // Initial greeting and options
      twimlResponse.say('Welcome to FarmBetter IVR! Please select your preferred voice option to continue:');
      twimlResponse.gather({
        numDigits: 1,
        action: '/voice-selection',
        method: 'POST'
      }).say('Press 1 for Male or Press 2 for Female.');
    }
    else {
      // Handle user input
      switch (digits) {
        case '1':
          console.log('we are 1');
          twimlResponse.say({ voice: 'man' }, 'You have selected the male voice. How can I assist you today?');
          break;
        case '2':
          twimlResponse.say({ voice: 'woman' }, 'You have selected the female voice. How can I assist you today?');
          break;
        default:
          console.log('we are default');
          twimlResponse.say('Invalid selection. Please try again.');
          twimlResponse.redirect('/voice');
      }
    }

    return twimlResponse.toString();
  }
}