import express, { Application } from 'express';

const app: Application = express();
const PORT = 3000;

app.listen(PORT, (): void => {
  console.log(`Running on Port ${PORT}`);
});
