export default `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_maskTexture;

uniform float u_opacity;
uniform int u_isAlpha;

void main(void) {
  vec4 texColor = texture2D(u_texture, v_texcoord);
  texColor.a = texColor.a * u_opacity;

  float isAlpha = step(1.0, float(u_isAlpha)); // 0 或者 1
  float alpha = texture2D(u_texture, v_texcoord + vec2(0.5, 0.0)).r;
  texColor.a = texColor.a * (isAlpha * alpha + 1.0 - isAlpha);
  
  gl_FragColor = texColor;
}
`
