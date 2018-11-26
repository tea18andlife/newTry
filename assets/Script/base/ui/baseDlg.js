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
/* eslint-disable */
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

        // 对其他节点适当放大和缩小
        this.fixScale();
        this._touchBlankCloseSelf = true;

        util.loadSp(this.node, "img2/common/singleColor", function (sp_bg) {
            sp_bg.width=2000;
            sp_bg.height=2000;
            sp_bg.zIndex = -1;
            sp_bg.color = cc.Color.BLACK;
            sp_bg.opacity = this.mask?200:1;
            sp_bg.lwMaskName = "lwMaskName"

            sp_bg.addComponent(cc.BlockInputEvents);

            var node = new cc.Node("touch_toclose");
            node.width=2000;
            node.height=2000;
            node.parent = sp_bg

            var self = this;
            node.quickBt(function () {
                if(self._touchBlankCloseSelf){
                    self.closeSelf()
                }
            }, true);
        }.bind(this));

        
      
    },
    fixScale () {
        var children = this.node.getChildren();

        var defaultRatio = 1280/720;
        var ratio = null;
        if (cc.winSize.height/cc.winSize.width > 1) {
            ratio = cc.winSize.height/cc.winSize.width;
        } else {
            ratio = cc.winSize.width/cc.winSize.height;
        }
        var defScale = defaultRatio/ratio;
        if (defScale != 1) {
            if (defScale > 1) {
                defScale = Math.sqrt( defScale )
            }
            for (var i = 0; i < children.length; i++) {
                var scale = children[i].getScale();
                // 缩放比例 以1280*700 为中心轴
                children[i].setScale(defScale*scale);
            }
        }
    },

    
    closeSelf() {
        uiFunc.closeUI(this);
        
    },
    onCloseAutoShowUI(){
        //这里统一给自动弹出的接口做关闭用 
        var uiHall = uiFunc.findUI("hall/uiHall", true)
        if(uiHall){
            uiHall.closeAutoShowUI(this)
        }
    }


    // update (dt) {},
});
