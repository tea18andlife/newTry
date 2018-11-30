
cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        console.log("wenyuStar");
        var vsh = 
        `
attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_color;

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

void main()
{
    gl_Position = CC_PMatrix * a_position;
    v_fragmentColor = a_color;
    v_texCoord = a_texCoord;
}
        `;
        var fsh = 
        `
varying vec2 v_texCoord;
varying vec4 v_fragmentColor;


void main()
{
    vec4 normal = vec4(0.0);
    normal = texture2D(CC_Texture0, vec2(v_texCoord.x, v_texCoord.y));
    gl_FragColor = v_fragmentColor * normal;
}
        `;
        // console.log(fsh);
        // var glProgram = new cc.GLProgram();
        // glProgram.initWithString(vsh, fsh);
    },
});