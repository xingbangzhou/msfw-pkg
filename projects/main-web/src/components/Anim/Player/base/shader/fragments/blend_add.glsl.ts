export default `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_dstTexture;

void main(void) {
  vec4 src = texture2D(u_texture, v_texcoord);
  vec4 dst = texture2D(u_dstTexture, v_texcoord);

  float noSrc = step(src.a, 0.001);

  gl_FragColor = noSrc*dst + (1.0-noSrc)*vec4(dst.rgb + src.rgb, dst.a);
}
`
