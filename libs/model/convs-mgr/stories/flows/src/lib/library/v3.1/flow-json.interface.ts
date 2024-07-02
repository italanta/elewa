import { FlowPageLayoutElementV31 } from "./elements/flow-element.interface";

/**
 * Root element of the flow JSON.
 * Entry point for flows
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson
 */
export interface FlowJSONV31
{
  /** 
   * The flow version being used. Constant set at 3.1.
   * When updating the flow, copy this folder to create the new version as seperate types.
   */
  version: '3.1';

  /** List of all screens in the flow */
  screens: FlowScreenV31[];

  /** Represents the version to use during communication with the WhatsApp Flows Data Endpoint. Currently, it is 3.0. If flow uses the data-channel capability, the validation system will ask to provide this property. */
  data_api_version: '3.0';

  /** 
   * Routing logic of the screens
   * 
   * Dictionary of current screen to navigable screens e.g. {"MY_FIRST_SCREEN": ["MY_SECOND_SCREEN"] }, 
  */
  routing_model: { 
    // Current screen ID   // List of screens IDs navigable from here
    [screen_name: string]: string[] 
  };
}

/** 
 * A single screen of the flow
 */
export interface FlowScreenV31
{
  //
  // SECTION - LOAD

  /** 
   * Unique identifier of the screen which works as a page url. 
   * SUCCESS is a reserved keyword and should not be used as a screen id. */
  id: string;

  /**
   * (optional) 
   * Declaration of dynamic data that fills the components field in the Flow JSON. 
   * It uses JSON Schema to define the structure and type of the properties.
   * 
   * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson#dynamic-properties
   */
  data?: {
    [attr_name: string]: {
      type: 'string' | 'number' | 'boolean' | 'object' | 'array' | string;
      __example__: string | number | boolean | any | any[];
    }
  };

  //
  // SECTION - LAYOUT

  /** Screen level attribute that is rendered in the top navigation bar. */
  title?: string;

  /** 
   * Layout represents screen UI Content. It can be predefined by the WhatsApp Flows team, or the business can use empty containers and build custom experience using the WhatsApp Flows Library.
   */
  layout: FlowPageLayoutV31;
  
  //
  // SECTION - TERMINAL STATE

  /**
   * (optional)
   * True if the business flow is the end state machine. 
   * 
   * It means that each Flow should have a terminal state where we terminate the experience and have the Flow completed. 
   * Multiple screens can be marked as terminal. It's mandatory to have a Footer component on the terminal screen.
   */
  terminal?: boolean;

  /**
   * (optional, only applicable on terminal screens) 
   * Defaults to true. A Flow can have multiple terminal screens with different business outcomes. 
   * This property marks whether terminating on a terminal screen should be considered a successful business outcome.
   */
  success?: boolean;

  /**
   * (optional) 
   * Defaults to false. This property defines whether to trigger a data exchange request with the WhatsApp Flows Data Endpoint 
   * when using the back button while on this screen. The property is useful when you need to reevaluate the screen data when 
   * returning to the previous screen.
   * 
   * @see https://developers.facebook.com/docs/whatsapp/flows/reference/flowjson#additional-information-on-refresh-on-back
   */
  refresh_on_back?: boolean;
}

export interface FlowPageLayoutV31 
{
  /** 
   * The layout identifier that’s used in the template. 
   * In the current version of Flow JSON, there is only one layout available - "SingleColumnLayout" 
   * which represents a vertical flexbox container. 
   */
  type: 'SingleColumnLayout';

  /**
   * Represents an array of components from the WhatsApp Flows Library.
   */
  children: FlowPageLayoutElementV31[];
}
