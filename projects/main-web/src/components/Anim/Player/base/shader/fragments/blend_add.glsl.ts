export default `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform sampler2D u_dstTexture;

void main(void) {
  vec4 src = texture2D(u_texture, v_texcoord);
  vec4 dst = texture2D(u_dstTexture, v_texcoord);

  gl_FragColor = vec4(dst.rgb + src.rgb, dst.a);
}
`
