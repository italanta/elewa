import { RestRegistrar } from "@ngfi/functions";

import { InitMicroAppHandler } from "@app/private/functions/micro-apps/base";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new InitMicroAppHandler();

export const initMicroApp = new ConvLearnFunction('initMicroApp', 
                                                  new RestRegistrar('asia-south1'), 
                                                  [], 
                                                  handler)
                               .build();
                               