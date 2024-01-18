export const vertextShaderCode = `
  attribute vec2 a_position; // 接受顶点坐标
  attribute vec2 a_texCoord; // 接受纹理坐标
  varying vec2 v_texCoord; // 传递纹理坐标给片元着色器

  void main(void) {
    gl_Position = vec4(a_position, 0.0, 1.0); // 设置坐标
    v_texCoord = a_texCoord; // 设置纹理坐标
  }
`

export const fragmenShaderCode = `
  precision lowp float;
  varying vec2 v_texCoord;
  uniform sampler2D u_image0;
  uniform sampler2D u_image1;

  void main(void) {
    vec4 color0 = vec4(texture2D(u_image0, v_texCoord).rgb, texture2D(u_image0, v_texCoord+vec2(0.5, 0)).r);
    vec4 color1 = vec4(texture2D(u_image1, v_texCoord).rgb, 1.0);
    gl_FragColor = color0;
  }
`
