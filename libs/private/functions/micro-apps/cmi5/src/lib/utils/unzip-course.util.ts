import { Storage } from '@google-cloud/storage';
import * as unzipper from "unzipper";

import { HandlerTools } from "@iote/cqrs";

export function UnzipCourse(extractDest: string, srcBucket: any, savedFilePath: string, tools: HandlerTools): Promise<boolean>
{
  const zippedCMI5 = srcBucket.file(savedFilePath);

  return new Promise((resolve, reject) =>
  {
    zippedCMI5.createReadStream()
      .pipe(unzipper.Parse())
      .on("entry", function (entry)
      {
        const filePath = entry.path;
        const type = entry.type;

        tools.Logger.log(() => `Found ${type}: ${filePath}`);

        const gcsDstObject = srcBucket.file(`${extractDest}/${filePath}`);

        entry
          .pipe(gcsDstObject.createWriteStream())
          .on('error', function (err: any)
          {
            tools.Logger.log(() => `File Error: ${JSON.stringify(err)}`);

            reject(false);
          })
          .on('finish', function ()
          {
            tools.Logger.log(() => `File Extracted: ${filePath}`);

            if (filePath === 'cmi5.xml') {

              tools.Logger.log(() => `Manifest extracted....`);

              resolve(true);
            }
          });
      });
  });

}