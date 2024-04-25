export default `#version 300 es

precision mediump float;

in vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_dstTexture;

out vec4 fragColor;

void main(void) {
  vec4 src = texture(u_texture, v_texcoord);
  vec4 dst = texture(u_dstTexture, v_texcoord);

  float noSrc = step(src.a, 0.001);

  fragColor = noSrc*dst + (1.0-noSrc)*vec4(dst.rgb + src.rgb, dst.a);
}
`
