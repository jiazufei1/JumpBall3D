
import { _decorator, Component, Node, RigidBody ,Vec3, Collider} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {

    private initSpeed = 0



    onLoad(){
        let collider = this.getComponent(Collider)
        if(collider){
            //绑定碰撞回调事件
            collider.on('onCollisionEnter',this.onCollisionEnter,this)
        }
    }
    //碰撞回调
    onCollisionEnter(){
        console.log('碰撞回调')
        this.bounce()
    }

    //碰撞处理函数
    bounce(){
        let rigidBody = this.node.getComponent(RigidBody)
        if (this.initSpeed == 0){
            if(rigidBody){
                let vc = new Vec3(0,0,0);
                //拿到碰撞时向上的速度
                rigidBody.getLinearVelocity(vc);
                this.initSpeed = vc.y
            }
        } else {
            if(rigidBody){
                rigidBody.setLinearVelocity(new Vec3(0,this.initSpeed,0))
            }
        }
    }

    //小球向下加速
    boost(){
    let rigidBody = this.node.getComponent(RigidBody)

    if  (rigidBody){
        console.log('加速')
        rigidBody.setLinearVelocity(new Vec3(0,-4,0))

    }
   }
}


