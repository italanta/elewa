/**
 * Interface representing the parameters sent from the voice API.
 */
interface IVRAPICallback {
    /**
     * This lets your application know the call session state.
     * - `1` for an ongoing call.
     * - `0` for the final request indicating call has ended.
     * @type {number}
     * @example 1 // ongoing call
     * @example 0 // call has ended
     */
    isActive: number;
  
    /**
     * Unique identifier for each call session.
     * This value remains the same throughout the session.
     * @type {string}
     * @example "1234567890abcdef"
     */
    sessionId: string;
  
    /**
     * Indicates if the call is inbound (user-initiated) or outbound (app-initiated).
     * @type {'inbound' | 'outbound'}
     * @example "inbound"
     * @example "outbound"
     */
    direction: 'inbound' | 'outbound';
  
    /**
     * The phone number of the user making or receiving the call.
     * This number will be in international format.
     * @type {string}
     * @example "+254711XXXYYY"
     */
    callerNumber: string;
  
    /**
     * The destination phone number provided by Africa's Talking in international format.
     * @type {string}
     * @example "+254XXXYYYZZZ"
     */
    destinationNumber: string;
  
    /**
     * Contains digits entered by the user in response to a `<GetDigits />` request.
     * This is only present after a GetDigits response.
     * @type {string}
     * @example "1234"
     * @optional
     */
    dtmfDigits?: string;
  
    /**
     * URL of the call recording.
     * This is sent in the final request if a recording was made.
     * @type {string}
     * @example "https://example.com/recording.mp3"
     * @optional
     */
    recordingUrl?: string;
  
    /**
     * Duration of the call in seconds.
     * This is sent in the final request.
     * @type {number}
     * @example 120
     * @optional
     */
    durationInSeconds?: number;
  
    /**
     * The currency used for billing the call (e.g., KES, USD).
     * This is sent in the final request.
     * @type {string}
     * @example "KES"
     * @optional
     */
    currencyCode?: string;
  
    /**
     * The total cost of the call.
     * This is sent in the final request.
     * @type {number}
     * @example 0.50
     * @optional
     */
    amount?: number;
  }
  