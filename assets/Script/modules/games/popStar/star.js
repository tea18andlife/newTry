

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        var self = this;
    },
    setColorWhich (which) {
    	// 绿色 150 243 137  黄 231 235 131  蓝 133 166 222  粉色 227 118 216 红 232 92 95
    	var colors = [cc.color(116,179,231), cc.color(150,243,137), cc.color(136,72,152), cc.color(232,92,95), cc.color(231,235,131)];
    	this.node.color = colors[which];
    },
    setArrPosition (colIndex, rowIndex) {
    	var pos = this.getArrPos(colIndex, rowIndex);
    	this.node.setPosition(pos);
    },
    getArrPos (colIndex, rowIndex) {
    	var x = (this.game.sp_main.width / this.game.numX)*(colIndex+0.5);
    	var y =(this.game.sp_main.height / this.game.numY)*(rowIndex+0.5);
    	return cc.v2(x, y);
    },
    moveArrPos (colIndex, rowIndex, time) {
    	time = util.ifNull(time, 0.18)
    	var pos = this.getArrPos(colIndex, rowIndex);
    	var moveAction = cc.moveTo(time, pos);
    	this.node.runAction(moveAction);
    },
    // resetPos () {
    //     this.setArrPosition(this.starData.indexOfColumn, this.starData.indexOfRow)
    // },
});