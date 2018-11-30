varying vec2 v_texCoord;
varying vec4 v_fragmentColor;

uniform float PosX;
uniform float PosY;

void main()
{
	float t_x;
    if (PosX > 0.0)
    {
        t_x = 1.- v_texCoord.x; 
    }
    else
    {
        t_x =  v_texCoord.x; 
    }
    float m_y = (v_texCoord.y - 0.5) * (2. * abs(PosX) * t_x + 1.) + 0.5 ;
    //float m_alpha = texture2D(CC_Texture0, fract(vec2(v_texCoord.x, m_y))).a ; 
    vec4 normalColor = texture2D(CC_Texture0, fract(vec2(v_texCoord.x, m_y)));
    if(m_y < 0. || m_y > 1.){                                                              
        normalColor = vec4(0.);
    }        
    gl_FragColor = v_fragmentColor * vec4(normalColor);

}
