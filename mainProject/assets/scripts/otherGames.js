var otherGames = [
    [{
            name: "愤怒的小兔",
            url: "otherGames/rabbit",
            appid: 'wxba7bd2e33d7964ca'
        },
        {
            name: "福益多",
            url: "otherGames/fyd",
            appid: 'wx35ebfea01d98c14e'
        },
        {
            name: "恐龙酷跑",
            url: "otherGames/klkp",
            appid: 'wxf1439517533e8128'
        },
        {
            name: "快来划水",
            url: "otherGames/klhs",
            appid: 'wx34179a03db78feb9'
        }
    ],
    [{
            name: "球球刷一刷",
            url: "otherGames/qqsys",
            appid: 'wxf776796a50b65cd9'
        },
        {
            name: "新时代捕鱼",
            url: "otherGames/xsdby",
            appid: 'wx848a75d8e44f5379'
        },
        {
            name: "围城大作战",
            url: "otherGames/wcdzz",
            appid: 'wxea6e659fdde0fb68'
        },
        {
            name: "快来划水",
            url: "otherGames/klhs",
            appid: 'wx34179a03db78feb9'
        }
    ],
    [{
            name: "球球刷一刷",
            url: "otherGames/qqsys",
            appid: 'wxf776796a50b65cd9'
        }, {
            name: "新时代捕鱼",
            url: "otherGames/xsdby",
            appid: 'wx848a75d8e44f5379'
        },
        {
            name: "围城大作战",
            url: "otherGames/wcdzz",
            appid: 'wxea6e659fdde0fb68'
        },
        {
            name: "恐龙酷跑",
            url: "otherGames/klkp",
            appid: 'wxf1439517533e8128'
        }
    ]
]

cc.Class({
    extends: cc.Component,

    properties: {
        listBox: cc.Node,
        item: cc.Prefab,
        gameNode: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        for (let i = 0; i < otherGames.length; i++) {

            let newItem = cc.instantiate(this.item)
            for (var j = 0; j < otherGames[i].length; j++) {
                let newGameNode = cc.instantiate(this.gameNode);
                cc.loader.loadRes(otherGames[i][j].url, cc.SpriteFrame, function (err, spriteFrame) {
                    if (err) {
                        return false;
                    } else {
                        newGameNode.getChildByName("gameLogo").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    }

                })
                newGameNode.getChildByName("gameName").getComponent(cc.Label).string = otherGames[i][j].name;
                newGameNode.appid = otherGames[i][j].appid;
                newGameNode.on(cc.Node.EventType.TOUCH_START, function (event) {
                    if (typeof wx === 'undefined') {
                        console.log("s")
                        return;
                    } else {
                        wx.navigateToMiniProgram({
                            appId: newGameNode.appid,
                            success(res) {
                                // 打开成功
                                console.log(打开成功)
                            },
                            fail(err) {
                                console.log(err)
                            }
                        })
                    }

                })
                newItem.addChild(newGameNode);
            }
            this.listBox.addChild(newItem)

        }


    },

    start() {

    },

    // update (dt) {},
});