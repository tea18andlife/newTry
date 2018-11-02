// Create by ChangWei on 2018/10/16
require("extend")
require("wxUtil")
//工具类
var util = {};

// 本地测试的时候开启来为True 不要上传到svn
util.isChangweiTest = false
// 屏幕打印函数  一般调试的时候用  往上飘一会  util.mlog("打印")
util.PrintPosDiff = 15;


util.mlog = function () {
    var mstr = "";
    for (var i in arguments) {
        if (i == 0) {
            mstr += arguments[i];
        } else {
            mstr += " ; " + arguments[i];
        }
    }
    if (util.PrintPosDiff > 1) {
        util.PrintPosDiff -= 1; 
    } else {
        util.PrintPosDiff = 15;
    }
    var scene = cc.director.getScene();
    var uTime = 6.5;

    var node = new cc.Node("loadText");
    var label = node.addComponent(cc.Label);
    node.color = new cc.Color(80, 19, 0);
    node.position = cc.v2(cc.winSize.width / 2, util.PrintPosDiff * 30);
    label.fontSize = 30;
    label.Font = "黑体"
    label.string = mstr;
    scene.addChild(node);
    node.zIndex = 9999;
    
    var action = cc.sequence(
        cc.spawn(
            cc.fadeOut(uTime),
            cc.moveBy(uTime, cc.v2(0, 400))
        ),
        cc.removeSelf()
    );
    node.runAction(action);
};
// 加载资源创建精灵  因为是异步加载的  你不能loadSp后就直接得到精灵了  要加载完后对其操作
/*
util.loadSp(self.btn_email, "img2/HelloWorld", function (node) {
    node.setPosition(x, y);
});
*/
util.loadSp = function (parent, path, func) {
    if (GM.hasLoadImg[path]) {
        var node = new cc.Node("loadSp");
        //调用新建的node的addComponent函数，会返回一个sprite的对象 
        var sprite = node.addComponent(cc.Sprite);
        //给sprite的spriteFrame属性 赋值  
        sprite.spriteFrame = GM.hasLoadImg[path];
        parent.addChild(node);
        if (func != null )
            func(node);
    } else {
        cc.loader.loadRes(path, cc.SpriteFrame, function(err, spriteFrame){ 
            if (err) {
                cc.error(err.message || err);
                return;
            }
            // cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
            var node = new cc.Node("loadSp");
            //调用新建的node的addComponent函数，会返回一个sprite的对象 
            var sprite = node.addComponent(cc.Sprite);
            //给sprite的spriteFrame属性 赋值  
            sprite.spriteFrame = spriteFrame;
            GM.hasLoadImg[path] = spriteFrame;
            parent.addChild(node);
            if (func != null )
                func(node);
        })
    }
};
// 找到两个不同节点的相对相差位置  var pos = util.moveToOtherWordPoint(self.btn_email, self.btn_setting)  self.btn_email.setPosition(pos); 就能移动到相同的相对位置了
util.moveToOtherWordPoint = function(mNode, toNode) {
    var oPos = toNode.getPosition();
    oPos = toNode.getParent().convertToWorldSpace(oPos);
    // ### 两者相差
    var sPos = mNode.getParent().convertToNodeSpace(oPos);
    return sPos;
};
// 播放音效 传入本地路径 util.playSound("common/Common_Panel_Dialog_Pop_Sound")
util.playSound = function (path) {
    var fullPath = "audio/"+path;
    if (GM.hasLoadSound[fullPath] == null) {
        cc.loader.loadRes(fullPath, cc.AudioClip, function (err, clip) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            cc.audioEngine.playEffect(clip, false);
            GM.hasLoadSound[fullPath] = clip;
        });
    } else {
        cc.audioEngine.playEffect(GM.hasLoadSound[fullPath], false);
    }
}
// 因为点击下按钮 起来 实在是太常用了 所以单独封装出来 util.SoundClick()
util.SoundClick = function () {
    util.playSound("common/Common_Panel_Dialog_Pop_Sound")
};
// 播放音效 传入本地路径 util.playSound("common/Common_Panel_Dialog_Pop_Sound")
util.playMusic = function (path, isLoop) {
    var fullPath = "audio/"+path;
    if (GM.hasLoadSound[fullPath] == null) {
        cc.loader.loadRes(fullPath, cc.AudioClip, function (err, clip) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            cc.audioEngine.playMusic(clip, isLoop);
            GM.hasLoadSound[fullPath] = clip;
        });
    } else {
        cc.audioEngine.playEffect(GM.hasLoadSound[fullPath], false);
    }
}

// 这里不能去掉img2 的原因是目前还没有封装完全  对于plist的图还没写进来 而且用户传的可能是#xx.png  util.display(self.sp_head, "img2/userhead/touxiang001")
util.display = function(node, fileName) {
    if (fileName === undefined)
        return node.getSpriteFrame();
    else if (typeof fileName === 'string') {
        if (GM.hasLoadImg[fileName]) {
            node.getComponent(cc.Sprite).spriteFrame = GM.hasLoadImg[fileName];
        } else {
            cc.loader.loadRes(fileName, cc.SpriteFrame, function(err, spriteFrame){ 
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                // cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));

                GM.hasLoadImg[fileName] = spriteFrame;
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
    }
};
// 获取后缀名 util.getSuffixName("xxx.plist") -> plist
util.getSuffixName = function(filename) {
    var index1 = filename.lastIndexOf(".");
    var index2 = filename.length;
    //后缀名
    var postf  = filename.substring(index1+1, index2);
    return postf
};
// 加载网络图片 如果提示跨域请求失败让服务端处理   util.loadUrlImg(this.sprite_head, "http://tools.itharbors.com/christmas/res/tree.png")
util.loadUrlImg = function(node, picUrl) {
    if (GM.hasLoadImg[picUrl]) {
        node.getComponent(cc.Sprite).spriteFrame = GM.hasLoadImg[picUrl];
    } else {
        cc.loader.load({url: picUrl, type: util.getSuffixName(picUrl)}, function (err, texTure) {
            var spriteFrame = new cc.SpriteFrame(texTure);
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            GM.hasLoadImg[picUrl] = spriteFrame;
        });
    }
};
// 从父节点脱落 到新的节点去 util.exto(this.hello_word, this.parent_node)
util.exto = function(child, father, zorder) {
    zorder = zorder || 0;
    var oldFather = child.getParent();

    if (oldFather) {
        child.removeFromParent(false);
        father.addChild(child, zorder);
    } else {
        father.addChild(child, zorder);
    }
};
// CocosCreater2.0后已经去掉了颜色穿透  所以要透明穿透只能把这个节点及其子节点设置颜色  util.setColor(this.hello_word, cc.color(0, 0, 0))
util.setColor = function(node, color) {
    node.color = color;
    var children = node.getChildren();
    for (var i = 0; i < children.length; i++) {
        util.setColor(children[i], color);
    }
};

/**
 * 返回时间搓对应的日期
 * @param time
 * @returns {*}
 */
util.getDateString=function(time){
  return new Date(time).Format("yyyy-MM-dd hh:mm:ss");
};

util.ifNull = function(mParam, mDefault){
    if (mParam == null) {
        return mDefault;
    } else {
        return mParam;
    }
};

util.getRandom = function (maxSize) {
    return Math.floor(Math.random() * maxSize) % maxSize;
}

util.tabcontains = function (tab, value) {
    for (var i = 0; i < tab.length; i++) {
        if (tab[i] == value) {
            return true;
        }
    }
    return false;
};

module.exports = util;