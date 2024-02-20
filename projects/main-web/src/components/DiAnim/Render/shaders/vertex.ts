export const vertexShaderSrc = `
  precision highp float;
  attribute vec4 a_position;  // 接受顶点坐标
  attribute vec2 a_texcoord;  // 接受纹理坐标

  uniform mat4 u_matrix;  // 顶点矩阵
  uniform mat4 u_texMatrix; // 纹理矩阵
  uniform int u_layerType; // 图层类型

  varying vec2 v_texcoord;

  void main() {
    gl_Position = u_matrix * a_position;
    v_texcoord = (u_texMatrix * vec4(a_texcoord, 0, 1)).xy;
  }
`
