
var baseWin = require("baseWin")

cc.Class({
    extends: baseWin,

    start () {
        this.currentLevel = 1;
        this.currentLevelScore = 0;

        var self = this;
        // this.btn_back.quickBt(function () {
        //     self.touchBack();
        // });
    },

    // onEnter () {
        
    //     console.log("onEnter");
    // },
    touchClose () {
    	uiFunc.closeUI(this);
    },
    touchBack () {
        uiFunc.closeUI(this);
        uiFunc.openUI("hall/uiHall");
    }
});