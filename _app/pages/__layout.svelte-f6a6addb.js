import{S as K,i as q,s as S,e as d,c as p,b as t,g as I,E as C,d as u,I as J,l as j,k as O,J as X,m as z,K as h,L as B,M as D,N as F,q as G,o as H,O as P}from"../chunks/index-571d3ec7.js";import{b as M}from"../chunks/paths-396f020f.js";function L(i,a,s){const o=i.slice();return o[3]=a[s][0],o[4]=a[s][1],o[5]=a[s][2],o[6]=a[s][3],o}function N(i){let a,s,o;return{c(){a=d("link"),this.h()},l(c){a=p(c,"LINK",{rel:!0,media:!0,href:!0}),this.h()},h(){t(a,"rel","apple-touch-startup-image"),t(a,"media",s="(device-width: "+i[3]+"px) and (device-height: "+i[4]+"px) and (-webkit-device-pixel-ratio: "+i[5]+")"),t(a,"href",o=M+"/images/"+i[6])},m(c,f){I(c,a,f)},p:C,d(c){c&&u(a)}}}function Q(i){let a,s,o,c,f,_,k,b,g,v,y,w,A,E=i[0],r=[];for(let e=0;e<E.length;e+=1)r[e]=N(L(i,E,e));const $=i[2].default,m=J($,i,i[1],null);return{c(){a=d("meta"),s=d("link"),o=d("link"),c=d("link"),f=d("meta"),_=d("meta"),k=d("meta"),b=d("meta"),g=d("meta"),v=d("meta");for(let e=0;e<r.length;e+=1)r[e].c();y=j(),w=O(),m&&m.c(),this.h()},l(e){const n=X('[data-svelte="svelte-uhs365"]',document.head);a=p(n,"META",{name:!0,content:!0}),s=p(n,"LINK",{rel:!0,type:!0,href:!0}),o=p(n,"LINK",{rel:!0,href:!0}),c=p(n,"LINK",{rel:!0,href:!0}),f=p(n,"META",{charset:!0}),_=p(n,"META",{name:!0,content:!0}),k=p(n,"META",{name:!0,content:!0}),b=p(n,"META",{name:!0,content:!0}),g=p(n,"META",{name:!0,content:!0,media:!0}),v=p(n,"META",{name:!0,content:!0,media:!0});for(let l=0;l<r.length;l+=1)r[l].l(n);y=j(),n.forEach(u),w=z(e),m&&m.l(e),this.h()},h(){document.title="Amadeus",t(a,"name","description"),t(a,"content","Listen to your music with Amadeus!"),t(s,"rel","icon"),t(s,"type","image/png"),t(s,"href",M+"/images/favicon.png"),t(o,"rel","apple-touch-icon"),t(o,"href",M+"/images/icon.jpg"),t(c,"rel","manifest"),t(c,"href",M+"/manifest.json"),t(f,"charset","utf-8"),t(_,"name","apple-mobile-web-app-capable"),t(_,"content","yes"),t(k,"name","apple-mobile-web-app-status-bar-style"),t(k,"content","default"),t(b,"name","viewport"),t(b,"content","width=device-width,height=device-height,initial-scale=1,user-scalable=no"),t(g,"name","theme-color"),t(g,"content","#ffffff"),t(g,"media","(prefers-color-scheme: light)"),t(v,"name","theme-color"),t(v,"content","#000000"),t(v,"media","(prefers-color-scheme: dark)")},m(e,n){h(document.head,a),h(document.head,s),h(document.head,o),h(document.head,c),h(document.head,f),h(document.head,_),h(document.head,k),h(document.head,b),h(document.head,g),h(document.head,v);for(let l=0;l<r.length;l+=1)r[l].m(document.head,null);h(document.head,y),I(e,w,n),m&&m.m(e,n),A=!0},p(e,[n]){if(n&1){E=e[0];let l;for(l=0;l<E.length;l+=1){const T=L(e,E,l);r[l]?r[l].p(T,n):(r[l]=N(T),r[l].c(),r[l].m(y.parentNode,y))}for(;l<r.length;l+=1)r[l].d(1);r.length=E.length}m&&m.p&&(!A||n&2)&&B(m,$,e,e[1],A?F($,e[1],n,null):D(e[1]),null)},i(e){A||(G(m,e),A=!0)},o(e){H(m,e),A=!1},d(e){u(a),u(s),u(o),u(c),u(f),u(_),u(k),u(b),u(g),u(v),P(r,e),u(y),e&&u(w),m&&m.d(e)}}}function R(i,a,s){let{$$slots:o={},$$scope:c}=a,f=[[320,568,2,"splash-5.jpg"],[375,667,2,"splash-8.jpg"],[375,812,3,"splash-X.jpg"],[414,736,3,"splash-plus.jpg"]];return i.$$set=_=>{"$$scope"in _&&s(1,c=_.$$scope)},[f,c,o]}class W extends K{constructor(a){super(),q(this,a,R,Q,S,{})}}export{W as default};
