function $(){}const G=t=>t;function bt(t,e){for(const n in e)t[n]=e[n];return t}function xt(t){return t&&typeof t=="object"&&typeof t.then=="function"}function lt(t){return t()}function rt(){return Object.create(null)}function S(t){t.forEach(lt)}function B(t){return typeof t=="function"}function Jt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let T;function Kt(t,e){return T||(T=document.createElement("a")),T.href=e,t===T.href}function $t(t){return Object.keys(t).length===0}function ot(t,...e){if(t==null)return $;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Qt(t){let e;return ot(t,n=>e=n)(),e}function Ut(t,e,n){t.$$.on_destroy.push(ot(e,n))}function Vt(t,e,n,i){if(t){const s=at(t,e,n,i);return t[0](s)}}function at(t,e,n,i){return t[1]&&i?bt(n.ctx.slice(),t[1](i(e))):n.ctx}function Xt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const l=[],r=Math.max(e.dirty.length,s.length);for(let o=0;o<r;o+=1)l[o]=e.dirty[o]|s[o];return l}return e.dirty|s}return e.dirty}function Yt(t,e,n,i,s,l){if(s){const r=at(e,n,i,l);t.p(r,s)}}function Zt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function te(t){return t==null?"":t}function ee(t,e,n){return t.set(n),e}function ne(t){return t&&B(t.destroy)?t.destroy:$}const ut=typeof window!="undefined";let J=ut?()=>window.performance.now():()=>Date.now(),Z=ut?t=>requestAnimationFrame(t):$;const j=new Set;function ft(t){j.forEach(e=>{e.c(t)||(j.delete(e),e.f())}),j.size!==0&&Z(ft)}function K(t){let e;return j.size===0&&Z(ft),{promise:new Promise(n=>{j.add(e={c:t,f:n})}),abort(){j.delete(e)}}}let Q=!1;function kt(){Q=!0}function wt(){Q=!1}function vt(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function Et(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let a=0;a<e.length;a++){const _=e[a];_.claim_order!==void 0&&c.push(_)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const a=e[c].claim_order,_=(s>0&&e[n[s]].claim_order<=a?s+1:vt(1,s,u=>e[n[u]].claim_order,a))-1;i[c]=n[_]+1;const f=_+1;n[f]=c,s=Math.max(f,s)}const l=[],r=[];let o=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(l.push(e[c-1]);o>=c;o--)r.push(e[o]);o--}for(;o>=0;o--)r.push(e[o]);l.reverse(),r.sort((c,a)=>c.claim_order-a.claim_order);for(let c=0,a=0;c<r.length;c++){for(;a<l.length&&r[c].claim_order>=l[a].claim_order;)a++;const _=a<l.length?l[a]:null;t.insertBefore(r[c],_)}}function Ct(t,e){t.appendChild(e)}function _t(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function St(t){const e=dt("style");return jt(_t(t),e),e.sheet}function jt(t,e){Ct(t.head||t,e)}function At(t,e){if(Q){for(Et(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function ie(t,e,n){Q&&!n?At(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function Nt(t){t.parentNode.removeChild(t)}function se(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function dt(t){return document.createElement(t)}function tt(t){return document.createTextNode(t)}function re(){return tt(" ")}function ce(){return tt("")}function le(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function oe(t){return function(e){return e.preventDefault(),t.call(this,e)}}function ae(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function ue(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function fe(t){return t===""?null:+t}function Mt(t){return Array.from(t.childNodes)}function Rt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function ht(t,e,n,i,s=!1){Rt(t);const l=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),o}}for(let r=t.claim_info.last_index-1;r>=0;r--){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,o}}return i()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function qt(t,e,n,i){return ht(t,s=>s.nodeName===e,s=>{const l=[];for(let r=0;r<s.attributes.length;r++){const o=s.attributes[r];n[o.name]||l.push(o.name)}l.forEach(r=>s.removeAttribute(r))},()=>i(e))}function _e(t,e,n){return qt(t,e,n,dt)}function Dt(t,e){return ht(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>tt(e),!0)}function de(t){return Dt(t," ")}function he(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function me(t,e){t.value=e==null?"":e}function pe(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function ye(t,e){for(let n=0;n<t.options.length;n+=1){const i=t.options[n];if(i.__value===e){i.selected=!0;return}}t.selectedIndex=-1}function ge(t){const e=t.querySelector(":checked")||t.options[0];return e&&e.__value}function be(t,e,n){t.classList[n?"add":"remove"](e)}function mt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function xe(t,e=document.body){return Array.from(e.querySelectorAll(t))}const H=new Map;let W=0;function Pt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Bt(t,e){const n={stylesheet:St(e),rules:{}};return H.set(t,n),n}function q(t,e,n,i,s,l,r,o=0){const c=16.666/i;let a=`{
`;for(let m=0;m<=1;m+=c){const g=e+(n-e)*l(m);a+=m*100+`%{${r(g,1-g)}}
`}const _=a+`100% {${r(n,1-n)}}
}`,f=`__svelte_${Pt(_)}_${o}`,u=_t(t),{stylesheet:d,rules:h}=H.get(u)||Bt(u,t);h[f]||(h[f]=!0,d.insertRule(`@keyframes ${f} ${_}`,d.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${f} ${i}ms linear ${s}ms 1 both`,W+=1,f}function D(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?l=>l.indexOf(e)<0:l=>l.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),W-=s,W||Ot())}function Ot(){Z(()=>{W||(H.forEach(t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}}),H.clear())})}function $e(t,e,n,i){if(!e)return $;const s=t.getBoundingClientRect();if(e.left===s.left&&e.right===s.right&&e.top===s.top&&e.bottom===s.bottom)return $;const{delay:l=0,duration:r=300,easing:o=G,start:c=J()+l,end:a=c+r,tick:_=$,css:f}=n(t,{from:e,to:s},i);let u=!0,d=!1,h;function p(){f&&(h=q(t,0,1,r,l,o,f)),l||(d=!0)}function m(){f&&D(t,h),u=!1}return K(g=>{if(!d&&g>=c&&(d=!0),d&&g>=a&&(_(1,0),m()),!u)return!1;if(d){const b=g-c,x=0+1*o(b/r);_(x,1-x)}return!0}),p(),_(0,1),m}function ke(t){const e=getComputedStyle(t);if(e.position!=="absolute"&&e.position!=="fixed"){const{width:n,height:i}=e,s=t.getBoundingClientRect();t.style.position="absolute",t.style.width=n,t.style.height=i,Lt(t,s)}}function Lt(t,e){const n=t.getBoundingClientRect();if(e.left!==n.left||e.top!==n.top){const i=getComputedStyle(t),s=i.transform==="none"?"":i.transform;t.style.transform=`${s} translate(${e.left-n.left}px, ${e.top-n.top}px)`}}let P;function E(t){P=t}function N(){if(!P)throw new Error("Function called outside component initialization");return P}function we(t){N().$$.on_mount.push(t)}function ve(t){N().$$.after_update.push(t)}function Ee(t){N().$$.on_destroy.push(t)}function Ce(){const t=N();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const l=mt(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,l)}),!l.defaultPrevented}return!0}}function Se(t,e){return N().$$.context.set(t,e),e}function je(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const R=[],ct=[],F=[],X=[],pt=Promise.resolve();let Y=!1;function yt(){Y||(Y=!0,pt.then(et))}function Ae(){return yt(),pt}function A(t){F.push(t)}function Ne(t){X.push(t)}const V=new Set;let z=0;function et(){const t=P;do{for(;z<R.length;){const e=R[z];z++,E(e),Tt(e.$$)}for(E(null),R.length=0,z=0;ct.length;)ct.pop()();for(let e=0;e<F.length;e+=1){const n=F[e];V.has(n)||(V.add(n),n())}F.length=0}while(R.length);for(;X.length;)X.pop()();Y=!1,V.clear(),E(t)}function Tt(t){if(t.fragment!==null){t.update(),S(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}let M;function nt(){return M||(M=Promise.resolve(),M.then(()=>{M=null})),M}function C(t,e,n){t.dispatchEvent(mt(`${e?"intro":"outro"}${n}`))}const I=new Set;let v;function zt(){v={r:0,c:[],p:v}}function Ft(){v.r||S(v.c),v=v.p}function it(t,e){t&&t.i&&(I.delete(t),t.i(e))}function gt(t,e,n,i){if(t&&t.o){if(I.has(t))return;I.add(t),v.c.push(()=>{I.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const st={duration:0};function Me(t,e,n){let i=e(t,n),s=!1,l,r,o=0;function c(){l&&D(t,l)}function a(){const{delay:f=0,duration:u=300,easing:d=G,tick:h=$,css:p}=i||st;p&&(l=q(t,0,1,u,f,d,p,o++)),h(0,1);const m=J()+f,g=m+u;r&&r.abort(),s=!0,A(()=>C(t,!0,"start")),r=K(b=>{if(s){if(b>=g)return h(1,0),C(t,!0,"end"),c(),s=!1;if(b>=m){const x=d((b-m)/u);h(x,1-x)}}return s})}let _=!1;return{start(){_||(_=!0,D(t),B(i)?(i=i(),nt().then(a)):a())},invalidate(){_=!1},end(){s&&(c(),s=!1)}}}function Re(t,e,n){let i=e(t,n),s=!0,l;const r=v;r.r+=1;function o(){const{delay:c=0,duration:a=300,easing:_=G,tick:f=$,css:u}=i||st;u&&(l=q(t,1,0,a,c,_,u));const d=J()+c,h=d+a;A(()=>C(t,!1,"start")),K(p=>{if(s){if(p>=h)return f(0,1),C(t,!1,"end"),--r.r||S(r.c),!1;if(p>=d){const m=_((p-d)/a);f(1-m,m)}}return s})}return B(i)?nt().then(()=>{i=i(),o()}):o(),{end(c){c&&i.tick&&i.tick(1,0),s&&(l&&D(t,l),s=!1)}}}function qe(t,e,n,i){let s=e(t,n),l=i?0:1,r=null,o=null,c=null;function a(){c&&D(t,c)}function _(u,d){const h=u.b-l;return d*=Math.abs(h),{a:l,b:u.b,d:h,duration:d,start:u.start,end:u.start+d,group:u.group}}function f(u){const{delay:d=0,duration:h=300,easing:p=G,tick:m=$,css:g}=s||st,b={start:J()+d,b:u};u||(b.group=v,v.r+=1),r||o?o=b:(g&&(a(),c=q(t,l,u,h,d,p,g)),u&&m(0,1),r=_(b,h),A(()=>C(t,u,"start")),K(x=>{if(o&&x>o.start&&(r=_(o,h),o=null,C(t,r.b,"start"),g&&(a(),c=q(t,l,r.b,r.duration,0,p,s.css))),r){if(x>=r.end)m(l=r.b,1-l),C(t,r.b,"end"),o||(r.b?a():--r.group.r||S(r.group.c)),r=null;else if(x>=r.start){const O=x-r.start;l=r.a+r.d*p(O/r.duration),m(l,1-l)}}return!!(r||o)}))}return{run(u){B(s)?nt().then(()=>{s=s(),f(u)}):f(u)},end(){a(),r=o=null}}}function De(t,e){const n=e.token={};function i(s,l,r,o){if(e.token!==n)return;e.resolved=o;let c=e.ctx;r!==void 0&&(c=c.slice(),c[r]=o);const a=s&&(e.current=s)(c);let _=!1;e.block&&(e.blocks?e.blocks.forEach((f,u)=>{u!==l&&f&&(zt(),gt(f,1,1,()=>{e.blocks[u]===f&&(e.blocks[u]=null)}),Ft())}):e.block.d(1),a.c(),it(a,1),a.m(e.mount(),e.anchor),_=!0),e.block=a,e.blocks&&(e.blocks[l]=a),_&&et()}if(xt(t)){const s=N();if(t.then(l=>{E(s),i(e.then,1,e.value,l),E(null)},l=>{if(E(s),i(e.catch,2,e.error,l),E(null),!e.hasCatch)throw l}),e.current!==e.pending)return i(e.pending,0),!0}else{if(e.current!==e.then)return i(e.then,1,e.value,t),!0;e.resolved=t}}function Pe(t,e,n){const i=e.slice(),{resolved:s}=t;t.current===t.then&&(i[t.value]=s),t.current===t.catch&&(i[t.error]=s),t.block.p(i,n)}function It(t,e){gt(t,1,1,()=>{e.delete(t.key)})}function Be(t,e){t.f(),It(t,e)}function Oe(t,e,n,i,s,l,r,o,c,a,_,f){let u=t.length,d=l.length,h=u;const p={};for(;h--;)p[t[h].key]=h;const m=[],g=new Map,b=new Map;for(h=d;h--;){const y=f(s,l,h),k=n(y);let w=r.get(k);w?i&&w.p(y,e):(w=a(k,y),w.c()),g.set(k,m[h]=w),k in p&&b.set(k,Math.abs(h-p[k]))}const x=new Set,O=new Set;function U(y){it(y,1),y.m(o,_),r.set(y.key,y),_=y.first,d--}for(;u&&d;){const y=m[d-1],k=t[u-1],w=y.key,L=k.key;y===k?(_=y.first,u--,d--):g.has(L)?!r.has(w)||x.has(w)?U(y):O.has(L)?u--:b.get(w)>b.get(L)?(O.add(w),U(y)):(x.add(L),u--):(c(k,r),u--)}for(;u--;){const y=t[u];g.has(y.key)||c(y,r)}for(;d;)U(m[d-1]);return m}function Le(t,e){const n={},i={},s={$$scope:1};let l=t.length;for(;l--;){const r=t[l],o=e[l];if(o){for(const c in r)c in o||(i[c]=1);for(const c in o)s[c]||(n[c]=o[c],s[c]=1);t[l]=o}else for(const c in r)s[c]=1}for(const r in i)r in n||(n[r]=void 0);return n}function Te(t){return typeof t=="object"&&t!==null?t:{}}function ze(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Fe(t){t&&t.c()}function Ie(t,e){t&&t.l(e)}function Ht(t,e,n,i){const{fragment:s,on_mount:l,on_destroy:r,after_update:o}=t.$$;s&&s.m(e,n),i||A(()=>{const c=l.map(lt).filter(B);r?r.push(...c):S(c),t.$$.on_mount=[]}),o.forEach(A)}function Wt(t,e){const n=t.$$;n.fragment!==null&&(S(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Gt(t,e){t.$$.dirty[0]===-1&&(R.push(t),yt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function He(t,e,n,i,s,l,r,o=[-1]){const c=P;E(t);const a=t.$$={fragment:null,ctx:null,props:l,update:$,not_equal:s,bound:rt(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:rt(),dirty:o,skip_bound:!1,root:e.target||c.$$.root};r&&r(a.root);let _=!1;if(a.ctx=n?n(t,e.props||{},(f,u,...d)=>{const h=d.length?d[0]:u;return a.ctx&&s(a.ctx[f],a.ctx[f]=h)&&(!a.skip_bound&&a.bound[f]&&a.bound[f](h),_&&Gt(t,f)),u}):[],a.update(),_=!0,S(a.before_update),a.fragment=i?i(a.ctx):!1,e.target){if(e.hydrate){kt();const f=Mt(e.target);a.fragment&&a.fragment.l(f),f.forEach(Nt)}else a.fragment&&a.fragment.c();e.intro&&it(t.$$.fragment),Ht(t,e.target,e.anchor,e.customElement),wt(),et()}E(c)}class We{$destroy(){Wt(this,1),this.$destroy=$}$on(e,n){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!$t(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{It as $,Te as A,Wt as B,bt as C,Ae as D,$ as E,ot as F,S as G,B as H,Vt as I,xe as J,At as K,Yt as L,Zt as M,Xt as N,se as O,Qt as P,J as Q,K as R,We as S,Kt as T,le as U,je as V,be as W,Ut as X,ae as Y,Oe as Z,Ce as _,Mt as a,ct as a0,G as a1,ne as a2,Ee as a3,A as a4,qe as a5,Ne as a6,ze as a7,oe as a8,me as a9,fe as aa,De as ab,Pe as ac,Me as ad,Re as ae,ke as af,$e as ag,Be as ah,ye as ai,ee as aj,ge as ak,te as al,ue as b,_e as c,Nt as d,dt as e,pe as f,ie as g,Dt as h,He as i,he as j,re as k,ce as l,de as m,zt as n,gt as o,Ft as p,it as q,Se as r,Jt as s,tt as t,ve as u,we as v,Fe as w,Ie as x,Ht as y,Le as z};
