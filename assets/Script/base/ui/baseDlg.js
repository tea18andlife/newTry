/****************************************************************************
 * Copyright (c) 2018 福州来玩互娱网络科技有限公司 
 *         All rights reserved. 
 * 
 * 
 * Filename:   baseDlg基础对话框 
 * Summary:    主要实现对话框弹出收回动作,以及背景半透明遮罩(todo),注意:所有弹窗类的perfeb,必需以这个类的子类作为组件
 * 
 * Version:    1.0.0
 * Author:     HZS
 * Date:       2018/10/15
 *****************************************************************************/

var baseNode = require("baseNode")
cc.Class({
    extends: baseNode,

    properties: {
        //弹窗的周围是否显示黑色底
        mask: {
            default: true,        // The default value will be used only when the component attaching
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        util.loadSp(this.node, "img2/common/singleColor", function (sp_bg) {
            sp_bg.width=1000;
            sp_bg.height=1280;
            sp_bg.zIndex = -1;
            sp_bg.color = cc.color(0,0,0);
            sp_bg.opacity = this.mask?100:0;
            sp_bg.addComponent(cc.BlockInputEvents);
        }.bind(this));
    },
    closeSelf() {
        uiFunc.closeUI(this);
    }



    // update (dt) {},
});
