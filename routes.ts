// Routes
import { Router } from 'express'
import { GameParams, generateGame, handleTileClick } from './models/Game'

const router = Router();

router.get('/', (req, res, next) => {
  res.send('Welcome')
});

// Products routes
router.post('/game', (req, res, next) => {
  const gameParams: GameParams = req.body?.gameParams;

  if (gameParams && (gameParams.colsNumber * gameParams.rowsNumber) > gameParams.bombsNumber) {
    res.json(generateGame(gameParams));
  } else {
    res.json({ error: 'Please provide valid cols, rows and bombs parameters' });
  }
});

router.post('/play', (req, res, next) => {
  const position: { x: number, y: number } = req.body?.position;

  if (position) {
    res.json(handleTileClick(position));
  } else {
    res.json({ error: 'Please provide position parameters' });
  }
});

export default router;
