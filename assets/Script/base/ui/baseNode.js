/****************************************************************************
 * Copyright (c) 2018 福州来玩互娱网络科技有限公司 
 *         All rights reserved. 
 * 
 * 
 * Filename:   baseNode基础节点 
 * Summary:    主要实现控件便捷调用,控制名中包含"_"的,可以直接用调用,比如: this.btn_close
 * 
 * Version:    1.0.0
 * Author:     HZS
 * Date:       2018/10/15
 *****************************************************************************/
/* eslint-disable */
cc.Class({
    extends: cc.Component,

    properties: {
        openAction:{
            default: false,
        },

    },

    //privete: 如果进行继承需要在子类里面调用this._super();
    onLoad () {
        //只有带"_"的 节点名字才会加入映射
        var linkWidget = function(self, nodeDict) {
            var children = self.children;
            for (let i = 0; i < children.length; i++) {
                var widgetName = children[i].name;
                if (widgetName && widgetName.indexOf("_") > 0) {
                    var nodeName = widgetName;
                    if (nodeDict[nodeName]) {
                        // cc.log("控件名字重复!" + children[i].name);
                    }
                    nodeDict[nodeName] = children[i];
                }
                if (children[i].childrenCount > 0) {
                    linkWidget(children[i], nodeDict);
                }
            }
        }.bind(this);
        linkWidget(this.node, this);

        this.cantouch = false
        
        
        //添加底部吞噬层.. 重要改动 这里将吞噬放到 basewin 和 basedlg去做 
        //this.addComponent(cc.BlockInputEvents)
    },

    show()
    {
        this.__showing__ = true
       
        var children = this.node.parent.children;
        var zIndex = 0;
        for (let i = 0; i < children.length; i++) {
            zIndex = Math.max(zIndex,children[i].zIndex)
        }
        this.node.zIndex = zIndex + 1;

        
        if(this.openAction){
           
            var children = this.node.children;
            
            for (var i = 0; i < children.length; i++) {
                
                if(children[i].lwMaskName != "lwMaskName" ){
                    var oriScale = children[i].getScale()
                    
                    var action1 = cc.scaleTo(0.005, 0.5);
                    var action2 = cc.scaleTo(0.13, oriScale+0.05);
                    var action3 = cc.scaleTo(0.13, oriScale);
                    var action4 = cc.scaleTo(0.08, oriScale+0.02);
                    var action5 = cc.scaleTo(0.08, oriScale);
                   
                    var seq = undefined
                    seq = cc.sequence(cc.hide(),action1,cc.show(),action2,action3,action4,action5);
                   
                    seq.easing(cc.easeOut(1.0))

                    children[i].runAction(seq);
                }
             
            }
           
            
        }else{
          
        }
        
    },
  
  

    hide()
    {
        this.node.zIndex = 0;
    },

    lateUpdate()
    {
        
        if (this.__showing__ && this.onEnter)
        {
            this.__showing__ = false;

            if(this.openAction){
                this.cantouch = false
                this.scheduleOnce(function () {
                    this.onEnter()
                },0.05)
                
                this.scheduleOnce(function () {
                    this.cantouch = true
                },0.8)
                
               
               
            
            }else{
                this.onEnter()
            }
        }
    },
});
