// Routes
import { Router } from 'express'

const router = Router();

import { GameParams, generateGame, handleTileClick } from './models/Game'

router.get('/', (req, res, next) => {
  res.send('Welcome')
});

// Products routes
router.post('/game', (req, res, next) => {
  const gameParams: GameParams = req.body?.gameParams;
  console.log(req.body)

  if (gameParams) {
    res.json(generateGame(gameParams));
  } else {
    res.json({ error: 'Please provide cols, rows and bombs parameters' });
  }
});

router.post('/play', (req, res, next) => {
  const position: { x: number, y: number } = req.body?.position;
  console.log(req.body)

  if (position) {
    res.json(handleTileClick(position));
  } else {
    res.json({ error: 'Please provide position parameters' });
  }
});


export default router;
