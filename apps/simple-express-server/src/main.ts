/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 * 
 * Nx+Docker
 * https://blog.nrwl.io/nx-and-node-microservices-b6df3cd1bad6
 */

import * as express from 'express';

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to simple-express-server!' });
});

const port = process.env.port || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
