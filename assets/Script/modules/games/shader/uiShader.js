
var baseWin = require("baseWin")

cc.Class({
    extends: baseWin,

    properties: {
        // wenyuSp:{
        //     default:null,
        //     type:cc.Prefab
        // },
    },

    start () {
        this.state = 1;
        // 1-文娱效果
        // uiFunc.openUI("hall/uiHall"); ShaderWenyu
        this.demoTab = ["ShaderStone", "ShaderIce", "ShaderBins", "WenyuMain"]

        // var wenyuSp = cc.instantiate(this.wenyuSp);
        // this.center_node.addChild(wenyuSp);
        var self = this;
        util.openUi("shader/demo/WenyuMain", function(panel) {
            self.center_node.addChild(panel);
            // panel.y = -200;
        })



    },

    touchClose () {
    	uiFunc.closeUI(this);
    },
    touchBack () {
        uiFunc.closeUI(this);
        uiFunc.openUI("hall/uiHall");
    }
});