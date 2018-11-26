/****************************************************************************
 * Copyright (c) 2018 福州来玩互娱网络科技有限公司 
 *         All rights reserved. 
 * 
 * 
 * Filename:   baseWin基础对话框 
 * Summary:    主要实现窗口切换动作等,注意:所有窗口类的perfeb,必需以这个类的子类作为组件
 * 
 * Version:    1.0.0
 * Author:     HZS
 * Date:       2018/10/15
 *****************************************************************************/

 var baseNode = require("baseNode")

cc.Class({
    extends: baseNode,

    properties: {
    
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        this.addComponent(cc.BlockInputEvents)
    },

    start () {

    },

    // update (dt) {},
});
