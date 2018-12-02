

var ShaderType = cc.Enum({
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
        _color: cc.color(),
        _start: 0,
    },

    start () {
        this._shader = this.mShader;

        this.getComponent(cc.Sprite).setState(0);
        this._applyShader();
    },

    _applyShader() {
        let shader = this._shader;
        let sprite = this.getComponent(cc.Sprite);
        let material = util.useShader(sprite, shader);


        this._material = material;
        this._start = 0;
        let clr = this._color;
        // clr.setR(255), clr.setG(255), clr.setB(255), clr.setA(255);
        // if (!material) return;
        // switch (shader) {
        //     case ShaderType.Blur:
        //     case ShaderType.GaussBlur:
        //         material.setNum(0.03); //0-0.1
        //         break;
        //     default:
        //         break;
        // }
        // this._setShaderColor();
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

    // update(dt) {
    //     // console.log("dt", dt);
    //     if (NeedUpdate.indexOf(this._shader) >= 0) {
    //         let start = this._start;
    //         if (start > 65535) start = 0;
    //         start += dt;
    //         this._material.setTime(start);
    //         this._start = start;
    //     }
    // },

});
