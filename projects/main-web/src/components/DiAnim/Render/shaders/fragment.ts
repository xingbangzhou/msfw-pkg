export const fragmenShaderSrc = `
  precision mediump float;

  varying vec2 v_texcoord;
  
  uniform sampler2D u_texture;
  uniform int u_fragType;

  void main(void) {
    if (u_fragType == 0) {
      gl_FragColor = vec4(texture2D(u_texture, v_texcoord).rgb, texture2D(u_texture, v_texcoord+vec2(0.5, 0)).r);
    } else if (u_fragType == 1) {
      if (v_texcoord.x < 0.0 ||
          v_texcoord.y < 0.0 ||
          v_texcoord.x > 1.0 ||
          v_texcoord.y > 1.0) {
        discard;
      }
      gl_FragColor = vec4(texture2D(u_texture, v_texcoord).rgb, 1.0);
    } else if (u_fragType == 2) {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  }
`
