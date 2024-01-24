export const vertexShaderSrc = `
  attribute vec2 a_position; // 接受顶点坐标
  attribute vec2 a_texcoord; // 接受纹理坐标
  varying vec2 v_texcoord; // 传递纹理坐标给片元着色器
  uniform mat4 u_mat; // 矩阵变量
  uniform vec2 u_translation; // 平移向量

  void main(void) {
    vec2 position = a_position + u_translation;
    gl_Position = vec4(position, 0.0, 1.0); // 设置坐标
    v_texcoord = a_texcoord; // 设置纹理坐标
  }
`
