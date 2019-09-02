  const MIN_LENGTH = 50; //手指滑动最小长度
  const MAX_LEVEL = 24;
  var step = require("step");
  let gameData;
  let shareTime = 0;
  let ballData = [];
  let startTime = null;
  let endTime = null;
  let gameTag = false;

  cc.Class({
      extends: cc.Component,
      properties: {
          bg: cc.Node,
          blockPrefab: cc.Prefab,
          ballPrefab: cc.Prefab,
          resetBtn: cc.Node,
          blocksNum: 5, //行数和列数
          gap: 2, //声明块之前间隔
          flag: true,
          panel: cc.Node,
          finishWrap: cc.Node,
          curLevel: 1,
          leveiTitle: cc.Label,
          allLevel: cc.Label,
          throuWrap: cc.Node,
          ballMusic: cc.AudioSource,
          backBtn: cc.Node,
          tipBtn: cc.Node,
          victoryMusic: cc.AudioSource,
          finger: cc.Node,
          failNode: cc.Node,
          timeFinishNode: cc.Node
      },

      // LIFE-CYCLE CALLBACKS:

      onLoad() {

          let that = this;
          if (this.isWeixn()) {
              this.curLevel = wx.getStorageSync('level') || 1;

          } else {
              this.curLevel = localStorage.getItem('level') || 1;
          }
          this.leveiTitle.string = "第" + this.curLevel + "关";

          this.drawBgBlocks(); //绘制网格

          cc.loader.loadRes("balls", function (err, res) {
              ballData = res.json;
          })
          cc.loader.loadRes('level', (err, res) => {
              if (err) {
                  return;
              } else {
                  let resData = res.json;
                  gameData = resData[this.curLevel - 1];
                  this.addBalls(gameData);

              }
          })


          //  重玩
          this.resetBtn.on(cc.Node.EventType.TOUCH_START, function (params) {
              if (typeof wx === 'undefined') {
                  localStorage.removeItem("shareTime")
              } else {
                  wx.removeStorageSync('shareTime')
              }

              that.init()
          })
          //   返回
          this.backBtn.on(cc.Node.EventType.TOUCH_START, function (params) {
              cc.director.loadScene("start")
          })
          //   提示
          this.tipBtn.on(cc.Node.EventType.TOUCH_START, (ev) => {
              that.init()
              gameTag = true;
              if (typeof wx === 'undefined') {
              } else {
                  wx.shareAppMessage({
                      title: "快来玩吧，好玩的游戏",
                      imageUrl: "https://w.xinbaad.com/ballShare.png"
                  })
                  startTime = new Date();
              }
          })
          console.log("curballs" + that.balls)
          //  计算分享的时间差
          if (typeof wx === 'undefined') {

          } else {

              wx.onShow(function () {
                 
                  endTime = new Date();
                  let distTime = parseInt((endTime - startTime) / 1000); //回到前台的时间差
                  if (that.balls) {
                      if (gameTag) {
                          gameTag = false;
                          if (distTime > 1.5) {

                              let totalTime = wx.getStorageSync("totalTime") || 0; //记录分享的总次数
                              let firstTime = wx.getStorageSync("firstTime") || 0; //记录分享的第一次时间
                              let timeDiff;
                              //    console.log("fisrtTime" + firstTime)
                              if (firstTime) {
                                  let curTime = new Date();
                                  let oldTime = new Date(firstTime)
                                  timeDiff = parseInt((curTime - oldTime)) / 1000/60/60;

                              } else {
                                  let curTime = new Date();
                                  wx.setStorageSync('firstTime', curTime);
                                  timeDiff = 0
                              }
                              //    console.log("时间差为" + timeDiff)
                              if (timeDiff > 12) {
                                  wx.setStorageSync('firstTime', new Date());
                                  wx.setStorageSync("totalTime", 0);
                              }
                              //    console.log("totalTime" + totalTime);
                              if (totalTime > 3) {
                                  console.log("不能再分享了")
                                  that.timeFinishNode.active = true;
                                  setTimeout(() => {
                                        that.timeFinishNode.active = false;
                                  }, 1500);
                              } else {

                                  wx.setStorageSync("totalTime", (parseInt(totalTime) + 1));
                                  shareTime = wx.getStorageSync('shareTime') || 0; //之前分享的次数
                                  let curlvel = wx.getStorageSync('level') || 1;
                                  //    console.log(curlvel)
                                  let curStep = step[parseInt(curlvel) - 1]; //计算当前关卡的总共步数
                                  //    console.log(curStep)
                                  if (shareTime >= curStep.length) {
                                      shareTime = curStep.length
                                  } else {
                                      shareTime = parseInt(shareTime) * 1 + 1;
                                  }
                                  wx.setStorageSync("shareTime", shareTime); //之前分享的次数+1
                                  let count = 0;

                                  function fn() {
                                      let stepNumber = [];
                                      stepNumber = curStep[count];
                                      console.log(that.balls)
                                      let moveNode = that.balls[stepNumber[0]][stepNumber[1]]
                                      let startPositon = that.positions[stepNumber[0]][stepNumber[1]];
                                      let endPosition = that.positions[stepNumber[2]][stepNumber[3]];
                                      if (shareTime > 1) {
                                          that.ballMove(moveNode, startPositon, endPosition)
                                          if (count < shareTime - 2) {
                                              setTimeout(function () {
                                                  count++;
                                                  fn()
                                              }, 1000)

                                          } else {
                                              setTimeout(function () {
                                                  let stepNumber = curStep[count + 1];
                                                  let startPositon = that.positions[stepNumber[0]][stepNumber[1]];
                                                  let endPosition = that.positions[stepNumber[2]][stepNumber[3]];
                                                  that.fingerMove(startPositon, endPosition)
                                              }, 1000)
                                          }
                                      } else {
                                          that.fingerMove(startPositon, endPosition)
                                      }

                                  }
                                  fn();
                              }

                          } else {
                                  that.failNode.active = true;
                                  setTimeout(() => {
                                      that.failNode.active = false;
                                  }, 1500);

                          }
                      }
                  }

              })
          }

      },
      showBack() {


      },



      isWeixn() {
          var ua = navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == "micromessenger") {
              return true;
          } else {
              return false;
          }
      },
      fingerMove(startPosition, endPosition) {
          this.finger.active = true;
          let that = this;
          this.finger.setPosition(startPosition);
          let vec = endPosition.sub(startPosition);

          if (Math.abs(vec.x) > Math.abs(vec.y)) {
              this.finger.rotation = 0;
          } else {
              this.finger.rotation = 110;
          }
          const ACTION_TAG = 1;
          let action = cc.sequence(cc.repeat(cc.sequence(
              cc.moveTo(.6, endPosition),
              cc.moveTo(.6, startPosition)
          ), 2), cc.callFunc(function (params) {


          }))
          action.setTag(ACTION_TAG);
          this.finger.runAction(action)

      },
      //   根据提示自动移动
      ballMove(moveNode, startPosition, endPosition) {

          let vec = endPosition.sub(startPosition);

          if (Math.abs(vec.x) > Math.abs(vec.y)) {
              //水平方向
              if (vec.x > 0) {
                  this.moveBall('right', moveNode)
              } else {
                  this.moveBall('left', moveNode)
              }
          } else {

              this.finger.rotation = 110;
              if (vec.y > 0) {
                  this.moveBall('up', moveNode)
              } else {
                  this.moveBall('down', moveNode)
              }
          }
      },

      start() {
          this.finger.zIndex = 4;
      },
      init() {
          this.flag = true;
          this.finger.active = false;
          this.finger.stopActionByTag(1)
          for (let i = 0; i < 5; i++) {
              for (let j = 0; j < 5; j++) {
                  if (this.balls[i][j]) {
                      this.balls[i][j].destroy();
                  }
              }
          }
          this.balls = []; //存储块
          for (let i = 0; i < this.blocksNum; i++) {
              this.balls.push([null, null, null, null, null])
          }
          this.addBalls(gameData)

      },
      nextLevel() {
          let that = this;
          let setBox = this.finishWrap.getChildByName("setBox");
          setBox.getChildByName("reset").on(cc.Node.EventType.TOUCH_START, function (params) {
              let layer = that.finishWrap.getComponent("layer");
              layer.hideDialog();
              that.init()
          })
          setBox.getChildByName("next").on(cc.Node.EventType.TOUCH_START, function (params) {
              let layer = that.finishWrap.getComponent("layer");
              layer.hideDialog();
              if (typeof wx === 'undefined') {
                  localStorage.removeItem("shareTime")
              } else {
                  wx.removeStorageSync('shareTime')
              }
              cc.director.loadScene('game')

          });
          setBox.getChildByName("close").on(cc.Node.EventType.TOUCH_START, function (params) {
              let layer = that.finishWrap.getComponent("layer");
              layer.hideDialog();
              cc.director.loadScene('start')

          })
      },
      finishFunc() {
          let that = this;
          let setBox = this.throuWrap.getChildByName("setBox");

          setBox.getChildByName("allLevel").getComponent(cc.Label).string = "第" + MAX_LEVEL + "关";
          setBox.getChildByName("reset").on(cc.Node.EventType.TOUCH_START, function (params) {
              let layer = that.throuWrap.getComponent("layer");
              layer.hideDialog();
              that.init();
          });

          setBox.getChildByName("share").on(cc.Node.EventType.TOUCH_START, function (params) {
              gameTag = false;
              let layer = that.throuWrap.getComponent("layer");
              layer.hideDialog();
              if (typeof wx === "undefined") {
                  return;
              }

              wx.shareAppMessage({
                  title: "这游戏可得劲儿了，快来玩吧！",
                  imageUrl: "https://w.xinbaad.com/ballShare.png"
              });


          });
          setBox.getChildByName("close").on(cc.Node.EventType.TOUCH_START, function (params) {
              let layer = that.throuWrap.getComponent("layer");
              layer.hideDialog();
              cc.director.loadScene('start')

          })
      },
      drawBgBlocks() {
          this.blockSize = (this.panel.width - this.gap * (this.blocksNum + 1)) / this.blocksNum; //一个格子的大小
          let x = this.gap + this.blockSize / 2;
          let y = this.blockSize - this.blockSize / 2;
          this.positions = []; //记录方块的位置
          this.balls = []; //存储球
          for (let i = 0; i < this.blocksNum; i++) {
              this.positions.push([0, 0, 0, 0, 0]) //记录块的位置
              this.balls.push([null, null, null, null, null])
              for (let j = 0; j < this.blocksNum; j++) {
                  let curBlock = cc.instantiate(this.blockPrefab);
                  curBlock.width = this.blockSize;
                  curBlock.height = this.blockSize;
                  this.panel.addChild(curBlock);
                  curBlock.setPosition(cc.v2(x, y));
                  this.positions[i][j] = cc.v2(x, y); //记录一下滑块的位置
                  x += this.blockSize + this.gap;
              }
              y += this.gap + this.blockSize;
              x = this.gap + this.blockSize / 2;
          }
      },
      addEventHandler(oneNode) {
          let that = this;
          oneNode.on(cc.Node.EventType.TOUCH_START, function (event) {
              that.startPoint = event.touch.getLocation()

          });
          oneNode.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
              that.finger.active = false;
              let endPoint = event.touch.getLocation()
              let vec = endPoint.sub(that.startPoint);

              if (vec.mag() > MIN_LENGTH) {
                  if (Math.abs(vec.x) > Math.abs(vec.y)) {
                      //水平方向
                      if (vec.x > 0) {
                          that.moveBall('right', oneNode)
                      } else {
                          that.moveBall('left', oneNode)
                      }
                  } else {
                      if (vec.y > 0) {
                          that.moveBall('up', oneNode)
                      } else {
                          that.moveBall('down', oneNode)
                      }

                  }
              }




          });
      },

      // 新建球
      addBalls(gameData) {
          let that = this;
          let locations = gameData;
          for (let i = 0; i < locations.length; i++) {
              let location = locations[i];
              let x = location.x;
              let y = location.y;
              let position = this.positions[x][y];
              let curBall = cc.instantiate(this.ballPrefab);
              let ballTexture = ballData[i].url;
              cc.loader.loadRes(ballTexture, cc.SpriteFrame, function (err, spriteFrame) {
                  curBall.nowTeture = spriteFrame;
                  curBall.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              });
              curBall.blockX = x;
              curBall.blockY = y;
              this.balls[x][y] = curBall;
              this.panel.addChild(curBall);
              curBall.setPosition(position);
              this.addEventHandler(curBall)

          }

      },
      //  移动之后判断
      afterMove() {
          // 判断是否还有一个球
          this.flag = true;
          let restBall = this.testBall();
          if (restBall.length == 1) {
              this.victoryMusic.play();
              if (this.curLevel < MAX_LEVEL) {
                  this.curLevel = this.curLevel * 1 + 1;
                  if (this.isWeixn()) {
                      this.curLevel = wx.setStorageSync('level', this.curLevel);

                  } else {
                      this.curLevel = localStorage.setItem('level', this.curLevel);
                  }
                  let layer = this.finishWrap.getComponent("layer");
                  layer.showDialog()
                  this.nextLevel();

              } else {

                  let layer = this.throuWrap.getComponent("layer");
                  layer.showDialog();
                  this.finishFunc()
              }


          } else {





          }
      },
      //   查看当前剩余球
      testBall() {
          let arr = []
          for (let i = 0; i < this.blocksNum; i++) {
              for (let j = 0; j < this.blocksNum; j++) {
                  if (this.balls[i][j]) {
                      arr.push(this.balls[i][j])
                  }
              }
          }
          return arr;
      },
      moveAction(originx, originy, otherx, othery, directx, directy, curNode, positonx, positiony) {
          let that = this;
          if (this.flag) {
              this.flag = false;
              let deg;
              if (directx) {
                  deg = 1
              }
              if (directy) {
                  deg = -1
              }
              that.ballMusic.stop();
              this.balls[originx][originy].runAction(cc.sequence(
                  cc.spawn(cc.moveTo(.4, this.positions[otherx][othery].x + 50 * directy, this.positions[otherx][othery].y + 50 * directx), cc.rotateBy(.4, 180 * deg)),
                  cc.callFunc(function (params) {
                      let isPlay;
                      if (typeof wx === "undefined") {
                          isPlay = localStorage.getItem('colliderchecked') || 1;

                      } else {
                          isPlay = wx.getStorageSync("colliderchecked") || 1;

                      }

                      if (isPlay == 1) {
                          that.ballMusic.play();
                      } else {
                          that.ballMusic.stop();
                      }
                  }),
                  cc.spawn(cc.moveTo(.4, this.positions[otherx + directx][othery + directy].x, this.positions[otherx + directx][othery + directy].y), cc.rotateBy(.4, 180 * deg)),

                  cc.callFunc(function (params) {
                      that.addNewBall(curNode, otherx + directx, othery + directy, originx, originy)
                  })
              ));
              setTimeout(() => {
                  var action1 = cc.sequence(cc.spawn(cc.moveTo(.4, positonx, positiony), cc.rotateBy(.4, 180 * deg)), cc.callFunc(function () {
                      that.balls[otherx][othery].destroy()
                      that.balls[otherx][othery] = null;
                      that.afterMove();
                  }))
                  action1.easing(cc.easeIn(3.0));
                  this.balls[otherx][othery].runAction(action1);

              }, 400);
          }

      },
      addNewBall(curNode, x1, y1, x2, y2) {
          this.newFlag = false;
          let newNode = cc.instantiate(this.ballPrefab);
          this.panel.addChild(newNode);
          newNode.blockX = x1;
          newNode.blockY = y1;
          newNode.getComponent(cc.Sprite).spriteFrame = curNode.nowTeture;
          newNode.nowTeture = curNode.nowTeture;
          curNode.destroy();
          newNode.setPosition(this.positions[x1][y1]);
          this.balls[x2][y2] = null;
          this.balls[x1][y1] = newNode;
          this.addEventHandler(newNode);
          this.newFlag = true;
      },

      moveBall(direction, curNode) {
          let that = this;
          let x = curNode.blockX;
          let y = curNode.blockY;
          if (direction == "down") {
              let count = 0;
              for (let i = 0; i < this.blocksNum; i++) {
                  //   判断当前列是否有球，如果有球，且球在下面
                  if (this.balls[i][y] !== null && i !== x && i < x) {
                      count++;
                  }
              }
              if (count > 1) {
                  return;
              }
              for (let i = 0; i < this.blocksNum; i++) {
                  //   判断当前列是否有球，如果有球，且球在下面
                  if (this.balls[i][y] !== null && i !== x && i < x) {
                      // 判断下面的球是否和当前球相邻
                      if (i + 1 == x) {
                          return;
                      }
                      that.moveAction(x, y, i, y, 1, 0, curNode, this.positions[i][y].x, -60)
                  }
              }
          } else if (direction == "up") {
              let count = 0;
              for (let i = 0; i < this.blocksNum; i++) {
                  //   判断当前球的上面是否有球，且球在当前球的上面
                  if (this.balls[i][y] !== null && i !== x && i > x) {
                      count++;
                  }
              }
              if (count > 1) {
                  return;
              }
              for (let i = 0; i < this.blocksNum; i++) {
                  //   判断当前球的上面是否有球，且球在当前球的上面
                  if (this.balls[i][y] !== null && i !== x && i > x) {
                      // 判端球是否和当前球相邻
                      if (i == x + 1) {
                          return;
                      }
                      let TopDist = that.blockSize * (that.blocksNum + 1) - 30;
                      that.moveAction(x, y, i, y, -1, 0, curNode, this.positions[i][y].x, TopDist)
                  }
              }

          } else if (direction == "left") {
              let count = 0;
              for (let i = 0; i < this.blocksNum; i++) {
                  // 判断球是否在当前球的左边
                  if (this.balls[x][i] !== null && i !== y && i < y) {
                      count++;
                  }
              }
              if (count > 1) {
                  return false;
              }
              for (let i = 0; i < this.blocksNum; i++) {
                  // 判断球是否在当前球的左边
                  if (this.balls[x][i] !== null && i !== y && i < y) {
                      if (i + 1 == y) {
                          return;
                      }
                      that.moveAction(x, y, x, i, 0, 1, curNode, -50, this.positions[x][i].y)
                  }
              }

          } else if (direction == "right") {

              let count = 0;
              for (let i = 0; i < this.blocksNum; i++) {
                  if (this.balls[x][i] !== null && i !== y && i > y) {
                      count++;

                  }
              }
              //   如果右边有两个球不能操作
              if (count > 1) {
                  return;
              }
              for (let i = 0; i < this.blocksNum; i++) {
                  if (this.balls[x][i] !== null && i !== y && i > y) {
                      if (i - 1 == y) {
                          return false;

                      } else {
                          that.moveAction(x, y, x, i, 0, -1, curNode, 800, this.positions[x][i].y)
                      }
                  }


              }

          } else {
              cc.log("err")
          }
      }
  });