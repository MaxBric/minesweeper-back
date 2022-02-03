// Products Model
export interface Game {
  tiles: Tile[];
  isFinished: boolean
  gameParams: GameParams
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
  gameParams: {} as GameParams
}

export const getCurrentGame = (): Game => {
  return currentGame;
}

export const generateGame = (gameParams: GameParams): Game => {
  currentGame.gameParams = gameParams;
  currentGame.tiles = [];

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
  currentGame.isFinished = false;

  return currentGame;
}

export const handleTileClick = (position: { x: number, y: number }): Game | any => {
  const clickedTile = currentGame.tiles.find(tile => {
    return (tile.x === position.x && tile.y === position.y);
  })

  if (clickedTile) {
    clickedTile.isRevealed = true;

    if (clickedTile.isABomb) currentGame.isFinished = true;

    clickedTile.numberOfBombsAround = calculateNumberOfBombsAround(clickedTile);

    return currentGame;

    // if (clickedTile.numberOfBombsAround > 0) {
    //   return currentGame;
    // } else {
    //   const neighbors = getNeighbors(clickedTile);
    //   neighbors.forEach(neighbor => {
    //     if (!neighbor.isRevealed) {
    //       handleTileClick({ x: neighbor.x, y: neighbor.y });
    //     }
    //   })
    // }
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
  return [];
}

const calculateNumberOfBombsAround = (tile: Tile): number => {
  const neighbors = getNeighbors(tile);

  return neighbors.filter(neighbor => {
    return neighbor.isABomb;
  }).length;
}
