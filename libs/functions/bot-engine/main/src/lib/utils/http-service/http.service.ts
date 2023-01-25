import axios, { AxiosResponse } from "axios";

import { HandlerTools } from "@iote/cqrs";

export class HttpService
{
  public async post(URL: string, data: any, tools: HandlerTools)
  {
    const payload = { data: data };

    tools.Logger.log(() => `[makeHttpRequest] - Data to post: ${JSON.stringify(payload)}`);

    try {
      let response = await axios.post(URL, payload, {
        headers: {
          'ContentType': 'application/json'
        }
      });
      response = response as AxiosResponse;

      if (response.status === 200 || 201 || 202) tools.Logger.log(() => `[makeHttpRequest] - Post data Success: ${JSON.stringify(response)}`);

      return response.status;

    } catch (error) {
      tools.Logger.error(() => `[BotEngine].httpPostRequest - Error while posting data: ${error}`);
    }
  }

  public async get(URL: string, tools: HandlerTools)
  {

    tools.Logger.log(() => `[BotEngine].httpGetRequest - Attempting to fetch Data`);

    try {
      let response = await axios.get(URL, {
        headers: {
          'ContentType': 'application/json'
        }
      });
      response = response as AxiosResponse;

      if (response.status === 200 || 201 || 202) tools.Logger.log(() => `[BotEngine].httpGetRequest - Fetch data Success: ${JSON.stringify(response)}`);

      return response.data;

    } catch (error) {
      tools.Logger.error(() => `[BotEngine].httpGetRequest - Error while fetching data: ${error}`);
    }
  }
}