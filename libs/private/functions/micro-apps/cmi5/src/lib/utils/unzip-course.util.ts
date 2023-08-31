import * as unzipper from "unzipper";

import { HandlerTools } from "@iote/cqrs";

/**
 * Unzips the course package and saves the contents to firebase storage.
 * 
 * Resolves the promise as soon as the manifest is extracted so that we 
 *  can parse and process it as the extraction continues.
 */
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