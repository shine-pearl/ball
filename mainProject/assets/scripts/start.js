let flag = true;
cc.Class({
    extends: cc.Component,

    properties: {
        startBtn: cc.Node,
        setBtn: cc.Node,
        setBox: cc.Node,
        closeBtn: cc.Node,
        moreBtn: cc.Node,
        moreWrap: cc.Prefab,
        ruleBtn: cc.Node,
        ruleWrap: cc.Node,
        // ruleClose:cc.Node,
        content: cc.Node,


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let that = this;
        this.startBtn.on("touchstart", function (ev) {
            if( flag){
                 cc.director.loadScene("game")
            }else{
                flag = false;
            }
           
        });
        this._isShow = false;
        this.setBox.y = 1800;
        var showAction = cc.moveTo(0.3, 0, 0);
        var hideAction = cc.moveTo(0.3, 0, 1800);
        this.setBtn.on("touchstart", function (params) {
            that.setBox.runAction(showAction);
        })
        this.closeBtn.on("touchstart", function (params) {
            that.setBox.runAction(hideAction);
        })
     

    },

    start() {
         this.moreFunc();
         this.ruleFunc();
    },
    moreFunc() {
        let that = this;
        //  更多游戏
        let moreWrap = cc.instantiate(this.moreWrap)
        this.content.addChild(moreWrap);
        let showMoreAction = cc.moveTo(0.3, 0, 0);
        let hideMoreAction = cc.moveTo(0.3, -(moreWrap.width / 2 + cc.winSize.width), 0);
        this.moreBtn.on("touchstart", function (params) {
            that.moreBtn.active = false;
            moreWrap.active = true;
            moreWrap.getChildByName("content").runAction(showMoreAction)

        })
        moreWrap.getChildByName("content").getChildByName("close").on("touchstart", function (params) {
            moreWrap.getChildByName("content").runAction(cc.sequence(hideMoreAction, cc.callFunc(function (params) {
                that.moreBtn.active = true;
                moreWrap.active = false;
            })))

        })
    },
    ruleFunc() {
        let that = this;
        //  规则
        let showRuleAction = cc.moveTo(0.3, 0, 0);
        let hideRuleAction = cc.moveTo(0.3, this.ruleWrap.width / 2 + cc.winSize.width, 0);
       
        this.ruleBtn.on(cc.Node.EventType.TOUCH_START, function (params) {
            that.ruleBtn.active = false;
            that.ruleWrap.active = true;
            that.ruleWrap.getChildByName("content").runAction(showRuleAction)

        })

       this.ruleWrap.getChildByName("mask").on(cc.Node.EventType.TOUCH_START, function (e) {
           cc.log('touch')
            that.ruleWrap.getChildByName("content").runAction(cc.sequence(hideRuleAction, cc.callFunc(function (params) {
                that.ruleBtn.active = true;
                that.ruleWrap.active = false;
            })))

        })
    },
    onEnable(){
        cc.log(this.ruleWrap)
       
    }
    // update (dt) {},
});