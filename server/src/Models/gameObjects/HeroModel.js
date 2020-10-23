import BaseObject from './BaseObject.js';

export default class Hero extends BaseObject{
  constructor(username) {
    super('hero');
    this.username = username;
  }
}