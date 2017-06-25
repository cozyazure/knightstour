import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public tiles = [];
  public knightCurrentPos = {
    x: 7,
    y: 0
  }

  constructor() {
    for (let i = 0; i < 8; i++) {
      const temp = [];
      for (let j = 0; j < 8; j++) {
        const tile = new Tile(i, j);
        temp.push(tile);
      }
      this.tiles.push(temp);
    }

  }

  knightIsHere(tile: Tile) {
    return tile.x === this.knightCurrentPos.x && tile.y === this.knightCurrentPos.y;
  }
}


export class Tile {
  public x: number;
  public y: number;
  public isVisited: boolean;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
