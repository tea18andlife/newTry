
var baseWin = require("baseWin")

cc.Class({
    extends: baseWin,

    properties: {
        tilePre:{
            default:null,
            type:cc.Prefab
        },
        tamplateLabel:{
            default:null,
            type:cc.Node
        },
    },

    start () {
        this.currentLevel = 1;
        this.currentLevelScore = 0;

        this.numX = 10;
        this.numY = 10;
        this.starSize = 52;

        this.sameColorList = [];

        this.totalScore = 0;
        // this.isClear = false;

        this.init();

        var self = this;
        this.btn_back.quickBt(function () {
            self.touchBack();
        });

        // var self = this;
        // this.node.delayCall(function () {
        //     uiFunc.openUI("common/uiCommonTips",(uiScript)=>{
        //         uiScript.init({
        //             desc: "wocao",
        //             btnCount: 2,
        //         });
        //     })
        // }, 2);
    },
    init () {
        this.isClear = false;
        this.lb_clear.active = false;

        this.canTouch = true;
        // 初始化星星
        this.initStarTable();
        // 关卡
        this.lb_stage.setLabel(this.currentLevel);
        // 目标分数
        this.targetScore = 1000 * (1 + this.currentLevel) * this.currentLevel / 2;
        this.lb_target.setLabel(this.targetScore);
        // 得分
        this.lb_score.setLabel(this.totalScore);
        // 最高分 读取缓存 先跳过
        // this.bestScore = cc.sys.localStorage.getItem("starBestScore");
        this.bestScore = util.getStorageData("starBestScore");
        if (this.bestScore != null && this.bestScore != undefined) {
            this.bestScore = Number(this.bestScore);
        } else {
            this.bestScore = 0;
        }
        this.lb_best_score.setLabel(this.bestScore);

        this.sp_main.off(cc.Node.EventType.TOUCH_START);
        this.sp_main.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    },
    onTouchBegan: function (event) {
        if (this.canTouch == false) {
            return;
        }
        var pos = event.touch.getLocation();
        pos = this.sp_main.convertToNodeSpace(pos);
        this.ccTouchBeganPos = pos;

        for (var i = 0; i < this.starTable.length; i++) {

            for (var j = 0; j < this.starTable[i].length; j++) {

                if (this.starTable[i][j] && this.starTable[i][j] != null) {

                    var mPos = this.starTable[i][j].getPosition();
                    var ccRect = cc.rect(mPos.x-this.starSize/2, mPos.y-this.starSize/2, this.starSize, this.starSize);
                    var pSprite0 = this.starTable[i][j];
                    if (ccRect.contains(this.ccTouchBeganPos)) {
                        if (this.sameColorList.length > 1) {
                            if (util.tabcontains(this.sameColorList, pSprite0)) {
                                var len = Math.floor(this.sameColorList.length/2);
                                if (len > 8) {
                                    len = 8
                                }
                                util.playSound("star/star"+len);
                                this.removeSameColorStars();
                                this.lb_tipScore.active = false;
                            } else {
                                for (let k = 0; k < this.sameColorList.length; k++) {
                                    if (this.sameColorList[k]) {
                                        this.sameColorList[k].runAction(cc.scaleTo(0.1, 1));
                                    }
                                }
                                this.checkSameColorStars(pSprite0);
                                if (this.sameColorList.length > 1) {
                                    util.SoundClick();
                                    this.showScoreTip();
                                }
                                else {
                                    this.lb_tipScore.active = false;
                                }
                            }
                        } else {
                            this.checkSameColorStars(pSprite0);
                            if (this.sameColorList.length > 1) {
                                util.SoundClick();
                                this.showScoreTip();
                            }
                            else {
                                this.lb_tipScore.active = false;
                            }
                        }
                        break;
                    }
                }
            }
        }
    },
    showScoreTip () {
        this.lb_tipScore.active = true;
        var length = this.sameColorList.length;
        var tip = length + " blocks " + length * length * 5 + " points";
        this.lb_tipScore.setLabel(tip);
    },
    removeSameColorStars () {
        var length = this.sameColorList.length;
        this.oneStarScore = 5 * length;
        for (let k = 0; k < length; k++) {
            var simpleStar = this.sameColorList[k];
            if (simpleStar) {
                var col = simpleStar.starData.indexOfColumn;
                var row = simpleStar.starData.indexOfRow;
                // 创建粒子效果 稍后调试

                // 加分
                var starScoreSprite = cc.instantiate(this.tamplateLabel);
                starScoreSprite.active = true;
                starScoreSprite.setLabel(this.oneStarScore);
                this.nd_lb.addChild(starScoreSprite);
                var starPos = util.moveToOtherWordPoint(starScoreSprite, simpleStar);
                starScoreSprite.setPosition(starPos)
                
                var toPos = util.moveToOtherWordPoint(starScoreSprite, this.sp_score);
                var action = cc.sequence(
                    cc.moveTo(0.3+k/20, toPos),
                    cc.removeSelf(true),
                    cc.callFunc(function () {
                        this.totalScore += this.oneStarScore;
                        this.lb_score.setLabel(this.totalScore);
                        if (this.totalScore >= this.targetScore) {
                                if (this.isClear == false) {
                                    this.isClear = true;
                                    this.lb_clear.active = true;
                                    this.lb_clear.setPosition(cc.v2(0, -266))
                                    var pos = cc.v2(-216, 100);
                                    this.lb_clear.runAction(cc.sequence(
                                        cc.delayTime(1),
                                        cc.moveTo(1, pos)
                                    ));
                                    util.mlog("sound.clear");
                                }
                            }
                    }, this)
                );
                starScoreSprite.runAction(action);

                this.starTable[col].splice(row, 1, null);
                simpleStar.removeFromParent(true);
            }
        }
        this.sameColorList = [];
        this.fallStar();
    },
    fallStar () {
        for (var i = 0; i < this.starTable.length; i++) {
            var sprites = this.starTable[i];
            var length = sprites.length;
            for (var j = 0; j < length; j++) {
                var pSprite0 = sprites[j];
                if (pSprite0 == null) {
                    var k = j + 1;
                    while (k < length) {
                        var upSprite = sprites[k];
                        if (upSprite != null) {
                            upSprite.starData.indexOfColumn = i;
                            upSprite.starData.indexOfRow = j;
                            this.starTable[i].splice(j, 1, upSprite);
                            this.starTable[i].splice(k, 1, null);
                            k = length;
                        }
                        k++;
                    }
                }
            }
        }
        this.combineStar();
    },
    checkCombineStar () {
        for (var m = 0; m < (this.starTable.length - 1); m++) {
            if (this.starTable[m][0] == null && this.starTable[m + 1][0] != null) {
                return m;
            }
        }
        return -1;
    },
    combineStar () {
        while (this.checkCombineStar() >= 0) {
            var m = this.checkCombineStar();
            if (m == (this.starTable.length - 1)) {      //last length
                for (var k = 0; k < this.starTable[m].length; k++) {
                    this.starTable[m].splice(k, 1, null);
                }
            } else {
                for (var i = (m + 1); i < this.starTable.length; i++) {
                    for (var j = 0; j < this.starTable[i].length; j++) {
                        if (this.starTable[i][j] != null) {
                            this.starTable[i][j].starData.indexOfColumn = (i - 1);
                        }
                        this.starTable[i - 1].splice(j, 1, this.starTable[i][j]);
                        if (i == (this.starTable.length - 1)) {
                            this.starTable[i].splice(j, 1, null);
                        }
                    }
                }
            }
        }

        this.moveStar();
    },
    moveStar () {
        for (var i = 0; i < this.starTable.length; i++) {
            var sprites = this.starTable[i];
            var length = sprites.length;
            var jj = i + "==  ";
            for (var j = 0; j < length; j++) {
                var pSprite0 = sprites[j];
                if (pSprite0) {
                    pSprite0.getComponent("star").moveArrPos(pSprite0.starData.indexOfColumn, pSprite0.starData.indexOfRow);
                    jj += pSprite0.starData.rand + pSprite0.starData.indexOfColumn + pSprite0.starData.indexOfRow + "    ";
                }
                else {
                    jj += "xxx" + i + j + "    ";
                }
            }
        }
        this.deadStar();
    },
    deadStar: function() {
        // console.log("deadStar");
        var isDead = true;
        var deadCount = 0;
        for (var i = 0; i < this.starTable.length; i++) {
            var sprites = this.starTable[i];
            var length = sprites.length;
            for (var j = 0; j < length; j++) {
                var pSprite0 = sprites[j];
                if (pSprite0 != null) {
                    if (this.checkOneStarFourSide(pSprite0).length > 0) {
                        isDead = false;
                        return;
                    } else {
                        deadCount += 1;
                    }
                }
            }
        }

        if (isDead) {
            this.canTouch = false;
            for (var jj = 9; jj >= 0; jj--) {

                for (var ii = 0; ii < 10; ii++) {

                    var pSprite0 = this.starTable[ii][jj];
                    if (pSprite0 != null) {
                        var delay = 4 + 0.3 * ii - 0.4 * jj;
                        pSprite0.runAction(cc.sequence(
                            cc.delayTime(delay),
                            cc.removeSelf(true)
                        ));
                        // var starParticle = PopMain.StarParticleCreate(this, (36 + ii * this.starSize), (36 + jj * this.starSize), "spark");
                        // starParticle.runAction(cc.sequence(cc.scaleTo(0, 0),
                        //         cc.DelayTime(delay), cc.scaleTo(0, 1), cc.DelayTime(0.8),
                        //         cc.removeSelf(true)
                        // ));

                        if (deadCount < 10) {
                            if (deadCount == 0) {
                                this.totalScore += 1000;
                                this.lb_score.setLabel(this.totalScore);
                            }
                            // 剩下的能加多少分
                            this.oneDeadStarScore = Math.floor((1000 - deadCount * 100) / deadCount);
                            this.oneDeadStarScore = this.oneDeadStarScore - this.oneDeadStarScore % 10;

                            var starScoreSprite = cc.instantiate(this.tamplateLabel);
                            starScoreSprite.active = true;
                            starScoreSprite.setLabel(this.oneDeadStarScore);
                            this.nd_lb.addChild(starScoreSprite);
                            var starPos = util.moveToOtherWordPoint(starScoreSprite, pSprite0);
                            starScoreSprite.setPosition(starPos)
                            
                            var toPos = util.moveToOtherWordPoint(starScoreSprite, this.sp_score);
                            var action = cc.sequence(
                                // cc.scaleTo(0, 0),
                                cc.delayTime(delay),
                                // cc.scaleTo(0, 1),
                                cc.moveTo(0.3+jj/20, toPos),
                                cc.callFunc(function () {
                                    this.totalScore += this.oneDeadStarScore;
                                    this.lb_score.setLabel(this.totalScore);
                                }, this),
                                cc.removeSelf(true),
                            );
                            starScoreSprite.runAction(action);
                        }
                    }
                }
            }
        }
        var self = this;
        this.node.delayCall(function () {
            self.winStar();
        }, 5);
    },
    initStarTable () {
        this.starTable = new Array(this.numX);
        for (var i = 0; i < this.numX; i++) {
            var sprites = new Array(this.numY);
            for (var j = 0; j < this.numY; j++) {
                var pSprite0 = this.getRandomStar(i, j);
                if (pSprite0 != null) {
                    this.sp_main.addChild(pSprite0);
                }
                sprites[j] = pSprite0;
            }
            this.starTable[i] = sprites;
        }
    },
    winStar () {
        var self = this;
        if (this.isClear == true) {
            // Sound.playEffect(PS_MAIN_SOUNDS.win);
            util.mlog("Win");
            this.currentLevel += 1;
            this.currentLevelScore = this.totalScore;
            var targetScore = 1000 * (1 + this.currentLevel) * this.currentLevel / 2;
            this.canTouch = false;

            this.node.delayCall(function () {
                self.sp_win.active = true;
                self.sp_win.x = -cc.winSize.width;
                self.sp_win.width = cc.winSize.width;
                self.next_level.setLabel("level "+self.currentLevel);
                self.next_target.setLabel("target "+targetScore);

                var action = cc.sequence(
                    cc.moveTo(1, cc.v2(0, 0)),
                    cc.delayTime(2),
                    cc.moveTo(1, cc.v2(-cc.winSize.width, 0)),
                );
                self.sp_win.runAction(action);
            }, 3);

            this.node.delayCall(function () {
                self.init();
            }, 7);
        } else {
            // Sound.playEffect(PS_MAIN_SOUNDS.gameover);
            util.mlog("lost sound.gameover");
            this.currentLevel = 1;
            this.currentLevelScore = 0;
            var self = this;
            this.node.delayCall(function () {
                // util.mlog("enter StartLayer")
                self.touchBack();
            }, 1);
        }
        if (this.totalScore > this.bestScore) {
            // cc.sys.localStorage.setItem("starBestScore", this.totalScore + "");
            util.saveStorageData("starBestScore", this.totalScore)
        }
    },
    getRandomStar (colIndex, rowIndex) {
        var random = util.getRandom(5);

        var starSprite = cc.instantiate(this.tilePre);
        var star = starSprite.getComponent("star");
        star.game = this;

        starSprite.width = this.starSize;
        starSprite.height = this.starSize;

        star.setColorWhich(random);
        var x = (this.sp_main.width / this.numX)*(colIndex+0.5);
        var toPos = star.getArrPos(colIndex, rowIndex);
        starSprite.setPosition(toPos.x, 1300);
        starSprite.starData = {rand: random, indexOfColumn: colIndex, indexOfRow: rowIndex};

        var flowTime = rowIndex / 10;
        var fallAction = cc.moveTo(flowTime, toPos);
        starSprite.runAction(fallAction);

        return starSprite;
    },
    onPauseClicked () {
        // this.pauseNode.setVisible(true);
        util.mlog("onPauseClicked");
    },
    onResumeClicked () {
        // this.pauseNode.setVisible(false);
        util.mlog("onResumeClicked");
    },
    onSaveExitClicked () {
        util.mlog("onSaveExitClicked");
    },
    checkOneStarFourSide (sprite) {
        if (sprite == null) {
            return;
        }
        var fourSideSpriteList = [];
        var rand = sprite.starData.rand;
        var col = sprite.starData.indexOfColumn;
        var row = sprite.starData.indexOfRow;
        // up 
        if (row < 9) {
            var upSprite = this.starTable[col][row + 1];
            if (upSprite != null && upSprite.starData.rand == rand) {
                fourSideSpriteList.push(upSprite);
            }
        }
        // down
        if (row > 0) {
            var downSprite = this.starTable[col][row - 1];
            if (downSprite != null && downSprite.starData.rand == rand) {
                fourSideSpriteList.push(downSprite);
            }
        }

        // left
        if (col > 0) {
            var leftSprite = this.starTable[col - 1][row];
            if (leftSprite != null && leftSprite.starData.rand == rand) {
                fourSideSpriteList.push(leftSprite);
            }
        }

        // right
        if (col < 9) {
            var rightSprite = this.starTable[col + 1][row];
            if (rightSprite != null && rightSprite.starData.rand == rand) {
                fourSideSpriteList.push(rightSprite);
            }
        }
        return fourSideSpriteList;
    },
    checkSameColorStars: function(sprite) {
        if (sprite == null) {
            return;
        }
        this.sameColorList = [];
        this.sameColorList.push(sprite);
        var newSameColorList = [];
        newSameColorList.push(sprite);

        // by logic ,check the same color star list
        while (newSameColorList.length > 0) {
            for (var i = 0; i < newSameColorList.length; i++) {
                var fourSide = this.checkOneStarFourSide(newSameColorList[i]);
                if (fourSide.length > 0) {
                    for (var j = 0; j < fourSide.length; j++) {
                        if (util.tabcontains(this.sameColorList, fourSide[j]) == false) {
                            this.sameColorList.push(fourSide[j]);
                            newSameColorList.push(fourSide[j]);
                        }
                    }
                }
                newSameColorList.splice(i, 1);
            }
        }
        if (this.sameColorList.length > 1) {
            for (var k = 0; k < this.sameColorList.length; k++) {
                var simpleStar = this.sameColorList[k];
                if (simpleStar) {
                    simpleStar.runAction(cc.scaleTo(0.1, 1.08));
                }
            }
        }
    },

    touchClose () {
    	uiFunc.closeUI(this);
    },
    touchBack () {
        uiFunc.closeUI(this);
        uiFunc.openUI("hall/uiHall");
    }
});