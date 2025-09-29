(()=>{var e={};e.id=941,e.ids=[941],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},83122:e=>{"use strict";e.exports=require("undici")},39491:e=>{"use strict";e.exports=require("assert")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},9523:e=>{"use strict";e.exports=require("dns")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},85158:e=>{"use strict";e.exports=require("http2")},41808:e=>{"use strict";e.exports=require("net")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},77282:e=>{"use strict";e.exports=require("process")},12781:e=>{"use strict";e.exports=require("stream")},24404:e=>{"use strict";e.exports=require("tls")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},1687:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>n.a,__next_app__:()=>x,originalPathname:()=>m,pages:()=>c,routeModule:()=>p,tree:()=>d}),s(12973),s(53817),s(35866);var r=s(23191),a=s(88716),i=s(37922),n=s.n(i),l=s(95231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);s.d(t,o);let d=["",{children:["teacher",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,12973)),"C:\\Users\\DELL\\Documents\\E-learning-1.0.0\\portal-app\\src\\app\\teacher\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,53817)),"C:\\Users\\DELL\\Documents\\E-learning-1.0.0\\portal-app\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\DELL\\Documents\\E-learning-1.0.0\\portal-app\\src\\app\\teacher\\page.tsx"],m="/teacher/page",x={require:s,loadChunk:()=>Promise.resolve()},p=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/teacher/page",pathname:"/teacher",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},67902:(e,t,s)=>{Promise.resolve().then(s.bind(s,39875))},39875:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>b});var r=s(10326),a=s(17577),i=s(90434),n=s(94001),l=s(64676),o=s(90445),d=s(76),c=s(46791),m=s(42585),x=s(31270),p=s(8806),u=s(40381);function f({onStudentRegistered:e}){let{user:t,roleInfo:s}=(0,n.a)(),i=s?.role==="admin",[l,f]=(0,a.useState)(!1),[g,h]=(0,a.useState)(null),[b,y]=(0,a.useState)(null),[j,v]=(0,a.useState)(""),[N,w]=(0,a.useState)({name:"",age:"",class:"",parentPhone:"",parentEmail:"",parentPassword:"",parentConfirm:"",studentEmail:""}),P=e=>{let t={};return Object.entries(e).forEach(([e,s])=>{void 0!==s&&(t[e]=s)}),t},C=e=>e.trim().toUpperCase().replace(/\s+/g,""),k=async e=>{let t=C(e)||"CLASS",s=new Date().getFullYear();for(let e=0;e<18;e++){let e=Math.floor(1e3+9e3*Math.random()),r=`${t}-${s}-${e}`,a=(0,d.JU)((0,d.hJ)(o.db,"students"),r);if(!(await (0,d.QT)(a)).exists())return r}return`${t}-${s}-${Date.now().toString().slice(-4)}`},S=async e=>{let t=`${window.location.origin}/student-id/${e}`;return x.toDataURL(t,{width:220,margin:2,color:{dark:"#000000",light:"#ffffff"}})},q=async e=>{let t=await (0,p.Z)(e,{maxSizeMB:.4,maxWidthOrHeight:700,useWebWorker:!0}),s=await new Promise((e,s)=>{let r=new FileReader;r.onload=()=>e(r.result.replace(/^data:[^;]+;base64,/,"")),r.onerror=s,r.readAsDataURL(t)}),r=await fetch("/api/imagekit/upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({file:s,fileName:`student_${Date.now()}.jpg`})});if(!r.ok)throw Error("Image upload failed");let a=await r.json();if(!a?.url)throw Error("No image URL returned");return a.url},E=()=>N.name.trim()?!N.age.trim()||isNaN(Number(N.age))?(u.ZP.error("Valid age required"),!1):N.class.trim()?N.parentEmail.trim()?/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(N.parentEmail)?N.parentPassword.length<6?(u.ZP.error("Parent password min 6 chars"),!1):N.parentPassword===N.parentConfirm||(u.ZP.error("Parent passwords do not match"),!1):(u.ZP.error("Invalid parent email"),!1):(u.ZP.error("Parent email required"),!1):(u.ZP.error("Class is required"),!1):(u.ZP.error("Name is required"),!1),_=async s=>{if(s.preventDefault(),t&&E()){f(!0);try{let s;let a=await k(N.class);if(b)try{s=await q(b)}catch{u.ZP.error("Photo upload failed")}let n=N.name.trim(),l=n.split(/\s+/),x=l[0],p=l.length>1?l.slice(1).join(" "):void 0,f={name:n,firstName:x,lastName:p,class:N.class.trim(),classLevel:N.class.trim(),age:Number(N.age),rollNumber:a,parentPhone:N.parentPhone||void 0,parentEmail:N.parentEmail||void 0,photoUrl:s,registeredBy:i?"admin":"teacher",registeredByUid:t.uid,feeStatus:{term1:!1,term2:!1,term3:!1},createdAt:new Date,updatedAt:new Date};if(i){let e=await S(a);f.qrCode=e,f.qrGeneratedAt=new Date,f.qrGeneratedBy=t.uid,f.qrHistory=[{generatedAt:new Date,generatedBy:t.uid}]}let g=P(f),j=(0,d.JU)((0,d.hJ)(o.db,"students"),a);await (0,d.pl)(j,g);try{let e="parent-provision",t=(0,m.C6)().find(t=>t.name===e)||(0,m.ZF)(o.I.app.options,e),s=(0,c.v0)(t),r=await (0,c.Xb)(s,N.parentEmail.trim(),N.parentPassword);await (0,d.pl)((0,d.JU)((0,d.hJ)(o.db,"users"),r.user.uid),{role:"parent",studentId:a,email:N.parentEmail.trim(),createdAt:new Date},{merge:!0})}catch(e){u.ZP.error("Parent auth create failed: "+(e?.message||"error"))}let C={...g,id:j.id};h(j.id),u.ZP.success(`Student registered${i?" (QR ready)":""}. ID generated.`),u.ZP.custom((0,r.jsxs)("div",{className:"bg-white text-midnight_text text-xs px-3 py-2 rounded shadow",children:[r.jsx("div",{children:"Student ID:"}),r.jsx("div",{className:"font-mono text-sm font-semibold",children:j.id})]}),{duration:8e3}),w({name:"",age:"",class:"",parentPhone:"",parentEmail:"",parentPassword:"",parentConfirm:"",studentEmail:""}),y(null),v(""),e?.(C)}catch(e){console.error("Registration error",e),u.ZP.error("Registration failed: "+(e?.message||"unknown"))}finally{f(!1)}}};return(0,r.jsxs)("div",{className:"card p-6",children:[(0,r.jsxs)("div",{className:"flex items-center gap-3 mb-6",children:[r.jsx("div",{className:"w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center",children:r.jsx("i",{className:"fas fa-user-plus text-primary"})}),(0,r.jsxs)("div",{children:[r.jsx("h2",{className:"text-xl font-semibold text-midnight_text",children:"Register New Student"}),r.jsx("p",{className:"text-sm text-grey",children:i?"Admin registration (QR + optional login)":"Teacher registration (no QR, no student email field)"})]})]}),(0,r.jsxs)("form",{onSubmit:_,className:"space-y-6",children:[g&&(0,r.jsxs)("div",{className:"p-3 rounded border border-green-500/40 bg-green-500/10 text-xs flex items-center justify-between gap-3",children:[(0,r.jsxs)("div",{children:[r.jsx("strong",{children:"Last Student ID:"})," ",r.jsx("span",{className:"font-mono",children:g}),r.jsx("div",{className:"text-[10px] text-grey mt-1",children:"Used as initial password if login was provisioned."})]}),r.jsx("button",{type:"button",onClick:()=>{navigator.clipboard.writeText(g),u.ZP.success("Copied")},className:"btn outline text-xs",children:"Copy"})]}),(0,r.jsxs)("div",{className:"grid md:grid-cols-2 gap-4",children:[(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-midnight_text mb-2",children:"Student Name *"}),r.jsx("input",{value:N.name,onChange:e=>w(t=>({...t,name:e.target.value})),placeholder:"Full Name",className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-midnight_text mb-2",children:"Age *"}),r.jsx("input",{value:N.age,onChange:e=>w(t=>({...t,age:e.target.value})),placeholder:"e.g. 12",className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-midnight_text mb-2",children:"Class *"}),r.jsx("input",{value:N.class,onChange:e=>w(t=>({...t,class:e.target.value})),placeholder:"JSS1",className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"})]}),i&&(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-midnight_text mb-2",children:"Student Email (optional)"}),r.jsx("input",{value:N.studentEmail||"",onChange:e=>w(t=>({...t,studentEmail:e.target.value})),placeholder:"student@example.com",className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"})]})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-midnight_text mb-2",children:"Student Photo"}),(0,r.jsxs)("div",{className:"flex items-center gap-4",children:[j?r.jsx("img",{src:j,alt:"Preview",className:"w-20 h-20 rounded-full object-cover border-2 border-gray-200"}):r.jsx("div",{className:"w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center",children:r.jsx("i",{className:"fas fa-camera text-gray-400 text-xl"})}),r.jsx("input",{type:"file",accept:"image/*",onChange:e=>{let t=e.target.files?.[0];if(!t)return;y(t);let s=new FileReader;s.onload=()=>v(s.result),s.readAsDataURL(t)},className:"flex-1"})]})]}),(0,r.jsxs)("div",{className:"grid md:grid-cols-2 gap-4",children:[(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-midnight_text mb-2",children:"Parent Phone"}),r.jsx("input",{value:N.parentPhone,onChange:e=>w(t=>({...t,parentPhone:e.target.value})),placeholder:"+234...",className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-midnight_text mb-2",children:"Parent Email"}),r.jsx("input",{type:"email",value:N.parentEmail,onChange:e=>w(t=>({...t,parentEmail:e.target.value})),placeholder:"parent@example.com",className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-midnight_text mb-2",children:"Parent Password"}),r.jsx("input",{type:"password",value:N.parentPassword,onChange:e=>w(t=>({...t,parentPassword:e.target.value})),placeholder:"Parent password",className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"})]}),(0,r.jsxs)("div",{children:[r.jsx("label",{className:"block text-sm font-medium text-midnight_text mb-2",children:"Confirm Password"}),r.jsx("input",{type:"password",value:N.parentConfirm,onChange:e=>w(t=>({...t,parentConfirm:e.target.value})),placeholder:"Confirm password",className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"})]})]}),i&&(0,r.jsxs)("div",{className:"bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3",children:[r.jsx("i",{className:"fas fa-qrcode text-primary mt-1"}),(0,r.jsxs)("div",{children:[r.jsx("h4",{className:"font-medium text-primary",children:"QR Code Auto Generation"}),r.jsx("p",{className:"text-xs text-grey mt-1",children:"Admins automatically create a QR code used for the student's digital ID card."})]})]}),r.jsx("button",{type:"submit",disabled:l,className:"w-full btn btn-primary btn-lg justify-center",children:l?(0,r.jsxs)(r.Fragment,{children:[r.jsx("i",{className:"fas fa-spinner fa-spin"})," Processing..."]}):(0,r.jsxs)(r.Fragment,{children:[r.jsx("i",{className:"fas fa-user-plus"})," ",i?"Register Student (QR)":"Register Student"]})})]})]})}function g({student:e,onAttendanceClick:t,onUpdateClick:s,showActions:a=!0}){return r.jsx("div",{className:"card p-6 hover:shadow-lg transition-all duration-200",children:(0,r.jsxs)("div",{className:"flex gap-6",children:[r.jsx("div",{className:"flex-shrink-0",children:e.photoUrl?r.jsx("img",{src:e.photoUrl,alt:e.name,className:"w-24 h-24 rounded-full object-cover border-4 border-primary/20"}):r.jsx("div",{className:"w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200",children:r.jsx("i",{className:"fas fa-user text-gray-400 text-2xl"})})}),(0,r.jsxs)("div",{className:"flex-1 space-y-2",children:[(0,r.jsxs)("div",{children:[r.jsx("h3",{className:"text-xl font-semibold text-midnight_text",children:e.name}),(0,r.jsxs)("div",{className:"flex items-center gap-4 text-sm text-grey mt-1",children:[(0,r.jsxs)("span",{className:"flex items-center gap-1",children:[r.jsx("i",{className:"fas fa-id-badge text-primary"}),"Roll: ",e.rollNumber]}),(0,r.jsxs)("span",{className:"flex items-center gap-1",children:[r.jsx("i",{className:"fas fa-graduation-cap text-primary"}),e.class]}),(0,r.jsxs)("span",{className:"flex items-center gap-1",children:[r.jsx("i",{className:"fas fa-birthday-cake text-primary"}),e.age," years"]})]})]}),(e.parentPhone||e.parentEmail)&&(0,r.jsxs)("div",{className:"space-y-1",children:[r.jsx("h4",{className:"text-sm font-medium text-midnight_text",children:"Parent Contact:"}),(0,r.jsxs)("div",{className:"flex flex-wrap gap-3 text-sm text-grey",children:[e.parentPhone&&(0,r.jsxs)("span",{className:"flex items-center gap-1",children:[r.jsx("i",{className:"fas fa-phone text-success"}),e.parentPhone]}),e.parentEmail&&(0,r.jsxs)("span",{className:"flex items-center gap-1",children:[r.jsx("i",{className:"fas fa-envelope text-success"}),e.parentEmail]})]})]}),(0,r.jsxs)("div",{className:"flex items-center gap-4 text-xs text-grey pt-2 border-t border-gray-100",children:[(0,r.jsxs)("span",{className:"flex items-center gap-1",children:[r.jsx("i",{className:"fas fa-user-shield"}),"Registered by ",e.registeredBy]}),(0,r.jsxs)("span",{className:"flex items-center gap-1",children:[r.jsx("i",{className:"fas fa-calendar"}),e.createdAt.toLocaleDateString()]})]}),a&&(0,r.jsxs)("div",{className:"flex gap-3 pt-3",children:[(0,r.jsxs)("button",{onClick:t,className:"btn btn-sm bg-success text-white hover:bg-success/90",children:[r.jsx("i",{className:"fas fa-check-circle"}),"Mark Attendance"]}),(0,r.jsxs)("button",{onClick:s,className:"btn btn-sm btn-outline",children:[r.jsx("i",{className:"fas fa-edit"}),"Update Info"]})]})]}),r.jsx("div",{className:"flex-shrink-0 text-center",children:e.qrCode?(0,r.jsxs)("div",{className:"space-y-2",children:[r.jsx("img",{src:e.qrCode,alt:"Student QR Code",className:"w-20 h-20 border border-gray-200 rounded-lg"}),r.jsx("p",{className:"text-xs text-grey",children:"Digital ID"}),(0,r.jsxs)("button",{className:"text-xs text-primary hover:underline",children:[r.jsx("i",{className:"fas fa-external-link-alt"}),"View ID Card"]})]}):(0,r.jsxs)("div",{className:"w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center",children:[r.jsx("i",{className:"fas fa-qrcode text-gray-300 text-lg"}),r.jsx("p",{className:"text-xs text-grey mt-1",children:"No QR Code"}),r.jsx("p",{className:"text-xs text-grey",children:"(Teacher reg.)"})]})})]})})}var h=s(64685);function b(){return r.jsx(h.Z,{allowed:["teacher","admin"],children:r.jsx(y,{})})}function y(){let{user:e}=(0,n.a)(),[t,s]=(0,a.useState)("overview"),[o,d]=(0,a.useState)([]),[c,m]=(0,a.useState)(""),[x,p]=(0,a.useState)(""),[h,b]=(0,a.useState)(!1),y=async(e=!1)=>{b(t=>!e||t);try{let e=[];e=(e="students"===t?c.trim()?await (0,l.b0)(c.trim()):x?await (0,l._8)(x):await (0,l.b0)(""):await (0,l.b0)("")).map(e=>({...e,name:e.name||[e.firstName,e.lastName].filter(Boolean).join(" ").trim()||e.rollNumber})),d(e)}catch(t){console.error("Error fetching students:",t),e||u.ZP.error("Failed to load students")}finally{b(!1)}},j=async t=>{try{let s=new Date().toISOString().split("T")[0];await (0,l.YF)(t.id,s,"present",e?.uid||""),u.ZP.success(`Marked ${t.name} as present`)}catch(e){console.error("Error marking attendance:",e),u.ZP.error("Failed to mark attendance")}},v=e=>{console.log("Update student:",e)};return r.jsx("div",{className:"min-h-screen bg-slateGray py-8",children:(0,r.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[(0,r.jsxs)("div",{className:"mb-8",children:[r.jsx("h1",{className:"text-3xl font-bold text-midnight_text",children:"Teacher Dashboard"}),(0,r.jsxs)("p",{className:"text-grey mt-2",children:["Welcome back, ",e?.email]})]}),r.jsx("div",{className:"bg-white rounded-lg shadow-sm border border-gray-200 mb-8",children:r.jsx("nav",{className:"flex space-x-8 px-6",children:[{id:"overview",label:"Overview",icon:"fas fa-tachometer-alt"},{id:"register",label:"Register Student",icon:"fas fa-user-plus"},{id:"students",label:"Students",icon:"fas fa-users"},{id:"attendance",label:"Attendance",icon:"fas fa-check-circle"}].map(e=>(0,r.jsxs)("button",{onClick:()=>s(e.id),className:`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${t===e.id?"border-primary text-primary":"border-transparent text-grey hover:text-midnight_text hover:border-gray-300"}`,children:[r.jsx("i",{className:e.icon}),e.label]},e.id))})}),"overview"===t&&(0,r.jsxs)("div",{className:"grid md:grid-cols-2 lg:grid-cols-3 gap-6",children:[r.jsx("div",{className:"card p-6",children:(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("div",{children:[r.jsx("p",{className:"text-sm font-medium text-grey",children:"Total Students"}),r.jsx("p",{className:"text-2xl font-bold text-midnight_text",children:o.length})]}),r.jsx("div",{className:"w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center",children:r.jsx("i",{className:"fas fa-users text-primary text-xl"})})]})}),r.jsx("div",{className:"card p-6",children:(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("div",{children:[r.jsx("p",{className:"text-sm font-medium text-grey",children:"Present Today"}),r.jsx("p",{className:"text-2xl font-bold text-midnight_text",children:"--"})]}),r.jsx("div",{className:"w-12 h-12 bg-success/10 rounded-full flex items-center justify-center",children:r.jsx("i",{className:"fas fa-check-circle text-success text-xl"})})]})}),r.jsx("div",{className:"card p-6",children:(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("div",{children:[r.jsx("p",{className:"text-sm font-medium text-grey",children:"QR Students"}),r.jsx("p",{className:"text-2xl font-bold text-midnight_text",children:o.filter(e=>e.qrCode).length})]}),r.jsx("div",{className:"w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center",children:r.jsx("i",{className:"fas fa-qrcode text-secondary text-xl"})})]})})]}),"register"===t&&r.jsx(f,{onStudentRegistered:e=>{d(t=>[e,...t]),s("students")}}),"students"===t&&(0,r.jsxs)("div",{className:"space-y-6",children:[r.jsx("div",{className:"card p-4",children:(0,r.jsxs)("div",{className:"flex flex-wrap gap-4",children:[r.jsx("div",{className:"flex-1 min-w-64",children:(0,r.jsxs)("div",{className:"relative",children:[r.jsx("input",{type:"text",placeholder:"Search students by name or roll number...",value:c,onChange:e=>m(e.target.value),className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"}),r.jsx("i",{className:"fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-grey"})]})}),(0,r.jsxs)("select",{value:x,onChange:e=>p(e.target.value),className:"px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary",children:[r.jsx("option",{value:"",children:"All Classes"}),["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Form 1","Form 2","Form 3"].map(e=>r.jsx("option",{value:e,children:e},e))]}),r.jsx("button",{onClick:()=>y(),disabled:h,className:"btn btn-primary",children:h?(0,r.jsxs)(r.Fragment,{children:[r.jsx("i",{className:"fas fa-spinner fa-spin"}),"Loading..."]}):(0,r.jsxs)(r.Fragment,{children:[r.jsx("i",{className:"fas fa-refresh"}),"Refresh"]})})]})}),r.jsx("div",{className:"flex justify-end",children:r.jsx(i.default,{href:"/teacher/students",className:"text-sm text-primary hover:underline font-medium",children:"Go to full management view →"})}),h?(0,r.jsxs)("div",{className:"card p-8 text-center",children:[r.jsx("i",{className:"fas fa-spinner fa-spin text-primary text-2xl mb-4"}),r.jsx("p",{className:"text-grey",children:"Loading students..."})]}):0===o.length?(0,r.jsxs)("div",{className:"card p-8 text-center",children:[r.jsx("i",{className:"fas fa-users text-grey text-3xl mb-4"}),r.jsx("h3",{className:"text-lg font-semibold text-midnight_text mb-2",children:"No Students Found"}),r.jsx("p",{className:"text-grey mb-4",children:c||x?"No students match your current filters.":"Get started by registering your first student."}),(0,r.jsxs)("button",{onClick:()=>s("register"),className:"btn btn-primary",children:[r.jsx("i",{className:"fas fa-user-plus"}),"Register Student"]})]}):r.jsx("div",{className:"space-y-4",children:o.map(e=>r.jsx(g,{student:e,onAttendanceClick:()=>j(e),onUpdateClick:()=>v(e),showActions:!0},e.id))})]}),"attendance"===t&&(0,r.jsxs)("div",{className:"card p-6 space-y-4",children:[r.jsx("h2",{className:"text-xl font-semibold text-midnight_text",children:"Attendance Management"}),r.jsx("p",{className:"text-grey text-sm",children:"Use the dedicated attendance page for a monthly matrix and CSV export."}),(0,r.jsxs)(i.default,{href:"/teacher/attendance",className:"btn btn-primary w-fit text-sm",children:[r.jsx("i",{className:"fas fa-table"})," Open Attendance Page"]})]})]})})}},64685:(e,t,s)=>{"use strict";s.d(t,{Z:()=>n});var r=s(10326);s(17577);var a=s(35047),i=s(94001);function n({allowed:e,children:t}){let{loading:s,roleInfo:n,isOverrideAdmin:l}=(0,i.a)();(0,a.useRouter)();let o=n?.role||(l?"admin":null);return s?r.jsx("p",{className:"text-center py-10 text-white/80",children:"Loading..."}):o&&e.includes(o)?r.jsx(r.Fragment,{children:t}):null}},12973:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>n,__esModule:()=>i,default:()=>l});var r=s(68570);let a=(0,r.createProxy)(String.raw`C:\Users\DELL\Documents\E-learning-1.0.0\portal-app\src\app\teacher\page.tsx`),{__esModule:i,$$typeof:n}=a;a.default;let l=(0,r.createProxy)(String.raw`C:\Users\DELL\Documents\E-learning-1.0.0\portal-app\src\app\teacher\page.tsx#default`)},40381:(e,t,s)=>{"use strict";s.d(t,{ZP:()=>Q});var r,a=s(17577);let i={data:""},n=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||i,l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,c=(e,t)=>{let s="",r="",a="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+n+";":r+="f"==i[1]?c(n,i):i+"{"+c(n,"k"==i[1]?"":t)+"}":"object"==typeof n?r+=c(n,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=c.p?c.p(i,n):i+":"+n+";")}return s+(t&&a?t+"{"+a+"}":a)+r},m={},x=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+x(e[s]);return t}return e},p=(e,t,s,r,a)=>{let i=x(e),n=m[i]||(m[i]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(i));if(!m[n]){let t=i!==e?e:(e=>{let t,s,r=[{}];for(;t=l.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(s=t[3].replace(d," ").trim(),r.unshift(r[0][s]=r[0][s]||{})):r[0][t[1]]=t[2].replace(d," ").trim();return r[0]})(e);m[n]=c(a?{["@keyframes "+n]:t}:t,s?"":"."+n)}let p=s&&m.g?m.g:null;return s&&(m.g=m[n]),((e,t,s,r)=>{r?t.data=t.data.replace(r,e):-1===t.data.indexOf(e)&&(t.data=s?e+t.data:t.data+e)})(m[n],t,r,p),n},u=(e,t,s)=>e.reduce((e,r,a)=>{let i=t[a];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"");function f(e){let t=this||{},s=e.call?e(t.p):e;return p(s.unshift?s.raw?u(s,[].slice.call(arguments,1),t.p):s.reduce((e,s)=>Object.assign(e,s&&s.call?s(t.p):s),{}):s,n(t.target),t.g,t.o,t.k)}f.bind({g:1});let g,h,b,y=f.bind({k:1});function j(e,t){let s=this||{};return function(){let r=arguments;function a(i,n){let l=Object.assign({},i),o=l.className||a.className;s.p=Object.assign({theme:h&&h()},l),s.o=/ *go\d+/.test(o),l.className=f.apply(s,r)+(o?" "+o:""),t&&(l.ref=n);let d=e;return e[0]&&(d=l.as||e,delete l.as),b&&d[0]&&b(l),g(d,l)}return t?t(a):a}}var v=e=>"function"==typeof e,N=(e,t)=>v(e)?e(t):e,w=(()=>{let e=0;return()=>(++e).toString()})(),P=((()=>{let e;return()=>e})(),"default"),C=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return C(e,{type:e.toasts.find(e=>e.id===r.id)?1:0,toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},k=[],S={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},q={},E=(e,t=P)=>{q[t]=C(q[t]||S,e),k.forEach(([e,s])=>{e===t&&s(q[t])})},_=e=>Object.keys(q).forEach(t=>E(e,t)),D=e=>Object.keys(q).find(t=>q[t].toasts.some(t=>t.id===e)),A=(e=P)=>t=>{E(t,e)},$={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},R=(e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||w()}),L=e=>(t,s)=>{let r=R(t,e,s);return A(r.toasterId||D(r.id))({type:2,toast:r}),r.id},Z=(e,t)=>L("blank")(e,t);Z.error=L("error"),Z.success=L("success"),Z.loading=L("loading"),Z.custom=L("custom"),Z.dismiss=(e,t)=>{let s={type:3,toastId:e};t?A(t)(s):_(s)},Z.dismissAll=e=>Z.dismiss(void 0,e),Z.remove=(e,t)=>{let s={type:4,toastId:e};t?A(t)(s):_(s)},Z.removeAll=e=>Z.remove(void 0,e),Z.promise=(e,t,s)=>{let r=Z.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?N(t.success,e):void 0;return a?Z.success(a,{id:r,...s,...null==s?void 0:s.success}):Z.dismiss(r),e}).catch(e=>{let a=t.error?N(t.error,e):void 0;a?Z.error(a,{id:r,...s,...null==s?void 0:s.error}):Z.dismiss(r)}),e};var F=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,U=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,I=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,G=(j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${U} 0.15s ease-out forwards;
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
    animation: ${I} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`),O=(j("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${G} 1s linear infinite;
`,y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`),T=y`
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
}`,M=(j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${T} 0.2s ease-out forwards;
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
`,j("div")`
  position: absolute;
`,j("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`);j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${M} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,j("div")`
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
`,j("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,r=a.createElement,c.p=void 0,g=r,h=void 0,b=void 0,f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var Q=Z}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[948,307,31,434,60],()=>s(1687));module.exports=r})();