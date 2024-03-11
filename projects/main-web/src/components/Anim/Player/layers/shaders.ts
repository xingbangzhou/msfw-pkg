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
  uniform sampler2D u_texture1;

  uniform int u_test;
  
  void main(void) {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    if (u_test == 1) {
        vec4 texColor1 = texture2D(u_texture1, v_texcoord);
  
        gl_FragColor = vec4(texColor.rgb, texColor.a * texColor1.a);
    } else {
        gl_FragColor = texColor;
    }
    // gl_FragColor = texColor;
  }
`
