//游戏入口函数,为主场景main Canvas加载的脚本,尽量简洁

cc.Class({
    extends: cc.Component,
    start () {
		console.log("mainScene Start");

        // uiFunc.openUI("hall/uiHall");
        // uiFunc.openUI("plusOne/uiPlusOne");
        // uiFunc.openUI("popStar/uiPopStar");
        // uiFunc.openUI("common/uiTest");
        uiFunc.openUI("shader/uiShader");
    },
});
