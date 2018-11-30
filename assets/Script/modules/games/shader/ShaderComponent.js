
// var ShaderManager = require("ShaderManager");
// var ShaderMaterial = require("ShaderMaterial");

// const NeedUpdate = [ShaderType.Fluxay, ShaderType.FluxaySuper];

window.ShaderType = cc.Enum({
    Default: 0,
    Gray: 1,
    GrayScaling: 100,
    Stone: 101,
    Ice: 102,
    Frozen: 103,
    Mirror: 104,
    Poison: 105,
    Banish: 106,
    Vanish: 107,
    Invisible: 108,
    Blur: 109,
    GaussBlur: 110,
    Dissolve: 111,
    Fluxay: 112,
    FluxaySuper: 113,
});

const NeedUpdate = [ShaderType.Fluxay, ShaderType.FluxaySuper];

cc.Class({
    extends: cc.Component,

    properties: {
    	mShader: {
            default: ShaderType.Default,
            type: ShaderType
        },
    },
    // ctor () {
    // 	console.log("ctor wocao");
    // },

    onLoad () {
    	this._color = cc.color();
    	this._start = 0;

    	this._shader = this.mShader;
    	// this._material = ShaderMaterial;
    	console.log("this._color", this._color);

    	// console.log("ShaderComponent", ShaderLab);
    	// console.log("this.type", this.mShader);
    	this.node.getComponent(cc.Sprite).setState(0);
    	this._applyShader();
        // this._applyShader();
        console.log("wocao");
    },

    _applyShader() {
        let shader = this._shader;
        let sprite = this.node.getComponent(cc.Sprite);
        console.log("ShaderManager", ShaderManager);
        let material = ShaderManager.useShader(sprite, shader);

        this._material = material;
        this._start = 0;
        let clr = this._color;
        clr.setR(255), clr.setG(255), clr.setB(255), clr.setA(255);
        if (!material) return;
        switch (shader) {
            case ShaderType.Blur:
            case ShaderType.GaussBlur:
                material.setNum(0.03); //0-0.1
                break;
            default:
                break;
        }
        this._setShaderColor();
    },

    _setShaderColor() {
        let node = this.node;
        let c0 = node.color;
        let c1 = this._color;
        let r = c0.getR(), g = c0.getG(), b = c0.getB(), a = node.opacity;
        let f = !1;
        if (c1.getR() !== r) { c1.setR(r); f = !0; }
        if (c1.getG() !== g) { c1.setG(g); f = !0; }
        if (c1.getB() !== b) { c1.setB(b); f = !0; }
        if (c1.getA() !== a) { c1.setA(a); f = !0; }
        f && this._material.setColor(r / 255, g / 255, b / 255, a / 255);
    },

    _setShaderTime(dt) {
        if (NeedUpdate.indexOf(this._shader) >= 0) {
            let start = this._start;
            if (start > 65535) start = 0;
            start += dt;
            this._material.setTime(start);
            this._start = start;
        }
    },


});


