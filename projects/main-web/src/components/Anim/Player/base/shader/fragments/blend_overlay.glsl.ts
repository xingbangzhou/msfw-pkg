export default `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_dstTexture;

void main(void) {
  vec4 src = texture2D(u_texture, v_texcoord);
  vec4 dst = texture2D(u_dstTexture, v_texcoord);

  vec4 flag = step(dst, vec4(0.5, 0.5, 0.5, 0.5));

  gl_FragColor = flag*dst*src*2.0 + (1.0-flag)*(1.0-(1.0-dst)*(1.0-src)*2.0);
}
`
