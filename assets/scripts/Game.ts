
import { _decorator, Component, Node, systemEvent, RigidBody, Vec3, Prefab, instantiate, TERRAIN_DATA_VERSION3, Director, Label, Camera, SystemEventType, EventKeyboard, macro } from 'cc';
import { Ball } from './Ball';
import { Block } from './Block';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(Node)
    private ballNode: Node = null!
    @property(Prefab)
    private blockPrefab: Prefab = null!
    @property(Label)
    private scoreLabel:Label = null!

    //如果不需要对外绑定，所以这里不需要property关键字
    private blockNodeArr: Node[] = [];
    private lastBlockNode: Node = null! //当前场景中最后一块跳板
    //标记游戏状态 
    private gameState: number = 0  //0:等待状态，1:游戏开始 2:游戏结束
    //初试分数
    private score :number = 0

    @property(Camera)
    private camera_1:Camera = null!
    
    @property(Camera)
    private camera_2:Camera = null!


    onLoad() {
        systemEvent.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        systemEvent.on(SystemEventType.KEY_DOWN,this.onKeyDown, this)
        //初始化跳板
        this.initBlock()
    }

    update(dt: number) {
        if (this.gameState == 1) {

            if(this.ballNode.getPosition().y <-4){
                console.log('小球坠落游戏结束')
                this.gameState = 2;
                Director.instance.loadScene('Game')
                return
            }

            //移动速度
            let speed = -2 * dt //每秒移动2个单位， dt =0.01 根据帧率计算

            for (let blockNode of this.blockNodeArr) {
                let nowPos = blockNode.getPosition()
                let nextX = nowPos.x += speed
                //跳板移除屏幕外，进行循环滚动
                if (nextX <= -2) {
                    //得分增加
                    this.incrScore(1)
                    blockNode.setPosition(this.lastBlockNode.getPosition().x + 2,nowPos.y,nowPos.z)
                    this.lastBlockNode = blockNode

                    let block = blockNode.getComponent('Block') as Block
                    block.init(0.5+0.6 * Math.random(),(Math.random() >0.5?1:-1)*(Math.random()*0.5))
                }else{
                    blockNode.setPosition(nextX,nowPos.y,nowPos.z)
                }
            }
        }
    }


    onTouchStart() {
        let ball = this.ballNode.getComponent('Ball') as Ball;
        ball.boost()
        if (this.gameState == 0) {
            this.gameState = 1;
        }
    }


    onKeyDown(event:EventKeyboard){
        switch(event.keyCode){
            case macro.KEY.space:{
                this.switchCamera()
                break
            }
        }
    }
    //切换摄像机
    switchCamera(){
        if (this.camera_1.node.active){
            this.camera_1.node.active = false
            this.camera_2.node.active = true
        }else{
            this.camera_1.node.active = true
            this.camera_2.node.active = false
        }
    }

    //初始化跳板
    initBlock() {
        for (let i = 0; i < 5; i++) {
            let blockNode = instantiate(this.blockPrefab)
            this.node.addChild(blockNode) //添加节点
            this.blockNodeArr.push(blockNode)//储存节点

            blockNode.setPosition(new Vec3(i * 2, 0, 0))

        }

        this.lastBlockNode = this.blockNodeArr[this.blockNodeArr.length - 1]
    }

    //得分增加
    incrScore(incr:number){
        this.score += incr
        this.scoreLabel.string = String(this.score)
    }
}

