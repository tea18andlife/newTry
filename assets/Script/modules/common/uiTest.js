
var baseWin = require("baseWin")

cc.Class({
    extends: baseWin,

    properties: {
    },

    start () {
        this.addEvents();
    },

    addEvents () {
        var self = this;
        // this.btn_back.quickBt(function () {
        //     self.touchBack();
        // });
        this.btn_1.quickBt(function () {
            // self.saveMsg("wocao", "wocao");
            util.mlog("btn_1")
        });
        this.btn_3.quickBt(function () {
            // self.saveMsg("wocao", true);
            util.mlog("btn_3")
        });

        this.btn_2.quickBt(function () {
            // self.getMsg("wocaovv");
            util.mlog("btn_2")
        });

    },
    saveMsg (key, value) {
        if (CC_WECHATGAME) {
            wxUtil.saveUserStorageDataSync(key, value);
            util.mlog("saveOver");
        }
    },
    getMsg (key) {
        
        // if (CC_WECHATGAME) {
        //     var getKey = wxUtil.getUserStorageDataSync(key);
        //     // util.mlog("getKey", getKey, typeof getKey);
            
        //     // util.mlog("getKey2", getKey == "")
        //     // console.log("wxUtil.getLaunchParam", wxUtil.getLaunchParam（);
        //     // console.log("wxUtil.getLaunchParam", wxUtil.getLaunchParam());
        //     var param = wxUtil.getLaunchParam()
        //     util.mlog("getKey", param.scene);

        // }
        var param = wxUtil.getLaunchParam()
        if (param && (param.scene == 1104 || param.scene == 1103) ) {
            util.mlog("成功");
        } else {
            util.mlog("请从“我的小程序”\n入口进入游戏！", param.scene, typeof param.scene);
        }
    },

    touchClose () {
    	uiFunc.closeUI(this);
    },
});