import express, { Application } from 'express';

const application: Application = express();
const PORT_HTTP_SERVER: number = 8000 || process.env.PORT_HTTP_SERVER;

application.listen(PORT_HTTP_SERVER, (): void => {
  console.log('teste');
});
