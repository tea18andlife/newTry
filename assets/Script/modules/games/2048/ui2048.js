
var baseWin = require("baseWin")

cc.Class({
    extends: baseWin,

    start () {
    	// console.log("start");
    },

    onEnter () {
        var self = this;
    	this.btn_back.quickBt(function () {
            self.touchBack();
    	});
        console.log("onEnter");
    },
    touchClose () {
    	uiFunc.closeUI(this);
    },
    touchBack () {
        uiFunc.closeUI(this);
        uiFunc.openUI("hall/uiHall");
    }
});