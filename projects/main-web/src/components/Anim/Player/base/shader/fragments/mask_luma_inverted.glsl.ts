export default `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_maskTexture;

uniform float u_opacity;

void main(void) {
  vec4 texColor = texture2D(u_texture, v_texcoord);
  texColor = texColor * u_opacity;

  vec4 maskColor = texture2D(u_maskTexture, v_texcoord.xy);
  float brightness = maskColor.r * 0.3 + maskColor.g * 0.6 + maskColor.b * 0.1;

  gl_FragColor = texColor * (1.0 - brightness);
}
`
