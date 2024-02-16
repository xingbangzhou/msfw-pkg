export const vertexShaderSrc = `
  attribute vec2 a_position;  // 接受顶点坐标
  attribute vec2 a_texcoord;  // 接受纹理坐标

  uniform mat4 u_matrix;  // 顶点矩阵
  uniform mat4 u_texMatrix;

  varying vec2 v_texcoord;

  void main(void) {
    vec4 position = vec4(a_position, 0.0, 1.0);
    gl_Position = u_matrix * position;
    v_texcoord = (u_texMatrix * vec4(a_texcoord, 0, 1)).xy;
  }
`
