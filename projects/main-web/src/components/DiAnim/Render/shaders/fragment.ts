export const fragmenShaderSrc = `
  precision highp float;
  varying vec2 v_texcoord;
  uniform sampler2D u_image0;
  uniform int u_moldType;

  void main(void) {
    if (u_moldType == 0) {
      gl_FragColor = vec4(texture2D(u_image0, v_texcoord).rgb, texture2D(u_image0, v_texcoord+vec2(0.5, 0)).r);
    } else if (u_moldType == 1) {
      gl_FragColor = vec4(texture2D(u_image0, v_texcoord).rgb, 1.0);
    }
  }
`
