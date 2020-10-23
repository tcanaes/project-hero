import BaseObject from './BaseObject.js';

export default class Map extends BaseObject{
  constructor(area) {
    super('map');
    this.imgName = 'map.png',
    this.dimensions = {
      startX: area.startX,
      startY: area.startY,
      endX: area.endX,
      endY: area.endY,
      width: area.endX,
      height: area.endY,
    }
  }
}