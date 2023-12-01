import * as express from "express";
import { exec } from 'child_process';

import { collectionIds } from './collection-ids';
import { sleep } from "./utils/sleep";

const app = express();
const port = process.env.PORT || 8080;
const project = process.env.PROJECT || 'default';

app.get('/', (req, res) => {
    const bucketName = 'analytics-bi';

    const command = `gcloud firestore export gs://${bucketName}/${project}/exports --collection-ids=${collectionIds.join(',')}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            res.status(500).send(`Error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.send(`Export started: ${stdout}`);
    });
});

app.get('/load', async (req, res) => {
    const projectName = process.env.PROJECT || 'default';

    const BUCKET_NAME = 'analytics-bi';

    // Check if projectName is provided
    if (!projectName) {
        res.status(400).send('Project name is required');
        return;
    }

    // Loop through each collectionId
    for (const collectionId of collectionIds) {
        const collection = collectionId;
        const table = `${projectName}_${collection}`;
        const exportFile = `${projectName}/exports/all_namespaces/kind_${collection}/all_namespaces_kind_${collection}.export_metadata`;
        const source = `gs://${BUCKET_NAME}/${exportFile}`;
        const command = `bq --location=asia-south1 load  --replace --source_format=DATASTORE_BACKUP goomza_bi_analysis.${table} ${source} &`;

        try {
            await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error with collection ${collection}: ${error}`);
                        reject(error);
                        return;
                    }
                    console.log(`stdout for collection ${collection}: ${stdout}`);
                    resolve(stdout);
                });
            });

            await sleep(2000); // Wait for 2 seconds
        } catch (error) {
            res.status(500).send(`Error with collection ${collection}: ${error}`);
            return;
        }
    }

    // Wait for 2 seconds before running next command
    await sleep(2000);
    
    // Remove exports folder after loading the data to big query
    const removeFolder = `gsutil rm -r gs://${BUCKET_NAME}/${projectName}/exports`;

    exec(removeFolder, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            res.status(500).send(`Error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.send(`Delete started: ${stdout}`);
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});