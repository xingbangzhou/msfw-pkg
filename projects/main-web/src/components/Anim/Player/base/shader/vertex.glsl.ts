export default `
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
