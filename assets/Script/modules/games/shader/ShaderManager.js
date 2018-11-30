
// var ShaderLab = require("ShaderLab");
// var ShaderMaterial = require("ShaderMaterial");
var manage = {};

manage.useShader = function (sprite, shader) {
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        console.warn('Shader not surpport for canvas');
        return;
    }
    console.log("sprite", sprite);
    if (!sprite || !sprite.spriteFrame || sprite.getState() === shader) {
        return;
    }
    if (shader > ShaderType.Gray) {
        let name = ShaderType[shader];
        let lab = ShaderLab[name];
        if (!lab) {
            console.warn('Shader not defined', name);
            return;
        }
        cc.dynamicAtlasManager.enabled = false;
        
        // let material = new ShaderMaterial(name, lab.vert, lab.frag, lab.defines || []);
        var material = new ShaderMaterial();
        material.callfunc(name, lab.vert, lab.frag, lab.defines || []);

        let texture = sprite.spriteFrame.getTexture();
        material.setTexture(texture);
        material.updateHash();
        let sp = sprite; // as any;
        console.log("material", sprite._renderData);
        sp._material = material;
        // sprite._renderData.material = material;
        sp._state = shader;
        return material;
    }
    else {
        sprite.setState(shader);
    }
}

// var manage = cc.Class({
//     // extends: Material,
//     name: "ShaderManager",

//     properties: {

//     },
//     useShader (sprite, shader) {
//     	if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
//             console.warn('Shader not surpport for canvas');
//             return;
//         }
//         if (!sprite || !sprite.spriteFrame || sprite.getState() === shader) {
//             return;
//         }
//         if (shader > ShaderType.Gray) {
//             let name = ShaderType[shader];
//             let lab = ShaderLab[name];
//             if (!lab) {
//                 console.warn('Shader not defined', name);
//                 return;
//             }
//             cc.dynamicAtlasManager.enabled = false;
//             // let material = new ShaderMaterial(name, lab.vert, lab.frag, lab.defines || []);
//             let material = new ShaderMaterial();
//             material.callfunc();

//             // let texture = sprite.spriteFrame.getTexture();
//             // material.setTexture(texture);
//             // material.updateHash();
//             // let sp = sprite; // as any;
//             // sp._material = material;
//             // sp._renderData._material = material;
//             // sp._state = shader;
//             // return material;
//         }
//         else {
//             sprite.setState(shader);
//         }
//     },
// });

// console.log("wocao", manage);

module.exports = manage;

