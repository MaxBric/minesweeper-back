import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import router from './routes'

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);
console.log(process.env);
app.listen(process.env.PORT, () => {
  console.log(`Minesweeper api listening at http://localhost:${process.env.PORT}`)
});