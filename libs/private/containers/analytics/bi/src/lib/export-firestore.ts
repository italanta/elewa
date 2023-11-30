import * as express from "express";
import { exec } from 'child_process';

import { collectionIds } from './collection-ids';

const app = express();
const port = process.env.PORT || 8080;
const project = process.env.PROJECT || 'default';

app.get('/', (req, res) => {
    const bucketName = 'analytics-bi';

    const command = `gcloud firestore export gs://${bucketName}/${project}/export-${Date.now()} --collection-ids=${collectionIds.join(',')}`;

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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
