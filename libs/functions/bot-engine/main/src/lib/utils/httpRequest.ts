import axios, { AxiosResponse } from "axios";

import { HandlerTools } from "@iote/cqrs";

export async function makeHttpRequest(URL: string, data: any, tools: HandlerTools)
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

    return response;
    
  } catch (error) {
    tools.Logger.error(() => `[makeHttpRequest] - Error while posting data: ${error}`);
  }
}
