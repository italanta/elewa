import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";

export function CleanPayload(formData: any) {
  formData.content.header.examples = formData.headerExamples;
  formData.content.body.examples = formData.bodyExamples;

  delete formData.headerExamples;
  delete formData.bodyExamples;

 return formData as TemplateMessage;
}