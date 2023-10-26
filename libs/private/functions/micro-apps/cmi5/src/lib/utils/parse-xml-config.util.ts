import * as fs from 'fs';

import { XMLParser } from "fast-xml-parser";

/**
 * Uses fast-xml-parser to parse the xml file and returns
 *  an object in the structure of the xml
 * 
 * @see https://www.npmjs.com/package/fast-xml-parser
 */
export function parseXMLConfig(filePath: string)
{
  const data = fs.readFileSync(filePath, 'utf8');

  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: ""
  };

  const xmlParser = new XMLParser(options);

  const manifestData = xmlParser.parse(data);

  return manifestData.courseStructure;

}