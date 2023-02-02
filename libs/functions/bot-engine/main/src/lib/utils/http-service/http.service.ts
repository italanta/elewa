import axios from "axios";

import { HandlerTools } from "@iote/cqrs";

export class HttpService
{
  public async post(URL: string, dataPayload: any, tools: HandlerTools)
  {
    const payload = { data: dataPayload || {} };

    tools.Logger.log(() => `[makeHttpRequest] - URL: ${URL}`);

    tools.Logger.log(() => `[makeHttpRequest] - Data to post: ${JSON.stringify(payload)}`);

      const resp = await axios.post(URL, payload, {
        headers: {
          'ContentType': 'application/json'
        }
      });

      if (resp.status === 200 || 201 || 202) {
        tools.Logger.log(() => `[makeHttpRequest] - Post data Success: ${JSON.stringify(resp.status)}`);

        return resp.data
      } else {
        tools.Logger.error(() => 
          `[BotEngine].httpPostRequest - Error while posting data. CODE :: ${JSON.stringify(resp.status)} - ${JSON.stringify(resp.data)}`);
      }
  }

  public async get(URL: string, tools: HandlerTools)
  {

    tools.Logger.log(() => `[BotEngine].httpGetRequest - Attempting to fetch Data`);

      const resp = await axios.get(URL, {
        headers: {
          'ContentType': 'application/json'
        }
      });

       if (resp.status === 200 || 201 || 202) {
        tools.Logger.log(() => `[makeHttpRequest] - Fetch data Success: ${JSON.stringify(resp.status)}`);

        return resp.data
      } else {
        tools.Logger.error(() => 
          `[BotEngine].httpPostRequest - Error while fetching data. CODE :: ${JSON.stringify(resp.status)} - ${JSON.stringify(resp.data)}`);
      }

  }
}