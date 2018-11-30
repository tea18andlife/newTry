
var baseWin = require("baseWin")

cc.Class({
    extends: baseWin,

    properties: {
        wenyuSp:{
            default:null,
            type:cc.Prefab
        },
    },

    start () {
        var wenyuSp = cc.instantiate(this.wenyuSp);
        this.center_node.addChild(wenyuSp);
    },

    touchClose () {
    	uiFunc.closeUI(this);
    },
    touchBack () {
        uiFunc.closeUI(this);
        uiFunc.openUI("hall/uiHall");
    }
});