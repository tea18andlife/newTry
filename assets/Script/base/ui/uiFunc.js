/****************************************************************************
 * Copyright (c) 2018 福州来玩互娱网络科技有限公司 
 *         All rights reserved. 
 * 
 * 
 * Filename:   UIFunc 界面窗口管理类 
 * Summary:    实现窗口显示隐藏创建销毁
 * 
 * Version:    1.0.0
 * Author:     HZS
 * Date:       2018/10/15
 *****************************************************************************/

window.uiFunc = {
    //当前打开的窗口列表
    uiList: [],
    //缓存中的窗口列表
    cacheUIList: []
};

/**
 * 打开界面
 *  m
 * @param {String} uiPath ui预制体的相对路径如:"hall/uiHall",注:路径必需在resource/ui目录下
 * @param {Function} callBack 加载成功回调 
 */
uiFunc.openUI = function(uiPath, callBack) {
    var initFame = function(frame)
    {
        var panel = frame.getComponent("baseNode");
        if (callBack) {
            callBack(panel);
        }
        if (panel)
        {
            panel.show();
        }
    }



    var findtemp = this.findUI(uiPath)
    if (findtemp)
    {
        cc.error("窗口重复创建,直接显示上一个窗口:"+uiPath);
        findtemp.active = true;
        initFame(findtemp);
        return
    }
    // 缓存--
    for (var i = 0; i < uiFunc.cacheUIList.length; i++) {
        var temp = uiFunc.cacheUIList[i];
        if (temp && temp.pathName === uiPath) {
            temp.active = true;
            temp.parent = cc.Canvas.instance.node;
            uiFunc.uiList.push(temp)
            uiFunc.cacheUIList.splice(i, 1);

            initFame(temp);
            return;
        }
    }
    // 非缓存--
    cc.loader.loadRes('ui/' + uiPath, function(err, prefab) {
        if (err) {
            cc.error(err.message || err);
            return;
        }

        var temp = cc.instantiate(prefab);
        temp.pathName = uiPath;
        temp.parent = cc.Canvas.instance.node;
        uiFunc.uiList.push(temp)
        initFame(temp);
    });
};


/**
 * 关闭界面
 * 
 * @param {String,object} uiPath ui预制体的相对路径,也可以传入窗口句柄,如:uiFunc.closeUI(this);
 * @param {Function} callBack 成功回调 
 * @param {Bool} clear 清除界面,默认不清除界面 
 */
uiFunc.closeUI = function(uiPath, noClear, callBack) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        var temp = uiFunc.uiList[i];
        if (temp && (temp.pathName === uiPath || (typeof (uiPath) == "object" && temp === uiPath.node))) {
            temp.active = false;
            if (noClear)
            {
                temp.removeFromParent(false);
                uiFunc.cacheUIList.push(temp);
            }
            else
            {
                temp.removeFromParent(true);
            }
            
            uiFunc.uiList.splice(i, 1);

            if (callBack) {
                callBack();
            }
            return;
        }
    }
    cc.error("uiFunc.closeUI fail not found ui "+uiPath)
}

/**
 * 查找界面
 * 
 * @param {String,Object} uiPath ui预制体的相对路径
 * @returns {Object}  窗口句柄
 */

uiFunc.findUI = function(uiPath) {
    for (var i = uiFunc.uiList.length - 1; i >= 0; i--) {
        var temp = uiFunc.uiList[i];
        if (temp && temp.pathName === uiPath) {
            return temp;
        }
    }
};
/**
 * 用于调用前清理一下，防止重复创建窗口
 * @param path
 */
uiFunc.clearUI = function (uiPath) {
    if(this.findUI(uiPath))
    {
        this.closeUI(uiPath);
    }
};
