/****************************************************************************
 * Copyright (c) 2018 福州来玩互娱网络科技有限公司 
 *         All rights reserved. 
 * 
 * 
 * Filename:   wxData 微信平台数据
 * Summary:    玩家登录微信后获取账号数据,主要是登录请求发起
 * 
 * Version:    1.0.0
 * Author:     HZS
 * Date:       2018/10/15
 *****************************************************************************/


var md5 = require("md5")

var baseData = require("baseData")

cc.Class({
    extends: baseData,
    name:"wxData",

    properties: {
        //登录数据
        //玩家账号名,这里通过uiLogin进行了重新赋值,从微信取openid也是存这里
        szName:"guest1",
        userid:0,
        sign:"",
        sex:0,
        headweb:"",


        szToken:"",//todo
        nickName:"guest1",
        iIssue:0,
        iPCID:0,
        szMD5:"",
        bRegWay:0,
        iAreaID:1157,//版本号todo
        szMD5Pass:"",
        szHeadWeb:"",
        iWBFlag:1,

        //设备数据
        szMac:"",//todo
        // szPass:"123456"
    },


    /**
     * 初始化数据
     * todo:
     */
    ctor()
    {
        // this.autoReadSave("szName")//opinid暂不作保存
        this.on("szName",this.update_MD5.bind(this))
    },

    /**
     * 计算szMD5,szMD5Pass相关
     */
    //
    update_MD5()
    {
        this.set("szToken",this.get("szName"))
        this.set("szMac",this.get("szName"))
        var regisetMD5 = md5(cc.js.formatStr("7%s8%s0%d",this.get("szName"),this.get("szMac"),this.get("iWBFlag")))
        this.set("szMD5",regisetMD5)
        this.set("szMD5Pass", md5((md5(md5(this.get("szName")))+"110")))
    },
});