export default `#version 300 es

precision mediump float;

in vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_maskTexture;

uniform float u_opacity;
uniform int u_isAlpha;

out vec4 fragColor;

void main(void) {
  float isAlpha = step(1.0, float(u_isAlpha)); // 0 或者 1
  float edgeX = isAlpha * 0.4996 + 1.0 - isAlpha;

  float invalid = step(v_texcoord.x, 0.0) + step(edgeX, v_texcoord.x) + step(v_texcoord.y, 0.0) + step(1.0, v_texcoord.y);
  invalid = step(1.0, invalid);

  vec4 texColor = texture(u_texture, v_texcoord);
  texColor.a = texColor.a * u_opacity;

  float alpha = texture(u_texture, v_texcoord + vec2(0.5, 0.0)).r;
  texColor.a = texColor.a * (isAlpha * alpha + 1.0 - isAlpha);
  
  fragColor = mix(texColor, vec4(0.0, 0.0, 0.0, 0.0), invalid);
}
`
