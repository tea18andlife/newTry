
var baseWin = require("baseWin");

cc.Class({
    extends: baseWin,

    start () {
    	this.initLogin();

    },

    initLogin () {
    	//获取微信用户信息后,执行登录
        var onGetUserInfo = function(res)
        {
            wxData.set("nickName",res.nickName)
            wxData.set("headweb",res.avatarUrl)
            wxData.set("sex",res.gender)
            this.initUserInfo();
        }.bind(this)

		//没有openid向服务器申请.
        wxUtil.loginWx((res)=>{
            if (res.openid)
            {
                wxData.set("szName", res.openid);
            }
            console.log("获取用户信息");
            //获取用户信息
            wxUtil.getUserInfo(
                //成功
                (res)=>{
                    cc.log("getUserInfo", res);
                    onGetUserInfo(res.userInfo)
                },
                //失败,把登录按钮换成授权按钮
                ()=>{
                	this.btn_connect.active = true;

                    wxUtil.createUserInfoButton(this.btn_connect, (res)=>{
                        cc.log("createUserInfoButton",res);
                        onGetUserInfo(res.userInfo)
                        this.btn_connect.active = false;
                    })
                    
                }
            )
        })
    },

    initUserInfo () {
    	console.log("微信登录成功后的初始化人物信息");

    	// this.lb_name.getcom
    	wxData.setLableText("nickName", this.lb_name);
    	// imgUserHand.
    	this.img_head.loadUrlImage(wxData.headweb,'png');
    },

    onEnter () {
    	var self = this;
    	this.btn_1.quickBt(function () {
    		uiFunc.closeUI(self, true);
            // uiFunc.openUI("2048/ui2048");
            uiFunc.openUI("plusOne/uiPlusOne");
    	});
    },
    touchClose () {
    	uiFunc.closeUI(this, true);
    },
});