export const fragmenShaderSrc = `
  precision mediump float;

  varying vec2 v_texcoord;
  
  uniform sampler2D u_texture;
  uniform int u_layerType; // 图层类型
  uniform float u_opacity;

  void main(void) {
    // 透明mp4
    if (u_layerType == 1) {
      gl_FragColor = vec4(texture2D(u_texture, v_texcoord).rgb, texture2D(u_texture, v_texcoord+vec2(0.5, 0)).r);
    } else {
      if (v_texcoord.x < 0.0 ||
          v_texcoord.y < 0.0 ||
          v_texcoord.x > 1.0 ||
          v_texcoord.y > 1.0) {
        discard;
      }
      gl_FragColor = vec4(texture2D(u_texture, v_texcoord).rgb, 1.0);
    }
  }
`
