
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
        this.ccTouchBeganPos = pos;
        var star_width = 60;

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
                            if (this.sameColorList.contains(pSprite0)) {
                                console.log("mPos", mPos);
                    //             Sound.playEffect(PS_MAIN_SOUNDS.broken);
                                this.removeSameColorStars();
                    //             this.scoreTipLabel.setVisible(false);
                    //         }
                    //         else {
                    //             for (var k = 0; k < this.sameColorList.length; k++) {
                    //                 if (this.sameColorList[k]) {
                    //                     this.sameColorList[k].runAction(cc.ScaleTo.create(0.1, 1));
                    //                 }
                    //             }
                    //             this.checkSameColorStars(pSprite0);
                    //             if (this.sameColorList.length > 1) {
                    //                 // cc.AudioEngine.getInstance().playEffect(PS_MAIN_SOUNDS.select, false);
                    //                 Sound.playEffect(PS_MAIN_SOUNDS.select);
                    //                 this.showScoreTip();
                    //             }
                    //             else {
                    //                 this.scoreTipLabel.setVisible(false);
                    //             }
                            }
                        } else {
                    //         this.checkSameColorStars(pSprite0);
                    //         if (this.sameColorList.length > 1) {
                    //             // cc.AudioEngine.getInstance().playEffect(PS_MAIN_SOUNDS.select, false);
                    //             Sound.playEffect(PS_MAIN_SOUNDS.select);
                    //             this.showScoreTip();
                    //         }
                    //         else {
                    //             this.scoreTipLabel.setVisible(false);
                            // }
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


            }
        }
        this.sameColorList = [];
        // this.fallStar();
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
    getRandomStar (colIndex, rowIndex) {
        var random = util.getRandom(5);

        var starSprite = cc.instantiate(this.tilePre);
        var star = starSprite.getComponent("star");
        star.game = this;

        starSprite.width = this.starSize;
        starSprite.height = this.starSize;

        star.setColorWhich(random);
        star.setArrPosition(colIndex, rowIndex)
        star.starData = {rand: random, indexOfColumn: colIndex, indexOfRow: rowIndex};
        // var fallAction = cc.MoveTo.create(flowTime, cc.p(36 + colIndex * this.starSize,
        //     36 + rowIndex * this.starSize));
        // starSprite.runAction(fallAction);

        return starSprite;
    },


    touchClose () {
    	uiFunc.closeUI(this);
    },
    touchBack () {
        uiFunc.closeUI(this);
        uiFunc.openUI("hall/uiHall");
    }
});