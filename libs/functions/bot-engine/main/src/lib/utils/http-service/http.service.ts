import axios, { Axios } from "axios";

import { HandlerTools } from "@iote/cqrs";

/**
 * TODO: @Reagan - Move this to functions/base/utils folder
 */
export class HttpService
{
  public async post(URL: string, dataPayload: any, tools: HandlerTools, accessToken?: string)
  {
    const payload = { data: dataPayload || {} };

    tools.Logger.log(() => `[HttpService].post - Attempting to post: ${JSON.stringify(payload)}`);

    const headers = {
      'ContentType': 'application/json'
    }

    if(accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const resp = await axios.post(URL, payload, {
      headers: headers
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

  /**
   * Doesn't place the payload in a data object
   */
  async httpPost(URL: string, payload: any, accessToken: string, tools: HandlerTools) {

    tools.Logger.log(() => `[HttpService].post - Attempting to post: ${JSON.stringify(payload)}`);
  
    const headers = {
      'ContentType': 'application/json'
    }
  
    if(accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
  
    const resp = await axios.post(URL, payload, {
      headers: headers
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

  public async get(URL: string, tools: HandlerTools, accessToken?: string)
  {

    tools.Logger.log(() => `[HttpService].get - Attempting to fetch Data`);

    const headers = {
      'ContentType': 'application/json'
    }

    if(accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const resp = await axios.get(URL, {
      headers: headers
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

  public async delete(URL: string, tools: HandlerTools, accessToken?: string)
  {

    tools.Logger.log(() => `[HttpService].get - Attempting to fetch Data`);

    const headers = {
      'ContentType': 'application/json'
    }

    if(accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const resp = await axios.delete(URL, {
      headers: headers
    });

    if (resp.status < 300) {

      tools.Logger.log(() => `[HttpService].get - Response: ${JSON.stringify(resp.status)}`);
      tools.Logger.log(() => `[HttpService].get - Delete data Success: ${JSON.stringify(resp.status)}`);

      return resp.data;
    } else {
      tools.Logger.log(() => `[HttpService].get - Response: ${JSON.stringify(resp.status)}`);
      tools.Logger.error(() =>
        `[HttpService].get - Error while deleting data: ${JSON.stringify(resp.data)}`);
    }

  }
}