(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`/api/chat`,t=`X-Achroma-Attest`,n=[`/signout`,`/sync`,`/visit`,`/attest`,`/challenge`,`/signin`,`/signup`,`/recover`],r=`
const K = new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
const W = new Uint32Array(64);
const B = new Uint8Array(64);
function solve(salt, hex, max) {
  const T = new Uint32Array(8);
  for (let i = 0; i < 8; i++) T[i] = parseInt(hex.slice(i * 8, i * 8 + 8), 16) >>> 0;
  const sl = salt.length;
  for (let i = 0; i < sl; i++) B[i] = salt.charCodeAt(i);
  for (let n = 0; n <= max; n++) {
    const d = String(n);
    const len = sl + d.length;
    for (let i = 0; i < d.length; i++) B[sl + i] = d.charCodeAt(i);
    B[len] = 0x80;
    for (let i = len + 1; i < 56; i++) B[i] = 0;
    const bits = len * 8;
    B[56] = 0; B[57] = 0; B[58] = 0; B[59] = 0;
    B[60] = bits >>> 24; B[61] = (bits >>> 16) & 255; B[62] = (bits >>> 8) & 255; B[63] = bits & 255;
    for (let i = 0; i < 16; i++) W[i] = (B[i * 4] << 24) | (B[i * 4 + 1] << 16) | (B[i * 4 + 2] << 8) | B[i * 4 + 3];
    for (let i = 16; i < 64; i++) {
      const a = W[i - 15], b = W[i - 2];
      const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
      const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
    }
    let a = 0x6a09e667, b = 0xbb67ae85, c = 0x3c6ef372, e0 = 0xa54ff53a, e = 0x510e527f, f = 0x9b05688c, g = 0x1f83d9ab, h = 0x5be0cd19;
    for (let i = 0; i < 64; i++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g; g = f; f = e; e = (e0 + t1) | 0; e0 = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    if (((a + 0x6a09e667) >>> 0) === T[0] && ((b + 0xbb67ae85) >>> 0) === T[1] && ((c + 0x3c6ef372) >>> 0) === T[2] && ((e0 + 0xa54ff53a) >>> 0) === T[3]
      && ((e + 0x510e527f) >>> 0) === T[4] && ((f + 0x9b05688c) >>> 0) === T[5] && ((g + 0x1f83d9ab) >>> 0) === T[6] && ((h + 0x5be0cd19) >>> 0) === T[7]) return n;
  }
  return -1;
}
self.onmessage = (ev) => { const { salt, challenge, max } = ev.data; self.postMessage(solve(salt, challenge, max)); };
`,i=null;function a(e){return new Promise((t,n)=>{let a;try{i||=URL.createObjectURL(new Blob([r],{type:`text/javascript`})),a=new Worker(i)}catch{try{t(Function(r.replace(/self\.onmessage[\s\S]*$/,``)+`; return solve;`)()(e.salt,e.challenge,e.max))}catch(e){n(e)}return}a.onmessage=e=>{a.terminate(),e.data>=0?t(e.data):n(Error(`no solution`))},a.onerror=e=>{a.terminate(),n(e)},a.postMessage(e)})}function o(){return window.__achromaGuardFetch||window.fetch.bind(window)}async function s(t){let n=await o()(`${e}/challenge?for=${t}`,{cache:`no-store`,credentials:`same-origin`});if(!n.ok){let e=Error(`challenge ${n.status}`);throw e.status=n.status,e}let r=await n.json(),i=document;try{window.top.document&&(i=window.top.document)}catch{}let s=Function(`return (${r.code})`)()(i),c=await a(r.pow);return{token:r.token,n:c,answer:s}}function c(){return s(`signup`)}function l(){try{if(window.top!==window&&window.top.__achromaGuard)return window.top.__achromaGuard}catch{}return null}function u(){let t={token:null,exp:0,pending:null,timer:0,signedOut:!1,failAt:0},n=async r=>{if(!r&&t.token&&t.exp-Date.now()>6e4)return t.token;if(t.pending)return t.pending;if(Date.now()-t.failAt<6e4)throw Error(`attest backoff`);return t.pending=(async()=>{try{let r=await s(`session`),i=await o()(`${e}/attest`,{method:`POST`,credentials:`same-origin`,headers:{"Content-Type":`application/json`},body:JSON.stringify({guard:r})});if(!i.ok)throw Error(`attest ${i.status}`);let a=await i.json();return t.token=a.attest,t.exp=Date.now()+(a.ttl||9e5),t.signedOut=!1,clearTimeout(t.timer),t.timer=setTimeout(()=>n(!0).catch(()=>{}),Math.max(3e4,(a.ttl||9e5)-18e4)),t.token}catch(e){throw e&&e.status===401?(t.signedOut=!0,t.token=null):t.failAt=Date.now(),e}finally{t.pending=null}})(),t.pending};return{get:()=>t.token&&t.exp>Date.now()?t.token:null,refresh:n,signedIn:()=>{t.signedOut=!1,t.token=null,t.failAt=0,n(!0).catch(()=>{})},signedOut:()=>{t.token=null,t.signedOut=!0,clearTimeout(t.timer)}}}function d(){return l()||(window.__achromaGuard||(window.__achromaGuard=u()),window.__achromaGuard)}function f(){d().signedIn()}function p(){d().signedOut()}function m(t){try{let n=new URL(t,location.href),r=n.pathname.indexOf(`${e}/`);return r===-1?null:n.pathname.slice(r+9)}catch{return null}}function h(e,t){if(!e||/^(GET|HEAD|OPTIONS)$/i.test(e))return!1;let r=m(t);return r!==null&&!n.some(e=>r===e||r.startsWith(`${e}/`))}function g(){if(window.__achromaGuardFetch)return;let e=window.fetch.bind(window);window.__achromaGuardFetch=e,window.fetch=async function(n,r){let i=n instanceof Request?n.url:String(n);if(!h(r&&r.method||(n instanceof Request?n.method:`GET`),i))return e(n,r);let a=d(),o=i=>{let a=new Headers(r&&r.headers||(n instanceof Request?n.headers:void 0));return i&&a.set(t,i),e(n,{...r,headers:a})},s=a.get();s||=await Promise.race([a.refresh(!1).catch(()=>null),new Promise(e=>setTimeout(()=>e(null),15e3))]);let c=await o(s);if(c.status!==403)return c;let l=c.headers.get(`X-Achroma-Need-Attest`)===`1`;if(!l)try{l=(await c.clone().json())?.code===`attest`}catch{}if(!l)return c;let u=r&&r.body;if(n instanceof Request||u&&typeof u.getReader==`function`)return c;let f=await a.refresh(!0).catch(()=>null);return f?o(f):c};let n=XMLHttpRequest.prototype.open,r=XMLHttpRequest.prototype.send;if(XMLHttpRequest.prototype.open=function(e,t,...r){return this.__guard=h(e,t),n.call(this,e,t,...r)},XMLHttpRequest.prototype.send=function(e){if(this.__guard){let e=d().get();if(e)try{this.setRequestHeader(t,e)}catch{}}return r.call(this,e)},!l()){let e=d();setTimeout(()=>e.refresh(!1).catch(()=>{}),1500);try{let t=new BroadcastChannel(`achroma-account`);t.onmessage=t=>{t.data?.type===`user`?e.signedIn():t.data?.type===`signedout`&&e.signedOut()}}catch{}}}g();export{p as n,c as r,f as t};