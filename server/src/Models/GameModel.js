import Hero from './gameObjects/HeroModel.js';
import Map from './gameObjects/MapModel.js';

class Game {
  constructor() {
    console.log('--> Game.constructor');

    //Area of the game. Supposed be the same as the MAP SIZE
    this.area = {
      startX: 0,
      startY: 0,
      endX: 3200,
      endY: 2400,
    };

    this.players = [];

    this.gameObjects = [];
    this.gameObjects.push(new Map(this.area));
  }

  playerJoin = (username) => {
    console.log('--> Game.playerJoin');
    /* check if player in game */
    let player = this.players.find((player) => player.username === username);

    /*if it doesnt exist, create a new player instance for this user*/
    if (!player) {
      player = {
        username,
        hero: new Hero(username),
      };
    }
    this.players.push(player);
    this.gameObjects.push(player.hero);
    return true;
  };

  playerDisconnect = (username) => {
    console.log('--> Game.playerDisconnect');
    const player = this.players.find((player) => player.username === username);
    if (player) {
      this.gameObjects = this.gameObjects.filter((object) => {
        if (!object.username) return true; //Check it has a username attribute
        if (object.username !== player.username) return true; //check its the username to remove
        return false;
      });
      this.players = this.players.filter(
        (player) => player.username !== username
      );
    }
  };
}

const game = new Game();
export default game;
