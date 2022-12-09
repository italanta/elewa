# Description

When the bot engine receives a message from whatsapp, we use the `WhatsAppReceiveIncomingMsgHandler` to handle all whatsapp messages.

This module contains implementation for:
  - Interpreting the whatsapp message to our standardized message format
  - Interpreting Story Blocks to whatsapp messages
  - Sending whatsapp messages through the whatsapp api endpoint

To test the bot on whatsapp you need to register on the [Meta Developer Platform](https://developers.facebook.com).

## How to setup your Meta Developer Account

If you had registered for a meta developer account, go to step 2
### 1. Create a Meta Developer Account
- Go to [Meta Developer Platform](https://developers.facebook.com) and login with your facebook account
- Click on 'Get Started' in the top right
- Follow the steps shown to create your developer account

### 2. Create an app
- Once you have your developer account head to your [My Apps](https://developers.facebook.com/apps) and click on 'Create App'
- In 'Select an app type' select 'Business' and click next
- Enter the app name e.g. 'Elewa Conversational Learning App' and click 'Create App'. Enter your facebook account password if you are prompted.

### 3. Setup whatsapp
- Once you have your app is created, you will be redirected to the developers dashboard
- You will need a whatsapp business account, go ahead and create it. Follow the instructions in this [link](https://web.facebook.com/business/help/2087193751603668?id=2129163877102343&_rdc=1&_rdr)
- Under 'Add products to your app' find Whatsapp and click 'Setup'
- Select your business account and click continue
- You're almost done

### 4. Configure webhooks
- Under the whatsapp menu, click 'Quickstart' if you are not there already.
- Click 'Configure Webhooks'.
- Under Webhook click 'Edit'. The 'Callback URL' will be the http url of the bot engine cloud function. 
- The 'Verify token' can be any string of text. Just keep it short. E.g. Elewa CLM Token.
- Click 'Verify and Save'.
- In 'Webhook fields', click 'Manager'. Look for messages, and then click subscribe to its right.

### 5. Test
- On the left menu, under Whatsapp, click 'Get Started'.
- Under 'Send and receive messages'. 'From' will already be filled with your test number. If not select 'Test Number' from the dropdown.
This will be the phone number of our bot.
- Under 'To', select the country code and enter your phone number.
- Click 'Send Message'. You should get a message on your whatsapp number.