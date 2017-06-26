import {Component} from '@angular/core';
import 'rxjs/observable/interval';
import {Observable, Subscription} from 'rxjs/Rx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public tiles = [];
  public knightCurrentPos: { x, y };

  public automate$: Observable<any>;
  public automateSubscription: Subscription;

  constructor() {
    this.resetTour();
    this.automate$ = Observable
      .interval(500)
      .timeInterval()
      .take(64);
  }

  knightIsHere(tile: Tile) {
    return tile.x === this.knightCurrentPos.x && tile.y === this.knightCurrentPos.y;
  }

  isBetweenZeroAndSeven(input) {
    return input >= 0 && input <= 7;
  }

  calculateNextPossibleMoves(tile: Tile): number {
    let count = 0;
    for (let x = -2; x < 3; x++) {
      for (let y = -2; y < 3; y++) {
        if (x !== 0 && y !== 0 && Math.abs(x) !== Math.abs(y)) {
          const posX = tile.x + x;
          const posY = tile.y + y;
          if (this.isBetweenZeroAndSeven(posX) && this.isBetweenZeroAndSeven(posY)) {
            if (!this.tiles[posX][posY].isVisited) {
              count++;
            }
          }
        }

      }
    }
    return count;
  }


  getPossibleMovesOfKnight() {
    this.resetTiles();
    const possibleTileList = [];
    for (let x = -2; x < 3; x++) {
      for (let y = -2; y < 3; y++) {
        if (x !== 0 && y !== 0 && Math.abs(x) !== Math.abs(y)) {
          const posX = this.knightCurrentPos.x + x;
          const posY = this.knightCurrentPos.y + y;
          if (this.isBetweenZeroAndSeven(posX) && this.isBetweenZeroAndSeven(posY) && !this.tiles[posX][posY].isVisited) {
            this.tiles[posX][posY].isNextPossible = true;
            this.tiles[posX][posY].nextPossibleMoves = this.calculateNextPossibleMoves(this.tiles[posX][posY]);
            possibleTileList.push(this.tiles[posX][posY]);
          }
        }

      }
    }
    return possibleTileList;

  }

  moveKnight() {

    const possibleMoves = this.getPossibleMovesOfKnight().reduce((prev, curr) => {
      return prev.nextPossibleMoves < curr.nextPossibleMoves ? prev : curr;
    });
    this.setKnightPosition(possibleMoves.x, possibleMoves.y);
    const nextMove = this.getPossibleMovesOfKnight().reduce((prev, curr) => {
      return prev.nextPossibleMoves < curr.nextPossibleMoves ? prev : curr;
    });
    nextMove.isNext = true;
  }

  resetTiles() {
    this.tiles.forEach(x => x.forEach(y => {
      y.isNextPossible = false;
      y.nextPossibleMoves = 0;
    }));
  }

  setKnightPosition(x, y) {
    if (this.knightCurrentPos.x === x && this.knightCurrentPos === y) {
      alert('foul');
    }
    this.knightCurrentPos.x = x;
    this.knightCurrentPos.y = y;
    this.tiles[x][y].isVisited = true;
  }

  automateMoveKnight() {
    this.automateSubscription = this.automate$.subscribe(() => this.moveKnight());
  }

  resetTour() {
    if (this.automateSubscription) {
      this.automateSubscription.unsubscribe();
    }
    // initialize the array
    this.tiles = [];
    for (let i = 0; i < 8; i++) {
      const temp = [];
      for (let j = 0; j < 8; j++) {
        const tile = new Tile(i, j);
        temp.push(tile);
      }
      this.tiles.push(temp);
    }

    // initalize knight Position
    this.knightCurrentPos = {
      x: 0, y: 0
    };

    this.tiles[this.knightCurrentPos.x][this.knightCurrentPos.y].isVisited = true;

    const firstPossible = this.getPossibleMovesOfKnight().reduce((prev, curr) => {
      return prev.nextPossibleMoves < curr.nextPossibleMoves ? prev : curr;
    });
    firstPossible.isNext = true;
  }
}


export class Tile {
  public x: number;
  public y: number;
  public isVisited: boolean;
  public isNextPossible: boolean;
  public nextPossibleMoves: number;
  public isNext: boolean;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
