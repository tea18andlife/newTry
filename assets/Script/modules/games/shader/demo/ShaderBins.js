
cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        // this._color = cc.color();
        this._start = 0;
        this.node.script = this;
        this.pos_desc = cc.find("pos_desc", this.node);

        let mVert = `
uniform mat4 viewProj;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
void main () {
    vec4 pos = viewProj * vec4(a_position, 1);
    gl_Position = pos;
    uv0 = a_uv0;
}`;
        let mFrag = `
uniform sampler2D texture;
varying vec2 uv0;
varying vec4 color;
uniform vec3 pos;

const float waterwid = 0.1;
const float deepwid = 0.2;
const float pi = 3.141592653589793;

float CountScale(float left,float right)
{
    //水深
    float depth = pos.y;
    //防止怪异现象
    if (depth > 1.)
    {
        depth = 1.;
    }
    else if (depth < 0.)
    {
        depth = 0.;
    }
    //像素Y值缩放
    float scale = 1.-depth;
    float length = right - left;
    float mysca = pi/length;
    //向下弯曲的坐标值定在0.-1.之间
    float mpos = (uv0.x - left)/length;
    if (mpos < (1.-deepwid)/2. )
    {
        mpos = 1./(1.-deepwid)*(mpos);
        scale = (1.-depth) + depth *(0.5001-0.5*(sin(-pi/2.+mpos*2.*pi)) );
    }
    else if( mpos > (1.+deepwid)/2.)
    {
        mpos = 1./(1.-deepwid)*(mpos-deepwid);
        scale = (1.-depth)+ (depth)*(.5001-.5*( sin(-pi/2.+(mpos)*2.*pi) ) );
    }
    return scale;
}

void main() {
    float scale = 1.;
    float left  = pos.x - waterwid/2.;
    float right = pos.x + waterwid/2.;
    if (uv0.x > left && uv0.x < right )
    {
        scale = CountScale(left,right);
    }
    vec4 mycolor = vec4(0.0);
    if (1.-uv0.y < scale )
    {
        mycolor = texture2D(texture, vec2(uv0.x,1./scale*(uv0.y-1.+scale))  );
    }
    
    gl_FragColor = mycolor;
}
`
    
        var lab = {
            vert: mVert,
            frag: mFrag,
            name: "bins"
        }

        this.getComponent(cc.Sprite).setState(0);
        let sprite = this.getComponent(cc.Sprite);
        let material = util.useShader(sprite, lab);
        this._material = material;

        this.addTouch();
    },

    addTouch () {
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            var pos = this.node.convertToNodeSpace(cc.v2(event.touch._point.x, event.touch._point.y));
            this.changePos(pos)
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
            var pos = this.node.convertToNodeSpace(cc.v2(event.touch._point.x, event.touch._point.y));
            this.changePos(pos)
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            var pos = this.node.convertToNodeSpace(cc.v2(event.touch._point.x, event.touch._point.y));
            this.changePos(pos)
        }, this);
    },
    changePos (pos) {
        let x = pos.x/this.node.width;
        let y = pos.y/this.node.height;
        this.pos_desc.setLabel("x:"+x.toFixed(2)+" y:"+y.toFixed(2))
        this._material.setPos(x, 1-y, 0);
    },

    // update (dt) {
    //     if (this._start > 65535) {
    //         this._start = 0;
    //     }
    //     this._start += dt;

    //     this._material.setTime(this._start);
    // },
    
});