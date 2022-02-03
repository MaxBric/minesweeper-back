// Products Model
export interface Game {
  tiles: Tile[];
  isFinished: boolean;
  isWon: boolean;
  gameParams: GameParams;
}

export interface GameParams {
  colsNumber: number;
  rowsNumber: number;
  bombsNumber: number;
}

export interface Tile {
  x: number;
  y: number;
  isRevealed: boolean;
  isABomb: boolean;
  numberOfBombsAround?: number;
}

const currentGame: Game = {
  tiles: [],
  isFinished: true, // Starts finish
  isWon: false,
  gameParams: {} as GameParams
}

export const getCurrentGame = (): Game => {
  return currentGame;
}

export const generateGame = (gameParams: GameParams): Game => {
  currentGame.gameParams = gameParams;
  currentGame.tiles = [];
  currentGame.isFinished = false;

  // Generate tiles
  for (let rowIdx = 0; rowIdx < gameParams.rowsNumber; rowIdx++) {
    for (let colIdx = 0; colIdx < gameParams.colsNumber; colIdx++) {
      let field: Tile = {
        x: rowIdx,
        y: colIdx,
        isRevealed: false,
        isABomb: false,
      };

      currentGame.tiles.push(field);
    }
  }

  generateBombs();

  return currentGame;
}

export const handleTileClick = (position: { x: number, y: number }): Game | any => {
  const clickedTile = currentGame.tiles.find(tile => {
    return (tile.x === position.x && tile.y === position.y);
  })

  if (clickedTile) {
    currentGame.isFinished = clickedTile.isABomb;
    currentGame.isWon = (currentGame.tiles.filter(tile => !tile.isRevealed && tile.isABomb).length === currentGame.tiles.filter(tile => !tile.isRevealed).length)
      && (currentGame.tiles.filter(tile => !tile.isRevealed).length === currentGame.gameParams.bombsNumber);

    clickedTile.isRevealed = true;
    clickedTile.numberOfBombsAround = calculateNumberOfBombsAround(clickedTile);

    if (clickedTile.numberOfBombsAround > 0) {
      return currentGame;
    } else {
      const neighbors = getNeighbors(clickedTile);
      neighbors.forEach(neighbor => {
        if (!neighbor.isRevealed) {
          return handleTileClick({ x: neighbor.x, y: neighbor.y });
        }
      })
    }

    return currentGame;
  }
}

const generateBombs = (): void => {
  const tilesCopy = [ ...currentGame.tiles.filter(tile => !tile.isABomb) ]; // Filter tiles without bombs

  for (let bombIdx = 0; bombIdx < currentGame.gameParams.bombsNumber; bombIdx++) {
    const randomIdx = Math.floor(Math.random() * tilesCopy.length); // Generate a random index to place bomb
    const tileToUpdate = currentGame.tiles.find(tile => {
      return tile.x === tilesCopy[randomIdx].x && tile.y === tilesCopy[randomIdx].y
    });

    if (tileToUpdate) {
      tileToUpdate.isABomb = true;
      tilesCopy.slice(randomIdx, 1);
    } else {
      bombIdx--;
    }
  }
}

const getNeighbors = (tile: Tile): Tile[] => {
  const neighbors: Tile[] = [];

  const neighborsCoords = [
    { x: tile.x - 1, y: tile.y - 1 },
    { x: tile.x, y: tile.y - 1 },
    { x: tile.x + 1, y: tile.y - 1 },
    { x: tile.x - 1, y: tile.y },
    { x: tile.x + 1, y: tile.y },
    { x: tile.x - 1, y: tile.y + 1 },
    { x: tile.x, y: tile.y + 1 },
    { x: tile.x + 1, y: tile.y + 1 },
  ];

  neighborsCoords.map(coords => {
    const foundTile = currentGame.tiles.find(tile => tile.x === coords.x && tile.y === coords.y);
    if (foundTile) neighbors.push(foundTile);
  })

  return neighbors;
}

const calculateNumberOfBombsAround = (tile: Tile): number => {
  const neighbors = getNeighbors(tile);

  return neighbors.filter(neighbor => {
    return neighbor.isABomb;
  }).length;
}
