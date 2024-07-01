import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";


/**
 * An interface for the call to action button supported by Meta's WhatsApp cloud messages API.
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-cta-url-messages
 */
export interface InteractiveURLButtonBlock extends StoryBlock 
{
  /** Optional heading to be displayed */
  headerText?: string;
  /** Call to action description */
  bodyText?: string;
  /** Any additional text you want to include */
  footerText?: string;
  /** The call to action button text, eg See dates */
  urlDisplayText: string;
  /** URL to load in the device's default web browser when tapped by the WhatsApp user. */
  url: string;
}
