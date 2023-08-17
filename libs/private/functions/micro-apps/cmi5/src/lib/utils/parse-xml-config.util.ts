import * as fs from 'fs';

import { XMLParser } from "fast-xml-parser";

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