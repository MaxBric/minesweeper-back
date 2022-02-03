import express from 'express'
import cors from 'cors'

import router from './routes'

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.listen(3001, () => {
  console.log(`Minesweeper api listening at http://localhost:3001`)
});