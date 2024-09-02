
import { WFlow } from "@app/model/convs-mgr/stories/flows";
import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';



export class SendWhatsAppJsonHandler extends FunctionHandler<any, any> {
  public override execute(data: WFlow, context: FunctionContext, tools: HandlerTools): Promise<any> 
  {
    const base_url= ''

    const flowsRepo = tools.getRepository<WFlow>(`whatsappFlows`);
    flowsRepo.create(data)
  }
}
