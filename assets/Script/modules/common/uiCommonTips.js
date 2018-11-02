var baseDlg = require("baseDlg");


cc.Class({
    extends: baseDlg,

    properties: {

    },

    start () {

    },
    // 参数(btnCount：按钮个数，默认是两个，如果只需要一个确定按钮，值为1)
    // confirmFunc：点击确定按钮调用该函数；cancleFunc：点击取消调用该函数
    init(obj){
        // cc.log(obj)
        this.node.stopAllActions();
        var self = this;
        if (obj.richDesc) {
            this.lb_rich.active = true;
            this.lb_desc.active = false;
            this.setRichText(obj.richDesc);
        } else {
            this.lb_rich.active = false;
            this.lb_desc.active = true;
            this.lb_desc.getComponent(cc.Label).string = obj.desc;
        }
        
        if (obj.confirmText) {
            this.lb_confirm.getComponent(cc.Label).string = obj.confirmText;
        }
        if (obj.cancleText) {
            this.lbl_cancle.getComponent(cc.Label).string = obj.cancleText;
        }
        this.btn_close.onClick(this.closeSelf, this);

        this.btn_confirm.onClick(()=>{
            if (obj.confirmFunc) {
                obj.confirmFunc();
            }
            this.closeSelf();
        }, this);

        this.btn_cancel.onClick(()=>{
            if (obj.cancleFunc) {
                obj.confirmFunc();
            }
            this.closeSelf();
        }, this);

        if (obj.btnCount && obj.btnCount == 1) {
            this.btn_cancel.active = false;
            this.btn_confirm.x = 0;
        }

        if (obj.time) {
            this.node.delayCall(function () {
                self.closeSelf();
            }, obj.time);
        }
    },
    setRichText (paramStr) {
        // 设置行间距
        this.lbl_rich.getComponent(cc.RichText).lineHeight = 48;
        // this.lbl_rich.getComponent(cc.RichText).string = "<color=#A2794D>您确定要用</c><color=#D4030C>50元红包券</c>\n<color=#A2794D>兑换</c><color=#D4030C>50元话费</c><color=#A2794D>吗？</c>"
        this.lbl_rich.getComponent(cc.RichText).string = paramStr;
    },
});