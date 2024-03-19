export const VertexShader = `
  attribute vec4 a_position;  // 接受顶点坐标
  attribute vec2 a_texcoord;  // 接受纹理坐标

  uniform mat4 u_matrix;  // 顶点矩阵
  uniform mat4 u_texMatrix; // 纹理矩阵

  varying vec2 v_texcoord;

  void main() {
    gl_Position = u_matrix * a_position;

    v_texcoord = a_texcoord;
  }
`

export const FragmentShader = `
  precision mediump float;
  
  varying vec2 v_texcoord;
  
  uniform sampler2D u_texture;
  uniform sampler2D u_maskTexture;

  uniform int u_maskMode;
  uniform float u_opacity;
  
  void main(void) {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    texColor.a = texColor.a * u_opacity;
    if (u_maskMode == 1) {
      vec4 maskColor = texture2D(u_maskTexture, v_texcoord.xy);
      float light = maskColor.r * 0.3 + maskColor.g * 0.6 + maskColor.b * 0.1;
      gl_FragColor = vec4(texColor.rgb, texColor.a * light);
    } else if (u_maskMode == 2) {
      vec4 maskColor = texture2D(u_maskTexture, v_texcoord.xy);
      gl_FragColor = vec4(texColor.rgb, texColor.a * maskColor.a);
    } else if (u_maskMode == 3) {
      gl_FragColor = vec4(texColor.rgb, texColor.a * texture2D(u_texture, v_texcoord+vec2(0.5, 0)).r);
    } else {
      gl_FragColor = texColor;
    }
  }
`
