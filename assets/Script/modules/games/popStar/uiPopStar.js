
var baseWin = require("baseWin")

cc.Class({
    extends: baseWin,

    properties: {
        tilePre:{
            default:null,
            type:cc.Prefab
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
        this.isClear = false;
        // var self = this;
        // this.btn_back.quickBt(function () {
        //     self.touchBack();
        // });
        this.init();
    },
    init () {
        this.canTouch = true;
        // 初始化星星
        this.initStarTable();
        // 关卡
        this.lb_stage.setLabel(this.currentLevel);
        // 目标分数
        this.lb_target.setLabel(1000*(1+this.currentLevel)*this.currentLevel/2);
        // 得分砸·
        this.lb_score.setLabel(this.totalScore);
        // 最高分 读取缓存 先跳过
        this.bestScore = cc.sys.localStorage.getItem("starBestScore");
        if (this.bestScore != null && this.bestScore != undefined) {
            this.bestScore = Number(this.bestScore);
        } else {
            this.bestScore = 0;
        }
        this.lb_best_score.setLabel(this.bestScore);

        // var self = this;
        // this.sp_main.on(cc.Node.EventType.TOUCH_START, function(event) {
        //     console.log("event", event);
        // });
        this.sp_main.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    },
    onTouchBegan: function (event) {
        if (this.canTouch == false) {
            return;
        }
        var pos = event.touch.getLocation();
        pos = this.sp_main.convertToNodeSpace(pos);
        this.ccTouchBeganPos = pos;
        var star_width = 52;

        for (var i = 0; i < this.starTable.length; i++) {
            // var sprites = this.starTable[i];
            for (var j = 0; j < this.starTable[i].length; j++) {
                // var pSprite0 = sprites[j];
                if (this.starTable[i][j] && this.starTable[i][j] != null) {
                    var mPos = this.starTable[i][j].getPosition();

                    var ccRect = cc.rect(mPos.x-star_width/2, mPos.y-star_width/2, star_width, star_width);
                    var pSprite0 = this.starTable[i][j];
                    if (ccRect.contains(this.ccTouchBeganPos)) {
                        if (this.sameColorList.length > 1) {
                            // if (this.sameColorList.contains(pSprite0)) {
                            if (util.tabcontains(this.sameColorList, pSprite0)) {
                    //             Sound.playEffect(PS_MAIN_SOUNDS.broken);
                                util.mlog("Sound.broken");
                                this.removeSameColorStars();
                                this.lb_tipScore.active = false;
                            } else {
                                for (var k = 0; k < this.sameColorList.length; k++) {
                                    if (this.sameColorList[k]) {
                                        this.sameColorList[k].runAction(cc.scaleTo(0.1, 1));
                                    }
                                }
                                this.checkSameColorStars(pSprite0);
                                if (this.sameColorList.length > 1) {
                                    // Sound.playEffect(PS_MAIN_SOUNDS.select);
                                    this.showScoreTip();
                                }
                                else {
                                    this.lb_tipScore.active = false;
                                }
                            }
                        } else {
                            this.checkSameColorStars(pSprite0);
                            console.log("this.sameColorList", this.sameColorList);
                            if (this.sameColorList.length > 1) {
                                // Sound.playEffect(PS_MAIN_SOUNDS.select);
                                util.mlog("sound.select");
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
        // var scene = cc.director.getScene();
        // var touchLoc = event.touch.getLocation();
        // var bullet = cc.instantiate(this.bullet);
        // bullet.position = touchLoc;
        // bullet.active = true;
        // scene.addChild(bullet);
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
        for (var k = 0; k < length; k++) {
            var simpleStar = this.sameColorList[k];
            if (simpleStar) {
                var col = simpleStar.starData.indexOfColumn;
                var row = simpleStar.starData.indexOfRow;
                this.starTable[col].splice(row, 1, null);
                // this.removeChild(simpleStar);
                simpleStar.removeFromParent(true);
                // 创建粒子效果 稍后调试
                // 加分

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
            }
            else {
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
                    // var moveAction = cc.MoveTo(0.18, cc.v2(36 + i * this.starSize, 36 + j * this.starSize));
                    // this.starTable[i][j].runAction(moveAction);
                    pSprite0.getComponent("star").setArrPosition(pSprite0.starData.indexOfColumn, pSprite0.starData.indexOfRow);
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
                    }
                    else {
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
                                cc.delayTim(delay),
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

                            this.oneDeadStarScore = Math.floor((1000 - deadCount * 100) / deadCount);
                            this.oneDeadStarScore = this.oneDeadStarScore - this.oneDeadStarScore % 10;
                            // var starScoreSprite = PopMain.createScore(this,
                            //         cc.p((36 + ii * this.starSize), (36 + jj * this.starSize)), this.oneDeadStarScore + "");
                            // starScoreSprite.runAction(cc.Sequence.create(
                            //         cc.scaleTo.create(0, 0),
                            //         cc.DelayTime.create(delay), cc.scaleTo.create(0, 1),
                            //         cc.MoveTo.create(0.3 + jj / 20, this.scoreFont.getPosition()),
                            //         // cc.CleanUp.create(starScoreSprite),
                            //         cc.CallFunc.create(function ()
                            //         {
                            //             this.totalScore += this.oneDeadStarScore;
                            //             this.scoreFont.setString(this.totalScore + "");
                            //         }, this),
                            //         cc.removeSelf(true)
                            // ))
                        }
                    }
                }
            }
        }
        var self = this;
        this.node.delayCall(function () {
            self.winStar();
        }, 5)
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

        if (this.isClear == true) {
            // Sound.playEffect(PS_MAIN_SOUNDS.win);
            util.mlog("Win");
            this.currentLevel += 1;
            this.currentLevelScore = this.totalScore;

            // this.nextSprite.setLocalZOrder(100);
            // var that = this;
            // this.scheduleOnce(function ()
            // {
            //     that.nextLevelLabel.setString("level " + currentLevel + "");
            //     that.nextTargetLabel.setString("target " + 1000 * (1 + currentLevel) * currentLevel / 2);
            //     that.nextSprite.runAction(cc.Sequence.create(
            //             cc.MoveTo.create(1, cc.p(0, 0)),
            //             cc.DelayTime.create(2),
            //             cc.MoveTo.create(1, cc.p(-730, 0))
            //     ))
            // }, 3);
            // this.scheduleOnce(function ()
            // {
            //     cc.director.runScene(new PopstarScene);
            // }, 7);
        }
        else {
            // Sound.playEffect(PS_MAIN_SOUNDS.gameover);
            this.currentLevel = 1;
            this.currentLevelScore = 0;

            util.mlog("lost");
            // this.scheduleOnce(function ()
            // {
            //     util.mlog("enter StartLayer");
            //     cc.director.runScene(new StarScene);
            // }, 2)
        }
        if (this.totalScore > this.bestScore) {
            cc.sys.localStorage.setItem("starBestScore", this.totalScore + "");
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
        star.setArrPosition(colIndex, rowIndex);
        starSprite.starData = {rand: random, indexOfColumn: colIndex, indexOfRow: rowIndex};
        // var fallAction = cc.MoveTo.create(flowTime, cc.p(36 + colIndex * this.starSize,
        //     36 + rowIndex * this.starSize));
        // starSprite.runAction(fallAction);

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
                        // if (!this.sameColorList.tabcontains(fourSide[j])) {
                        if (util.tabcontains(this.sameColorList, fourSide[j]) == false) {
                            this.sameColorList.push(fourSide[j]);
                            newSameColorList.push(fourSide[j]);
                        }
                    }
                }
                newSameColorList.splice(i, 1);
            }
        }
        // cc.log("sameColorList length==" + this.sameColorList.length);
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