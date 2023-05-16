/**
 * The supported Messenger Button Types
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/buttons
 */
export enum MessengerButtonType {

  /** Postback button */
  POSTBACK = 'postback',

  /** URL button */
  WEB_URL = 'web_url',

  /** Call button */
  PHONE_NUMBER = 'phone_number',

  /** Game play */
  GAME_PLAY = 'game_play',

  /** Account login. The button triggers the 
   *  account linking authentication flow.
   */
  LOGIN = 'login',

  /** Account logout */
  LOGOUT = 'logout',
}