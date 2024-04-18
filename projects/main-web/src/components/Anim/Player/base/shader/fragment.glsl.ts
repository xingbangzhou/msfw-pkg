export default `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_maskTexture;

uniform float u_opacity;
uniform int u_isAlpha;

void main(void) {
  vec4 texColor = texture2D(u_texture, v_texcoord);
  texColor = texColor * u_opacity;

  if (u_isAlpha == 1) {
    float r = texture2D(u_texture, v_texcoord + vec2(0.5, 0)).r;
    texColor = texColor * r;
  }
  
  gl_FragColor = texColor;
}
`
