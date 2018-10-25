/****************************************************************************
 * Copyright (c) 2018 福州来玩互娱网络科技有限公司 
 *         All rights reserved. 
 * 
 * 
 * Filename:   baseData基础数据模块,对数据进行存取,分发. 
 * Summary:    游戏数据模块类的基类
 * 
 * Version:    1.0.0
 * Author:     HZS
 * Date:       2018/10/15
 *****************************************************************************/

 //事件通知
var _dataEvent = cc.systemEvent;

cc.Class({
    checkKey(key)
    {

    },

    /**
     * 设置数据
     * 
     * @param {String} key 数据索引 
     * @param {Any} value 数据值 
     */

    set(key,value)
    {
        this[key] = value;
        //不加此判断,在creator编辑器中会报错
        if(_dataEvent)
        {
            _dataEvent.emit(this.classname+key,value);
        }
    },

    /**
     * 设置数据
     * 
     * @param {Object} values 数据对象
     */
    sets(values)
    {
        for (let k in values)
        {
            this.set(k,values[k]);
        }
    },

    /**
     * 获取数据
     * 
     * @param {String} key 数据索引 
     * 
     * @returns {Any}  数据值 
     */
    get(key)
    {
        return this[key];
    },

    /**
     * 获取所有数据
     * 
     * @param {String} key 数据索引 
     * 
     * @returns {Object}  所有数据(这里直接返回整个对象,未找到只返回properties 的方法) 
     */
    getAll()
    {
        return this;
    },

    /**
     * 数据监听
     * 
     * @param {String} key 数据索引 
     * @param {Function}} callback 回调,在首次调用或数据发生改变时会调用(数据不可为undefine) 
     * 
     */
    on(key,callback)
    {
        if (typeof(callback) !== "function")
        {
            return
        }
        //不加此判断,在creator编辑器中会报错
        if(_dataEvent)
        {
            _dataEvent.on(this.classname+key,callback);
        }

        var value = this.get(key);
        if (value !== undefined)
        {
            callback(value);
        }
    },

    /**
     * 绑定数据到cc.Label,cc.EditBox上,显示的数值会实时变化
     * 
     * @param {String} key 数据索引 
     * @param {cc.Label}} lable 显示对应值的控件 
     * @param {Int}} iBaseNum 对应值为数字的时候,进行倍率 
     * 
     */
    bindLable(key,lable,iBaseNum)
    {
        var nodeLable = lable.getComponent(cc.Label) || lable.getComponent(cc.EditBox)
        if(!nodeLable)
        {
            cc.error("bindLable arg2 mush be a cc.Lable")
            return
        }
        this.on(key,function(text){
            if (typeof(text) == "number")
            {
                iBaseNum = iBaseNum || 1;
                text = text/iBaseNum;
            }
            else if(iBaseNum)
            {
                cc.error("bindLable value is not a number key = " + key)
            }
            nodeLable.string = text;
        }.bind(this));
    },

    /**
     * 设置数据显示到文本控件上,只显示一次.不做实时刷新
     * 
     * @param {String} key 数据索引 
     * 
     */
    setLableText(key,lable)
    {
        var nodeLable = lable.getComponent(cc.Label) || lable.getComponent(cc.EditBox)
        if(!nodeLable)
        {
            cc.error("bindLable arg2 mush be a cc.Lable")
            return
        }
        var text = this.get(key);
        nodeLable.string = text;
    },

    save(key)
    {
        if(!this.__cid__ || this.__cid__ == "")
        {
            cc.error("必须要有类名才能保存值")
            return
        }

        var value = String(this.get(key))
        wxUtil.saveUserStorageDataSync(value, this.__cid__+key);
    },

    read(key,def)
    {
        if(!this.__cid__ || this.__cid__ == "")
        {
            cc.error("必须要有类名才能保存值")
            return
        }

        var value = wxUtil.getUserStorageDataSync(this.__cid__+key) || def || "";
        return value
    },

    /**
     * 自动存取数据,目前只支持String类型(这里现在会调用两次存取,todo)
     * 
     * @param {String} key 数据索引 
     * @param {String} def 默认数值 
     * 
     */
    autoReadSave(key,def)
    {
        if(!CC_WECHATGAME)
        {
            return
        }

        let isFirst = true;
        this.set(key,this.read(key,def))
        this.on(key,function(text){
            if (isFirst)
            {
                isFirst = null;
                return;
            }
            this.save(key)
        }.bind(this));
    },
});