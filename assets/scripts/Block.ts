
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
  init(width:number,y_offset:number = 0){
      let scale = this.node.getScale()
      this.node.setScale(width,scale.y,scale.z)

      let pos = this.node.position
      this.node.setPosition(pos.x,y_offset,pos.z)
  }
}


