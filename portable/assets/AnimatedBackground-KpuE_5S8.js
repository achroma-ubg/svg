import{r as e,t}from"./jsx-runtime-D-6n_2XS.js";var n=e(),r=t(),i=5,a=3,o=2.4,s=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,c=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uStops[${i}];
uniform int uStopCount;
uniform float uAmplitude;
uniform float uBlend;
uniform float uHeight;
uniform float uScale;
uniform float uGlow;
uniform float uBrightness;
uniform int uLayers;
uniform float uFlip;
uniform vec3 uPointer;
uniform float uReveal;
uniform float uOpacity;
uniform float uLightMode;
out vec4 outColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float smootherstep(float edge0, float edge1, float x) {
  float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 oklabToLinear(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

vec3 ramp(float t) {
  float x = clamp(t, 0.0, 1.0) * float(uStopCount - 1);
  int i = int(min(floor(x), float(uStopCount - 2)));
  float f = x - float(i);
  f = f * f * (3.0 - 2.0 * f);
  vec3 lch = mix(uStops[i], uStops[i + 1], f);
  lch.x = mix(lch.x, min(lch.x, 0.7), uLightMode);
  return toSrgb(oklabToLinear(vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z))));
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float y = 1.0 - frag.y / uResolution.y;
  y = mix(y, 1.0 - y, uFlip);
  float u = frag.x / uResolution.x;
  float X = (frag.x - uResolution.x * 0.5) / uResolution.y;
  float t = uTime;
  float reach = uPointer.z * exp(-pow((X - uPointer.x) / 0.38, 2.0));

  vec3 glow = vec3(0.0);
  float cover = 0.0;
  for (int k = 0; k < ${a}; k++) {
    if (k >= uLayers) break;
    float layer = float(k);
    float seed = layer * 13.7;
    float pace = t * (1.0 - layer * 0.18);
    float warp = snoise(vec2(X * 0.45 * uScale + pace * 0.02 + seed, pace * 0.05 + seed));
    float wave = snoise(vec2(X * 0.75 * uScale + warp * 0.35 - pace * 0.03 + seed, pace * 0.07 - seed)) * 0.72
      + snoise(vec2(X * 1.6 * uScale + warp * 0.5 + pace * 0.04 - seed, pace * 0.1 + seed * 0.5)) * 0.28;
    float hem = uHeight + layer * 0.07 + wave * 0.15 * uAmplitude;
    hem += reach * 0.08 * (layer < 0.5 ? 1.0 : 0.4);
    hem = mix(-0.25, hem, uReveal);

    float soft = (0.04 + uBlend * 0.16) * (1.0 + layer * 0.9);
    float rise = hem - y;
    float low = -soft - uGlow * 0.14;
    float high = 0.26 + soft * 0.6;
    float body = pow(smootherstep(low, high, rise), 1.5 + uGlow * 0.6);
    float lobes = 0.86 + 0.14 * snoise(vec2(X * 0.9 * uScale - pace * 0.025 + seed, y * 0.3 + pace * 0.04));
    float alpha = body * lobes * (layer < 0.5 ? 1.0 : 0.32 / layer);
    alpha = clamp(alpha * (1.0 + reach * 0.25 * smootherstep(0.9, 0.0, abs(y - hem))), 0.0, 1.0);

    vec3 tint = ramp(u + 0.05 * sin(pace * 0.08 + layer * 2.3) + layer * 0.1 + max(rise, 0.0) * 0.05);
    glow = 1.0 - (1.0 - glow) * (1.0 - tint * alpha);
    cover = 1.0 - (1.0 - cover) * (1.0 - alpha);
  }

  float fade = smootherstep(0.0, 0.7, uReveal) * uOpacity;
  float strength = clamp(uBrightness, 0.0, 2.0);
  glow *= fade * min(strength, 1.0);
  cover *= fade * min(strength, 1.0);
  glow = 1.0 - pow(1.0 - glow, vec3(max(strength, 1.0)));
  float dither = (hash(frag) - 0.5) / 255.0;

  if (uLightMode > 0.5) {
    vec3 tint = cover > 0.0001 ? glow / cover : vec3(0.0);
    cover *= smootherstep(0.0, 0.25, cover);
    float alpha = cover * 0.7;
    outColor = vec4(tint * alpha + dither, clamp(alpha + dither, 0.0, 1.0));
    return;
  }
  outColor = vec4(glow + dither, clamp(cover + dither, 0.0, 1.0));
}`,l=(e,t,n)=>Math.min(n,Math.max(t,e)),u=e=>{let[t,n,r]=e.map(e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4),i=Math.cbrt(.4122214708*t+.5363325363*n+.0514459929*r),a=Math.cbrt(.2119034982*t+.6806995451*n+.1073969566*r),o=Math.cbrt(.0883024619*t+.2817188376*n+.6299787005*r),s=[.2104542553*i+.793617785*a-.0040720468*o,1.9779984951*i-2.428592205*a+.4505937099*o,.0259040371*i+.7827717662*a-.808675766*o];return[s[0],Math.hypot(s[1],s[2]),Math.atan2(s[2],s[1])]},d=e=>{let t=e.findIndex(e=>e[1]>.02),n=t===-1?0:e[t][2];return e.map(e=>{let t=e[1]>.02?e[2]:n;for(;t-n>Math.PI;)t-=Math.PI*2;for(;t-n<-Math.PI;)t+=Math.PI*2;return n=t,[e[0],e[1],t]})},f=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},p=e=>{let t=f(e,e.VERTEX_SHADER,s),n=f(e,e.FRAGMENT_SHADER,c),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name.replace(`[0]`,``)]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},m=({colorStops:e=[`#5227FF`,`#7cff67`,`#5227FF`],amplitude:t=1,blend:s=.5,speed:c=1,time:f,height:m=.45,scale:h=1,glow:g=.6,brightness:_=1,layers:v=1,direction:y=`top`,mouseInteraction:b=!0,intro:x=!0,opacity:S=1,lightMode:C=!1,paused:w=!1,dpr:T,className:E=``,style:D})=>{let O=(0,n.useRef)(null),k=(0,n.useRef)(null),A=(0,n.useRef)(null),j=(Array.isArray(e)?e:[]).filter(Boolean).map(String).slice(0,i),M={stops:j.length>=2?j:j.length===1?[j[0],j[0]]:[`#5227FF`,`#7cff67`],amplitude:Math.max(0,t),blend:l(s,0,1),speed:c,time:f,height:l(m,0,1),scale:Math.max(.1,h),glow:Math.max(0,g),brightness:Math.max(0,_),layers:l(Math.round(v),1,a),flip:+(y===`bottom`),mouseInteraction:b,intro:x,opacity:l(S,0,1),lightMode:C,paused:w,dpr:T},N=(0,n.useRef)(M);return N.current=M,(0,n.useEffect)(()=>{let e=O.current,t=k.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=p(n);if(!r)return;let i=r.uniforms,a=n.createBuffer(),s=n.createVertexArray();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let c=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),f=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,m=new Map,h=e=>{if(m.has(e))return m.get(e);let t=[1,1,1];if(c){c.clearRect(0,0,1,1),c.fillStyle=`#ffffff`,c.fillStyle=e,c.fillRect(0,0,1,1);let[n,r,i]=c.getImageData(0,0,1,1).data;t=[n/255,r/255,i/255]}return m.set(e,t),t},g=new Float32Array(15),_={width:1,height:1},v={x:0,y:0,inside:!1},y={clock:0,px:0,py:.5,reach:0,reveal:N.current.intro&&!f?0:1},b=0,x=0,S=!0,C=()=>{let e=N.current;d(e.stops.map(e=>u(h(e)))).forEach((e,t)=>g.set(e,t*3));let a=y.reveal;n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.bindVertexArray(s),n.uniform2f(i.uResolution,t.width,t.height),n.uniform1f(i.uTime,e.time===void 0?y.clock:e.time*e.speed*.1),n.uniform3fv(i.uStops,g),n.uniform1i(i.uStopCount,e.stops.length),n.uniform1f(i.uAmplitude,e.amplitude),n.uniform1f(i.uBlend,e.blend),n.uniform1f(i.uHeight,e.height),n.uniform1f(i.uScale,e.scale),n.uniform1f(i.uGlow,e.glow),n.uniform1f(i.uBrightness,e.brightness),n.uniform1i(i.uLayers,e.layers),n.uniform1f(i.uFlip,e.flip),n.uniform3f(i.uPointer,y.px,y.py,y.reach),n.uniform1f(i.uReveal,1-(1-a)**3),n.uniform1f(i.uOpacity,e.opacity),n.uniform1f(i.uLightMode,+!!e.lightMode),n.drawArrays(n.TRIANGLES,0,3)},w=e=>{if(b=0,!S||document.hidden)return;let t=N.current,n=x?l((e-x)/1e3,5e-4,.05):1/60;if(x=e,t.paused){y.reveal=1,C(),x=0;return}let r=+!f;y.clock+=n*t.speed*r;let i=t.mouseInteraction&&v.inside&&!f,a=1-Math.exp(-n/.6);if(i){let e=(v.x-_.width/2)/_.height,n=t.flip?1-v.y/_.height:v.y/_.height;y.px+=(e-y.px)*a,y.py+=(n-y.py)*a}y.reach+=(+!!i-y.reach)*(1-Math.exp(-n/(i?.9:1.4))),!t.intro||f?y.reveal=1:y.reveal<1&&(y.reveal=Math.min(1,y.reveal+n/o)),C(),b=requestAnimationFrame(w)},T=()=>{!b&&S&&!document.hidden&&(b=requestAnimationFrame(w))},E=()=>{let n=N.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);_.width=r,_.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),C(),T()},D=t=>{let n=e.getBoundingClientRect();v.x=t.clientX-n.left,v.y=t.clientY-n.top;let r=v.inside;if(v.inside=v.x>=0&&v.y>=0&&v.x<=n.width&&v.y<=n.height,v.inside&&!r){let e=N.current;y.px=(v.x-n.width/2)/Math.max(1,n.height),y.py=e.flip?1-v.y/Math.max(1,n.height):v.y/Math.max(1,n.height)}N.current.paused||T()},j=e=>{e.pointerType!==`mouse`&&(v.inside=!1)},M=()=>{v.inside=!1},P=()=>{x=0,T()},F=new ResizeObserver(E);F.observe(e);let I=new IntersectionObserver(e=>{S=e.some(e=>e.isIntersecting),S&&(x=0,T())});I.observe(e),window.addEventListener(`pointermove`,D,{passive:!0}),window.addEventListener(`pointerdown`,D,{passive:!0}),window.addEventListener(`pointerup`,j,{passive:!0}),window.addEventListener(`pointercancel`,j,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,M),document.addEventListener(`visibilitychange`,P),E();let L=N.current.dpr;return A.current=()=>{let e=N.current;if(e.dpr!==L){L=e.dpr,E();return}b||C(),T()},()=>{cancelAnimationFrame(b),A.current=null,F.disconnect(),I.disconnect(),window.removeEventListener(`pointermove`,D),window.removeEventListener(`pointerdown`,D),window.removeEventListener(`pointerup`,j),window.removeEventListener(`pointercancel`,j),document.documentElement.removeEventListener(`pointerleave`,M),document.removeEventListener(`visibilitychange`,P),n.deleteProgram(r.program),n.deleteBuffer(a),n.deleteVertexArray(s),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,n.useEffect)(()=>{A.current?.()}),(0,r.jsx)(`div`,{ref:O,className:`aurora-container${E?` ${E}`:``}`,style:D,children:(0,r.jsx)(`canvas`,{ref:k,className:`aurora-canvas`,"aria-hidden":`true`})})},h=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,g=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform vec2 uScale;
uniform float uZoom;
uniform float uTime;
uniform float uTwist;
uniform float uWave;
uniform float uSharpness;
uniform vec2 uOrbit;
uniform float uDither;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 c = (gl_FragCoord.xy * uScale - 0.5 * uView) / uZoom;
  vec3 rd = normalize(vec3(c, uView.y));
  vec3 ro = vec3(0.0, 0.0, -4.0);
  float cy = cos(uOrbit.x);
  float sy = sin(uOrbit.x);
  float cx = cos(uOrbit.y);
  float sx = sin(uOrbit.y);
  mat3 orbit = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy) * mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
  ro = orbit * ro;
  rd = orbit * rd;
  float z = 0.0;
  float density = 0.0;
  float band = 0.0;
  for (int i = 0; i < 60; i++) {
    vec3 p = ro + rd * z;
    vec3 s = p;
    float d = p.y - uTime;
    p.x += uWave * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    vec2 q = p.xz *= mat2(cos(p.y * uTwist + vec4(0.0, 11.0, 33.0, 0.0) - uTime));
    float shell = abs(sqrt(length(q * q)) - 0.25 * (5.0 + s.y)) / 3.0;
    float stepLength = shell + 0.0008;
    z += stepLength;
    float phase = s.y + p.z * 0.5 + s.z - length(s - p);
    float weight = (1.0 + sin(phase + 8.0)) * exp(-shell * uSharpness) * stepLength;
    density += weight;
    band += weight * (0.5 + 0.5 * sin(phase * 0.5 + 1.0));
  }
  vec2 encoded = sqrt(vec2(density, band) / (1.0 + vec2(density, band)));
  encoded += (vec2(hash(gl_FragCoord.xy), hash(gl_FragCoord.yx + 17.0)) - 0.5) * uDither;
  outColor = vec4(encoded, 0.0, 1.0);
}`,_=`#version 300 es
precision highp float;
uniform sampler2D uVolume;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uHighlight;
uniform vec3 uInk;
uniform float uGain;
uniform float uShine;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uTime;
uniform float uLightMode;
uniform vec3 uHeat;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 encoded = clamp(texture(uVolume, uv).rg, 0.0, 0.9995);
  encoded *= encoded;
  vec2 volume = encoded / (1.0 - encoded);
  vec2 offset = (gl_FragCoord.xy - uHeat.xy) / uResolution.y;
  float heat = uHeat.z * exp(-dot(offset, offset) / 0.05);
  float density = volume.r * uGain * uPresence * (1.0 + heat * 0.35);
  float band = clamp(volume.g / max(volume.r, 0.00001), 0.0, 1.0);
  vec3 tint = mix(uColor, uHighlight, band * 0.35);
  vec3 hdr = tint * density + uHighlight * density * density * uShine;
  float peak = max(hdr.r, max(hdr.g, hdr.b));
  float level = 1.0 - exp(-peak);
  float hot = smoothstep(1.0, 3.0, peak);
  float edge = uFade * 0.5;
  float mask = smootherstep(edge, uv.x) * smootherstep(edge, 1.0 - uv.x) * smootherstep(edge, uv.y) * smootherstep(edge, 1.0 - uv.y);
  mask *= uOpacity;
  float grain = (hash(gl_FragCoord.xy + fract(uTime * 7.31) * 113.0) - 0.5) * uGrain;
  if (uLightMode > 0.5) {
    vec3 color = mix(uInk, vec3(1.0), hot * 0.75);
    float alpha = clamp(pow(level, 0.8) * 0.9 * (1.0 + grain), 0.0, 1.0) * mask;
    outColor = vec4(color * alpha, alpha);
  } else {
    vec3 hue = hdr / max(peak, 0.0001);
    vec3 color = mix(hue * level, vec3(level), hot * 0.6);
    color = pow(color, vec3(1.0 / 2.2));
    color = clamp(color + grain * level, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`,v=1.6,y=16e5,b=(e,t,n)=>Math.min(n,Math.max(t,e)),x=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},S=(e,t)=>{let n=x(e,e.VERTEX_SHADER,h),r=x(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},C=({color:e=`#a6a3b8`,speed:t=1,direction:i=`forward`,scale:a=1,twist:o=1,wave:s=1,softness:c=.5,shine:l=1,brightness:u=1,grain:d=.04,quality:f=.75,mouseInteractive:p=!0,intro:m=!0,fade:h=0,opacity:x=1,lightMode:C=!1,paused:w=!1,dpr:T,className:E=``,...D})=>{let O=(0,n.useRef)(null),k=(0,n.useRef)(null),A=(0,n.useRef)(null),j={color:String(e),speed:t,direction:i,scale:Math.max(.1,a),twist:o,wave:Math.max(0,s),softness:b(c,0,1),shine:Math.max(0,l),brightness:Math.max(0,u),grain:Math.max(0,d),quality:b(f,.25,1),mouseInteractive:p,intro:m,fade:b(h,0,1),opacity:b(x,0,1),lightMode:C,paused:w,dpr:T},M=(0,n.useRef)(j);return M.current=j,(0,n.useEffect)(()=>{let e=O.current,t=k.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=S(n,g),a=S(n,_);if(!i||!a)return;let o={volume:i,composite:a},s=n.createBuffer(),c=n.createVertexArray();n.bindVertexArray(c),n.bindBuffer(n.ARRAY_BUFFER,s),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let l=n.createTexture(),u=n.createFramebuffer(),d={width:0,height:0},f=(e,t)=>{(d.width!==e||d.height!==t)&&(d.width=e,d.height=t,n.bindTexture(n.TEXTURE_2D,l),r?n.texImage2D(n.TEXTURE_2D,0,n.RGBA16F,e,t,0,n.RGBA,n.HALF_FLOAT,null):n.texImage2D(n.TEXTURE_2D,0,n.RGBA,e,t,0,n.RGBA,n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,u),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,l,0))},p=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),m=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,h=new Map,b=e=>{if(h.has(e))return h.get(e);let t=[1,1,1];if(p){p.clearRect(0,0,1,1),p.fillStyle=`#ffffff`,p.fillStyle=e,p.fillRect(0,0,1,1);let[n,r,i]=p.getImageData(0,0,1,1).data;t=[n,r,i].map(e=>(e/255)**2.2)}return h.set(e,t),t},x={width:1,height:1,volumeWidth:1,volumeHeight:1},C={x:0,y:0,inside:!1},w={clock:0,intro:M.current.intro&&!m?0:1,yaw:0,pitch:0,yawVelocity:0,pitchVelocity:0,heat:0,heatX:0,heatY:0},T=0,E=0,D=!0,j=e=>{let t=w.clock*.4;if(e.direction===`reverse`)return-t;if(e.direction!==`pingpong`)return t;let n=w.clock%10/10,r=n*n*(3-2*n);return(Math.floor(w.clock/10)%2==0?r:1-r)*10*.4},N=()=>{let e=M.current,i=w.intro*w.intro*(3-2*w.intro);n.bindVertexArray(c),f(x.volumeWidth,x.volumeHeight);let a=o.volume,s=a.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,u),n.viewport(0,0,d.width,d.height),n.useProgram(a.program),n.uniform2f(s.uView,x.width,x.height),n.uniform2f(s.uScale,x.width/d.width,x.height/d.height),n.uniform1f(s.uZoom,e.scale),n.uniform1f(s.uTime,j(e)+(1-i)*1.4),n.uniform1f(s.uTwist,e.twist),n.uniform1f(s.uWave,.4*e.wave),n.uniform1f(s.uSharpness,100-e.softness*90),n.uniform2f(s.uOrbit,w.yaw,w.pitch),n.uniform1f(s.uDither,r?0:1/255),n.drawArrays(n.TRIANGLES,0,3);let p=o.composite,m=p.uniforms,h=b(e.color),g=h.map(e=>e+(1-e)*.85),_=.2126*h[0]+.7152*h[1]+.0722*h[2],v=Math.min(1,.16/Math.max(_,.001)),y=h.map(e=>Math.min(1,e*v)**(1/2.2));n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(p.program),n.uniform2f(m.uResolution,t.width,t.height),n.uniform3fv(m.uColor,h),n.uniform3fv(m.uHighlight,g),n.uniform3fv(m.uInk,y),n.uniform1f(m.uGain,4.8*e.brightness),n.uniform1f(m.uShine,.025*e.shine),n.uniform1f(m.uPresence,i),n.uniform1f(m.uGrain,e.grain),n.uniform1f(m.uFade,e.fade),n.uniform1f(m.uOpacity,e.opacity),n.uniform1f(m.uTime,w.clock%1e3),n.uniform1f(m.uLightMode,+!!e.lightMode),n.uniform3f(m.uHeat,w.heatX*t.width/x.width,(x.height-w.heatY)*t.height/x.height,w.heat),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,l),n.uniform1i(m.uVolume,0),n.drawArrays(n.TRIANGLES,0,3)},P=e=>{if(T=0,!D||document.hidden)return;let t=M.current,n=E?Math.min(.05,(e-E)/1e3):1/60;E=e;let r=!t.paused&&!m;r&&(w.clock+=n*t.speed),!t.intro||m?w.intro=1:w.intro<1&&(w.intro=Math.min(1,w.intro+n/v));let i=t.mouseInteractive&&C.inside&&!m,a=i?(C.x/x.width-.5)*.9:0,o=i?(C.y/x.height-.5)*.18:0;w.yawVelocity+=(40*(a-w.yaw)-11*w.yawVelocity)*n,w.pitchVelocity+=(40*(o-w.pitch)-11*w.pitchVelocity)*n,w.yaw+=w.yawVelocity*n,w.pitch+=w.pitchVelocity*n,w.heat+=(+!!i-w.heat)*(1-Math.exp(-n*(i?4:2))),w.heatX+=(C.x-w.heatX)*(1-Math.exp(-n*8)),w.heatY+=(C.y-w.heatY)*(1-Math.exp(-n*8)),N();let s=w.intro<1||Math.abs(a-w.yaw)>5e-4||Math.abs(w.yawVelocity)>5e-4||Math.abs(o-w.pitch)>5e-4||Math.abs(w.pitchVelocity)>5e-4||Math.abs(+!!i-w.heat)>.002;r||s?T=requestAnimationFrame(P):E=0},F=()=>{!T&&D&&!document.hidden&&(T=requestAnimationFrame(P))},I=()=>{let n=M.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);x.width=r,x.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a));let o=n.quality;r*i*o*o>y&&(o=Math.sqrt(y/(r*i))),x.volumeWidth=Math.max(1,Math.round(r*o)),x.volumeHeight=Math.max(1,Math.round(i*o)),T||N(),F()},L=t=>{let n=e.getBoundingClientRect();C.x=t.clientX-n.left,C.y=t.clientY-n.top,C.inside=C.x>=0&&C.y>=0&&C.x<=n.width&&C.y<=n.height,F()},R=()=>{C.inside=!1,F()},z=()=>{E=0,F()},B=new ResizeObserver(I);B.observe(e);let V=new IntersectionObserver(e=>{D=e.some(e=>e.isIntersecting),D&&(E=0,F())});V.observe(e),window.addEventListener(`pointermove`,L,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,R),document.addEventListener(`visibilitychange`,z),I();let H=M.current.quality,U=M.current.dpr;return A.current=()=>{let e=M.current;if(e.quality!==H||e.dpr!==U){H=e.quality,U=e.dpr,I();return}T||N(),F()},()=>{cancelAnimationFrame(T),A.current=null,B.disconnect(),V.disconnect(),window.removeEventListener(`pointermove`,L),document.documentElement.removeEventListener(`pointerleave`,R),document.removeEventListener(`visibilitychange`,z),n.deleteTexture(l),n.deleteFramebuffer(u),n.deleteProgram(o.volume.program),n.deleteProgram(o.composite.program),n.deleteBuffer(s),n.deleteVertexArray(c),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,n.useEffect)(()=>{A.current?.()}),(0,r.jsx)(`div`,{ref:O,className:`plasma-container${E?` ${E}`:``}`,...D,children:(0,r.jsx)(`canvas`,{ref:k,className:`plasma-canvas`,"aria-hidden":`true`})})},w=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,T=`
uniform vec2 uView;
uniform float uScale;
uniform float uRotation;
uniform float uTime;
uniform float uWave;
uniform float uRipple;
uniform float uFold;
uniform vec2 uShift;
uniform vec4 uPointer;
uniform vec2 uDrag;
uniform vec4 uWaves[4];

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

vec2 bend(vec2 uv) {
  vec2 aspect = vec2(uView.x / uView.y, 1.0);
  vec2 offset = (uv - uPointer.xy) * aspect;
  float touch = uPointer.z * exp(-dot(offset, offset) / (uPointer.w * uPointer.w));
  uv -= uDrag * touch;
  for (int i = 0; i < 4; i++) {
    vec4 wave = uWaves[i];
    if (wave.w <= 0.0) continue;
    vec2 q = (uv - wave.xy) * aspect;
    float dist = length(q);
    float front = dist - wave.z;
    float ring = exp(-front * front * 60.0) * wave.w;
    uv += q / max(dist, 0.0001) / aspect * ring * 0.034 * sin(front * 34.0);
  }
  return uv;
}

float silk(vec2 vUv) {
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale + uShift;
  float tOffset = uTime;
  tex.y += 0.03 * uWave * sin(8.0 * tex.x - tOffset);
  return 0.6 + 0.4 * uFold * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) + uRipple * sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
}
`,E=`#version 300 es
precision highp float;
${T}
out vec4 outColor;

void main() {
  vec2 vUv = gl_FragCoord.xy / uView;
  float pattern = silk(bend(vUv));
  float n = clamp((pattern - 0.2) / 0.8, 0.0, 1.0);
  outColor = vec4(pow(n, 6.0), 0.0, 0.0, 1.0);
}`,D=`#version 300 es
precision highp float;
${T}
uniform sampler2D uBloom;
uniform vec3 uColor;
uniform vec3 uSheenColor;
uniform float uNoiseIntensity;
uniform float uDepth;
uniform float uSheen;
uniform float uGlow;
uniform float uLightMode;
uniform vec3 uLight;
uniform vec2 uStep;
uniform float uPresence;
uniform float uFade;
out vec4 outColor;

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 softClip(vec3 c) {
  vec3 over = max(c - 0.75, 0.0);
  return min(c, 0.75) + 0.25 * (1.0 - exp(-over * 4.0));
}

void main() {
  vec2 vUv = gl_FragCoord.xy / uView;
  vec2 coord = bend(vUv);
  float pattern = silk(coord);
  float rnd = noise(gl_FragCoord.xy);
  float n = clamp((pattern - 0.2) / 0.8, 0.0, 1.0);

  float gx = silk(coord + vec2(uStep.x, 0.0)) - pattern;
  float gy = silk(coord + vec2(0.0, uStep.y)) - pattern;
  vec3 normal = normalize(vec3(-gx * 26.0, -gy * 26.0, 1.0));
  vec3 toLight = normalize(vec3(uLight.xy, 0.85));
  float relief = 1.0 + (dot(normal, toLight) - toLight.z) * 1.8 * uDepth;
  vec3 halfway = normalize(toLight + vec3(0.0, 0.0, 1.0));
  float gloss = pow(max(dot(normal, halfway), 0.0), 48.0) * smoothstep(0.25, 0.85, n);
  float crest = pow(n, 5.0);
  float shine = (gloss * 0.85 + crest * 0.4) * uSheen * (1.0 + uLight.z * 0.6);

  float bloom = 0.0;
  if (uGlow > 0.0) {
    bloom += textureLod(uBloom, vUv, 1.0).r * 0.35;
    bloom += textureLod(uBloom, vUv, 2.0).r * 0.3;
    bloom += textureLod(uBloom, vUv, 3.0).r * 0.2;
    bloom += textureLod(uBloom, vUv, 4.0).r * 0.15;
  }

  vec3 result;
  if (uLightMode > 0.5) {
    float fold = smoothstep(0.28, 0.9, pattern);
    float specular = smoothstep(0.72, 0.98, pattern);
    vec3 shadowColor = uColor * (0.72 - 0.12 * uDepth);
    vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
    vec3 lightBase = mix(shadowColor, bodyColor, fold) * mix(1.0, relief, 0.6);
    lightBase = mix(lightBase, vec3(1.0), clamp(specular * 0.92 + shine * 0.22 + bloom * uGlow * 0.2, 0.0, 1.0));
    float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
    float grainSignal = (rnd + fineNoise - 1.0);
    float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
    result = clamp(lightBase + grainSignal * grainStrength, 0.0, 1.0);
  } else {
    float grain = rnd / 15.0 * uNoiseIntensity;
    float floorValue = mix(0.2, 0.03, uDepth);
    float curve = uDepth > 0.0 ? pow(n, 1.0 + 1.4 * uDepth) : n;
    float shade = uDepth > 0.0 ? floorValue + (1.0 - floorValue) * curve : pattern;
    vec3 tone = mix(uColor, pow(uColor, vec3(1.45)), (1.0 - n) * uDepth);
    vec3 lit = tone * shade * relief - vec3(grain);
    vec3 tint = mix(uColor, uSheenColor, 0.8);
    vec3 extra = tint * (shine + bloom * uGlow * 0.55);
    float blend = clamp((uSheen + uGlow) * 4.0, 0.0, 1.0);
    result = mix(clamp(lit, 0.0, 1.0), clamp(softClip(lit + extra), 0.0, 1.0), blend);
  }

  float edge = uFade * 0.5;
  float mask = 1.0;
  if (edge > 0.0) {
    mask = smootherstep01(vUv.x / edge) * smootherstep01((1.0 - vUv.x) / edge);
    mask *= smootherstep01(vUv.y / edge) * smootherstep01((1.0 - vUv.y) / edge);
  }
  float alpha = uPresence * mask;
  outColor = vec4(result * alpha, alpha);
}`,O=2.2,k=1.6,A=1.6,j=[-.55,.7],M=Math.hypot(j[0],j[1]),N=(e,t,n)=>Math.min(n,Math.max(t,e)),P=e=>e*e*e*(e*(e*6-15)+10),F=e=>{let t=Number(e)||0;if(!t)return[0,0];let n=e=>{let n=Math.sin(t*12.9898+e*78.233)*43758.5453;return n-Math.floor(n)-.5};return[n(1)*6,n(2)*6]},I=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},L=(e,t)=>{let n=I(e,e.VERTEX_SHADER,w),r=I(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},R=({speed:e=5,scale:t=1,color:i=`#7B7481`,sheenColor:a=`#ffffff`,noiseIntensity:o=1.5,rotation:s=0,sheen:c=.5,depth:l=.5,glow:u=.3,ripple:d=1,wave:f=1,variation:p=0,mouseInteraction:m=!0,interactionStrength:h=1,clickRipple:g=!0,intro:_=!0,fade:v=0,lightMode:y=!1,paused:b=!1,dpr:x,className:S=``,style:C})=>{let w=(0,n.useRef)(null),T=(0,n.useRef)(null),I=(0,n.useRef)(null),R=(0,n.useRef)(null);return R.current={speed:e,scale:t,color:String(i),sheenColor:String(a),noiseIntensity:Math.max(0,o),rotation:s,sheen:Math.max(0,c),depth:N(l,0,1),glow:Math.max(0,u),ripple:Math.max(0,d),wave:Math.max(0,f),variation:p,mouseInteraction:m,interactionStrength:Math.max(0,h),clickRipple:g,intro:_,fade:N(v,0,1),lightMode:y,paused:b,dpr:x},(0,n.useEffect)(()=>{let e=w.current,t=T.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=L(n,E),i=L(n,D);if(!r||!i)return;let a=n.createBuffer(),o=n.createVertexArray();n.bindVertexArray(o),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let s=n.createTexture(),c=n.createFramebuffer(),l={width:0,height:0},u=(e,t)=>{(l.width!==e||l.height!==t)&&(l.width=e,l.height=t,n.bindTexture(n.TEXTURE_2D,s),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,e,t,0,n.RGBA,n.UNSIGNED_BYTE,null),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,c),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,s,0))},d=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),f=new Map,p=e=>{if(f.has(e))return f.get(e);let t=[1,1,1];if(d){d.clearRect(0,0,1,1),d.fillStyle=`#ffffff`,d.fillStyle=e,d.fillRect(0,0,1,1);let[n,r,i]=d.getImageData(0,0,1,1).data;t=[n/255,r/255,i/255]}return f.set(e,t),t},m=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,h={width:1,height:1,ratio:1},g={x:0,y:0,inside:!1},_=[],v=new Float32Array(16),y={flow:0,intro:R.current.intro&&!m?0:1,touch:0,x:0,y:0,dragX:0,dragY:0,lightX:j[0],lightY:j[1]},b=0,x=0,S=!0,C=(e,t,r,i,a)=>{let[o,s]=F(i.variation);n.uniform2f(e.uView,t,r),n.uniform1f(e.uScale,i.scale),n.uniform1f(e.uRotation,i.rotation),n.uniform1f(e.uTime,y.flow-k*(1-a)),n.uniform1f(e.uWave,i.wave),n.uniform1f(e.uRipple,i.ripple),n.uniform1f(e.uFold,.25+.75*a),n.uniform2f(e.uShift,o,s),n.uniform4f(e.uPointer,y.x/h.width,1-y.y/h.height,y.touch*i.interactionStrength,.32),n.uniform2f(e.uDrag,y.dragX,y.dragY),n.uniform4fv(e.uWaves,v)},z=()=>{let e=R.current,a=P(y.intro),d=1-(1-y.intro)**3;n.bindVertexArray(o),v.fill(0),_.slice(-4).forEach((e,t)=>{v.set([e.x,e.y,e.age*.6,Math.exp(-e.age/(A*.45))],t*4)}),e.glow>0&&(u(Math.max(1,Math.round(t.width/4)),Math.max(1,Math.round(t.height/4))),n.bindFramebuffer(n.FRAMEBUFFER,c),n.viewport(0,0,l.width,l.height),n.useProgram(r.program),C(r.uniforms,l.width,l.height,e,a),n.drawArrays(n.TRIANGLES,0,3),n.bindTexture(n.TEXTURE_2D,s),n.generateMipmap(n.TEXTURE_2D));let f=i.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(i.program),C(f,t.width,t.height,e,a),n.uniform3fv(f.uColor,p(e.color)),n.uniform3fv(f.uSheenColor,p(e.sheenColor)),n.uniform1f(f.uNoiseIntensity,e.noiseIntensity),n.uniform1f(f.uDepth,e.depth),n.uniform1f(f.uSheen,e.sheen),n.uniform1f(f.uGlow,e.glow),n.uniform1f(f.uLightMode,+!!e.lightMode),n.uniform3f(f.uLight,y.lightX,y.lightY,y.touch*e.interactionStrength),n.uniform2f(f.uStep,h.ratio/t.width,h.ratio/t.height),n.uniform1f(f.uPresence,d),n.uniform1f(f.uFade,e.fade),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,s),n.uniform1i(f.uBloom,0),n.drawArrays(n.TRIANGLES,0,3)},B=e=>{if(b=0,!S||document.hidden)return;let t=R.current,n=x?Math.min(.05,(e-x)/1e3):1/60;x=e;let r=!t.paused&&!m&&t.speed!==0;r&&(y.flow+=n*.1*t.speed),!t.intro||m?y.intro=1:y.intro<1&&(y.intro=Math.min(1,y.intro+n/O));let i=t.mouseInteraction&&g.inside&&!m;i&&y.touch<.01&&(y.x=g.x,y.y=g.y);let a=1-Math.exp(-n*10),o=y.x,s=y.y;y.x+=(g.x-y.x)*a,y.y+=(g.y-y.y)*a;let c=(y.x-o)/Math.max(n,.001)/h.height,l=(y.y-s)/Math.max(n,.001)/h.height,u=1-Math.exp(-n*4);y.dragX+=(N(c*.03,-.06,.06)-y.dragX)*u,y.dragY+=(N(-l*.03,-.06,.06)-y.dragY)*u,y.touch+=(+!!i-y.touch)*(1-Math.exp(-n*(i?3.5:1.4)));let d=j[0],f=j[1];if(i){let e=(g.x/h.width-.5)*(h.width/h.height),t=.5-g.y/h.height,n=Math.hypot(e,t);n>.04?(d=e/n*M,f=t/n*M):(d=y.lightX,f=y.lightY)}let p=1-Math.exp(-n*3);y.lightX+=(d-y.lightX)*p,y.lightY+=(f-y.lightY)*p;for(let e=_.length-1;e>=0;e--)_[e].age+=n,_[e].age>A*2.5&&_.splice(e,1);z();let v=y.intro<1||_.length>0||Math.abs(+!!i-y.touch)>.002||Math.abs(y.dragX)+Math.abs(y.dragY)>2e-4||Math.abs(g.x-y.x)+Math.abs(g.y-y.y)>.3||Math.abs(d-y.lightX)+Math.abs(f-y.lightY)>.001;r||v?b=requestAnimationFrame(B):x=0},V=()=>{!b&&S&&!document.hidden&&(b=requestAnimationFrame(B))},H=()=>{let n=R.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);h.width=r,h.height=i,h.ratio=a,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),b||z(),V()},U=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},W=e=>{let t=U(e);g.x=t.x,g.y=t.y,g.inside=t.inside,V()},G=e=>{if(!R.current.clickRipple||m)return;let t=U(e);t.inside&&(_.push({x:t.x/h.width,y:1-t.y/h.height,age:0}),_.length>4&&_.shift(),V())},K=()=>{g.inside=!1,V()},ee=()=>{x=0,V()},te=new ResizeObserver(H);te.observe(e);let ne=new IntersectionObserver(e=>{S=e.some(e=>e.isIntersecting),S&&(x=0,V())});ne.observe(e),window.addEventListener(`pointermove`,W,{passive:!0}),window.addEventListener(`pointerdown`,G,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,K),document.addEventListener(`visibilitychange`,ee),H();let q=R.current.dpr;return I.current=()=>{let e=R.current;if(e.dpr!==q){q=e.dpr,H();return}b||z(),V()},()=>{cancelAnimationFrame(b),I.current=null,te.disconnect(),ne.disconnect(),window.removeEventListener(`pointermove`,W),window.removeEventListener(`pointerdown`,G),document.documentElement.removeEventListener(`pointerleave`,K),document.removeEventListener(`visibilitychange`,ee),n.deleteTexture(s),n.deleteFramebuffer(c),n.deleteProgram(r.program),n.deleteProgram(i.program),n.deleteBuffer(a),n.deleteVertexArray(o),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,n.useEffect)(()=>{I.current?.()}),(0,r.jsx)(`div`,{ref:w,className:`silk-container${S?` ${S}`:``}`,style:C,children:(0,r.jsx)(`canvas`,{ref:T,className:`silk-canvas`,"aria-hidden":`true`})})},z=`#version 300 es
precision highp float;
in vec2 aPoint;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uFrame;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;
uniform float uCount;
uniform float uThickness;
uniform float uSoftness;
uniform float uWaves;
uniform float uSplit;
uniform float uFray;
uniform float uSeed;
uniform vec2 uTurn;
uniform vec4 uPart;
uniform float uTaper;
out float vEdge;
out float vBand;
out float vDraw;
out float vAlpha;
out float vIndex;

float Perlin2D(vec2 P) {
  vec2 Pi = floor(P);
  vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
  vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
  Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
  Pt += vec2(26.0, 161.0).xyxy;
  Pt *= Pt;
  Pt = Pt.xzxz * Pt.yyww;
  vec4 hash_x = fract(Pt * (1.0 / 951.135664));
  vec4 hash_y = fract(Pt * (1.0 / 642.949883));
  vec4 grad_x = hash_x - 0.49999;
  vec4 grad_y = hash_y - 0.49999;
  vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y) * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
  grad_results *= 1.4142135623730950;
  vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
  vec4 blend2 = vec4(blend, vec2(1.0 - blend));
  return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

void main() {
  float perc = float(gl_InstanceID) / uCount;
  float x = aPoint.x;
  float pixel = 1.0 / max(uResolution.x, uResolution.y);
  float splitPoint = uSplit + perc * uFray;
  float amplitudeNormal = smoothstep(splitPoint, max(0.7, splitPoint + 0.2), x);
  float finalAmplitude = amplitudeNormal * 0.5 * uAmplitude * (1.0 + (uMouse.y - 0.5) * 0.2);
  float timeScaled = uTime / 10.0 + (uMouse.x - 0.5);
  float blur = smoothstep(splitPoint, splitPoint + 0.05, x) * perc;
  float xnoise = mix(
    Perlin2D(vec2(timeScaled * 2.5 + uSeed, (x * uWaves + perc) * 2.5)),
    Perlin2D(vec2(timeScaled * 3.5 + uSeed, (x * uWaves + timeScaled) * 3.5)) / 1.5,
    x * 0.3
  );
  float y = 0.5 + (perc - 0.5) * uDistance + xnoise / 2.0 * finalAmplitude;
  vec2 local = vec2((x - 0.5) * uFrame.x, (y - 0.5) * uFrame.y);
  if (uPart.z > 0.0) {
    vec2 delta = local - uPart.xy;
    float reach = uPart.w;
    float pull = exp(-dot(delta, delta) / (reach * reach));
    local.y += delta.y * pull * uPart.z;
  }
  float width = 7.0 * uThickness * pixel * (1.0 - perc);
  float band = (width / 2.0 + 10.0 * uSoftness * pixel * blur) * uFrame.y;
  float draw = max(band, 1.0);
  local.y += aPoint.y * draw;
  vec2 turned = vec2(local.x * uTurn.x - local.y * uTurn.y, local.x * uTurn.y + local.y * uTurn.x);
  gl_Position = vec4(turned / (uResolution * 0.5), 0.0, 1.0);
  vEdge = aPoint.y * draw;
  vBand = band;
  vDraw = draw;
  vAlpha = 1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3)) * uTaper;
  vIndex = perc;
}`,B=`#version 300 es
precision highp float;
in float vEdge;
in float vBand;
in float vDraw;
in float vAlpha;
in float vIndex;
uniform vec3 uColor;
uniform vec3 uAccent;
out vec4 outColor;
void main() {
  float coverage = (1.0 - smoothstep(0.0, vDraw, abs(vEdge))) * (vBand / vDraw) * vAlpha;
  outColor = vec4(mix(uColor, uAccent, vIndex) * coverage, coverage);
}`,V=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,H=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uLines;
uniform vec2 uResolution;
uniform float uFade;
uniform float uOpacity;
uniform float uCurve;
out vec4 outColor;

float smootherstep(float edge, float x) {
  float t = clamp(x / edge, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec4 lines = texture(uLines, vUv);
  float alpha = lines.a;
  vec3 color = alpha > 0.0001 ? lines.rgb / alpha : vec3(0.0);
  float mask = uOpacity;
  if (uFade > 0.0) {
    vec2 px = vUv * uResolution;
    float edge = uFade * min(uResolution.x, uResolution.y) * 0.5;
    mask *= smootherstep(edge, px.x) * smootherstep(edge, uResolution.x - px.x);
    mask *= smootherstep(edge, px.y) * smootherstep(edge, uResolution.y - px.y);
  }
  outColor = vec4(color * pow(alpha, uCurve), alpha) * mask;
}`,U=1920,W=(e,t,n)=>Math.min(n,Math.max(t,e)),G=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},K=(e,t,n)=>{let r=G(e,e.VERTEX_SHADER,t),i=G(e,e.FRAGMENT_SHADER,n),a=e.createProgram();return!r||!i||!a?null:(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),e.getProgramParameter(a,e.LINK_STATUS)?a:(e.deleteProgram(a),null))},ee=(e,t,n)=>{let r={};for(let i of n)r[i]=e.getUniformLocation(t,i);return r},te=({color:e=[1,1,1],accentColor:t,amplitude:i=1.7,distance:a=.4,enableMouseInteraction:o=!1,lineCount:s=90,thickness:c=.6,softness:l=1.3,speed:u=.6,waves:d=1.05,split:f=.04,fray:p=.5,angle:m=25,seed:h=0,parting:g=0,taper:_=.85,brightness:v=1.4,fade:y=0,opacity:b=1,paused:x=!1,...S})=>{let C=(0,n.useRef)(null),w=(0,n.useRef)(null),T=(0,n.useRef)(null),E={color:e,accentColor:t,colorKey:`${Array.isArray(e)?e.join(`,`):String(e)}|${Array.isArray(t)?t.join(`,`):String(t??``)}`,amplitude:i,distance:a,enableMouseInteraction:o,lineCount:W(Math.round(s),1,400),thickness:Math.max(0,c),softness:Math.max(0,l),speed:u,waves:Math.max(0,d),split:W(f,0,1),fray:W(p,0,1),angle:m,seed:h,parting:W(g,0,1),taper:W(_,0,1),brightness:W(v,.25,2),fade:W(y,0,1),opacity:W(b,0,1),paused:x},D=(0,n.useRef)(E);D.current=E,(0,n.useEffect)(()=>{let e=C.current,t=w.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=K(n,z,B),i=K(n,V,H);if(!r||!i)return;let a=ee(n,r,[`uTime`,`uResolution`,`uFrame`,`uAmplitude`,`uDistance`,`uMouse`,`uCount`,`uThickness`,`uSoftness`,`uWaves`,`uSplit`,`uFray`,`uSeed`,`uTurn`,`uPart`,`uTaper`,`uColor`,`uAccent`]),o=ee(n,i,[`uLines`,`uResolution`,`uFade`,`uOpacity`,`uCurve`]),s=n.createVertexArray(),c=n.createBuffer();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,c);let l=n.getAttribLocation(r,`aPoint`);n.enableVertexAttribArray(l),n.vertexAttribPointer(l,2,n.FLOAT,!1,0,0);let u=n.createVertexArray(),d=n.createBuffer();n.bindVertexArray(u),n.bindBuffer(n.ARRAY_BUFFER,d),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW);let f=n.getAttribLocation(i,`aPosition`);n.enableVertexAttribArray(f),n.vertexAttribPointer(f,2,n.FLOAT,!1,0,0),n.bindVertexArray(null);let p=n.createTexture(),m=n.createFramebuffer();n.bindTexture(n.TEXTURE_2D,p),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let h=document.createElement(`canvas`);h.width=1,h.height=1;let g=h.getContext(`2d`,{willReadFrequently:!0}),_=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,v={time:0,width:1,height:1,segments:0,colorKey:``,color:[1,1,1],accent:[1,1,1],mouse:[.5,.5],targetMouse:[.5,.5],pointer:[0,0],targetPointer:[0,0],presence:0,inside:!1},y=0,b=0,x=!0,S=!0,E=e=>{if(Array.isArray(e))return[0,1,2].map(t=>W(Number(e[t]??1),0,1));if(!g)return[1,1,1];g.clearRect(0,0,1,1),g.fillStyle=`#ffffff`,g.fillStyle=String(e),g.fillRect(0,0,1,1);let[t,n,r]=g.getImageData(0,0,1,1).data;return[t/255,n/255,r/255]},O=e=>{e.colorKey!==v.colorKey&&(v.colorKey=e.colorKey,v.color=E(e.color),v.accent=e.accentColor===void 0||e.accentColor===null?v.color:E(e.accentColor))},k=e=>{if(e===v.segments)return;v.segments=e;let t=new Float32Array((e+1)*4);for(let n=0;n<=e;n++){let r=n/e;t.set([r,-1,r,1],n*4)}n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,t,n.STATIC_DRAW)},A=()=>{let r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(window.devicePixelRatio||1,2),o=Math.max(r,i)*a,s=o>U?a*U/o:a;t.width=Math.max(1,Math.round(r*s)),t.height=Math.max(1,Math.round(i*s)),v.width=r,v.height=i,n.bindTexture(n.TEXTURE_2D,p),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,t.width,t.height,0,n.RGBA,n.UNSIGNED_BYTE,null),n.bindFramebuffer(n.FRAMEBUFFER,m),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,p,0),n.bindFramebuffer(n.FRAMEBUFFER,null),k(W(Math.round(r/3),96,640)),j()},j=()=>{let e=D.current;O(e);let c=t.width,l=t.height,d=e.angle*Math.PI/180,f=Math.cos(d),h=Math.sin(d),g=Math.abs(c*f)+Math.abs(l*h),_=Math.abs(c*h)+Math.abs(l*f),y=c/v.width,b=e.enableMouseInteraction?v.mouse:[.5,.5],x=e.parting*v.presence*2,S=v.pointer[0]*y,C=v.pointer[1]*y,w=[S*f+C*h,-S*h+C*f];n.bindFramebuffer(n.FRAMEBUFFER,m),n.viewport(0,0,c,l),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n.useProgram(r),n.uniform1f(a.uTime,v.time),n.uniform2f(a.uResolution,c,l),n.uniform2f(a.uFrame,g,_),n.uniform1f(a.uAmplitude,e.amplitude),n.uniform1f(a.uDistance,e.distance),n.uniform2f(a.uMouse,b[0],b[1]),n.uniform1f(a.uCount,e.lineCount),n.uniform1f(a.uThickness,e.thickness),n.uniform1f(a.uSoftness,e.softness),n.uniform1f(a.uWaves,e.waves),n.uniform1f(a.uSplit,e.split),n.uniform1f(a.uFray,e.fray),n.uniform1f(a.uSeed,e.seed*13.37),n.uniform2f(a.uTurn,f,h),n.uniform4f(a.uPart,w[0],w[1],x,Math.min(c,l)*.16),n.uniform1f(a.uTaper,e.taper),n.uniform3f(a.uColor,v.color[0],v.color[1],v.color[2]),n.uniform3f(a.uAccent,v.accent[0],v.accent[1],v.accent[2]),n.bindVertexArray(s),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,(v.segments+1)*2,e.lineCount),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,c,l),n.disable(n.BLEND),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(i),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,p),n.uniform1i(o.uLines,0),n.uniform2f(o.uResolution,c,l),n.uniform1f(o.uFade,e.fade),n.uniform1f(o.uOpacity,e.opacity),n.uniform1f(o.uCurve,2/e.brightness),n.bindVertexArray(u),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)},M=e=>{if(y=0,!S||!x||document.hidden)return;let t=D.current,n=b?Math.min(.05,(e-b)/1e3):1/60;b=e;let r=!t.paused&&!_;r&&(v.time+=n*t.speed);let i=1-Math.exp(-n*3);v.mouse[0]+=(v.targetMouse[0]-v.mouse[0])*i,v.mouse[1]+=(v.targetMouse[1]-v.mouse[1])*i;let a=1-Math.exp(-n*10);v.pointer[0]+=(v.targetPointer[0]-v.pointer[0])*a,v.pointer[1]+=(v.targetPointer[1]-v.pointer[1])*a,v.presence+=((v.inside&&t.parting>0?1:0)-v.presence)*(1-Math.exp(-n*4)),j();let o=Math.abs(v.targetMouse[0]-v.mouse[0])>5e-4||Math.abs(v.targetMouse[1]-v.mouse[1])>5e-4||Math.abs(v.targetPointer[0]-v.pointer[0])>.05||Math.abs(v.targetPointer[1]-v.pointer[1])>.05||Math.abs((v.inside&&t.parting>0?1:0)-v.presence)>.002;r||o?y=requestAnimationFrame(M):b=0},N=()=>{!y&&S&&x&&!document.hidden&&(y=requestAnimationFrame(M))},P=t=>{let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/Math.max(1,n.width),i=(t.clientY-n.top)/Math.max(1,n.height),a=r>=0&&r<=1&&i>=0&&i<=1;a?(v.targetMouse=[r,1-i],v.targetPointer=[t.clientX-n.left-n.width/2,n.height/2-(t.clientY-n.top)],!v.inside&&v.presence<.01&&(v.pointer=[...v.targetPointer])):v.inside&&(v.targetMouse=[.5,.5]),v.inside=a,N()},F=()=>{v.inside=!1,v.targetMouse=[.5,.5],N()},I=()=>{b=0,N()},L=new ResizeObserver(A);L.observe(e);let R=new IntersectionObserver(e=>{x=e.some(e=>e.isIntersecting),x&&(b=0,N())});return R.observe(e),window.addEventListener(`pointermove`,P,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,F),document.addEventListener(`visibilitychange`,I),A(),T.current=()=>{y||j(),N()},()=>{S=!1,cancelAnimationFrame(y),T.current=null,L.disconnect(),R.disconnect(),window.removeEventListener(`pointermove`,P),document.documentElement.removeEventListener(`pointerleave`,F),document.removeEventListener(`visibilitychange`,I),n.deleteFramebuffer(m),n.deleteTexture(p),n.deleteBuffer(c),n.deleteBuffer(d),n.deleteVertexArray(s),n.deleteVertexArray(u),n.deleteProgram(r),n.deleteProgram(i)}},[]),(0,n.useEffect)(()=>{T.current?.()});let{className:O=``,...k}=S;return(0,r.jsx)(`div`,{ref:C,className:`threads-container${O?` ${O}`:``}`,...k,children:(0,r.jsx)(`canvas`,{ref:w,className:`threads-canvas`,"aria-hidden":`true`})})},ne=8,q=4,re=2.2,ie=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,ae=`#version 300 es
precision highp float;
precision highp int;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uGloss;
uniform float uDepth;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uStarGlow;
uniform float uFlareGain;
uniform float uSquash;
uniform float uSaturation;
uniform float uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationAngle;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform int uLayers;
uniform vec3 uColors[${q}];
uniform int uColorCount;
uniform float uWarp;
uniform float uReveal;
uniform float uMode;
uniform vec3 uBackground;
uniform float uOpacity;
out vec4 outColor;

#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare, vec2 radial, float invReach) {
#ifdef WARP
  float along = dot(uv, radial);
  float d = sqrt(max(dot(uv, uv) - uSquash * along * along, 0.0));
#else
  float d = length(uv);
#endif
  float m = uStarGlow / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uFlareGain;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uFlareGain;
  m *= smoothstep(1.0, 0.2, d * invReach);
#ifdef WARP
  m *= mix(1.0, smoothstep(1.0, 0.55, length(uv) * invReach), min(uWarp * 4.0, 1.0));
#endif
  return m;
}

vec3 StarLayer(vec2 uv, vec2 radial, vec2 repelAt, float pushCells, float spread) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uGloss / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

#ifdef PALETTE
      float pick = Hash21(si + 7.0) * float(uColorCount);
      vec3 base = uColors[int(min(floor(pick), float(uColorCount - 1)))];
#else
      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));
#endif

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      vec2 shift = vec2(0.0);
      float invReach = 1.0;
#ifdef REPEL
      vec2 away = si + 0.5 + pad - repelAt;
      float dist = length(away);
      float q = dist * spread;
      float cells = pushCells * exp(-q * q);
      float moved = cells * inversesqrt(1.0 + cells * cells * 2.78);
      shift = away * (moved / max(dist, 0.0001));
      invReach = 1.0 / (1.0 - moved);
#endif
      float star = Star(gv - offset - pad - shift, flareSize, radial, invReach);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      col += star * twinkle * size * base;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution;
  vec2 uv = (gl_FragCoord.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);

  vec2 repelAt = vec2(0.0);
  float strength = 0.0;
  float push = 0.0;
  if (uAutoCenterRepulsion > 0.0) {
    strength = uAutoCenterRepulsion;
    push = strength * 0.05;
  } else if (uMouseRepulsion > 0.5) {
    repelAt = (uMouse * uResolution - focalPx) / uResolution.y;
    strength = max(uRepulsionStrength, 0.0);
    push = strength * 0.05 * uMouseActiveFactor;
  } else {
    uv += mouseNorm * 0.1 * uMouseActiveFactor;
  }
  float radius = 0.16 + 0.04 * strength;

  vec2 radial = length(uv) > 0.0001 ? normalize(uv) : vec2(1.0, 0.0);
  float angle = uRotationAngle;
  uv = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
  radial = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * radial;
  radial = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * radial;
  repelAt = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * repelAt;
  repelAt = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * repelAt;

  vec3 col = vec3(0.0);
  float layers = float(uLayers);
  for (int k = 0; k < ${ne}; k++) {
    if (k >= uLayers) break;
    float i = float(k) / layers;
    float depth = fract(i + uDepth);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    vec2 offset = vec2(i * 453.32);
    col += StarLayer(uv * scale + offset, radial, repelAt * scale + offset, push * scale, 1.0 / (scale * radius)) * fade;
  }
  col *= uReveal;

  if (uMode > 1.5) {
    vec3 lit = col * smoothstep(0.0, 0.3, length(col));
    float energy = max(max(lit.r, lit.g), lit.b);
    vec3 tint = lit / max(energy, 0.0001);
    vec3 ink = tint * (0.16 / max(dot(tint, vec3(0.2126, 0.7152, 0.0722)), 0.16));
    float coverage = pow(min(energy * 1.3, 1.0), 1.3) * 0.92 * uOpacity;
    outColor = uMode > 2.5 ? vec4(ink * coverage, coverage) : vec4(mix(uBackground, ink, coverage), 1.0);
  } else if (uMode > 0.5) {
    float alpha = min(smoothstep(0.0, 0.3, length(col)), 1.0) * uOpacity;
    outColor = vec4(col * alpha, alpha);
  } else {
    outColor = vec4(mix(uBackground, col, uOpacity), 1.0);
  }
}`,oe=(e,t,n)=>Math.min(n,Math.max(t,e)),se=(e,t,n)=>(e?4:0)+(t?2:0)+ +!!n,ce=(e,t,n,r)=>{let i=`${t?`#define PALETTE
`:``}${n?`#define REPEL
`:``}${r?`#define WARP
`:``}`,a=e.createProgram(),o=e.createShader(e.VERTEX_SHADER),s=e.createShader(e.FRAGMENT_SHADER);return!a||!o||!s?null:(e.shaderSource(o,ie),e.shaderSource(s,ae.replace(`
`,`\n${i}`)),e.compileShader(o),e.compileShader(s),e.attachShader(a,o),e.attachShader(a,s),e.bindAttribLocation(a,0,`aPosition`),e.linkProgram(a),e.deleteShader(o),e.deleteShader(s),a)},le=(e,t)=>{if(!e.getProgramParameter(t,e.LINK_STATUS))return null;let n={},r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<r;i++){let r=e.getActiveUniform(t,i);r&&(n[r.name.replace(`[0]`,``)]=e.getUniformLocation(t,r.name))}return{program:t,uniforms:n}},ue=({focal:e=[.5,.5],rotation:t=[1,0],starSpeed:i=.5,density:a=1,hueShift:o=140,disableAnimation:s=!1,speed:c=1,mouseInteraction:l=!0,glowIntensity:u=.3,saturation:d=0,mouseRepulsion:f=!0,repulsionStrength:p=2,twinkleIntensity:m=.3,rotationSpeed:h=.1,autoCenterRepulsion:g=0,transparent:_=!0,lightMode:v=!1,starColors:y,starSize:b=1,flareIntensity:x=1,layers:S=4,direction:C=`forward`,clickWarp:w=!0,intro:T=!0,backgroundColor:E,opacity:D=1,dpr:O,className:k=``,style:A,...j})=>{let M=(0,n.useRef)(null),N=(0,n.useRef)(null),P=(0,n.useRef)(null),F=Array.isArray(y)?y.filter(Boolean).slice(0,q):[],I={focal:Array.isArray(e)?e:[.5,.5],rotation:Array.isArray(t)?t:[1,0],starSpeed:i,density:Math.max(.01,a),hueShift:o,disableAnimation:s,speed:c,mouseInteraction:l,glowIntensity:Math.max(0,u),saturation:Math.max(0,d),mouseRepulsion:f,repulsionStrength:p,twinkleIntensity:oe(m,0,1),rotationSpeed:h,autoCenterRepulsion:Math.max(0,g),transparent:_,lightMode:v,palette:F,starSize:Math.max(0,b),flareIntensity:Math.max(0,x),layers:oe(Math.round(S),2,ne),reverse:C===`backward`,clickWarp:w,intro:T,backgroundColor:E,opacity:oe(D,0,1),dpr:O},L=(0,n.useRef)(I);return L.current=I,(0,n.useEffect)(()=>{let e=M.current,t=N.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=n.getExtension(`KHR_parallel_shader_compile`),i=new Map,a=(e,t,r)=>{let a=se(e,t,r),o=i.get(a);return o||(o={program:ce(n,e,t,r),linked:null,done:!1},i.set(a,o)),o},o=(e,t,i,o)=>{let s=a(e,t,i);if(!s.done&&s.program){if(!o&&r&&!n.getProgramParameter(s.program,r.COMPLETION_STATUS_KHR))return null;s.linked=le(n,s.program),s.done=!0}return s.linked},s=L.current;if(!o(s.palette.length>0,!1,!1,!0)){i.forEach(e=>e.program&&n.deleteProgram(e.program));return}let c=n.createBuffer(),l=n.createVertexArray();n.bindVertexArray(l),n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let u=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),d=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,f=new Map,p=(e,t)=>{if(!e)return t;let n=String(e);if(f.has(n))return f.get(n);let r=t;if(u){u.clearRect(0,0,1,1),u.fillStyle=`#000000`,u.fillStyle=n,u.fillRect(0,0,1,1);let[e,t,i]=u.getImageData(0,0,1,1).data;r=[e/255,t/255,i/255]}return f.set(n,r),r},m=new Float32Array(12),h={x:.5,y:.5,inside:!1},g={time:0,gloss:0,depth:0,angle:0,mx:.5,my:.5,active:0,boost:0,reveal:L.current.intro&&!d?0:1},_=0,v=0,y=!0,b=()=>{let e=L.current;e.palette.forEach((e,t)=>m.set(p(e,[1,1,1]),t*3));let r=e.lightMode?e.transparent?3:2:+!!e.transparent,i=p(e.backgroundColor,e.lightMode?[1,1,1]:[0,0,0]),a=g.reveal,s=e.palette.length>0,c=e.autoCenterRepulsion>0||e.mouseRepulsion&&e.repulsionStrength>0&&g.active>0,u=g.boost>0,d=o(s,!1,!1,!0);if(!d)return;let f=(c||u?o(s,c,u,!1):null)??d,h=f.uniforms;n.viewport(0,0,t.width,t.height),n.useProgram(f.program),n.bindVertexArray(l),n.uniform1f(h.uTime,g.time),n.uniform2f(h.uResolution,t.width,t.height),n.uniform2f(h.uFocal,e.focal[0],e.focal[1]),n.uniform2f(h.uRotation,e.rotation[0],e.rotation[1]),n.uniform1f(h.uGloss,g.gloss),n.uniform1f(h.uDepth,g.depth),n.uniform1f(h.uDensity,e.density),n.uniform1f(h.uHueShift,e.hueShift),n.uniform1f(h.uSpeed,e.speed),n.uniform2f(h.uMouse,g.mx,g.my);let _=1+g.boost*5;n.uniform1f(h.uStarGlow,.05*e.glowIntensity*e.starSize/_**.6),n.uniform1f(h.uFlareGain,e.glowIntensity*e.flareIntensity),n.uniform1f(h.uSquash,1-1/(_*_)),n.uniform1f(h.uSaturation,e.saturation),n.uniform1f(h.uMouseRepulsion,+!!e.mouseRepulsion),n.uniform1f(h.uTwinkleIntensity,e.twinkleIntensity),n.uniform1f(h.uRotationAngle,g.angle),n.uniform1f(h.uRepulsionStrength,e.repulsionStrength),n.uniform1f(h.uMouseActiveFactor,g.active),n.uniform1f(h.uAutoCenterRepulsion,e.autoCenterRepulsion),n.uniform1i(h.uLayers,e.layers),n.uniform3fv(h.uColors,m),n.uniform1i(h.uColorCount,e.palette.length),n.uniform1f(h.uWarp,g.boost);let v=Math.min(1,a/.35);n.uniform1f(h.uReveal,v*v*(3-2*v)),n.uniform1f(h.uMode,r),n.uniform3fv(h.uBackground,i),n.uniform1f(h.uOpacity,e.opacity),n.drawArrays(n.TRIANGLES,0,3)},x=e=>{if(_=0,!y||document.hidden)return;let t=L.current,n=v?oe((e-v)/1e3,5e-4,.05):1/60;v=e;let r=t.disableAnimation||d?0:1;t.intro&&!d&&g.reveal<1?(g.reveal=Math.min(1,g.reveal+n/re),g.boost=Math.max(g.boost,(1-g.reveal)**2*1.4)):(!t.intro||d)&&(g.reveal=1);let i=t.starSpeed/10*(t.reverse?-1:1);g.time+=n*r,g.gloss+=n*i*r,g.depth+=n*i*t.speed*r*(1+g.boost*14),g.angle+=n*t.rotationSpeed*r,g.boost*=Math.exp(-n*1.3),g.boost<.001&&(g.boost=0);let a=1-Math.exp(-n/.325),o=t.mouseInteraction&&h.inside&&!d;o&&(g.mx+=(h.x-g.mx)*a,g.my+=(h.y-g.my)*a);let s=+!!o;g.active+=(s-g.active)*a,Math.abs(s-g.active)<.001&&(g.active=s),b(),r>0||g.boost>0||g.active!==s||g.reveal<1?_=requestAnimationFrame(x):v=0},S=()=>{!_&&y&&!document.hidden&&(_=requestAnimationFrame(x))},C=()=>{let n=L.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),b(),S()},w=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;h.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height,h.x=r/Math.max(1,n.width),h.y=1-i/Math.max(1,n.height)},T=e=>{w(e),S()},E=e=>{let t=L.current;w(e),h.inside&&t.clickWarp&&!d&&(g.boost=Math.min(1.6,g.boost+1),S())},D=e=>{e.pointerType!==`mouse`&&(h.inside=!1)},O=()=>{h.inside=!1},k=()=>{v=0,S()},A=new ResizeObserver(C);A.observe(e);let j=new IntersectionObserver(e=>{y=e.some(e=>e.isIntersecting),y&&(v=0,S())});j.observe(e),window.addEventListener(`pointermove`,T,{passive:!0}),window.addEventListener(`pointerdown`,E,{passive:!0}),window.addEventListener(`pointerup`,D,{passive:!0}),window.addEventListener(`pointercancel`,D,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,O),document.addEventListener(`visibilitychange`,k),C();let F=s.autoCenterRepulsion>0||s.mouseInteraction&&s.mouseRepulsion,I=s.palette.length>0;(s.clickWarp||s.intro)&&a(I,!1,!0),F&&a(I,!0,!1),F&&s.clickWarp&&a(I,!0,!0);let R=L.current.dpr;return P.current=()=>{let e=L.current;if(e.dpr!==R){R=e.dpr,C();return}_||b(),S()},()=>{cancelAnimationFrame(_),P.current=null,A.disconnect(),j.disconnect(),window.removeEventListener(`pointermove`,T),window.removeEventListener(`pointerdown`,E),window.removeEventListener(`pointerup`,D),window.removeEventListener(`pointercancel`,D),document.documentElement.removeEventListener(`pointerleave`,O),document.removeEventListener(`visibilitychange`,k),i.forEach(e=>e.program&&n.deleteProgram(e.program)),n.deleteBuffer(c),n.deleteVertexArray(l),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,n.useEffect)(()=>{P.current?.()}),(0,r.jsx)(`div`,{ref:M,className:`galaxy-container${k?` ${k}`:``}`,style:A,...j,children:(0,r.jsx)(`canvas`,{ref:N,className:`galaxy-canvas`,"aria-hidden":`true`})})},de=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,fe=`#version 300 es
precision highp float;
uniform vec2 uView;
uniform vec2 uScale;
uniform vec2 uTurn;
uniform float uTime;
uniform float uWidth;
uniform float uWave;
uniform float uDepth;
uniform float uRough;
uniform float uSeed;
uniform float uTwist;
uniform vec3 uLight;
uniform float uFill;
uniform float uCamera;
uniform vec4 uPointer;
out vec4 outColor;

const float PI = 3.141592653589793;

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

float laneHash(float lane) {
  return fract(sin(lane * 91.3458 + uSeed * 17.17) * 47453.5453);
}

float lobe(float nh, float nl, float nv, float vh, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float d = nh * nh * (a2 - 1.0) + 1.0;
  float distribution = a2 / (PI * d * d);
  float gv = nl * sqrt(nv * nv * (1.0 - a2) + a2);
  float gl = nv * sqrt(nl * nl * (1.0 - a2) + a2);
  float visibility = 0.5 / max(gv + gl, 0.0001);
  float fresnel = 0.028 + 0.972 * pow(1.0 - vh, 5.0);
  return distribution * visibility * fresnel * nl;
}

vec2 glint(float lane, vec2 local) {
  float along = local.y / uWave - laneHash(lane) * 60.0;
  float step = 0.01;
  float slope = (cnoise(vec3(0.0, along + step, uTime)) - cnoise(vec3(0.0, along - step, uTime))) / (2.0 * step);
  slope *= 0.2 * uDepth;
  float spin = laneHash(lane + 0.37);
  float tilt = ((spin - 0.5) * 0.5 + sin(uTime * 2.1 + spin * 6.2831) * 0.06) * uTwist;
  vec3 normal = normalize(vec3(tilt, -slope, 1.0));
  vec3 view = normalize(vec3(-local, uCamera));
  float nv = max(dot(normal, view), 0.0001);
  vec3 light = normalize(uLight);
  vec3 halfway = normalize(light + view);
  float core = lobe(max(dot(normal, halfway), 0.0), max(dot(normal, light), 0.0), nv, max(dot(view, halfway), 0.0), uRough);
  vec3 fill = normalize(vec3(0.0, -uLight.y * 1.25, uLight.z));
  vec3 fillHalf = normalize(fill + view);
  core += uFill * lobe(max(dot(normal, fillHalf), 0.0), max(dot(normal, fill), 0.0), nv, max(dot(view, fillHalf), 0.0), uRough);
  return vec2(core, core);
}

void main() {
  vec2 css = gl_FragCoord.xy * uScale;
  vec2 centered = css - uView * 0.5;
  vec2 local = mat2(uTurn.x, -uTurn.y, uTurn.y, uTurn.x) * centered;

  float across = local.x / uWidth + 0.5;
  float lane = floor(across);
  float u = across - lane;
  vec2 value = glint(lane, local);

  float pixel = max(uScale.x, uScale.y);
  float seam = min(u, 1.0 - u) * uWidth;
  if (seam < pixel * 1.5) {
    float other = u < 0.5 ? lane - 1.0 : lane + 1.0;
    float blend = 0.5 * (1.0 - smoothstep(0.0, pixel * 1.5, seam));
    value = mix(value, glint(other, local), blend);
  }

  vec2 toPointer = css - uPointer.xy;
  float near = exp(-dot(toPointer, toPointer) / (2.0 * uPointer.w * uPointer.w)) * uPointer.z;
  value *= 1.0 + near * 0.8;
  float hot = max(value.y - 0.18, 0.0);
  outColor = vec4(value.x, value.y, min(hot, 6.0), 1.0);
}`,pe=`#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uInk;
uniform float uGain;
uniform float uGlow;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uLightMode;
out vec4 outColor;

float random(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

float grainNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 acesFilmic(vec3 color) {
  const mat3 inputMatrix = mat3(
    vec3(0.59719, 0.07600, 0.02840),
    vec3(0.35458, 0.90834, 0.13383),
    vec3(0.04823, 0.01566, 0.83777)
  );
  const mat3 outputMatrix = mat3(
    vec3(1.60475, -0.10208, -0.00327),
    vec3(-0.53108, 1.10813, -0.07276),
    vec3(-0.07367, -0.00605, 1.07602)
  );
  color = inputMatrix * (color / 0.6);
  vec3 a = color * (color + 0.0245786) - 0.000090537;
  vec3 b = color * (0.983729 * color + 0.4329510) + 0.238081;
  color = outputMatrix * (a / b);
  return clamp(color, 0.0, 1.0);
}

vec3 toSrgb(vec3 color) {
  return mix(color * 12.92, 1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), color));
}

float feather(float x, float edge) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float radiance = textureLod(uField, uv, 0.0).r;
  float bloom = 0.0;
  bloom += textureLod(uField, uv, 2.0).b * 0.3;
  bloom += textureLod(uField, uv, 3.0).b * 0.3;
  bloom += textureLod(uField, uv, 4.0).b * 0.22;
  bloom += textureLod(uField, uv, 5.0).b * 0.18;

  float hot = textureLod(uField, uv, 0.0).g;
  vec3 light = uColor * (radiance + bloom * uGlow) * uGain;
  light += mix(uColor, vec3(1.0), 0.7) * hot * hot * 0.12 * uGain;
  light *= uPresence;
  vec3 color = toSrgb(acesFilmic(light));
  color -= grainNoise(gl_FragCoord.xy) / 15.0 * uGrain;
  color = max(color, 0.0);

  float edge = uFade * 0.5;
  float mask = feather(uv.x, edge) * feather(1.0 - uv.x, edge) * feather(uv.y, edge) * feather(1.0 - uv.y, edge);
  mask *= uOpacity;
  float dither = (random(gl_FragCoord.yx + 31.7) - 0.5) / 255.0;

  float peak = max(color.r, max(color.g, color.b));
  if (uLightMode > 0.5) {
    float alpha = clamp(peak * 0.9 + dither, 0.0, 1.0) * mask;
    outColor = vec4(uInk * alpha, alpha);
  } else {
    color = clamp(color + dither, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`,me=1.6,he=16e5,J=(e,t,n)=>Math.min(n,Math.max(t,e)),ge=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},_e=(e,t)=>{let n=ge(e,e.VERTEX_SHADER,de),r=ge(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},ve=({color:e=`#ffffff`,beamWidth:t=140,rotation:i=30,speed:a=1,waveLength:o=233,depth:s=1,sharpness:c=.6,twist:l=0,fillLight:u=.3,glow:d=.6,brightness:f=1.6,variation:p=0,grain:m=.35,quality:h=.75,mouseInteraction:g=!0,mouseStrength:_=1,intro:v=!0,fade:y=0,opacity:b=1,lightMode:x=!1,backgroundColor:S,paused:C=!1,dpr:w,className:T=``,style:E,...D})=>{let O=(0,n.useRef)(null),k=(0,n.useRef)(null),A=(0,n.useRef)(null),j={color:String(e),beamWidth:Math.max(8,t),rotation:i,speed:a,waveLength:Math.max(20,o),depth:Math.max(0,s),sharpness:J(c,0,1),twist:J(l,0,2),fillLight:J(u,0,1.5),glow:Math.max(0,d),brightness:Math.max(0,f),variation:Number(p)||0,grain:Math.max(0,m),quality:J(h,.25,1),mouseInteraction:g,mouseStrength:Math.max(0,_),intro:v,fade:J(y,0,1),opacity:J(b,0,1),lightMode:x,paused:C,dpr:w},M=(0,n.useRef)(j);return M.current=j,(0,n.useEffect)(()=>{let e=O.current,t=k.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=_e(n,fe),a=_e(n,pe);if(!i||!a)return;let o=n.createBuffer(),s=n.createVertexArray();n.bindVertexArray(s),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let c=null,l=n.createFramebuffer(),u={width:0,height:0},d=(e,t)=>{if(u.width===e&&u.height===t)return;u.width=e,u.height=t,c&&n.deleteTexture(c),c=n.createTexture(),n.bindTexture(n.TEXTURE_2D,c);let i=Math.floor(Math.log2(Math.max(e,t)))+1;n.texStorage2D(n.TEXTURE_2D,i,r?n.RGBA16F:n.RGBA8,e,t),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,l),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,c,0)},f=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),p=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,m=new Map,h=e=>{let t=m.get(e);if(t)return t;let n=[1,1,1];if(f){f.clearRect(0,0,1,1),f.fillStyle=`#ffffff`,f.fillStyle=e,f.fillRect(0,0,1,1);let[t,r,i]=f.getImageData(0,0,1,1).data;n=[t,r,i].map(e=>(e/255)**2.2)}return m.set(e,n),n},g={width:1,height:1,fieldWidth:1,fieldHeight:1},_={x:0,y:0,inside:!1},v={clock:0,intro:M.current.intro&&!p?0:1,reach:0,x:0,y:0,lightY:0},y=0,b=0,x=!0,S=()=>{let e=M.current,r=v.intro*v.intro*v.intro*(v.intro*(v.intro*6-15)+10);n.bindVertexArray(s),d(g.fieldWidth,g.fieldHeight);let o=e.rotation*Math.PI/180,f=(1-r)*-9,p=v.reach*e.mouseStrength,m=i.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,l),n.viewport(0,0,u.width,u.height),n.useProgram(i.program),n.uniform2f(m.uView,g.width,g.height),n.uniform2f(m.uScale,g.width/u.width,g.height/u.height),n.uniform2f(m.uTurn,Math.cos(o),Math.sin(o)),n.uniform1f(m.uTime,v.clock*.12%289),n.uniform1f(m.uWidth,e.beamWidth),n.uniform1f(m.uWave,e.waveLength),n.uniform1f(m.uDepth,e.depth),n.uniform1f(m.uRough,.55-e.sharpness*.5),n.uniform1f(m.uSeed,e.variation),n.uniform1f(m.uTwist,e.twist),n.uniform1f(m.uFill,e.fillLight),n.uniform3f(m.uLight,0,3+f+v.lightY*p,10),n.uniform1f(m.uCamera,g.height*1.866),n.uniform4f(m.uPointer,v.x,g.height-v.y,p,Math.max(g.height,g.width)*.28),n.drawArrays(n.TRIANGLES,0,3),n.bindTexture(n.TEXTURE_2D,c),n.generateMipmap(n.TEXTURE_2D);let _=a.uniforms,y=h(e.color),b=.2126*y[0]+.7152*y[1]+.0722*y[2],x=Math.min(1,.18/Math.max(b,.001)),S=y.map(e=>Math.min(1,e*x)**(1/2.2));n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(a.program),n.uniform2f(_.uResolution,t.width,t.height),n.uniform3fv(_.uColor,y),n.uniform3fv(_.uInk,S),n.uniform1f(_.uGain,e.brightness),n.uniform1f(_.uGlow,e.glow),n.uniform1f(_.uPresence,r),n.uniform1f(_.uGrain,e.grain*1.75),n.uniform1f(_.uFade,e.fade),n.uniform1f(_.uOpacity,e.opacity),n.uniform1f(_.uLightMode,+!!e.lightMode),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,c),n.uniform1i(_.uField,0),n.drawArrays(n.TRIANGLES,0,3)},C=e=>{if(y=0,!x||document.hidden)return;let t=M.current,n=b?Math.min(.05,(e-b)/1e3):1/60;b=e;let r=!t.paused&&!p;r&&(v.clock+=n*t.speed),!t.intro||p?v.intro=1:v.intro<1&&(v.intro=Math.min(1,v.intro+n/me));let i=t.mouseInteraction&&_.inside&&!p;i&&v.reach<.01&&(v.x=_.x,v.y=_.y);let a=1-Math.exp(-n*7);v.x+=(_.x-v.x)*a,v.y+=(_.y-v.y)*a,v.reach+=(+!!i-v.reach)*(1-Math.exp(-n*(i?3.2:1.8)));let o=t.rotation*Math.PI/180,s=v.x-g.width/2,c=g.height/2-v.y,l=-Math.sin(o)*s+Math.cos(o)*c;v.lightY=J(l/(g.height*.5)*3,-4,4),S();let u=v.intro<1||Math.abs(+!!i-v.reach)>.002||Math.abs(_.x-v.x)+Math.abs(_.y-v.y)>.3;r||u?y=requestAnimationFrame(C):b=0},w=()=>{!y&&x&&!document.hidden&&(y=requestAnimationFrame(C))},T=()=>{let n=M.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);g.width=r,g.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a));let o=n.quality*a;r*i*o*o>he&&(o=Math.sqrt(he/(r*i))),g.fieldWidth=Math.max(1,Math.round(r*o)),g.fieldHeight=Math.max(1,Math.round(i*o)),y||S(),w()},E=t=>{let n=e.getBoundingClientRect();_.x=t.clientX-n.left,_.y=t.clientY-n.top,_.inside=_.x>=0&&_.y>=0&&_.x<=n.width&&_.y<=n.height,w()},D=()=>{_.inside=!1,w()},j=()=>{b=0,w()},N=new ResizeObserver(T);N.observe(e);let P=new IntersectionObserver(e=>{x=e.some(e=>e.isIntersecting),x&&(b=0,w())});P.observe(e),window.addEventListener(`pointermove`,E,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,D),document.addEventListener(`visibilitychange`,j),T();let F=M.current.quality,I=M.current.dpr;return A.current=()=>{let e=M.current;if(e.quality!==F||e.dpr!==I){F=e.quality,I=e.dpr,T();return}y||S(),w()},()=>{cancelAnimationFrame(y),A.current=null,N.disconnect(),P.disconnect(),window.removeEventListener(`pointermove`,E),document.documentElement.removeEventListener(`pointerleave`,D),document.removeEventListener(`visibilitychange`,j),c&&n.deleteTexture(c),n.deleteFramebuffer(l),n.deleteProgram(i.program),n.deleteProgram(a.program),n.deleteBuffer(o),n.deleteVertexArray(s),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,n.useEffect)(()=>{A.current?.()}),(0,r.jsx)(`div`,{ref:O,className:`beams-container${T?` ${T}`:``}`,style:S?{background:S,...E}:E,...D,children:(0,r.jsx)(`canvas`,{ref:k,className:`beams-canvas`,"aria-hidden":`true`})})},ye=1.4,be=64,xe=[.299,.587,.114,.299,.587,.114,.299,.587,.114],Se=[.701,-.587,-.114,-.299,.413,-.114,-.3,-.588,.886],Ce=[.168,-.331,.5,.328,.035,-.5,-.497,.296,.201],we=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,Te=`#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform mat3 uRay;
uniform float uGlow;
uniform vec2 uOffset;
uniform float uColorFreq;
uniform float uCenterShift;
uniform float uInvBaseHalf;
uniform float uInvHeight;
uniform float uMinAxis;
uniform float uPxScale;
uniform sampler2D uPalette;
uniform int uUsePalette;
uniform float uTime;
uniform float uNoise;
uniform float uSaturation;
uniform mat3 uHue;
uniform int uUseHue;
uniform float uLight;
uniform float uNeutral;
out vec4 outColor;

const vec4 PHASE_COS = vec4(1.0, 0.5403023058681398, -0.4161468365471424, -0.9899924966004454);
const vec4 PHASE_SIN = vec4(0.0, 0.8414709848078965, 0.9092974268256817, 0.1411200080598672);

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
}

float pyramid(vec3 p) {
  vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
  return max((q.x + q.y + q.z - 1.0) * uMinAxis * 0.5773502691896258, -p.y);
}

vec3 grade(vec3 col, vec2 seed) {
  col += (rand(seed) - 0.5) * uNoise;
  col = clamp(col, 0.0, 1.0);
  float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);
  if (uUseHue == 1) col = clamp(uHue * col, 0.0, 1.0);
  return col;
}

void main() {
  vec2 f = (gl_FragCoord.xy - 0.5 * uResolution - uOffset) * uPxScale;
  vec3 origin = uRay * vec3(f, 0.0);
  vec3 axis = uRay[2];
  float z = 5.0;
  vec4 o = vec4(0.0);
  for (int i = 0; i < 100; i++) {
    vec3 p = origin + axis * z;
    float d = 0.1 + 0.2 * abs(pyramid(p + vec3(0.0, uCenterShift, 0.0)));
    z -= d;
    float phase = (p.y + z) * uColorFreq;
    vec4 band = sin(phase) * PHASE_COS + cos(phase) * PHASE_SIN + 1.0;
    if (uUsePalette == 1) band.rgb = texture(uPalette, vec2(phase * 0.15915494309189535, 0.5)).rgb * 2.0;
    o += band / d;
  }
  vec4 raw = o * o * uGlow / 1e5;
  vec4 e = exp(2.0 * raw);
  vec4 mapped = (e - 1.0) / (e + 1.0);
  vec2 seed = gl_FragCoord.xy + vec2(uTime);
  if (uLight > 0.5) {
    float peak = max(raw.r, max(raw.g, raw.b));
    vec3 hue = grade(raw.rgb / max(peak, 1e-6), seed);
    vec3 ink = pow(hue, vec3(1.5)) * mix(0.86, 0.32, uNeutral);
    float strength = max(mapped.r, max(mapped.g, mapped.b)) * mapped.a;
    float cover = clamp(strength * 0.95 + (rand(seed.yx) - 0.5) * uNoise * 0.5, 0.0, 1.0);
    outColor = vec4(ink * cover, cover);
  } else {
    outColor = vec4(grade(mapped.rgb, seed) * mapped.a, mapped.a);
  }
}`,Ee=(e,t,n)=>Math.min(n,Math.max(t,e)),De=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},Oe=e=>{let t=De(e,e.VERTEX_SHADER,we),n=De(e,e.FRAGMENT_SHADER,Te),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},ke=(e,t,n)=>{let r=Math.cos(e),i=Math.sin(e),a=Math.cos(t),o=Math.sin(t),s=Math.cos(n),c=Math.sin(n);return[r*s+i*o*c,a*c,-i*s+r*o*c,-r*c+i*o*s,a*s,i*c+r*o*s,i*a,-o,r*a]},Ae=(e,t)=>{let n=Array(9);for(let r=0;r<3;r++)for(let i=0;i<3;i++)n[r*3+i]=e[i]*t[r*3]+e[3+i]*t[r*3+1]+e[6+i]*t[r*3+2];return n},je=({height:e=3.5,baseWidth:t=5.5,animationType:i=`rotate`,glow:a=1,offset:o,noise:s=0,scale:c=3.6,hueShift:l=0,colorFrequency:u=1,colors:d,saturation:f=1.5,timeScale:p=.5,interactive:m=!0,hoverStrength:h=2,inertia:g=.05,intro:_=!0,resolution:v=.5,lightMode:y=!1,dpr:b,className:x=``,style:S,...C})=>{let w=(0,n.useRef)(null),T=(0,n.useRef)(null),E=(0,n.useRef)(null),D=Array.isArray(d)?d.filter(Boolean).slice(0,8):[],O={height:Math.max(.1,e),baseWidth:Math.max(.1,t),animationType:i===`rotate3d`?`3drotate`:i,glow:Math.max(0,a),offsetX:o?.x??0,offsetY:o?.y??0,noise:Math.max(0,s),scale:Math.max(.1,c),hueShift:(l||0)*Math.PI/180,colorFrequency:Math.max(0,u),colors:D,saturation:Math.max(0,f),timeScale:Math.max(0,p),interactive:m,hoverStrength:Math.max(0,h),inertia:Ee(g,.001,1),intro:_,resolution:Ee(v,.25,1),lightMode:y,dpr:b},k=(0,n.useRef)(O);return k.current=O,(0,n.useEffect)(()=>{let e=w.current,t=T.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=Oe(n);if(!r)return;let i=r.uniforms,a=n.createVertexArray(),o=n.createTexture();n.bindTexture(n.TEXTURE_2D,o),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.REPEAT),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,n.RGBA8,be,1,0,n.RGBA,n.UNSIGNED_BYTE,null);let s=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),c=e=>{if(!s)return[255,255,255];s.clearRect(0,0,1,1),s.fillStyle=`#000000`,s.fillStyle=String(e),s.fillRect(0,0,1,1);let[t,n,r]=s.getImageData(0,0,1,1).data;return[t,n,r]},l=``,u=0,d=e=>{let t=e.join(`,`);if(t===l||(l=t,u=0,!e.length))return;let r=e.map(c);u=1-r.reduce((e,[t,n,r])=>{let i=Math.max(t,n,r);return e+(i>0?(i-Math.min(t,n,r))/i:0)},0)/r.length;let i=new Uint8Array(256);for(let e=0;e<be;e++){let t=e/be*r.length,n=Math.floor(t),a=r[n%r.length],o=r[(n+1)%r.length],s=t-n,c=s*s*(3-2*s);for(let t=0;t<3;t++)i[e*4+t]=Math.round(a[t]+(o[t]-a[t])*c);i[e*4+3]=255}n.bindTexture(n.TEXTURE_2D,o),n.texSubImage2D(n.TEXTURE_2D,0,0,0,be,1,n.RGBA,n.UNSIGNED_BYTE,i)},f=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,p={width:1,height:1,scale:1},m={yaw:0,pitch:0,roll:0},h={x:0,y:0,inside:!1},g=0,_=k.current.intro&&!f?0:1,v=0,y=0,b=!0,x=e=>{let t=ke(m.yaw,m.pitch,m.roll);if(e.animationType===`rotate`){let n=g*e.timeScale,r=Math.cos(n),i=Math.cos(n+33);return Ae(t,[r,0,Math.cos(n+11),0,1,0,i,0,r])}if(e.animationType===`3drotate`){let n=g*e.timeScale;return Ae(t,ke(n*.55,Math.sin(n*.6+.6)*.6,Math.sin(n*.35+1.9)*.5))}return t},S=()=>{let e=k.current;d(e.colors);let s=e.baseWidth*.5,c=_*_*(3-2*_),l=Math.cos(e.hueShift),f=Math.sin(e.hueShift);n.bindVertexArray(a),n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.uniform2f(i.uResolution,t.width,t.height),n.uniformMatrix3fv(i.uRay,!1,x(e)),n.uniform1f(i.uGlow,e.glow*c*c),n.uniform2f(i.uOffset,e.offsetX*p.scale,-e.offsetY*p.scale),n.uniform1f(i.uColorFreq,e.colorFrequency),n.uniform1f(i.uCenterShift,e.height*.25),n.uniform1f(i.uInvBaseHalf,1/s),n.uniform1f(i.uInvHeight,1/e.height),n.uniform1f(i.uMinAxis,Math.min(s,e.height)),n.uniform1f(i.uPxScale,1/(t.height*.1*e.scale)),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,o),n.uniform1i(i.uPalette,0),n.uniform1i(i.uUsePalette,+!!e.colors.length),n.uniform1f(i.uTime,g),n.uniform1f(i.uNoise,e.noise),n.uniform1f(i.uSaturation,e.saturation),n.uniformMatrix3fv(i.uHue,!1,xe.map((e,t)=>e+Se[t]*l+Ce[t]*f)),n.uniform1i(i.uUseHue,+(Math.abs(e.hueShift)>1e-4)),n.uniform1f(i.uLight,+!!e.lightMode),n.uniform1f(i.uNeutral,u),n.drawArrays(n.TRIANGLES,0,3)},C=()=>{let n=k.current;p.width=Math.max(1,e.clientWidth),p.height=Math.max(1,e.clientHeight),p.scale=Math.min(n.dpr||window.devicePixelRatio||1,2)*n.resolution,t.width=Math.max(1,Math.round(p.width*p.scale)),t.height=Math.max(1,Math.round(p.height*p.scale)),S(),O()},D=e=>{if(v=0,!b||document.hidden)return;let n=k.current;if(Math.round(p.width*Math.min(n.dpr||window.devicePixelRatio||1,2)*n.resolution)!==t.width){C();return}let r=y?Ee((e-y)/1e3,.001,.05):1/60;y=e,f||(g+=r),_<1&&(_=Math.min(1,_+r/ye));let i=n.animationType===`hover`,a=h.inside&&!f&&(i||n.interactive),o=(i?.6:.09)*n.hoverStrength,s=a?-h.x*o:0,c=a?h.y*o:0,l=1-(1-n.inertia)**(r*60);m.yaw+=(s-m.yaw)*l,m.pitch+=(c-m.pitch)*l,m.roll+=(0-m.roll)*(1-.9**(r*60)),S();let u=Math.abs(s-m.yaw)+Math.abs(c-m.pitch)+Math.abs(m.roll)>1e-4;!f&&!i&&n.animationType!==`static`&&n.timeScale>0||u||_<1||!f&&n.noise>0?v=requestAnimationFrame(D):y=0};function O(){!v&&b&&!document.hidden&&(v=requestAnimationFrame(D))}let A=t=>{let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/Math.max(1,n.width)*2-1,i=(t.clientY-n.top)/Math.max(1,n.height)*2-1;h.inside=Math.abs(r)<=1&&Math.abs(i)<=1,h.x=Ee(r,-1,1),h.y=Ee(i,-1,1);let a=k.current;(a.interactive||a.animationType===`hover`)&&O()},j=()=>{h.inside=!1,O()},M=()=>{y=0,O()},N=new ResizeObserver(C);N.observe(e);let P=new IntersectionObserver(e=>{b=e.some(e=>e.isIntersecting),b&&(y=0,O())});return P.observe(e),window.addEventListener(`pointermove`,A,{passive:!0}),window.addEventListener(`blur`,j),document.documentElement.addEventListener(`pointerleave`,j),document.addEventListener(`visibilitychange`,M),C(),E.current=O,()=>{cancelAnimationFrame(v),E.current=null,N.disconnect(),P.disconnect(),window.removeEventListener(`pointermove`,A),window.removeEventListener(`blur`,j),document.documentElement.removeEventListener(`pointerleave`,j),document.removeEventListener(`visibilitychange`,M),n.deleteTexture(o),n.deleteVertexArray(a),n.deleteProgram(r.program),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,n.useEffect)(()=>{E.current?.()}),(0,r.jsx)(`div`,{ref:w,className:`prism${x?` ${x}`:``}`,style:S,...C,children:(0,r.jsx)(`canvas`,{ref:T,className:`prism-canvas`,"aria-hidden":`true`})})},Me={circle:0,square:1,ring:2,sparkle:3},Ne={parallax:0,repel:1,attract:2},Pe={none:0,up:1,down:2,forward:3},Fe=2e4,Ie=900,Le=9e3,Re=4,ze=10,Be=1/Math.tan(7.5*Math.PI/180),Ve=.1,Y=100,He=1.8,Ue=1.5,We=520,Ge=46,Ke=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec3 aPosition;
layout(location = 2) in vec4 aRandom;
layout(location = 3) in vec3 aColor;
uniform mat3 uRotation;
uniform vec3 uOffset;
uniform float uSpread;
uniform float uTime;
uniform float uCamera;
uniform float uAspect;
uniform vec2 uView;
uniform float uRatio;
uniform float uSize;
uniform float uRandomness;
uniform float uBlur;
uniform float uFocus;
uniform float uGlow;
uniform float uTwinkle;
uniform int uShape;
uniform int uDrift;
uniform float uTravel;
uniform vec4 uPointer;
uniform int uEffect;
uniform float uStrength;
uniform vec4 uBursts[${Re}];
uniform int uBurstCount;
uniform float uReveal;
out vec2 vLocal;
out float vRadius;
out float vBlur;
out float vAlpha;
out float vHalo;
out float vSeed;
out vec3 vColor;

vec3 bob(vec4 r, float t) {
  return vec3(
    sin(t * r.z + 6.28 * r.w) * mix(0.1, 1.5, r.x),
    sin(t * r.y + 6.28 * r.x) * mix(0.1, 1.5, r.w),
    sin(t * r.w + 6.28 * r.y) * mix(0.1, 1.5, r.z)
  );
}

void main() {
  vec3 pos = aPosition * uSpread;
  pos.z *= ${ze.toFixed(1)};
  vec3 wobble = bob(aRandom, uTime);
  vec3 world = uRotation * pos + uOffset + wobble;
  float edge = 1.0;
  if (uDrift == 1 || uDrift == 2) {
    float span = uSpread * 2.0 + 3.0;
    float k = mod(aRandom.w * span + uOffset.y + wobble.y + (uDrift == 1 ? uTravel : -uTravel), span);
    world.y = k - span * 0.5;
    edge = smoothstep(0.0, span * 0.12, k) * smoothstep(span, span * 0.88, k);
  } else if (uDrift == 3) {
    float span = uSpread * ${ze.toFixed(1)} * 2.0 + 3.0;
    float k = mod(aRandom.y * span + uOffset.z + wobble.z + uTravel, span);
    world.z = k - span * 0.5;
    edge = smoothstep(0.0, span * 0.1, k);
  }
  vec3 view = world - vec3(0.0, 0.0, uCamera);
  float dist = length(view);
  float ahead = -view.z;
  if (ahead < ${Ve.toFixed(2)} || ahead > ${Y.toFixed(1)}) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  edge *= smoothstep(1.0, 4.0, ahead);
  vec2 ndc = vec2(view.x * ${Be.toFixed(6)} / uAspect, view.y * ${Be.toFixed(6)}) / ahead;
  vec2 screen = (ndc * 0.5 + 0.5) * uView;

  vec2 shift = vec2(0.0);
  float flash = 0.0;
  if (uEffect != 0 && uPointer.z > 0.001) {
    vec2 delta = screen - uPointer.xy;
    float reach = length(delta);
    float falloff = exp(-dot(delta, delta) / (uPointer.w * uPointer.w));
    vec2 away = reach > 0.001 ? delta / reach : vec2(0.0);
    shift += (uEffect == 1 ? away * uPointer.w * 0.5 : -delta * 0.6) * falloff * uStrength * uPointer.z;
  }
  for (int i = 0; i < ${Re}; i++) {
    if (i >= uBurstCount) break;
    vec4 burst = uBursts[i];
    vec2 delta = screen - burst.xy;
    float reach = length(delta);
    float wave = exp(-pow((reach - burst.z * ${We.toFixed(1)}) / ${Ge.toFixed(1)}, 2.0));
    vec2 away = reach > 0.001 ? delta / reach : vec2(0.0);
    float fade = (1.0 - burst.z) * (1.0 - burst.z) * burst.w;
    shift += away * wave * fade * 56.0 * smoothstep(0.0, 30.0, reach);
    flash += wave * fade;
  }
  screen += shift;

  float diameter = (uRandomness <= 0.0 ? uSize : uSize * (1.0 + uRandomness * (aRandom.x - 0.5)) / dist) * (1.0 + min(flash, 1.0) * 0.6);
  float device = diameter * uRatio;
  float radius = max(diameter, 1.0 / uRatio) * 0.5;
  float coverage = min(1.0, device * device);
  float blur = uBlur * max(uFocus - dist, 0.0) / max(dist, 1.0);
  float halo = uGlow > 0.0 ? radius * 2.5 + 2.0 : 0.0;
  float extent = radius * (uShape == 3 ? 1.6 : 1.0) + blur + halo + 1.5;

  float twinkle = 1.0 - uTwinkle * 0.6 * (0.5 + 0.5 * sin(uTime * (6.0 + aRandom.y * 14.0) + aRandom.w * 40.0));
  float far = smoothstep(${Y.toFixed(1)}, ${(Y*.9).toFixed(1)}, ahead);
  float focus = radius / (radius + blur);
  float reveal = clamp(uReveal * 1.6 - aRandom.z * 0.6, 0.0, 1.0);

  vLocal = aCorner * extent;
  vRadius = radius;
  vBlur = blur;
  vHalo = halo;
  vSeed = aRandom.y;
  vAlpha = min(1.0, coverage * twinkle * (1.0 + flash * 1.4)) * far * edge * max(focus, 0.35) * reveal * reveal;
  vColor = aColor;
  gl_Position = vec4((screen + aCorner * extent) / uView * 2.0 - 1.0, 0.0, 1.0);
}`,qe=`#version 300 es
precision highp float;
precision highp int;
uniform int uShape;
uniform float uGlow;
uniform float uRatio;
uniform float uTime;
uniform float uSoft;
uniform float uShimmer;
uniform float uOpacity;
in vec2 vLocal;
in float vRadius;
in float vBlur;
in float vAlpha;
in float vHalo;
in float vSeed;
in vec3 vColor;
out vec4 outColor;

float ray(vec2 q, float aa) {
  float width = 0.14 * max(0.0, 1.0 - q.x);
  return (1.0 - smoothstep(width - aa, width + aa, q.y)) * step(q.x, 1.0);
}

void main() {
  float soft = vBlur + 0.7 / uRatio + vRadius * uSoft;
  float d = length(vLocal);
  float shape;
  if (uShape == 1) {
    float box = max(abs(vLocal.x), abs(vLocal.y));
    shape = 1.0 - smoothstep(vRadius * 0.86 - soft, vRadius * 0.86 + soft, box);
  } else if (uShape == 2) {
    float edge = max(vRadius * 0.22, 0.6 / uRatio);
    shape = 1.0 - smoothstep(edge - soft, edge + soft, abs(d - vRadius * 0.8));
  } else if (uShape == 3) {
    float reach = vRadius * 1.6;
    vec2 q = abs(vLocal) / max(reach, 0.0001);
    float aa = soft / max(reach, 0.0001);
    shape = max(max(ray(q, aa), ray(q.yx, aa)), 1.0 - smoothstep(vRadius * 0.32 - soft, vRadius * 0.32 + soft, d));
  } else {
    shape = 1.0 - smoothstep(vRadius - soft, vRadius + soft, d);
  }
  float halo = vHalo > 0.0 ? exp(-d / (vHalo * 0.35)) * uGlow * 0.4 : 0.0;
  float alpha = clamp(shape + halo * (1.0 - shape), 0.0, 1.0) * vAlpha * uOpacity * (1.0 - uSoft);
  if (alpha < 0.002) discard;
  vec2 uv = vLocal / max(vRadius * 2.0, 0.0001) + 0.5;
  vec3 color = clamp(vColor + uShimmer * 0.2 * sin(uv.yxx + uTime + vSeed * 6.28), 0.0, 1.0);
  outColor = vec4(color * alpha, alpha);
}`,Je=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aEnds;
layout(location = 2) in vec4 aTint;
uniform vec2 uView;
uniform float uRatio;
uniform float uWidth;
out float vAcross;
out float vHalf;
out vec4 vTint;

void main() {
  vec2 a = aEnds.xy;
  vec2 b = aEnds.zw;
  vec2 along = b - a;
  float span = max(length(along), 0.0001);
  vec2 normal = vec2(-along.y, along.x) / span;
  float reach = uWidth * 0.5 + 1.0 / uRatio;
  vec2 point = mix(a, b, aCorner.x * 0.5 + 0.5) + normal * aCorner.y * reach;
  vAcross = aCorner.y * reach;
  vHalf = uWidth * 0.5;
  vTint = aTint;
  gl_Position = vec4(point / uView * 2.0 - 1.0, 0.0, 1.0);
}`,Ye=`#version 300 es
precision highp float;
uniform float uRatio;
uniform float uOpacity;
in float vAcross;
in float vHalf;
in vec4 vTint;
out vec4 outColor;

void main() {
  float edge = 0.6 / uRatio;
  float cover = 1.0 - smoothstep(vHalf - edge, vHalf + edge, abs(vAcross));
  float alpha = cover * vTint.a * uOpacity;
  outColor = vec4(vTint.rgb * alpha, alpha);
}`,X=(e,t,n)=>Math.min(n,Math.max(t,e)),Xe=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},Ze=(e,t,n)=>{let r=Xe(e,e.VERTEX_SHADER,t),i=Xe(e,e.FRAGMENT_SHADER,n),a=e.createProgram();if(!r||!i||!a)return null;if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),!e.getProgramParameter(a,e.LINK_STATUS))return e.deleteProgram(a),null;let o={},s=e.getProgramParameter(a,e.ACTIVE_UNIFORMS);for(let t=0;t<s;t++){let n=e.getActiveUniform(a,t);n&&(o[n.name.replace(`[0]`,``)]=e.getUniformLocation(a,n.name))}return{program:a,uniforms:o}},Qe=e=>{let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}},$e=e=>1-(1-X(e,0,1))**3,et=(e,t)=>(e%t+t)%t,tt=({particleCount:e=200,particleSpread:t=10,speed:i=.1,particleColors:a=[`#ffffff`],moveParticlesOnHover:o=!0,particleHoverFactor:s=1,alphaParticles:c=!1,particleBaseSize:l=100,sizeRandomness:u=1,cameraDistance:d=20,disableRotation:f=!1,pixelRatio:p,shape:m=`circle`,glow:h=.5,twinkle:g=.3,depthOfField:_=0,connections:v=!1,connectionDistance:y=110,hoverEffect:b=`parallax`,hoverRadius:x=140,clickBurst:S=!0,drift:C=`none`,driftSpeed:w=1,variation:T=0,intro:E=!0,opacity:D=1,lightMode:O=!1,paused:k=!1,className:A=``,style:j})=>{let M=(0,n.useRef)(null),N=(0,n.useRef)(null),P=(0,n.useRef)(null),F=(Array.isArray(a)?a:[a]).filter(Boolean).map(String),I={count:X(Math.round(e),1,Fe),spread:Math.max(.1,t),speed:i,colors:F.length?F:[`#ffffff`],mouse:o,hoverFactor:Math.max(0,s),soft:c,size:Math.max(0,l),randomness:Math.max(0,u),camera:Math.max(1,d),rotate:!f,dpr:p,shape:Me[m]??0,glow:Math.max(0,h),twinkle:X(g,0,1),depthOfField:Math.max(0,_),connections:v,connectionDistance:Math.max(10,y),hoverEffect:Ne[b]??0,hoverRadius:Math.max(20,x),clickBurst:S,drift:Pe[C]??0,driftSpeed:w,variation:Math.max(0,Math.round(T)),intro:E,opacity:X(D,0,1),lightMode:O,paused:k},L=(0,n.useRef)(I);return L.current=I,(0,n.useEffect)(()=>{let e=M.current,t=N.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=Ze(n,Ke,qe),i=Ze(n,Je,Ye);if(!r||!i)return;let a=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),n.STATIC_DRAW);let o=n.createBuffer(),s=n.createBuffer(),c=n.createBuffer(),l=n.createVertexArray();n.bindVertexArray(l),n.bindBuffer(n.ARRAY_BUFFER,a),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let u=(e,t,r)=>{n.bindBuffer(n.ARRAY_BUFFER,e),n.enableVertexAttribArray(t),n.vertexAttribPointer(t,r,n.FLOAT,!1,0,0),n.vertexAttribDivisor(t,1)};u(o,1,3),u(s,2,4),u(c,3,3);let d=n.createBuffer(),f=new Float32Array(Le*8),p=n.createVertexArray();n.bindVertexArray(p),n.bindBuffer(n.ARRAY_BUFFER,a),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,d),n.bufferData(n.ARRAY_BUFFER,f.byteLength,n.DYNAMIC_DRAW),n.enableVertexAttribArray(1),n.vertexAttribPointer(1,4,n.FLOAT,!1,32,0),n.vertexAttribDivisor(1,1),n.enableVertexAttribArray(2),n.vertexAttribPointer(2,4,n.FLOAT,!1,32,16),n.vertexAttribDivisor(2,1),n.bindVertexArray(null);let m=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),h=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,g=new Map,_=e=>{if(g.has(e))return g.get(e);let t=[1,1,1];if(m){m.clearRect(0,0,1,1),m.fillStyle=`#ffffff`,m.fillStyle=e,m.fillRect(0,0,1,1);let[n,r,i]=m.getImageData(0,0,1,1).data;t=[n/255,r/255,i/255]}return g.set(e,t),t},v=e=>{let t=e.map(e=>e**2.2),n=.2126*t[0]+.7152*t[1]+.0722*t[2],r=Math.min(1,.06/Math.max(n,1e-4));return t.map(e=>(e*r)**(1/2.2))},y={width:1,height:1,ratio:1},b={x:0,y:0,sx:0,sy:0,nx:0,ny:0,inside:!1,active:0},x={clock:0,spin:0,travel:0,offsetX:0,offsetY:0,reveal:L.current.intro&&!h?0:1},S=[],C=new Float32Array(16),w={key:``,count:0,positions:new Float32Array,randoms:new Float32Array,colors:new Float32Array},T={x:new Float32Array,y:new Float32Array,ahead:new Float32Array,alpha:new Float32Array},E=0,D=0,O=!0,k=e=>{let t=`${e.count}|${e.variation}|${e.colors.join(`,`)}|${+!!e.lightMode}`;if(t===w.key)return;w.key=t;let r=Qe(e.variation*7919+1),i=e.count,a=new Float32Array(i*3),l=new Float32Array(i*4),u=new Float32Array(i*3),d=e.colors.map(t=>e.lightMode?v(_(t)):_(t));for(let e=0;e<i;e++){let t,n,i,o;do t=r()*2-1,n=r()*2-1,i=r()*2-1,o=t*t+n*n+i*i;while(o>1||o===0);let s=Math.cbrt(r());a.set([t*s,n*s,i*s],e*3),l.set([r(),r(),r(),r()],e*4),u.set(d[Math.floor(r()*d.length)],e*3)}w.count=i,w.positions=a,w.randoms=l,w.colors=u;let f=Math.min(i,Ie);T.x=new Float32Array(f),T.y=new Float32Array(f),T.ahead=new Float32Array(f),T.alpha=new Float32Array(f),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,a,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,s),n.bufferData(n.ARRAY_BUFFER,l,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,u,n.STATIC_DRAW)},A=e=>{let t=x.clock*1e3,n=e.rotate?Math.sin(t*2e-4)*.1:0,r=e.rotate?Math.cos(t*5e-4)*.15:0,i=e.rotate?x.spin:0,[a,o,s,c,l,u]=[Math.sin(n),Math.cos(n),Math.sin(r),Math.cos(r),Math.sin(i),Math.cos(i)];return[c*u+s*a*l,o*l,-s*u+c*a*l,-c*l+s*a*u,o*u,s*l+c*a*u,s*o,-a,c*o]},j=()=>[x.offsetX,x.offsetY,-(1-$e(x.reveal))*70],F=(e,t)=>{let n=Math.min(w.count,Ie),[r,i,a]=j(),o=y.width/y.height,s=x.clock,c=e.hoverRadius,l=e.hoverEffect===0?0:b.active,u=e.spread*2+3,d=e.spread*ze*2+3;for(let f=0;f<n;f++){let n=w.positions[f*3]*e.spread,p=w.positions[f*3+1]*e.spread,m=w.positions[f*3+2]*e.spread*ze,h=w.randoms[f*4],g=w.randoms[f*4+1],_=w.randoms[f*4+2],v=w.randoms[f*4+3],C=Math.sin(s*_+6.28*v)*(.1+1.4*h),E=Math.sin(s*g+6.28*h)*(.1+1.4*v),D=Math.sin(s*v+6.28*g)*(.1+1.4*_),O=t[0]*n+t[3]*p+t[6]*m+r+C,k=t[1]*n+t[4]*p+t[7]*m+i+E,A=t[2]*n+t[5]*p+t[8]*m+a+D,j=1;if(e.drift===1||e.drift===2){let t=et(v*u+i+E+(e.drift===1?x.travel:-x.travel),u);k=t-u/2;let n=X(t/(u*.12),0,1),r=X((u-t)/(u*.12),0,1);j=n*n*(3-2*n)*r*r*(3-2*r)}else if(e.drift===3){let e=et(g*d+a+D+x.travel,d);A=e-d/2;let t=X(e/(d*.1),0,1);j=t*t*(3-2*t)}let M=e.camera-A;if(M<Ve||M>Y){T.alpha[f]=0;continue}let N=X((M-1)/3,0,1);j*=N*N*(3-2*N);let P=O*Be/o/M*.5*y.width+y.width/2,F=k*Be/M*.5*y.height+y.height/2,I=0,L=0;if(l>.001){let t=P-b.sx,n=F-b.sy,r=Math.hypot(t,n),i=Math.exp(-(t*t+n*n)/(c*c))*e.hoverFactor*l;e.hoverEffect===1&&r>.001?(I+=t/r*c*.5*i,L+=n/r*c*.5*i):e.hoverEffect===2&&(I-=t*.6*i,L-=n*.6*i)}for(let e of S){let t=e.age/Ue,n=P-e.x,r=F-e.y,i=Math.hypot(n,r);if(i<.001)continue;let a=Math.exp(-(((i-t*We)/Ge)**2)),o=X(i/30,0,1),s=a*(1-t)*(1-t)*56*o*o*(3-2*o);I+=n/i*s,L+=r/i*s}P+=I,F+=L;let R=X((Y-M)/(Y-Y*.9),0,1),z=X(x.reveal*1.6-_*.6,0,1);T.x[f]=P,T.y[f]=F,T.ahead[f]=M,T.alpha[f]=R*R*(3-2*R)*j*z*z}return n},I=(e,t)=>{let n=F(e,t),r=e.connectionDistance,i=Math.max(1,Math.ceil(y.width/r)+2),a=new Map;for(let e=0;e<n;e++){if(T.alpha[e]<.02)continue;let t=(Math.floor(T.y[e]/r)+1)*i+Math.floor(T.x[e]/r)+1,n=a.get(t);n?n.push(e):a.set(t,[e])}let o=0,s=r*r;for(let[e,t]of a)for(let n of[0,1,i-1,i,i+1]){let i=n===0?t:a.get(e+n);if(i)for(let e=0;e<t.length;e++){let a=t[e];for(let t=n===0?e+1:0;t<i.length;t++){let e=i[t],n=T.x[a]-T.x[e],c=T.y[a]-T.y[e],l=n*n+c*c;if(l>s)continue;let u=X(1-Math.abs(T.ahead[a]-T.ahead[e])/18,0,1);if(u<=0)continue;if(o>=Le)return o;let d=1-Math.sqrt(l)/r,p=o*8;f[p]=T.x[a],f[p+1]=T.y[a],f[p+2]=T.x[e],f[p+3]=T.y[e],f[p+4]=(w.colors[a*3]+w.colors[e*3])/2,f[p+5]=(w.colors[a*3+1]+w.colors[e*3+1])/2,f[p+6]=(w.colors[a*3+2]+w.colors[e*3+2])/2,f[p+7]=d*d*u*.7*Math.min(T.alpha[a],T.alpha[e]),o++}}}return o},R=()=>{let e=L.current;k(e);let a=A(e),[o,s,c]=j();if(n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),e.connections){let t=I(e,a);t&&(n.useProgram(i.program),n.bindVertexArray(p),n.bindBuffer(n.ARRAY_BUFFER,d),n.bufferSubData(n.ARRAY_BUFFER,0,f.subarray(0,t*8)),n.uniform2f(i.uniforms.uView,y.width,y.height),n.uniform1f(i.uniforms.uRatio,y.ratio),n.uniform1f(i.uniforms.uWidth,1),n.uniform1f(i.uniforms.uOpacity,e.opacity),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,t))}let u=r.uniforms,m=0;for(let e=S.length-1;e>=0&&m<Re;e--)C.set([S[e].x,S[e].y,S[e].age/Ue,1],m*4),m++;n.useProgram(r.program),n.bindVertexArray(l),n.uniformMatrix3fv(u.uRotation,!1,a),n.uniform3f(u.uOffset,o,s,c),n.uniform1f(u.uSpread,e.spread),n.uniform1f(u.uTime,x.clock),n.uniform1f(u.uCamera,e.camera),n.uniform1f(u.uAspect,y.width/y.height),n.uniform2f(u.uView,y.width,y.height),n.uniform1f(u.uRatio,y.ratio),n.uniform1f(u.uSize,e.size),n.uniform1f(u.uRandomness,e.randomness),n.uniform1f(u.uBlur,e.depthOfField*14),n.uniform1f(u.uFocus,e.camera+14),n.uniform1f(u.uGlow,e.lightMode?e.glow*.3:e.glow),n.uniform1f(u.uTwinkle,e.twinkle),n.uniform1i(u.uShape,e.shape),n.uniform1i(u.uDrift,e.drift),n.uniform1f(u.uTravel,x.travel),n.uniform4f(u.uPointer,b.sx,b.sy,b.active,e.hoverRadius),n.uniform1i(u.uEffect,e.hoverEffect),n.uniform1f(u.uStrength,e.hoverFactor),n.uniform4fv(u.uBursts,C),n.uniform1i(u.uBurstCount,m),n.uniform1f(u.uReveal,x.reveal),n.uniform1f(u.uSoft,e.soft?.2:0),n.uniform1f(u.uShimmer,+!e.lightMode),n.uniform1f(u.uOpacity,e.opacity),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,w.count),n.bindVertexArray(null)},z=e=>{if(E=0,!O||document.hidden)return;let t=L.current,n=D?X((e-D)/1e3,5e-4,.05):1/60;if(D=e,t.paused){x.reveal=1,R(),D=0;return}let r=+!h,i=n*t.speed*r;x.clock+=i,t.rotate&&(x.spin+=i*.6),x.travel+=n*t.driftSpeed*r*(t.drift===3?6:.9);let a=t.mouse&&b.inside&&!h,o=1-Math.exp(-n/.35),s=a&&t.hoverEffect===0?t.hoverFactor:0;x.offsetX+=(-b.nx*s-x.offsetX)*o,x.offsetY+=(-b.ny*s-x.offsetY)*o,b.sx+=(b.x-b.sx)*(1-Math.exp(-n/.06)),b.sy+=(b.y-b.sy)*(1-Math.exp(-n/.06)),b.active+=(+!!a-b.active)*(1-Math.exp(-n/.2));for(let e=S.length-1;e>=0;e--)S[e].age+=n,S[e].age>=Ue&&S.splice(e,1);!t.intro||h?x.reveal=1:x.reveal<1&&(x.reveal=Math.min(1,x.reveal+n/He)),R(),E=requestAnimationFrame(z)},B=()=>{!E&&O&&!document.hidden&&(E=requestAnimationFrame(z))},V=()=>{let n=L.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);y.width=r,y.height=i,t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),y.ratio=t.width/r,R(),B()},H=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top,a=b.inside;b.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height,b.x=r,b.y=n.height-i,b.nx=r/Math.max(1,n.width)*2-1,b.ny=-(i/Math.max(1,n.height)*2-1),b.inside&&!a&&(b.sx=b.x,b.sy=b.y)},U=e=>{H(e),L.current.paused||B()},W=e=>{let t=L.current;H(e),b.inside&&t.clickBurst&&!t.paused&&!h&&(S.push({x:b.x,y:b.y,age:0}),S.length>Re&&S.shift(),B())},G=e=>{e.pointerType!==`mouse`&&(b.inside=!1)},K=()=>{b.inside=!1},ee=()=>{D=0,B()},te=new ResizeObserver(V);te.observe(e);let ne=new IntersectionObserver(e=>{O=e.some(e=>e.isIntersecting),O&&(D=0,B())});ne.observe(e),window.addEventListener(`pointermove`,U,{passive:!0}),window.addEventListener(`pointerdown`,W,{passive:!0}),window.addEventListener(`pointerup`,G,{passive:!0}),window.addEventListener(`pointercancel`,G,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,K),document.addEventListener(`visibilitychange`,ee),V();let q=L.current.dpr;return P.current=()=>{let e=L.current;if(e.dpr!==q){q=e.dpr,V();return}E||R(),B()},()=>{cancelAnimationFrame(E),P.current=null,te.disconnect(),ne.disconnect(),window.removeEventListener(`pointermove`,U),window.removeEventListener(`pointerdown`,W),window.removeEventListener(`pointerup`,G),window.removeEventListener(`pointercancel`,G),document.documentElement.removeEventListener(`pointerleave`,K),document.removeEventListener(`visibilitychange`,ee),n.deleteProgram(r.program),n.deleteProgram(i.program),[a,o,s,c,d].forEach(e=>n.deleteBuffer(e)),n.deleteVertexArray(l),n.deleteVertexArray(p),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,n.useEffect)(()=>{P.current?.()}),(0,r.jsx)(`div`,{ref:M,className:`particles-container${A?` ${A}`:``}`,style:j,children:(0,r.jsx)(`canvas`,{ref:N,className:`particles-canvas`,"aria-hidden":`true`})})},nt=2400,rt=5,it=2.6,at=7.5,ot=.56,st=24,ct={focus:0,part:1,none:2},lt={dots:0,dashes:.45,lines:1},ut={depth:0,along:1,across:2},dt=[0,.75,.35],ft=[[0,0,0,0],[1.9,-4.6,-.08,2.4],[-1.05,2,.12,4.1]],pt=[1,.5,.55],mt=Math.PI/180,ht=1/(2*Math.tan(ot/2)),Z=`#version 300 es
precision highp float;
`,gt=`${Z}
${`
uniform float uTime;
uniform float uTwist;
uniform float uRoll;
uniform float uWaves;
uniform float uWidth;
uniform float uRibbon;
uniform mat3 uOrient;
uniform float uScale;
uniform vec4 uPlace;
uniform float uVolume;

float hash11(float n) {
  return fract(sin(n * 91.3458) * 47453.5453);
}

vec3 centerLocal(float s) {
  float t = uTime;
  float ph = uPlace.w;
  float x = s * ${st.toFixed(1)};
  float y = uWaves * (0.52 * sin(x * 0.43 + t * 0.31 + ph) + 0.26 * sin(x * 0.79 - t * 0.23 + 1.3 + ph * 0.7)) + uPlace.x + x * uPlace.z;
  float z = uWaves * 0.65 * sin(x * 0.33 + t * 0.19 + 0.7 + ph * 1.3) + uPlace.y;
  return vec3(x, y, z);
}

float twistAt(float s, float layer) {
  float x = s * ${st.toFixed(1)};
  return uTwist * 0.483 * x + uRoll + uPlace.w * 0.6 + layer * uVolume * 0.42 + 0.5 * sin(x * 0.26 + uTime * 0.27 + uPlace.w);
}

vec3 ribbonPoint(float s, float v, float n, float layer, out vec3 normal) {
  vec3 c0 = centerLocal(s);
  vec3 c1 = centerLocal(s + 0.004);
  vec3 tangent = normalize(c1 - c0);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 n0 = normalize(up - tangent * dot(up, tangent));
  vec3 b0 = cross(tangent, n0);
  float th = twistAt(s, layer);
  vec3 across = cos(th) * n0 + sin(th) * b0;
  vec3 sheet = -sin(th) * n0 + cos(th) * b0;
  float halfWidth = uWidth * (0.78 + 0.22 * cos(s * 3.14159));
  vec3 local = c0 + across * v * halfWidth + sheet * (n + layer * uVolume * 0.16) * halfWidth;
  normal = uOrient * sheet;
  return uOrient * (local * uScale);
}
`}
uniform mat4 uViewProj;
uniform vec3 uEye;
uniform vec2 uViewport;
uniform float uDpr;
uniform float uFibers;
uniform float uDots;
uniform float uFlow;
uniform float uSize;
uniform float uFocus;
uniform float uDof;
uniform float uMaxCoc;
uniform float uFocal;
uniform float uIntro;
uniform vec4 uPulse;
uniform vec4 uHover;
uniform float uPart;
uniform float uDotLength;
uniform float uSparkle;
uniform float uDepthSpread;
uniform float uGain;
uniform float uTips;
uniform float uTint;
uniform float uGradient;
uniform float uFold;

out vec2 vLocal;
out float vRadius;
out float vSegment;
out vec3 vLight;
out float vTint;

vec3 project(vec3 world, out float depth) {
  vec4 clip = uViewProj * vec4(world, 1.0);
  depth = clip.w;
  vec2 ndc = clip.xy / clip.w;
  return vec3((ndc * 0.5 + 0.5) * uViewport, clip.w);
}

vec2 part(vec2 px) {
  if (uPart <= 0.0 || uHover.w <= 0.0) return px;
  vec2 away = px - uHover.xy;
  float dist = length(away);
  float radius = uHover.z;
  float push = uPart * uHover.w * radius * 0.55 * exp(-dist * dist / (radius * radius));
  return px + away / max(dist, 1e-3) * push * smoothstep(0.0, radius * 0.25, dist);
}

void main() {
  int perFiber = int(uDots);
  int fiber = gl_InstanceID / perFiber;
  int bead = gl_InstanceID - fiber * perFiber;
  float fi = float(fiber);
  float fk = float(bead);

  float seed = hash11(fi * 1.731 + uRibbon * 17.0);
  float s = fract((fk + uFlow + seed * uDots) / uDots) - 0.5;
  float sNext = s + 1.0 / uDots;
  float layer = mod(fi, 3.0) - 1.0;
  float slot = floor(fi / 3.0);
  float perLayer = max(floor(uFibers / 3.0), 1.0);
  float v = ((slot + 0.5) / perLayer) * 2.0 - 1.0 + (hash11(fi * 3.113 + 4.0) - 0.5) * (1.6 / perLayer) + layer * 0.12 / perLayer;
  float depthOffset = (hash11(fi * 7.919 + 2.0) - 0.5) * uDepthSpread * (0.35 + 6.0 * s * s);

  vec3 normal;
  vec3 world = ribbonPoint(s, v, depthOffset, layer, normal);
  vec3 nextNormal;
  vec3 nextWorld = ribbonPoint(sNext, v, depthOffset, layer, nextNormal);

  float depth;
  vec3 p0 = project(world, depth);
  float nextDepth;
  vec3 p1 = project(nextWorld, nextDepth);
  vec2 px = part(p0.xy);
  vec2 pxNext = part(p1.xy);

  float baseRadius = max(0.5 * uSize * uDpr * uFocal / max(depth, 0.1), 0.45);
  float coc = min(uDof * abs(1.0 - uFocus / max(depth, 0.1)) * uViewport.y * 0.035, uMaxCoc * uDpr);
  float radius = baseRadius + coc;
  float spill = max(10.0 * uDpr, baseRadius);
  float energy = pow(baseRadius / min(radius, spill), 1.25) * pow(min(1.0, spill / radius), 2.0);

  vec3 toEye = normalize(uEye - world);
  float facing = abs(dot(normalize(normal), toEye));
  float focalPx = uViewport.y * ${ht.toFixed(5)} / max(depth, 0.1);
  float widthPx = 2.0 * uWidth * uScale * focalPx;
  float stack = (widthPx * facing + 2.0 * baseRadius) / (widthPx + 2.0 * baseRadius);
  float spacingFace = length(nextWorld - world) * focalPx;
  float trail = (length(p1.xy - p0.xy) + 2.0 * baseRadius) / (spacingFace + 2.0 * baseRadius);
  float crowd = sqrt(clamp(stack * trail, 0.002, 1.0));
  float fold = pow(1.0 - facing, 6.0) * uFold;
  float endFade = smoothstep(0.5, 0.4, abs(s)) * smoothstep(1.6, 4.2, depth);
  float tipEnd = mix(0.6, 0.06 + 0.26 * hash11(fi * 9.137 + uPlace.w * 3.0), uTips);
  float tip = exp(-pow((s - tipEnd) / 0.0065, 2.0)) * uTips;
  endFade *= smoothstep(tipEnd + 0.003, tipEnd - 0.001, s);
  float appear = smoothstep(0.0, 0.12, uIntro * 1.3 - (s + 0.5) - seed * 0.12);
  float twinklePhase = hash11(fi * 13.7 + fk * 0.917 + uRibbon * 3.0);
  float twinkle = pow(max(sin(uTime * (1.2 + 2.6 * twinklePhase) * 3.0 + twinklePhase * 61.0), 0.0), 36.0) * uSparkle * (1.0 - 0.85 * uDotLength);
  float pulseGap = abs(s - uPulse.x) - uPulse.y * 0.42;
  float pulse = uPulse.z * exp(-pulseGap * pulseGap / 0.0018) * (abs(uPulse.w - uRibbon) < 0.5 ? 1.0 : 0.35);
  float strength = mix(0.45, 1.0, hash11(fi * 5.37 + 1.0)) * mix(1.0, 0.72, abs(layer) * uVolume);
  float intensity = energy * crowd * strength * endFade * appear * 0.8 * uGain * (1.0 + fold * 7.0 + twinkle * 5.0 + pulse * 4.0 + tip * 7.0);
  float highlight = clamp(fold * 0.55 + twinkle + pulse + tip, 0.0, 1.0);

  vec2 segment = (pxNext - px) * uDotLength;
  float segmentLength = length(segment);
  intensity *= mix(1.0, (2.0 * radius) / (segmentLength + 2.0 * radius) * 1.6, uDotLength);
  vec2 axis = segmentLength > 1e-3 ? segment / segmentLength : vec2(1.0, 0.0);
  vec2 perp = vec2(-axis.y, axis.x);
  vec2 corner = vec2(gl_VertexID == 1 || gl_VertexID == 3 ? 1.0 : 0.0, gl_VertexID >= 2 ? 1.0 : 0.0);
  float along = mix(-radius, segmentLength + radius, corner.x);
  float across = mix(-radius, radius, corner.y);
  vec2 position = px + axis * along + perp * across;

  vLocal = vec2(along, across);
  vRadius = radius;
  vSegment = segmentLength;
  vLight = vec3(intensity, highlight, coc / max(radius, 1e-3));
  float depthTint = clamp(uTint + smoothstep(uFocus, uFocus + 5.0, depth) * 0.5, 0.0, 1.0);
  vTint = uGradient < 0.5 ? depthTint : uGradient < 1.5 ? smoothstep(-0.42, 0.42, s) : clamp(v * 0.5 + 0.5, 0.0, 1.0);
  if (intensity < 0.0005) position = vec2(-1e4);
  gl_Position = vec4(position / uViewport * 2.0 - 1.0, 0.0, 1.0);
}`,_t=`${Z}
uniform mat4 uViewProj;
uniform vec2 uViewport;
uniform float uDpr;
uniform float uTime;
uniform float uSize;
uniform float uFocus;
uniform float uDof;
uniform float uMaxCoc;
uniform float uFocal;
uniform float uIntro;
uniform float uSparkle;
uniform float uScale;
uniform float uGradient;
uniform float uGain;

out vec2 vLocal;
out float vRadius;
out float vSegment;
out vec3 vLight;
out float vTint;

float hash11(float n) {
  return fract(sin(n * 91.3458) * 47453.5453);
}

void main() {
  float id = float(gl_InstanceID);
  vec3 seed = vec3(hash11(id * 1.37 + 0.3), hash11(id * 2.91 + 1.7), hash11(id * 4.17 + 2.9));
  vec3 box = vec3(9.0, 5.4, 6.0);
  vec3 p = (seed - 0.5) * box;
  p.z -= 0.6;
  p += 0.18 * vec3(sin(uTime * 0.21 + seed.x * 40.0), sin(uTime * 0.17 + seed.y * 40.0), sin(uTime * 0.13 + seed.z * 40.0));
  p *= mix(1.0, uScale, 0.5);
  vec4 clip = uViewProj * vec4(p, 1.0);
  float depth = clip.w;
  vec2 px = (clip.xy / clip.w * 0.5 + 0.5) * uViewport;
  float size = uSize * mix(0.5, 1.4, hash11(id * 7.7));
  float baseRadius = max(0.5 * size * uDpr * uFocal / max(depth, 0.1), 0.45);
  float coc = min(uDof * abs(1.0 - uFocus / max(depth, 0.1)) * uViewport.y * 0.035, uMaxCoc * uDpr * 1.6);
  float radius = baseRadius + coc;
  float spill = max(10.0 * uDpr, baseRadius);
  float energy = pow(baseRadius / min(radius, spill), 0.9) * pow(min(1.0, spill / radius), 2.0);
  float twinkle = pow(max(sin(uTime * (0.8 + 1.6 * seed.y) * 2.0 + seed.z * 50.0), 0.0), 8.0);
  float intensity = energy * (0.35 + 0.65 * twinkle) * mix(0.4, 1.0, seed.x) * smoothstep(0.3, 1.0, uIntro) * (depth > 0.2 ? 1.0 : 0.0);
  vec2 corner = vec2(gl_VertexID == 1 || gl_VertexID == 3 ? 1.0 : 0.0, gl_VertexID >= 2 ? 1.0 : 0.0) * 2.0 - 1.0;
  vec2 position = px + corner * radius;
  vLocal = corner * radius;
  vRadius = radius;
  vSegment = 0.0;
  vLight = vec3(intensity * 0.8 * uGain, 0.3 + 0.6 * twinkle * uSparkle, coc / max(radius, 1e-3));
  vTint = uGradient < 0.5 ? 0.45 + 0.55 * seed.y : seed.y;
  gl_Position = vec4(position / uViewport * 2.0 - 1.0, 0.0, 1.0);
}`,vt=`${Z}
uniform vec3 uGlowColor;
uniform vec3 uLineColor;
uniform vec3 uSecondaryColor;
in vec2 vLocal;
in float vRadius;
in float vSegment;
in vec3 vLight;
in float vTint;
out vec4 outColor;
void main() {
  float along = clamp(vLocal.x, 0.0, vSegment);
  float d = length(vec2(vLocal.x - along, vLocal.y));
  float rho = d / max(vRadius, 1e-3);
  if (rho > 1.0) discard;
  float soft = clamp(2.6 / max(vRadius, 1e-3), 0.14, 1.0);
  float disk = 1.0 - smoothstep(1.0 - soft, 1.0, rho);
  float bokeh = disk * (0.94 + 0.08 * smoothstep(0.55, 0.95, rho));
  float core = exp(-rho * rho * 3.2);
  float shape = mix(core, bokeh, smoothstep(0.25, 0.7, vLight.z));
  vec3 color = mix(mix(uGlowColor, uSecondaryColor, vTint), uLineColor, vLight.y);
  outColor = vec4(color * shape * vLight.x, shape * vLight.x);
}`,yt=`${Z}
out vec2 vUv;
void main() {
  vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`,bt=`${Z}
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 outColor;
vec3 pick(vec2 uv) {
  vec3 c = texture(uSource, uv).rgb;
  float peak = max(max(c.r, c.g), c.b);
  return c * smoothstep(0.35, 1.2, peak);
}
void main() {
  vec2 o = uTexel;
  vec3 c = pick(vUv + vec2(-o.x, -o.y)) + pick(vUv + vec2(o.x, -o.y)) + pick(vUv + vec2(-o.x, o.y)) + pick(vUv + vec2(o.x, o.y));
  outColor = vec4(c * 0.25, 1.0);
}`,xt=`${Z}
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec2 o = uTexel;
  vec3 c = texture(uSource, vUv).rgb * 4.0;
  c += texture(uSource, vUv + vec2(-o.x, -o.y)).rgb;
  c += texture(uSource, vUv + vec2(o.x, -o.y)).rgb;
  c += texture(uSource, vUv + vec2(-o.x, o.y)).rgb;
  c += texture(uSource, vUv + vec2(o.x, o.y)).rgb;
  outColor = vec4(c / 8.0, 1.0);
}`,St=`${Z}
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec2 o = uTexel;
  vec3 c = texture(uSource, vUv + vec2(-o.x * 2.0, 0.0)).rgb;
  c += texture(uSource, vUv + vec2(-o.x, o.y)).rgb * 2.0;
  c += texture(uSource, vUv + vec2(0.0, o.y * 2.0)).rgb;
  c += texture(uSource, vUv + vec2(o.x, o.y)).rgb * 2.0;
  c += texture(uSource, vUv + vec2(o.x * 2.0, 0.0)).rgb;
  c += texture(uSource, vUv + vec2(o.x, -o.y)).rgb * 2.0;
  c += texture(uSource, vUv + vec2(0.0, -o.y * 2.0)).rgb;
  c += texture(uSource, vUv + vec2(-o.x, -o.y)).rgb * 2.0;
  outColor = vec4(c / 12.0, 1.0);
}`,Ct=`${Z}
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uGlow;
uniform float uBrightness;
uniform float uLightMode;
uniform float uGrain;
uniform float uVignette;
uniform float uFrame;
uniform vec2 uView;
uniform float uDpr;
in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float smoother(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

void main() {
  vec4 scene = texture(uScene, vUv);
  vec3 bloom = texture(uBloom, vUv).rgb;
  vec3 light = (scene.rgb + bloom * uGlow) * uBrightness;
  float reach = max(uVignette * 0.3, 1e-4);
  float mask = uVignette > 0.0 ? smoother(vUv.x / reach) * smoother((1.0 - vUv.x) / reach) * smoother(vUv.y / reach) * smoother((1.0 - vUv.y) / reach) : 1.0;
  vec2 cell = floor(vUv * uView / max(uDpr, 1.0));
  float grain = hash(cell + uFrame * 17.31) + hash(cell * 1.31 + uFrame * 3.7 + 9.1) - 1.0;
  if (uLightMode > 0.5) {
    float amount = scene.a * uBrightness;
    float ink = (1.0 - exp(-amount * 1.5)) * mask;
    ink = clamp(ink * (1.0 + grain * uGrain * 2.0), 0.0, 1.0);
    vec3 hue = clamp(scene.rgb / max(scene.a, 1e-4), 0.0, 1.0);
    vec3 tone = hue * mix(1.0, 0.72, clamp(amount * 0.35, 0.0, 1.0));
    outColor = vec4(tone * ink, ink);
    return;
  }
  vec3 color = (1.0 - exp(-light * 1.25)) * mask;
  float peak = max(color.r, max(color.g, color.b));
  color = max(color + grain * uGrain * (0.25 + 0.75 * sqrt(peak)), 0.0);
  outColor = vec4(color, max(color.r, max(color.g, color.b)));
}`,wt=`uTime.uTwist.uRoll.uWaves.uWidth.uRibbon.uOrient.uScale.uPlace.uVolume.uViewProj.uEye.uViewport.uDpr.uFibers.uDots.uFlow.uSize.uFocus.uDof.uMaxCoc.uFocal.uIntro.uPulse.uHover.uPart.uDotLength.uSparkle.uDepthSpread.uGain.uTips.uTint.uGradient.uFold.uGlowColor.uLineColor.uSecondaryColor`.split(`.`),Tt=[`uViewProj`,`uViewport`,`uDpr`,`uTime`,`uSize`,`uFocus`,`uDof`,`uMaxCoc`,`uFocal`,`uIntro`,`uSparkle`,`uScale`,`uGradient`,`uGain`,`uGlowColor`,`uLineColor`,`uSecondaryColor`],Et=[`uSource`,`uTexel`],Dt=[`uScene`,`uBloom`,`uGlow`,`uBrightness`,`uLightMode`,`uGrain`,`uVignette`,`uFrame`,`uView`,`uDpr`],Q=(e,t,n)=>Math.min(n,Math.max(t,e)),Ot=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},kt=(e,t,n,r)=>{let i=Ot(e,e.VERTEX_SHADER,t),a=Ot(e,e.FRAGMENT_SHADER,n),o=e.createProgram();if(!i||!a||!o)return null;if(e.attachShader(o,i),e.attachShader(o,a),e.linkProgram(o),e.deleteShader(i),e.deleteShader(a),!e.getProgramParameter(o,e.LINK_STATUS))return e.deleteProgram(o),null;let s={};for(let t of r)s[t]=e.getUniformLocation(o,t);return{program:o,uniforms:s}},At=(e,t,n,r)=>{let i=1/Math.tan(e/2),a=1/(n-r);return[i/t,0,0,0,0,i,0,0,0,0,(r+n)*a,-1,0,0,2*r*n*a,0]},jt=(e,t)=>{let n=Array(16);for(let r=0;r<4;r+=1)for(let i=0;i<4;i+=1)n[r*4+i]=e[i]*t[r*4]+e[4+i]*t[r*4+1]+e[8+i]*t[r*4+2]+e[12+i]*t[r*4+3];return n},Mt=(e,t,n)=>{let r=Math.cos(e),i=Math.sin(e),a=Math.cos(t),o=Math.sin(t),s=Math.cos(n),c=Math.sin(n),l=[r,0,-i,0,1,0,i,0,r],u=[1,0,0,0,a,o,0,-o,a],d=[s,c,0,-c,s,0,0,0,1],f=(e,t)=>{let n=Array(9);for(let r=0;r<3;r+=1)for(let i=0;i<3;i+=1)n[r*3+i]=e[i]*t[r*3]+e[3+i]*t[r*3+1]+e[6+i]*t[r*3+2];return n};return f(d,f(u,l))},Nt=(e,t)=>[e[0]*t[0]+e[3]*t[1]+e[6]*t[2],e[1]*t[0]+e[4]*t[1]+e[7]*t[2],e[2]*t[0]+e[5]*t[1]+e[8]*t[2]],Pt=({glowColor:e=`#8b5cf6`,lineColor:t,secondaryColor:i,gradient:a=`depth`,speed:o=.5,scale:s=1,rotation:c=18,rollSpeed:l=.15,layers:u=3,waves:d=1,twist:f=1.2,threads:p=72,volume:m=.7,spread:h=1,density:g=1,thickness:_=1,flow:v=.4,fiberStyle:y=`dots`,tips:b=0,foldGlow:x=1,perspective:S=.65,depthOfField:C=.85,focusDepth:w=0,particles:T=.5,sparkle:E=.5,glow:D=.8,brightness:O=1,vignette:k=.3,grain:A=.06,mouseInteraction:j=!0,hoverEffect:M=`focus`,mouseStrength:N=1,pulseOnClick:P=!0,intro:F=!0,lightMode:I=!1,paused:L=!1,dpr:R,...z})=>{let B=(0,n.useRef)(null),V=(0,n.useRef)(null),H=(0,n.useRef)(null),U={glowColor:String(e),lineColor:t?String(t):``,secondaryColor:i?String(i):``,gradient:ut[a]??0,speed:Math.max(0,o),scale:Q(s,.3,3),rotation:c*mt,rollSpeed:l,layers:Q(Math.round(u),1,3),waves:Math.max(0,d),twist:Math.max(0,f),threads:Q(Math.round(p),6,180),volume:Q(m,0,2),spread:Q(h,.2,3),density:Q(g,.2,3),thickness:Q(_,.2,4),flow:v,dotLength:lt[y]??0,tips:Q(b,0,1),foldGlow:Q(x,0,3),perspective:Q(S,0,1),depthOfField:Q(C,0,2),focusDepth:Q(w,-1,1),particles:Q(T,0,2),sparkle:Q(E,0,2),glow:Math.max(0,D),brightness:Math.max(0,O),vignette:Q(k,0,1),grain:Math.max(0,A),mouseInteraction:j,hover:ct[M]??0,mouseStrength:Math.max(0,N),pulseOnClick:P,intro:F,lightMode:I,paused:L,dpr:R},W=(0,n.useRef)(U);W.current=U,(0,n.useEffect)(()=>{let e=B.current,t=V.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=kt(n,gt,vt,wt),a=kt(n,_t,vt,Tt),o=kt(n,yt,bt,Et),s=kt(n,yt,xt,Et),c=kt(n,yt,St,Et),l=kt(n,yt,Ct,Dt);if(!i||!a||!o||!s||!c||!l)return;let u=r?n.RGBA16F:n.RGBA8,d=()=>({texture:null,framebuffer:n.createFramebuffer(),width:0,height:0}),f=(e,t,r)=>{if(e.texture&&e.width===t&&e.height===r)return;e.texture&&n.deleteTexture(e.texture);let i=n.createTexture();n.bindTexture(n.TEXTURE_2D,i),n.texStorage2D(n.TEXTURE_2D,1,u,t,r),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,e.framebuffer),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,i,0),e.texture=i,e.width=t,e.height=r},p=d(),m=Array.from({length:rt},d),h=n.createVertexArray(),g=document.createElement(`canvas`);g.width=1,g.height=1;let _=g.getContext(`2d`,{willReadFrequently:!0}),v=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,y={time:0,roll:0,flow:0,frame:0,intro:W.current.intro&&!v?0:it,width:1,height:1,fit:1,colorKey:``,glow:[.55,.36,.96],line:[1,.85,.98],secondary:[.44,.29,.77],pointer:{x:0,y:0,inside:!1},hover:{x:0,y:0,presence:0,placed:!1},look:{x:0,y:0,vx:0,vy:0},focus:at+W.current.focusDepth*3,pulse:{s:0,age:9,strength:0,ribbon:0},camera:null},b=0,x=0,S=!0,C=!0,w=(e,t)=>{if(!_||!e)return t;let n=/^[0-9a-f]{3,8}$/i.test(e)?`#${e}`:e;_.clearRect(0,0,1,1),_.fillStyle=`#000000`,_.fillStyle=n,_.fillRect(0,0,1,1);let[r,i,a]=_.getImageData(0,0,1,1).data;return[r/255,i/255,a/255]},T=e=>{let t=`${e.glowColor}|${e.lineColor}|${e.secondaryColor}|${e.lightMode}`;t!==y.colorKey&&(y.colorKey=t,y.glow=w(e.glowColor,[.55,.36,.96]),y.secondary=e.secondaryColor?w(e.secondaryColor,y.glow):y.glow.map(e=>e*.8),e.lineColor?y.line=w(e.lineColor,y.glow):y.line=e.lightMode?y.glow:y.glow.map(e=>e+(1-e)*.72))},E=(e,t,n,r)=>{let i=ft[n],a=i[3],o=e*st;return[o,r*(.52*Math.sin(o*.43+t*.31+a)+.26*Math.sin(o*.79-t*.23+1.3+a*.7))+i[0]+o*i[2],r*.65*Math.sin(o*.33+t*.19+.7+a*1.3)+i[1]]},D=e=>{let t=y.width/Math.max(y.height,1),n=[0,0,at],r=At(ot,t,.1,60),i=[1,0,0,0,0,1,0,0,0,0,1,0,-n[0],-n[1],-n[2],1],a=Mt(e.perspective*.85+y.look.x*.22,.12-y.look.y*.14,e.rotation);return{eye:n,viewProj:jt(r,i),orient:a}},O=(e,t)=>{let n=e.viewProj,r=n[0]*t[0]+n[4]*t[1]+n[8]*t[2]+n[12],i=n[1]*t[0]+n[5]*t[1]+n[9]*t[2]+n[13],a=n[3]*t[0]+n[7]*t[1]+n[11]*t[2]+n[15];return{x:(r/a*.5+.5)*y.width,y:(.5-i/a*.5)*y.height,depth:a}},k=(e,t,n)=>{let r=y.camera;if(!r)return null;let i=null;for(let a=0;a<e.layers;a+=1)for(let o=0;o<=96;o+=1){let s=o/96-.5,c=E(s,y.time,a,e.waves).map(t=>t*e.scale*y.fit),l=Nt(r.orient,c),u=O(r,l),d=Math.hypot(u.x-t,u.y-n);(!i||d<i.gap)&&(i={gap:d,s,ribbon:a,depth:u.depth})}return i},A=()=>{let n=W.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2),o=Math.max(r,i)*a,s=o>nt?a*nt/o:a,c=Math.max(1,Math.round(r*s)),l=Math.max(1,Math.round(i*s));(t.width!==c||t.height!==l)&&(t.width=c,t.height=l),y.width=r,y.height=i,y.fit=Q(r/i/1.5,.6,1),M()},j=(e,t,r,i)=>{n.bindFramebuffer(n.FRAMEBUFFER,t.framebuffer),n.viewport(0,0,t.width,t.height),n.useProgram(e.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,r.texture),n.uniform1i(e.uniforms.uSource,0),n.uniform2f(e.uniforms.uTexel,i[0],i[1]),n.drawArrays(n.TRIANGLES,0,3)},M=()=>{let e=W.current;T(e);let r=D(e);y.camera=r;let u=t.height/Math.max(y.height,1),d=e.paused||v?1:Q(y.intro/it,0,1),g=1-(1-d)*(1-d)*(1-d);f(p,t.width,t.height),n.bindVertexArray(h),n.bindFramebuffer(n.FRAMEBUFFER,p.framebuffer),n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE);let _=Math.round(260*e.density),b=22*Q(Math.sqrt(56e3/(e.threads*_*e.layers)),.45,1),x=Math.max(.8*e.thickness,.45)**2/.64,S=(e.threads/72*e.density*x)**-.75;n.useProgram(i.program);let C=i.uniforms;n.uniform1f(C.uTime,y.time),n.uniform1f(C.uTwist,e.twist),n.uniform1f(C.uRoll,y.roll),n.uniform1f(C.uWaves,e.waves),n.uniform1f(C.uWidth,.62*e.spread),n.uniformMatrix3fv(C.uOrient,!1,r.orient),n.uniform1f(C.uScale,e.scale*y.fit),n.uniformMatrix4fv(C.uViewProj,!1,r.viewProj),n.uniform3f(C.uEye,r.eye[0],r.eye[1],r.eye[2]),n.uniform2f(C.uViewport,t.width,t.height),n.uniform1f(C.uDpr,u),n.uniform1f(C.uFibers,e.threads),n.uniform1f(C.uDots,_),n.uniform1f(C.uFlow,y.flow),n.uniform1f(C.uSize,1.6*e.thickness),n.uniform1f(C.uFocus,y.focus),n.uniform1f(C.uDof,e.depthOfField),n.uniform1f(C.uMaxCoc,b),n.uniform1f(C.uFocal,at),n.uniform1f(C.uIntro,g),n.uniform4f(C.uPulse,y.pulse.s,y.pulse.age,y.pulse.strength,y.pulse.ribbon),n.uniform4f(C.uHover,y.hover.x*u,(y.height-y.hover.y)*u,140*u,y.hover.presence*e.mouseStrength),n.uniform1f(C.uPart,+(e.hover===1)),n.uniform1f(C.uDotLength,e.dotLength),n.uniform1f(C.uSparkle,e.sparkle),n.uniform1f(C.uDepthSpread,.12),n.uniform1f(C.uVolume,e.volume),n.uniform3f(C.uGlowColor,y.glow[0],y.glow[1],y.glow[2]),n.uniform3f(C.uLineColor,y.line[0],y.line[1],y.line[2]),n.uniform3f(C.uSecondaryColor,y.secondary[0],y.secondary[1],y.secondary[2]),n.uniform1f(C.uTips,e.tips),n.uniform1f(C.uGradient,e.gradient),n.uniform1f(C.uFold,e.foldGlow);for(let t=0;t<e.layers;t+=1){let r=ft[t];n.uniform1f(C.uRibbon,t),n.uniform4f(C.uPlace,r[0],r[1],r[2],r[3]),n.uniform1f(C.uGain,pt[t]*S),n.uniform1f(C.uTint,dt[t]),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,e.threads*_)}let w=Math.round(420*e.particles);if(w>0){n.useProgram(a.program);let i=a.uniforms;n.uniformMatrix4fv(i.uViewProj,!1,r.viewProj),n.uniform2f(i.uViewport,t.width,t.height),n.uniform1f(i.uDpr,u),n.uniform1f(i.uTime,y.time),n.uniform1f(i.uSize,2.2*e.thickness),n.uniform1f(i.uFocus,y.focus),n.uniform1f(i.uDof,e.depthOfField),n.uniform1f(i.uMaxCoc,22),n.uniform1f(i.uFocal,at),n.uniform1f(i.uIntro,g),n.uniform1f(i.uSparkle,e.sparkle),n.uniform1f(i.uScale,e.scale*y.fit),n.uniform1f(i.uGradient,e.gradient),n.uniform1f(i.uGain,1/e.thickness),n.uniform3f(i.uGlowColor,y.glow[0],y.glow[1],y.glow[2]),n.uniform3f(i.uLineColor,y.line[0],y.line[1],y.line[2]),n.uniform3f(i.uSecondaryColor,y.secondary[0],y.secondary[1],y.secondary[2]),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,w)}n.disable(n.BLEND);let E=e.glow>.001&&!e.lightMode;if(n.bindVertexArray(h),E){m.forEach((e,n)=>{f(e,Math.max(1,Math.round(t.width/2**(n+1))),Math.max(1,Math.round(t.height/2**(n+1))))}),j(o,m[0],p,[.5/p.width,.5/p.height]);for(let e=1;e<rt;e+=1)j(s,m[e],m[e-1],[1/m[e-1].width,1/m[e-1].height]);n.enable(n.BLEND),n.blendFunc(n.ONE,n.ONE);for(let e=4;e>0;--e)j(c,m[e-1],m[e],[.5/m[e].width,.5/m[e].height]);n.disable(n.BLEND)}n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.useProgram(l.program);let O=l.uniforms;n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,p.texture),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,E?m[0].texture:p.texture),n.uniform1i(O.uScene,0),n.uniform1i(O.uBloom,1),n.uniform1f(O.uGlow,E?e.glow:0),n.uniform1f(O.uBrightness,e.brightness),n.uniform1f(O.uLightMode,+!!e.lightMode),n.uniform1f(O.uGrain,e.grain),n.uniform1f(O.uVignette,e.vignette),n.uniform1f(O.uFrame,y.frame%977),n.uniform2f(O.uView,t.width,t.height),n.uniform1f(O.uDpr,u),n.drawArrays(n.TRIANGLES,0,3),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,null),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,null),n.bindVertexArray(null)},N=e=>{if(b=0,!C||!S||document.hidden)return;let t=W.current,n=x?(e-x)/1e3:1/60,r=Math.min(.05,n);x=e;let i=!t.paused&&!v;i?(y.frame+=1,y.time+=r*t.speed,y.roll+=r*t.speed*t.rollSpeed,y.flow+=r*t.flow*12,y.intro+=Math.min(n,1)):y.intro<it&&(y.intro=it),y.pulse.age+=r,y.pulse.strength=Math.max(0,1-y.pulse.age/1.8)**2;let{pointer:a,hover:o,look:s}=y,c=t.mouseInteraction&&a.inside&&!v;c&&!o.placed&&(o.x=a.x,o.y=a.y,o.placed=!0),o.x+=(a.x-o.x)*(1-Math.exp(-r/.08)),o.y+=(a.y-o.y)*(1-Math.exp(-r/.08));let l=+!!c;o.presence+=(l-o.presence)*(1-Math.exp(-r/(l>o.presence?.3:.6))),!c&&o.presence<.001&&(o.placed=!1);let u=c?(a.x/y.width-.5)*.5:0,d=c?(.5-a.y/y.height)*.5:0;s.vx+=(30*(u-s.x)-11*s.vx)*r,s.vy+=(30*(d-s.y)-11*s.vy)*r,s.x+=s.vx*r,s.y+=s.vy*r;let f=at+t.focusDepth*3,p=f;if(c&&t.hover===0){let e=k(t,o.x,o.y);e&&(p=f+(e.depth-f)*o.presence*Math.min(1,t.mouseStrength))}y.focus+=(p-y.focus)*(1-Math.exp(-r/.35)),M();let m=Math.abs(l-o.presence)>.002||Math.abs(u-s.x)>2e-4||Math.abs(d-s.y)>2e-4||Math.abs(p-y.focus)>.001||y.pulse.strength>.001;i||m?b=requestAnimationFrame(N):x=0},P=()=>{!b&&C&&S&&!document.hidden&&(b=requestAnimationFrame(N))},F=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;y.pointer.x=r,y.pointer.y=i,y.pointer.inside=r>=0&&i>=0&&r<=n.width&&i<=n.height,P()},I=t=>{let n=W.current;if(!n.mouseInteraction||!n.pulseOnClick||t.button!==0||v||t.target instanceof Element&&t.target.closest(`a, button, input, textarea, select, label, [role="button"]`))return;let r=e.getBoundingClientRect(),i=t.clientX-r.left,a=t.clientY-r.top;if(i<0||a<0||i>r.width||a>r.height)return;let o=k(n,i,a);o&&(y.pulse={s:o.s,age:0,strength:1,ribbon:o.ribbon}),P()},L=()=>{y.pointer.inside=!1,P()},R=()=>{x=0,P()},z=new ResizeObserver(A);z.observe(e);let U=new IntersectionObserver(e=>{S=e.some(e=>e.isIntersecting),S&&(x=0,P())});return U.observe(e),window.addEventListener(`pointermove`,F,{passive:!0}),window.addEventListener(`pointerdown`,I),document.documentElement.addEventListener(`pointerleave`,L),document.addEventListener(`visibilitychange`,R),A(),P(),H.current=()=>{b||M(),P()},()=>{C=!1,cancelAnimationFrame(b),H.current=null,z.disconnect(),U.disconnect(),window.removeEventListener(`pointermove`,F),window.removeEventListener(`pointerdown`,I),document.documentElement.removeEventListener(`pointerleave`,L),document.removeEventListener(`visibilitychange`,R),n.deleteVertexArray(h),[p,...m].forEach(e=>{e.texture&&n.deleteTexture(e.texture),n.deleteFramebuffer(e.framebuffer)}),[i,a,o,s,c,l].forEach(e=>n.deleteProgram(e.program))}},[]),(0,n.useEffect)(()=>{H.current?.()});let{className:G=``,...K}=z;return(0,r.jsx)(`div`,{ref:B,className:`ghost-fibers-container${G?` ${G}`:``}`,...K,children:(0,r.jsx)(`canvas`,{ref:V,className:`ghost-fibers-canvas`,"aria-hidden":`true`})})},Ft=8,It=1.8,Lt={up:[0,1],down:[0,-1],left:[-1,0],right:[1,0]},Rt=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,zt=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uLine;
uniform float uMaxHalf;
uniform vec3 uColors[${Ft}];
uniform int uColorCount;
uniform vec4 uMagnet;
uniform vec4 uSwirl;
uniform float uReveal;
uniform float uLight;
uniform float uOpaque;
uniform vec3 uBackground;
uniform float uOpacity;
out vec4 outColor;

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * 3.14159265 - 3.14159265 / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}


vec3 palette(float h) {
  float x = clamp(h, 0.0, 1.0) * float(uColorCount - 1);
  int i = int(floor(x));
  int j = min(i + 1, uColorCount - 1);
  return mix(uColors[i], uColors[j], smoothstep(0.0, 1.0, x - float(i)));
}

void main() {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 frag = gl_FragCoord.xy;
  vec2 toMagnet = (frag - uMagnet.xy) / uResolution.y;
  float pull = uMagnet.z * exp(-dot(toMagnet, toMagnet) / (uMagnet.w * uMagnet.w));
  if (pull > 0.001) {
    float angle = pull * 0.55;
    float c = cos(angle);
    float s = sin(angle);
    frag = uMagnet.xy + mat2(c, s, -s, c) * (frag - uMagnet.xy);
  }
  if (uSwirl.w > 0.0) {
    vec2 d = frag - uSwirl.xy;
    float reach = uSwirl.z;
    float angle = uSwirl.w * exp(-dot(d, d) / (reach * reach));
    float c = cos(angle);
    float s = sin(angle);
    frag = uSwirl.xy + mat2(c, s, -s, c) * d;
  }
  vec2 p = frag / uResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = uTime;
  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);
  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;
  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);
  float field = smin(peaks, peaks2, max(uFluidity, 0.001));

  float slope = length(vec2(dFdx(field), dFdy(field)));
  float gap = abs(field - 0.4);
  float pixels = gap / max(slope, 1e-6);
  float halfBand = max(uRimWidth, 0.001) * 0.5;
  float across = max(gap / halfBand, pixels / uMaxHalf);
  float band = 5.0 * uRimWidth * (1.0 - across);
  float reveal = smoothstep(0.2, 0.85, pull);
  float shimmer = vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer * (1.0 - reveal * 0.75);
  float lit = clamp(band - shimmer, 0.0, 1.0);
  float glow = pow(lit, uSharpness) * uGlow * (1.0 + reveal * 0.25);
  float core = uLine > 0.0 ? smoothstep(uLine + 0.75, uLine - 0.75, pixels) * max(smoothstep(0.08, 0.6, glow), reveal) : 0.0;
  float shine = clamp(glow, 0.0, 1.0);
  float energy = max(shine * shine, core * 0.85) * uReveal;

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 tint = palette(h);

  if (uLight > 0.5) {
    float chroma = max(tint.r, max(tint.g, tint.b)) - min(tint.r, min(tint.g, tint.b));
    vec3 ink = mix(vec3(0.07, 0.07, 0.08), tint * 0.55, clamp(chroma * 1.6, 0.0, 1.0));
    float cover = energy * uOpacity;
    outColor = uOpaque > 0.5 ? vec4(mix(uBackground, ink, cover), 1.0) : vec4(ink * cover, cover);
    return;
  }

  vec3 light = tint * energy * uOpacity;
  outColor = uOpaque > 0.5 ? vec4(uBackground + light, 1.0) : vec4(light, max(light.r, max(light.g, light.b)));
}`,Bt=(e,t,n)=>Math.min(n,Math.max(t,e)),Vt=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},Ht=e=>{let t=Vt(e,e.VERTEX_SHADER,Rt),n=Vt(e,e.FRAGMENT_SHADER,zt),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name.replace(`[0]`,``)]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},Ut=({colors:e=[`#ffffff`,`#ffffff`,`#ffffff`],speed:t=.5,scale:i=1.6,turbulence:a=1,fluidity:o=.1,rimWidth:s=.2,sharpness:c=2.5,shimmer:l=1.5,glow:u=2,lineWidth:d=1,flowDirection:f=`down`,opacity:p=1,mouseInteraction:m=!0,mouseStrength:h=1,mouseRadius:g=.35,mouseDampening:_=.15,clickSwirl:v=!0,intro:y=!0,lightMode:b=!1,transparent:x=!0,backgroundColor:S,paused:C=!1,dpr:w,mixBlendMode:T,className:E=``,style:D,...O})=>{let k=(0,n.useRef)(null),A=(0,n.useRef)(null),j=(0,n.useRef)(null),M={colors:Array.isArray(e)&&e.length?e.slice(0,Ft):[`#ffffff`],speed:t,scale:Math.max(.05,i),turbulence:a,fluidity:Math.max(.001,o),rimWidth:Math.max(.001,s),sharpness:Math.max(.1,c),shimmer:Math.max(0,l),glow:Math.max(0,u),lineWidth:Math.max(0,d),flow:Lt[f]??Lt.down,opacity:Bt(p,0,1),mouseInteraction:m,mouseStrength:Math.max(0,h),mouseRadius:Math.max(.01,g),mouseDampening:Math.max(0,_),clickSwirl:v,intro:y,lightMode:b,transparent:x,backgroundColor:S,paused:C,dpr:w},N=(0,n.useRef)(M);return N.current=M,(0,n.useEffect)(()=>{let e=k.current,t=A.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=Ht(n);if(!r)return;let i=r.uniforms,a=n.createBuffer(),o=n.createVertexArray();n.bindVertexArray(o),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let s=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),c=new Map,l=(e,t)=>{if(!e)return t;let n=String(e);if(c.has(n))return c.get(n);let r=t;if(s){s.clearRect(0,0,1,1),s.fillStyle=`#000000`,s.fillStyle=n,s.fillRect(0,0,1,1);let[e,t,i]=s.getImageData(0,0,1,1).data;r=[e/255,t/255,i/255]}return c.set(n,r),r},u=new Float32Array(24),d=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,f={x:0,y:0,inside:!1},p={x:0,y:0,active:0},m={x:0,y:0,age:10},h=0,g=N.current.intro&&!d?0:1,_=0,v=0,y=!0,b=()=>{let a=N.current,s=t.width/Math.max(1,e.clientWidth);a.colors.forEach((e,t)=>u.set(l(e,[1,1,1]),t*3));let c=Math.min(1,g);n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.bindVertexArray(o),n.uniform2f(i.uResolution,t.width,t.height),n.uniform1f(i.uTime,h),n.uniform2f(i.uFlow,a.flow[0],a.flow[1]),n.uniform1f(i.uSpeed,a.speed),n.uniform1f(i.uScale,a.scale),n.uniform1f(i.uTurbulence,a.turbulence),n.uniform1f(i.uFluidity,a.fluidity),n.uniform1f(i.uRimWidth,a.rimWidth),n.uniform1f(i.uSharpness,a.sharpness),n.uniform1f(i.uShimmer,a.shimmer),n.uniform1f(i.uGlow,a.glow),n.uniform1f(i.uLine,a.lineWidth*s*.5),n.uniform1f(i.uMaxHalf,28*s),n.uniform3fv(i.uColors,u),n.uniform1i(i.uColorCount,a.colors.length),n.uniform4f(i.uMagnet,p.x,p.y,p.active*a.mouseStrength,a.mouseRadius);let d=m.age,f=1.9*Math.min(1,d/.23)*Math.exp(-Math.max(0,d-.23)*1.1);n.uniform4f(i.uSwirl,m.x,m.y,t.height*.22*(1+d*.5),d<6?f:0),n.uniform1f(i.uReveal,c*c*(3-2*c)),n.uniform1f(i.uLight,+!!a.lightMode),n.uniform1f(i.uOpaque,+!a.transparent),n.uniform3fv(i.uBackground,l(a.backgroundColor,a.lightMode?[1,1,1]:[.0706,.0588,.0902])),n.uniform1f(i.uOpacity,a.opacity),n.drawArrays(n.TRIANGLES,0,3)},x=e=>{if(_=0,!y||document.hidden)return;let t=N.current,n=v?Bt((e-v)/1e3,5e-4,.05):1/60;v=e;let r=t.paused||d?0:1;h+=n*r,m.age+=n,t.intro&&!d&&g<1?g=Math.min(1,g+n/It):(!t.intro||d)&&(g=1);let i=t.mouseInteraction&&f.inside,a=t.mouseDampening>0?1-Math.exp(-n/t.mouseDampening):1;i&&(p.x+=(f.x-p.x)*a,p.y+=(f.y-p.y)*a);let o=+!!i;p.active+=(o-p.active)*(1-Math.exp(-n/.3)),Math.abs(o-p.active)<.001&&(p.active=o),b(),r>0||p.active!==o||g<1||m.age<6?_=requestAnimationFrame(x):v=0},S=()=>{!_&&y&&!document.hidden&&(_=requestAnimationFrame(x))},C=()=>{let n=N.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),b(),S()},w=n=>{let r=e.getBoundingClientRect(),i=n.clientX-r.left,a=n.clientY-r.top,o=t.width/Math.max(1,r.width);f.inside=i>=0&&a>=0&&i<=r.width&&a<=r.height,f.x=i*o,f.y=(r.height-a)*o},T=e=>{let t=f.inside;w(e),f.inside&&!t&&p.active<.05&&(p.x=f.x,p.y=f.y),S()},E=e=>{T(e),f.inside&&N.current.clickSwirl&&!d&&(m.x=f.x,m.y=f.y,m.age=0,S())},D=e=>{e.pointerType!==`mouse`&&(f.inside=!1)},O=()=>{f.inside=!1},M=()=>{v=0,S()},P=new ResizeObserver(C);P.observe(e);let F=new IntersectionObserver(e=>{y=e.some(e=>e.isIntersecting),y&&(v=0,S())});F.observe(e),window.addEventListener(`pointermove`,T,{passive:!0}),window.addEventListener(`pointerdown`,E,{passive:!0}),window.addEventListener(`pointerup`,D,{passive:!0}),window.addEventListener(`pointercancel`,D,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,O),document.addEventListener(`visibilitychange`,M),C();let I=N.current.dpr;return j.current=()=>{let e=N.current;if(e.dpr!==I){I=e.dpr,C();return}_||b(),S()},()=>{cancelAnimationFrame(_),j.current=null,P.disconnect(),F.disconnect(),window.removeEventListener(`pointermove`,T),window.removeEventListener(`pointerdown`,E),window.removeEventListener(`pointerup`,D),window.removeEventListener(`pointercancel`,D),document.documentElement.removeEventListener(`pointerleave`,O),document.removeEventListener(`visibilitychange`,M),n.deleteProgram(r.program),n.deleteBuffer(a),n.deleteVertexArray(o),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,n.useEffect)(()=>{j.current?.()}),(0,r.jsx)(`div`,{ref:k,className:`flux-lines-container${E?` ${E}`:``}`,style:T?{...D,mixBlendMode:T}:D,...O,children:(0,r.jsx)(`canvas`,{ref:A,className:`flux-lines-canvas`,"aria-hidden":`true`})})},Wt=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Gt=`#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uTarget;
uniform vec2 uRot;
uniform vec2 uPillarRot;
uniform vec2 uWave;
uniform float uShift;
uniform float uPillarWidth;
uniform float uPillarHeight;
uniform int uDetail;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform float uGlowAmount;
uniform float uWidthNorm;
out vec4 outColor;

void main() {
  vec2 vUv = gl_FragCoord.xy / uTarget;
  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
  uv.x -= uShift;
  uv = vec2(uPillarRot.x * uv.x - uPillarRot.y * uv.y, uPillarRot.y * uv.x + uPillarRot.x * uv.y);

  vec3 ro = vec3(0.0, 0.0, -10.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  vec3 origin = vec3(uRot.x * ro.x - uRot.y * ro.z, ro.y, uRot.y * ro.x + uRot.x * ro.z);
  vec3 dir = vec3(uRot.x * rd.x - uRot.y * rd.z, rd.y, uRot.y * rd.x + uRot.x * rd.z);

  float glow = 0.0;
  float lift = 0.0;
  float t = 0.1;
  for (int i = 0; i < 80; i++) {
    vec3 p = origin + dir * t;
    vec3 q = p;
    q.y = p.y * uPillarHeight + uTime;

    float freq = 1.0;
    float amp = 1.0;
    for (int j = 0; j < 6; j++) {
      if (j >= uDetail) break;
      q.xz = vec2(uWave.y * q.x - uWave.x * q.z, uWave.x * q.x + uWave.y * q.z);
      q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
      freq *= 2.0;
      amp *= 0.5;
    }

    float d = length(cos(q.xz)) - 0.2;
    float bound = length(p.xz) - uPillarWidth;
    float h = max(4.0 - abs(d - bound), 0.0);
    d = max(d, bound) + h * h * 0.015625;
    d = abs(d) * 0.15 + 0.01;

    float weight = 1.0 / d;
    glow += weight;
    lift += clamp((15.0 - p.y) / 30.0, 0.0, 1.0) * weight;

    t += d;
    if (t > 50.0) break;
  }

  vec3 col = tanh((uBottomColor * glow + (uTopColor - uBottomColor) * lift) * uGlowAmount / uWidthNorm);
  float peak = max(col.r, max(col.g, col.b));
  outColor = vec4(col, smoothstep(0.62, 1.0, peak));
}`,Kt=`#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uFieldSize;
uniform vec2 uView;
uniform vec2 uAspect;
uniform vec2 uPillarRot;
uniform float uShift;
uniform float uIntensity;
uniform float uNoiseIntensity;
uniform float uLightMode;
uniform float uNeutral;
uniform float uBloom;
uniform float uFade;
uniform float uReveal;
uniform float uFlare;
uniform vec4 uPulses[3];
out vec4 outColor;

vec3 tap(vec2 uv) {
  return textureLod(uField, uv, 0.0).rgb;
}

vec3 bicubic(vec2 uv) {
  vec2 position = uv * uFieldSize;
  vec2 center = floor(position - 0.5) + 0.5;
  vec2 f = position - center;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
  vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
  vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f));
  vec2 w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2;
  vec2 t0 = (center - 1.0) / uFieldSize;
  vec2 t3 = (center + 2.0) / uFieldSize;
  vec2 t12 = (center + w2 / w12) / uFieldSize;
  vec3 result = vec3(0.0);
  result += tap(vec2(t0.x, t0.y)) * w0.x * w0.y;
  result += tap(vec2(t12.x, t0.y)) * w12.x * w0.y;
  result += tap(vec2(t3.x, t0.y)) * w3.x * w0.y;
  result += tap(vec2(t0.x, t12.y)) * w0.x * w12.y;
  result += tap(vec2(t12.x, t12.y)) * w12.x * w12.y;
  result += tap(vec2(t3.x, t12.y)) * w3.x * w12.y;
  result += tap(vec2(t0.x, t3.y)) * w0.x * w3.y;
  result += tap(vec2(t12.x, t3.y)) * w12.x * w3.y;
  result += tap(vec2(t3.x, t3.y)) * w3.x * w3.y;
  return max(result, 0.0);
}

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uView;
  vec3 col = bicubic(uv);

  if (uBloom > 0.0) {
    vec4 l3 = textureLod(uField, uv, 3.0);
    vec4 l4 = textureLod(uField, uv, 4.0);
    vec4 l5 = textureLod(uField, uv, 5.0);
    vec4 l6 = textureLod(uField, uv, 6.0);
    float halo = l3.a * 0.3 + l4.a * 0.3 + l5.a * 0.25 + l6.a * 0.15;
    vec3 tint = l4.rgb + l5.rgb;
    tint /= max(max(tint.r, max(tint.g, tint.b)), 0.001);
    vec3 glow = clamp(tint * halo * uBloom * 1.1, 0.0, 1.0);
    col = 1.0 - (1.0 - clamp(col, 0.0, 1.0)) * (1.0 - glow);
  }

  vec2 p = (uv * 2.0 - 1.0) * uAspect;
  p.x -= uShift;
  float axis = uPillarRot.y * p.x + uPillarRot.x * p.y;

  float boost = 0.0;
  for (int i = 0; i < 3; i++) {
    vec4 pulse = uPulses[i];
    if (pulse.y <= 0.0) continue;
    float offset = (axis - pulse.x) / 0.24;
    boost += exp(-offset * offset) * pulse.y;
  }
  float head = (axis - uReveal + 0.35) / 0.3;
  boost += exp(-head * head) * uFlare;
  float lum = max(col.r, max(col.g, col.b));
  col += mix(col, vec3(lum), 0.45) * boost * 1.8;

  col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
  vec3 result = clamp(col * uIntensity, 0.0, 1.0);

  float mask = smoothstep(uReveal, uReveal - 0.9, axis);
  float edge = uFade * 0.5;
  if (edge > 0.0) {
    mask *= smootherstep01(uv.x / edge) * smootherstep01((1.0 - uv.x) / edge);
    mask *= smootherstep01(uv.y / edge) * smootherstep01((1.0 - uv.y) / edge);
  }

  if (uLightMode > 0.5) {
    float energy = max(result.r, max(result.g, result.b));
    vec3 hue = result / max(energy, 0.001);
    float coverage = smoothstep(0.025, 0.95, energy);
    hue = pow(clamp(hue, 0.0, 1.0), vec3(1.25));
    vec3 tinted = mix(vec3(1.0), hue, coverage * 0.94 * mask);
    vec3 ink = vec3(1.0) - pow(result, vec3(1.6)) * 0.85 * mask;
    result = mix(tinted, ink, uNeutral);
  } else {
    result *= mask;
  }
  outColor = vec4(result, 1.0);
}`,qt={low:.35,medium:.5,high:.6},Jt=2.1,Yt=1.4,Xt=.25,Zt=(e,t,n)=>Math.min(n,Math.max(t,e)),Qt=e=>1-(1-e)**3,$t=e=>e*e*e*(e*(e*6-15)+10),en=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},tn=(e,t)=>{let n=en(e,e.VERTEX_SHADER,Wt),r=en(e,e.FRAGMENT_SHADER,t),i=e.createProgram();if(!n||!r||!i)return null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name.replace(/\[0\]$/,``)]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},nn=({topColor:e=`#5227FF`,bottomColor:t=`#FF9FFC`,intensity:i=1,rotationSpeed:a=.3,flow:o=1,interactive:s=!0,clickPulse:c=!0,glowAmount:l=.002,bloom:u=.5,pillarWidth:d=3,pillarHeight:f=.4,pillarRotation:p=25,twist:m=.4,detail:h=4,noiseIntensity:g=.5,fade:_=0,intro:v=!0,mixBlendMode:y=`screen`,quality:b=`high`,resolution:x,lightMode:S=!1,paused:C=!1,className:w=``,style:T})=>{let E=(0,n.useRef)(null),D=(0,n.useRef)(null),O=(0,n.useRef)(null),k=(0,n.useRef)(null),[A,j]=(0,n.useState)(0);return k.current={topColor:String(e),bottomColor:String(t),intensity:Math.max(0,i),rotationSpeed:a,flow:o,interactive:s,clickPulse:c,glowAmount:Math.max(0,l),bloom:Math.max(0,u),pillarWidth:Math.max(.05,d),pillarHeight:f,pillarRotation:p,twist:m,detail:Math.round(Zt(h,1,6)),noiseIntensity:Math.max(0,g),fade:Zt(_,0,1),intro:v,scale:Zt(x??qt[b]??qt.high,Xt,2),lightMode:S,paused:C},(0,n.useEffect)(()=>{let e=E.current,t=D.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!e||!t||!n)return;let r=!!n.getExtension(`EXT_color_buffer_float`),i=tn(n,Gt),a=tn(n,Kt);if(!i||!a)return;let o=e=>{e.preventDefault()},s=()=>j(e=>e+1);t.addEventListener(`webglcontextlost`,o),t.addEventListener(`webglcontextrestored`,s);let c=n.createBuffer(),l=n.createVertexArray();n.bindVertexArray(l),n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let u=null,d=n.createFramebuffer(),f={width:0,height:0},p=(e,t)=>{if(f.width===e&&f.height===t)return;f.width=e,f.height=t,u&&n.deleteTexture(u),u=n.createTexture(),n.bindTexture(n.TEXTURE_2D,u);let i=Math.floor(Math.log2(Math.max(e,t)))+1;n.texStorage2D(n.TEXTURE_2D,i,r?n.RGBA16F:n.RGBA8,e,t),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindFramebuffer(n.FRAMEBUFFER,d),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,u,0)},m=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),h=new Map,g=e=>{if(h.has(e))return h.get(e);let t=[1,1,1];if(m){m.clearRect(0,0,1,1),m.fillStyle=`#ffffff`,m.fillStyle=e,m.fillRect(0,0,1,1);let[n,r,i]=m.getImageData(0,0,1,1).data;t=[n/255,r/255,i/255]}return h.set(e,t),t},_=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,v={width:1,height:1,ratio:1},y={x:0,y:0,inside:!1},b=[],x=new Float32Array(12),S={clock:0,intro:k.current.intro&&!_?0:1,touch:0,spin:0,lean:0,shift:0,governor:1,slow:0,quick:0},C=0,w=0,T=!0,A=(e,t,n)=>{let r=v.width/v.height,i=(e/v.width*2-1)*r-S.shift,a=1-t/v.height*2;return Math.sin(n)*i+Math.cos(n)*a},M=()=>{let e=k.current,r=Math.max(Xt,e.scale*S.governor),o=Math.max(1,Math.round(v.width*r)),s=Math.max(1,Math.round(v.height*r));p(o,s);let c=$t(S.intro),m=Qt(S.intro),h=(e.pillarRotation+S.lean)*Math.PI/180,_=S.clock*.3+S.spin,y=e.pillarWidth*(.3+.7*c);n.bindVertexArray(l);let C=i.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,d),n.viewport(0,0,f.width,f.height),n.useProgram(i.program),n.uniform1f(C.uTime,S.clock*e.flow),n.uniform2f(C.uResolution,v.width,v.height),n.uniform2f(C.uTarget,f.width,f.height),n.uniform2f(C.uRot,Math.cos(_),Math.sin(_)),n.uniform2f(C.uPillarRot,Math.cos(h),Math.sin(h)),n.uniform2f(C.uWave,Math.sin(e.twist),Math.cos(e.twist)),n.uniform1f(C.uShift,S.shift),n.uniform1f(C.uPillarWidth,y),n.uniform1f(C.uPillarHeight,e.pillarHeight),n.uniform1i(C.uDetail,e.detail),n.uniform3fv(C.uTopColor,g(e.topColor)),n.uniform3fv(C.uBottomColor,g(e.bottomColor)),n.uniform1f(C.uGlowAmount,e.glowAmount),n.uniform1f(C.uWidthNorm,y/3),n.drawArrays(n.TRIANGLES,0,3),n.bindTexture(n.TEXTURE_2D,u),e.bloom>0&&n.generateMipmap(n.TEXTURE_2D),x.fill(0),b.forEach((e,t)=>{x.set([e.axis+e.age*1.7,Math.exp(-e.age/(Yt*.45)),0,0],t*4)});let w=a.uniforms;n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(a.program),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,u),n.uniform1i(w.uField,0),n.uniform2f(w.uFieldSize,f.width,f.height),n.uniform2f(w.uView,t.width,t.height),n.uniform2f(w.uAspect,v.width/v.height,1),n.uniform2f(w.uPillarRot,Math.cos(h),Math.sin(h)),n.uniform1f(w.uShift,S.shift),n.uniform1f(w.uIntensity,e.intensity*(.15+.85*m)*(1+.12*S.touch)),n.uniform1f(w.uNoiseIntensity,e.noiseIntensity),n.uniform1f(w.uLightMode,+!!e.lightMode);let T=e=>Math.max(...e)-Math.min(...e),E=Math.max(T(g(e.topColor)),T(g(e.bottomColor)));n.uniform1f(w.uNeutral,1-Zt((E-.08)/.12,0,1)),n.uniform1f(w.uBloom,e.bloom),n.uniform1f(w.uFade,e.fade);let D=v.width/v.height+1.2;n.uniform1f(w.uReveal,S.intro>=1?1e4:-D+m*(D*2+1.2)),n.uniform1f(w.uFlare,S.intro>=1?0:(1-m)*1.3*Math.min(1,S.intro*8)),n.uniform4fv(w.uPulses,x),n.drawArrays(n.TRIANGLES,0,3)},N=e=>{e>1/40?(S.slow+=1,S.quick=0):e<1/55&&(S.quick+=1,S.slow=0),S.slow>20?(S.governor=Math.max(.5,S.governor*.85),S.slow=0):S.quick>180&&S.governor<1&&(S.governor=Math.min(1,S.governor*1.1),S.quick=0)},P=e=>{if(C=0,!T||document.hidden)return;let t=k.current,n=w?Math.min(.05,(e-w)/1e3):1/60;w&&N((e-w)/1e3),w=e;let r=!t.paused&&!_&&t.rotationSpeed!==0;r&&(S.clock+=n*.96*t.rotationSpeed),!t.intro||_?S.intro=1:S.intro<1&&(S.intro=Math.min(1,S.intro+n/Jt));let i=t.interactive&&y.inside&&!_,a=i?y.x/v.width-.5:0,o=1-Math.exp(-n*2.4);S.spin+=(a*1.4-S.spin)*o,S.lean+=(a*9-S.lean)*o,S.shift+=(a*.35*(v.width/v.height)-S.shift)*o,S.touch+=(+!!i-S.touch)*(1-Math.exp(-n*3));for(let e=b.length-1;e>=0;e--)b[e].age+=n,b[e].age>Yt*2.2&&b.splice(e,1);M();let s=S.intro<1||b.length>0||Math.abs(a*1.4-S.spin)>5e-4||Math.abs(+!!i-S.touch)>.002;r||s?C=requestAnimationFrame(P):w=0},F=()=>{!C&&T&&!document.hidden&&(C=requestAnimationFrame(P))},I=()=>{let n=Math.max(1,e.clientWidth),r=Math.max(1,e.clientHeight),i=Math.min(window.devicePixelRatio||1,2);v.width=n,v.height=r,v.ratio=i,t.width=Math.max(1,Math.round(n*i)),t.height=Math.max(1,Math.round(r*i)),C||M(),F()},L=t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top;return{x:r,y:i,inside:r>=0&&i>=0&&r<=n.width&&i<=n.height}},R=e=>{let t=L(e);y.x=t.x,y.y=t.y,y.inside=t.inside,F()},z=e=>{let t=k.current;if(!t.clickPulse||_)return;let n=L(e);if(!n.inside)return;let r=(t.pillarRotation+S.lean)*Math.PI/180;b.push({axis:A(n.x,n.y,r),age:0}),b.length>3&&b.shift(),F()},B=()=>{y.inside=!1,F()},V=()=>{w=0,F()},H=new ResizeObserver(I);H.observe(e);let U=new IntersectionObserver(e=>{T=e.some(e=>e.isIntersecting),T&&(w=0,F())});return U.observe(e),window.addEventListener(`pointermove`,R,{passive:!0}),window.addEventListener(`pointerdown`,z,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,B),document.addEventListener(`visibilitychange`,V),I(),O.current=()=>{C||M(),F()},()=>{cancelAnimationFrame(C),O.current=null,t.removeEventListener(`webglcontextlost`,o),t.removeEventListener(`webglcontextrestored`,s),H.disconnect(),U.disconnect(),window.removeEventListener(`pointermove`,R),window.removeEventListener(`pointerdown`,z),document.documentElement.removeEventListener(`pointerleave`,B),document.removeEventListener(`visibilitychange`,V),u&&n.deleteTexture(u),n.deleteFramebuffer(d),n.deleteProgram(i.program),n.deleteProgram(a.program),n.deleteBuffer(c),n.deleteVertexArray(l),n.isContextLost()||n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[A]),(0,n.useEffect)(()=>{O.current?.()}),(0,r.jsx)(`div`,{ref:E,className:`light-pillar-container${w?` ${w}`:``}`,style:{mixBlendMode:y,...T},children:(0,r.jsx)(`canvas`,{ref:D,className:`light-pillar-canvas`,"aria-hidden":`true`})})};function rn(){let[e,t]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{let e=null,n=0,r=()=>{let i=document.getElementById(`page-overlay`);if(!i){n++<50&&setTimeout(r,100);return}let a=()=>t(i.classList.contains(`open`));a(),e=new MutationObserver(a),e.observe(i,{attributes:!0,attributeFilter:[`class`]})};return r(),()=>e?.disconnect()},[]),e}var an=(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4,$=an?.75:void 0,on=typeof matchMedia==`function`&&matchMedia(`(prefers-reduced-motion: reduce)`).matches;function sn(){let e=()=>{let e=getComputedStyle(document.body),t=t=>parseFloat(e.getPropertyValue(t))||0;return{x:t(`--sidebar-w`)/2,y:t(`--topbar-h`)/2}},[t,r]=(0,n.useState)(e);return(0,n.useEffect)(()=>{let t=()=>r(t=>{let n=e();return n.x===t.x&&n.y===t.y?t:n}),n=new MutationObserver(t);return n.observe(document.body,{attributes:!0,attributeFilter:[`class`]}),window.addEventListener(`resize`,t),()=>{n.disconnect(),window.removeEventListener(`resize`,t)}},[]),t}function cn({id:e}){let t=rn()||on,n=sn(),i=null;switch(e){case`aurora`:i=(0,r.jsx)(m,{dpr:$,colorStops:[`#3b1d8f`,`#7c3aed`,`#2563eb`],amplitude:1,blend:.55,speed:.6,paused:t});break;case`plasma`:i=(0,r.jsxs)(`div`,{className:`animated-bg-tint`,children:[(0,r.jsx)(C,{dpr:$,color:`#3a1fd6`,speed:.6,scale:1.1,brightness:.35,paused:t}),(0,r.jsx)(`div`,{className:`animated-bg-colour`})]});break;case`silk`:i=(0,r.jsx)(R,{dpr:$,color:`#3b2a9e`,speed:4,scale:1,noiseIntensity:1.5,paused:t});break;case`threads`:i=(0,r.jsx)(te,{color:[.42,.36,1],amplitude:1.6,distance:.4,paused:t});break;case`galaxy`:i=(0,r.jsx)(ue,{dpr:$,hueShift:250,density:1,glowIntensity:.35,saturation:.4,disableAnimation:t,transparent:!1});break;case`beams`:i=(0,r.jsx)(ve,{dpr:$,color:`#6d4aff`,backgroundColor:`#05050a`,rotation:30,speed:.8,brightness:1.4,paused:t});break;case`prism`:i=(0,r.jsx)(je,{dpr:$,animationType:`rotate`,timeScale:t?0:.5,glow:.8,scale:2.2,colors:[`#3b1d8f`,`#7c3aed`,`#4f46e5`,`#2563eb`],offset:n});break;case`particles`:i=(0,r.jsx)(tt,{pixelRatio:$,particleColors:[`#ffffff`,`#8b5cf6`,`#60a5fa`],particleCount:260,speed:.08,paused:t});break;case`ghostfibers`:i=(0,r.jsx)(Pt,{dpr:$,glowColor:`#7c3aed`,secondaryColor:`#2563eb`,speed:.4,paused:t});break;case`fluxlines`:i=(0,r.jsx)(Ut,{dpr:$,colors:[`#7c3aed`,`#4f46e5`,`#2563eb`],speed:.4,transparent:!1,backgroundColor:`#05050a`,paused:t});break;case`lightpillar`:i=(0,r.jsx)(`div`,{className:`animated-bg-centred`,children:(0,r.jsx)(nn,{quality:an?`low`:`high`,topColor:`#7c3aed`,bottomColor:`#2563eb`,rotationSpeed:.25,mixBlendMode:`normal`,paused:t})});break;default:return null}return(0,r.jsx)(`div`,{className:`animated-bg`,"aria-hidden":`true`,children:i})}export{cn as default};