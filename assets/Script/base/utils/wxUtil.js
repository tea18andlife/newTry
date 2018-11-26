window.wxUtil={};
/**
 * 微信转发分享
 * @param obj {title:分享标题,query:分享时带的字段,success:分享成功回调,fail:分享失败回调,imageUrl:转发显示图片的链接,显示图片长宽比是 5:4}
 */
wxUtil.shareToWx=function(obj){
    if (CC_WECHATGAME) {
        wx.showShareMenu({
            withShareTicket: true,
            success:() => {
                wx.shareAppMessage(obj);
            },
            fail:()=>{
                cc.log("showShareMenu fail");
            }
        });
    }else{
        cc.log("当前不是微信小游戏环境,无法分享");
    }
};
/**
 * 微信登录
 * @param callback 成功返回
 */
wxUtil.loginWx=function(callBack){
    if(CC_WECHATGAME){
        wx.login({
            success(res) {
                cc.log("[获的用户code]------",res.code);
                console.log(res);
                // HTTP.GET(
                //     "https://ddzgame.lwfjmj.com/Handler/WXddzCommon.ashx",
                //     {
                //         action:"apisessionkey",
                //         code:res.code,
                //     },
                //     function(res){
                //         wxData.set("userid",res.data.userid);
                //         wxData.set("sign",res.data.sign);
                        callBack(res);
                //     }
                // );

                // HTTP.GET(
                //     "https://tr.lwfjmj.com/WeiXin/APISessionKey",
                //     {
                //         type:1,
                //         code:res.code,
                //     },
                //     function(res){
                //         if (res.code === 1000 && res.jsonresult)
                //         {
                //             callBack(res.jsonresult);
                //         }
                        
                //     }
                // );

                // wxData.set("szName",userName) 
                // wxData.set("nickName",userName)
            },
            fail(){
                console.log('登录失败！' + res.errMsg);
            }
        });
    }else{
        cc.log("当前不是微信小游戏环境,无法分享");
    }
};
/**
 * 获取当前用户信息
 * @param callBack 回调函数，res={userInfo:用户信息对象，不包含敏感信息,rawData:用于计算签名,signature:用于校验用户信息,encryptedData:完整用户信息,iv:加密算法的初始向量}
 */
wxUtil.getUserInfo = function (callBack,failcallBack) {
    if(CC_WECHATGAME){
        wx.getUserInfo({
            withCredentials:true,
            lang:"zh_CN",
            success: function(res) {
                if (callBack)
                {
                    callBack(res);
                }
            },
            fail:function () {
                cc.log("获取用户信息失败!");
                if (callBack)
                {
                    failcallBack()
                }
            }
        })
    }else{
        cc.log("当前不是微信小游戏环境,无法分享");
    }
};
/**
 * 获得从分享链接进入时带的参数
 * @returns {*}
 */
wxUtil.getLaunchParam=function(){
    if(CC_WECHATGAME){
        var arg = wx.getLaunchOptionsSync();
        cc.log("小程序启动参数",arg);
        return arg;
    }
    return {};
};
/**
 * 获得用户是否已授权
 * @param key 权限类型,eg:scope.userInfo
 * @param callback 获取成功后的回调函数
 */
wxUtil.getUserAuthInfo=function(key,callback){
    if(CC_WECHATGAME){
        wx.getSetting({
            success (res) {
                callback(res.authSetting[key]);
            },
            fail(){
                cc.log("获取用户授权信息失败");
            }
        })
    }else{
        cc.log("当前不是微信小游戏环境,无法分享");
    }
};

/**
 * 显示广告
 * @param {Functoin}callback 成功回调
 */
wxUtil.fhowAD=function(callback){
    //todo
    cc.log("显示广告todo")
    if(CC_WECHATGAME){
        callback();
        return
    }
    callback()
};

wxUtil.createUserInfoButton=function(btn,callback){
    if(!CC_WECHATGAME|| !btn){
        return btn;
    }

    var spriteFrame = btn.getComponent(cc.Sprite).spriteFrame;

    let btnSize = cc.size(btn.width,btn.height);
    let frameSize = cc.view.getFrameSize();
    let winSize = cc.director.getWinSize();
    //适配不同机型来创建微信授权按钮
    let left = (winSize.width*0.5+btn.x-btnSize.width*0.5)/winSize.width*frameSize.width;
    let top = (winSize.height*0.5-btn.y-btnSize.height*0.5)/winSize.height*frameSize.height;
    let width = btnSize.width/winSize.width*frameSize.width;
    let height = btnSize.height/winSize.height*frameSize.height;

    var style = {
        left: left,
        top: top,
        width: width,
        height: height
    }

    let createUserInfoButton = wx.createUserInfoButton({
        type: 'image',
        image: spriteFrame._textureFilename || cc.url.raw("resources/img2/login/wxdr.png"),
        //text: '获取用户信息',
        style: style
    });

    //{nickName: "暗影飘零", gender: 1, language: "zh_CN", city: "Fuzhou", province: "Fujian", …}
    var onCreateUserInfoButtonTap = function (res) {
        if(callback)
        {
            callback(res)
        }
        createUserInfoButton.hide();
        createUserInfoButton.destroy();
    }.bind(this);

    createUserInfoButton.onTap(onCreateUserInfoButtonTap);
    createUserInfoButton.show();

    btn.active = false;
    return createUserInfoButton;
};


wxUtil.getUserStorageDataSync =function(key) {
    cc.log("===========key : ", key);
    if (CC_WECHATGAME) {
        if (typeof key === "string" && key.length > 0) {
            var fullKey = "Storage" + key;

            return wx.getStorageSync(fullKey);
        }
    }

    return null;
};

wxUtil.saveUserStorageDataSync =function(key, value) {
    cc.log("===========value, key : ", value, " ---- ", key);
    if (CC_WECHATGAME) {
        if (typeof key === "string" && key.length > 0) {
            var fullKey = "Storage" + key;
            wx.setStorageSync(fullKey, value);
            return true;
        }
    }

    return false;
};