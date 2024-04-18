export default `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_maskTexture;

uniform float u_opacity;

void main(void) {
  vec4 texColor = texture2D(u_texture, v_texcoord);
  texColor.a = texColor.a * u_opacity;

  vec4 maskColor = texture2D(u_maskTexture, v_texcoord.xy);
  gl_FragColor = vec4(texColor.rgb, texColor.a * maskColor.a);
}
`
