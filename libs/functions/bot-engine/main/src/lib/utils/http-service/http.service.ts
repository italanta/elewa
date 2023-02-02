import axios, { Axios } from "axios";

import { HandlerTools } from "@iote/cqrs";
import { HttpStatusCode } from "@angular/common/http";

export class HttpService
{
  public async post(URL: string, dataPayload: any, tools: HandlerTools)
  {
    const payload = { data: dataPayload || {} };

    tools.Logger.log(() => `[HttpService].post - Attempting to post: ${JSON.stringify(payload)}`);

    const resp = await axios.post(URL, payload, {
      headers: {
        'ContentType': 'application/json'
      }
    });

    if (resp.status < 300) {
      tools.Logger.log(() => `[HttpService].post - Response: ${JSON.stringify(resp.status)}`);
      tools.Logger.log(() => `[HttpService].post - Post data Success: ${JSON.stringify(resp.data)}`);
      return resp.data;
    } else {
      tools.Logger.log(() => `[HttpService].post - Response: ${JSON.stringify(resp.status)}`);
      tools.Logger.error(() =>
        `[BotEngine].httpPostRequest - Error while posting data: ${JSON.stringify(resp.data)}`);
    }
  }

  public async get(URL: string, tools: HandlerTools)
  {

    tools.Logger.log(() => `[HttpService].get - Attempting to fetch Data`);

    const resp = await axios.get(URL, {
      headers: {
        'ContentType': 'application/json'
      }
    });

    if (resp.status < 300) {

      tools.Logger.log(() => `[HttpService].get - Response: ${JSON.stringify(resp.status)}`);
      tools.Logger.log(() => `[HttpService].get - Fetch data Success: ${JSON.stringify(resp.status)}`);

      return resp.data;
    } else {
      tools.Logger.log(() => `[HttpService].get - Response: ${JSON.stringify(resp.status)}`);
      tools.Logger.error(() =>
        `[HttpService].get - Error while fecthing data: ${JSON.stringify(resp.data)}`);
    }

  }
}