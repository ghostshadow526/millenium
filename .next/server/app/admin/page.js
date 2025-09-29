(()=>{var e={};e.id=3,e.ids=[3],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},83122:e=>{"use strict";e.exports=require("undici")},39491:e=>{"use strict";e.exports=require("assert")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},9523:e=>{"use strict";e.exports=require("dns")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},85158:e=>{"use strict";e.exports=require("http2")},41808:e=>{"use strict";e.exports=require("net")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},77282:e=>{"use strict";e.exports=require("process")},12781:e=>{"use strict";e.exports=require("stream")},24404:e=>{"use strict";e.exports=require("tls")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},51468:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>n.a,__next_app__:()=>p,originalPathname:()=>u,pages:()=>d,routeModule:()=>m,tree:()=>c}),s(44753),s(53817),s(35866);var a=s(23191),r=s(88716),i=s(37922),n=s.n(i),o=s(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);s.d(t,l);let c=["",{children:["admin",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,44753)),"C:\\Users\\DELL\\Documents\\E-learning-1.0.0\\portal-app\\src\\app\\admin\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,53817)),"C:\\Users\\DELL\\Documents\\E-learning-1.0.0\\portal-app\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"]}],d=["C:\\Users\\DELL\\Documents\\E-learning-1.0.0\\portal-app\\src\\app\\admin\\page.tsx"],u="/admin/page",p={require:s,loadChunk:()=>Promise.resolve()},m=new a.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/admin/page",pathname:"/admin",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},72674:(e,t,s)=>{Promise.resolve().then(s.bind(s,14189))},14189:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>p});var a=s(10326),r=s(64685),i=s(17577),n=s(64676),o=s(46791),l=s(90445),c=s(76),d=s(31270),u=s(40381);function p(){return a.jsx(r.Z,{allowed:["admin"],children:a.jsx(m,{})})}function m(){let[e,t]=(0,i.useState)(""),[s,r]=(0,i.useState)(""),[p,m]=(0,i.useState)("JSS1"),[x,h]=(0,i.useState)(""),[g,f]=(0,i.useState)("Mathematics, English"),[b,v]=(0,i.useState)(),[y,j]=(0,i.useState)(!1),[w,N]=(0,i.useState)(null),[S,q]=(0,i.useState)(null),[C,P]=(0,i.useState)(null),[D,E]=(0,i.useState)(""),[L,k]=(0,i.useState)(""),[_,$]=(0,i.useState)("JSS1,JSS2"),[A,U]=(0,i.useState)(null),[I,M]=(0,i.useState)(""),[F,Z]=(0,i.useState)([]),[O,R]=(0,i.useState)(null),[z,G]=(0,i.useState)(""),[J,Q]=(0,i.useState)(""),[T,B]=(0,i.useState)(""),[H,X]=(0,i.useState)(null),[W,K]=(0,i.useState)(null);async function V(){let{students:e,cursor:t}=await (0,n.QN)(10);Z(e),K(t)}async function Y(){if(!W)return;let{students:e,cursor:t}=await (0,n.QN)(10,W);Z(t=>[...t,...e]),K(t)}async function ee(){if(!I.trim()){Z([]);return}Z(await (0,n.l6)(I.trim()))}async function et(e){if(!e){u.ZP.error("Missing student ID");return}try{let t=`${window.location.origin}/student-id/${e}`,s=await d.toDataURL(t,{width:200,margin:2,color:{dark:"#000000",light:"#ffffff"}});await (0,c.r7)((0,c.JU)(l.db,"students",e),{qrCode:s,qrGeneratedAt:new Date,qrGeneratedBy:"admin",qrHistory:[{generatedAt:new Date,generatedBy:"admin"}]}),u.ZP.success("QR code generated"),Z(t=>t.map(t=>t.id===e?{...t,qrCode:s}:t))}catch(e){console.error("QR generation failed",e),u.ZP.error(e.message||"Failed to generate QR")}}async function es(e){if(!e){u.ZP.error("Missing student ID");return}let t=await (0,n.Wv)(e);if(!t){u.ZP.error("Student not found");return}R(e),G(t.firstName||""),Q(t.lastName||""),B(t.classLevel||""),X(null)}async function ea(e){if(e.preventDefault(),O)try{await (0,c.pl)((0,c.JU)(l.db,"students",O),{firstName:z,lastName:J,classLevel:T},{merge:!0}),X("Updated"),await ee(),setTimeout(()=>X(null),1500)}catch(e){X(e.message)}}async function er(e){try{await (0,c.pl)((0,c.JU)(l.db,"students",e),{deleted:!0},{merge:!0}),Z(t=>t.filter(t=>t.id!==e))}catch(e){console.error(e)}}async function ei(e){e.preventDefault(),U(null);try{let e=await (0,o.Xb)(l.I,D.trim(),L);await (0,c.pl)((0,c.JU)(l.db,"users",e.user.uid),{role:"teacher",classLevels:_.split(",").map(e=>e.trim()).filter(Boolean)},{merge:!0}),U("Teacher account created"),E(""),k("")}catch(e){U(e.message)}}async function en(a){a.preventDefault(),j(!0),P(null);try{let a=await (0,n.tS)({firstName:e,lastName:s,classLevel:p,parentEmail:x||void 0,subjects:g.split(",").map(e=>e.trim()).filter(Boolean),photoFile:b});N(a.qrDataUrl),q(a.student.id),P("Student created successfully."),t(""),r(""),h(""),f("Mathematics, English"),v(void 0)}catch(e){P(e.message||"Failed")}finally{j(!1)}}return(0,a.jsxs)("div",{className:"max-w-6xl mx-auto py-12 px-6 space-y-10",children:[(0,a.jsxs)("section",{className:"grid md:grid-cols-2 gap-8",children:[(0,a.jsxs)("form",{onSubmit:en,className:"card space-y-4",children:[a.jsx("h2",{className:"text-lg font-semibold",children:"Add Student"}),(0,a.jsxs)("div",{className:"grid gap-3 grid-cols-2",children:[a.jsx("input",{placeholder:"First Name",value:e,onChange:e=>t(e.target.value),required:!0}),a.jsx("input",{placeholder:"Last Name",value:s,onChange:e=>r(e.target.value),required:!0}),a.jsx("input",{placeholder:"Class Level",value:p,onChange:e=>m(e.target.value),required:!0}),a.jsx("input",{placeholder:"Parent Email (optional)",value:x,onChange:e=>h(e.target.value)})]}),a.jsx("input",{placeholder:"Subjects (comma separated)",value:g,onChange:e=>f(e.target.value)}),a.jsx("input",{type:"file",accept:"image/*",onChange:e=>v(e.target.files?.[0])}),a.jsx("button",{className:"btn",type:"submit",disabled:y,children:y?"Saving...":"Create Student"}),C&&a.jsx("p",{className:"text-sm text-white/70",children:C}),w&&S&&(0,a.jsxs)("div",{className:"text-xs mt-2 space-y-2",children:[(0,a.jsxs)("div",{children:[a.jsx("strong",{children:"ID:"})," ",S]}),a.jsx("img",{src:w,className:"w-32"})]})]}),(0,a.jsxs)("form",{onSubmit:ei,className:"card space-y-4",children:[a.jsx("h2",{className:"text-lg font-semibold",children:"Create Teacher"}),a.jsx("input",{placeholder:"Email",value:D,onChange:e=>E(e.target.value),required:!0}),a.jsx("input",{placeholder:"Password",type:"password",value:L,onChange:e=>k(e.target.value),required:!0}),a.jsx("input",{placeholder:"Class Levels (comma)",value:_,onChange:e=>$(e.target.value)}),a.jsx("button",{className:"btn",type:"submit",children:"Create"}),A&&a.jsx("p",{className:"text-sm text-white/70",children:A})]})]}),(0,a.jsxs)("section",{className:"card",children:[a.jsx("h2",{className:"text-lg font-semibold mb-4",children:"Manage Students"}),(0,a.jsxs)("div",{className:"flex gap-3 mb-4",children:[a.jsx("input",{placeholder:"Search",value:I,onChange:e=>M(e.target.value)}),a.jsx("button",{className:"btn",type:"button",onClick:ee,disabled:!I.trim(),children:"Search"}),a.jsx("button",{className:"btn outline",type:"button",onClick:()=>{M(""),V()},children:"Load First Page"})]}),F.length>0&&a.jsx("div",{className:"overflow-auto",children:(0,a.jsxs)("table",{className:"table",children:[a.jsx("thead",{children:(0,a.jsxs)("tr",{children:[a.jsx("th",{children:"Photo"}),a.jsx("th",{children:"Name"}),a.jsx("th",{children:"ID"}),a.jsx("th",{children:"Class"}),a.jsx("th",{children:"QR"}),a.jsx("th",{})]})}),a.jsx("tbody",{children:F.map(e=>(0,a.jsxs)("tr",{children:[a.jsx("td",{children:e.photoUrl?a.jsx("img",{src:e.photoUrl,className:"w-10 h-10 object-cover rounded"}):a.jsx("span",{className:"text-xs text-white/40",children:"No Photo"})}),(0,a.jsxs)("td",{children:[e.firstName," ",e.lastName]}),a.jsx("td",{children:a.jsx("span",{className:"badge",children:e.id})}),a.jsx("td",{children:e.classLevel}),a.jsx("td",{children:e.qrCode?(0,a.jsxs)("div",{className:"flex flex-col items-start gap-1",children:[a.jsx("img",{src:e.qrCode,className:"w-14 h-14 object-contain border border-white/10 rounded"}),a.jsx("span",{className:"text-[10px] text-green-400",children:"Has QR"})]}):a.jsx("button",{type:"button",className:"btn outline text-xs",onClick:()=>et(e.id),children:"Generate"})}),(0,a.jsxs)("td",{className:"flex gap-2",children:[a.jsx("button",{className:"btn outline",onClick:()=>es(e.id),type:"button",children:"Edit"}),a.jsx("button",{className:"btn outline",onClick:()=>er(e.id),type:"button",children:"Delete"})]})]},e.id))})]})}),!I.trim()&&W&&a.jsx("button",{className:"btn mt-4",type:"button",onClick:Y,children:"Load More"}),O&&(0,a.jsxs)("form",{onSubmit:ea,className:"mt-6 p-4 rounded-lg border border-white/10 bg-white/5 space-y-3",children:[(0,a.jsxs)("h3",{className:"font-semibold text-sm",children:["Edit: ",O]}),(0,a.jsxs)("div",{className:"grid md:grid-cols-3 gap-3",children:[a.jsx("input",{value:z,onChange:e=>G(e.target.value)}),a.jsx("input",{value:J,onChange:e=>Q(e.target.value)}),a.jsx("input",{value:T,onChange:e=>B(e.target.value)})]}),(0,a.jsxs)("div",{className:"flex gap-2",children:[a.jsx("button",{className:"btn",type:"submit",children:"Save"}),a.jsx("button",{className:"btn outline",type:"button",onClick:()=>R(null),children:"Cancel"})]}),H&&a.jsx("p",{className:"text-xs text-white/70",children:H})]})]})]})}},64685:(e,t,s)=>{"use strict";s.d(t,{Z:()=>n});var a=s(10326);s(17577);var r=s(35047),i=s(94001);function n({allowed:e,children:t}){let{loading:s,roleInfo:n,isOverrideAdmin:o}=(0,i.a)();(0,r.useRouter)();let l=n?.role||(o?"admin":null);return s?a.jsx("p",{className:"text-center py-10 text-white/80",children:"Loading..."}):l&&e.includes(l)?a.jsx(a.Fragment,{children:t}):null}},44753:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>n,__esModule:()=>i,default:()=>o});var a=s(68570);let r=(0,a.createProxy)(String.raw`C:\Users\DELL\Documents\E-learning-1.0.0\portal-app\src\app\admin\page.tsx`),{__esModule:i,$$typeof:n}=r;r.default;let o=(0,a.createProxy)(String.raw`C:\Users\DELL\Documents\E-learning-1.0.0\portal-app\src\app\admin\page.tsx#default`)},40381:(e,t,s)=>{"use strict";s.d(t,{ZP:()=>J});var a,r=s(17577);let i={data:""},n=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||i,o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,d=(e,t)=>{let s="",a="",r="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+n+";":a+="f"==i[1]?d(n,i):i+"{"+d(n,"k"==i[1]?"":t)+"}":"object"==typeof n?a+=d(n,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=d.p?d.p(i,n):i+":"+n+";")}return s+(t&&r?t+"{"+r+"}":r)+a},u={},p=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+p(e[s]);return t}return e},m=(e,t,s,a,r)=>{let i=p(e),n=u[i]||(u[i]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(i));if(!u[n]){let t=i!==e?e:(e=>{let t,s,a=[{}];for(;t=o.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(s=t[3].replace(c," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(c," ").trim();return a[0]})(e);u[n]=d(r?{["@keyframes "+n]:t}:t,s?"":"."+n)}let m=s&&u.g?u.g:null;return s&&(u.g=u[n]),((e,t,s,a)=>{a?t.data=t.data.replace(a,e):-1===t.data.indexOf(e)&&(t.data=s?e+t.data:t.data+e)})(u[n],t,a,m),n},x=(e,t,s)=>e.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"");function h(e){let t=this||{},s=e.call?e(t.p):e;return m(s.unshift?s.raw?x(s,[].slice.call(arguments,1),t.p):s.reduce((e,s)=>Object.assign(e,s&&s.call?s(t.p):s),{}):s,n(t.target),t.g,t.o,t.k)}h.bind({g:1});let g,f,b,v=h.bind({k:1});function y(e,t){let s=this||{};return function(){let a=arguments;function r(i,n){let o=Object.assign({},i),l=o.className||r.className;s.p=Object.assign({theme:f&&f()},o),s.o=/ *go\d+/.test(l),o.className=h.apply(s,a)+(l?" "+l:""),t&&(o.ref=n);let c=e;return e[0]&&(c=o.as||e,delete o.as),b&&c[0]&&b(o),g(c,o)}return t?t(r):r}}var j=e=>"function"==typeof e,w=(e,t)=>j(e)?e(t):e,N=(()=>{let e=0;return()=>(++e).toString()})(),S=((()=>{let e;return()=>e})(),"default"),q=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return q(e,{type:e.toasts.find(e=>e.id===a.id)?1:0,toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},C=[],P={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},D={},E=(e,t=S)=>{D[t]=q(D[t]||P,e),C.forEach(([e,s])=>{e===t&&s(D[t])})},L=e=>Object.keys(D).forEach(t=>E(e,t)),k=e=>Object.keys(D).find(t=>D[t].toasts.some(t=>t.id===e)),_=(e=S)=>t=>{E(t,e)},$={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=(e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||N()}),U=e=>(t,s)=>{let a=A(t,e,s);return _(a.toasterId||k(a.id))({type:2,toast:a}),a.id},I=(e,t)=>U("blank")(e,t);I.error=U("error"),I.success=U("success"),I.loading=U("loading"),I.custom=U("custom"),I.dismiss=(e,t)=>{let s={type:3,toastId:e};t?_(t)(s):L(s)},I.dismissAll=e=>I.dismiss(void 0,e),I.remove=(e,t)=>{let s={type:4,toastId:e};t?_(t)(s):L(s)},I.removeAll=e=>I.remove(void 0,e),I.promise=(e,t,s)=>{let a=I.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?w(t.success,e):void 0;return r?I.success(r,{id:a,...s,...null==s?void 0:s.success}):I.dismiss(a),e}).catch(e=>{let r=t.error?w(t.error,e):void 0;r?I.error(r,{id:a,...s,...null==s?void 0:s.error}):I.dismiss(a)}),e};var M=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,F=v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Z=v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,O=(y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Z} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`),R=(y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${O} 1s linear infinite;
`,v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`),z=v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,G=(y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${R} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${z} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,y("div")`
  position: absolute;
`,y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`);y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${G} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,y("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,a=r.createElement,d.p=void 0,g=a,f=void 0,b=void 0,h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var J=I}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),a=t.X(0,[948,307,31,60],()=>s(51468));module.exports=a})();