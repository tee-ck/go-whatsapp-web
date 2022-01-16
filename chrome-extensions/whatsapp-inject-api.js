(()=>{var $=Object.create;var g=Object.defineProperty;var J=Object.getOwnPropertyDescriptor;var Q=Object.getOwnPropertyNames;var Y=Object.getPrototypeOf,z=Object.prototype.hasOwnProperty;var ee=r=>g(r,"__esModule",{value:!0});var te=(r,t)=>()=>(t||r((t={exports:{}}).exports,t),t.exports),I=(r,t)=>{for(var n in t)g(r,n,{get:t[n],enumerable:!0})},ne=(r,t,n,e)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Q(t))!z.call(r,s)&&(n||s!=="default")&&g(r,s,{get:()=>t[s],enumerable:!(e=J(t,s))||e.enumerable});return r},re=(r,t)=>ne(ee(g(r!=null?$(Y(r)):{},"default",!t&&r&&r.__esModule?{get:()=>r.default,enumerable:!0}:{value:r,enumerable:!0})),r);var q=te((_e,b)=>{"use strict";var h=typeof Reflect=="object"?Reflect:null,A=h&&typeof h.apply=="function"?h.apply:function(t,n,e){return Function.prototype.apply.call(t,n,e)},E;h&&typeof h.ownKeys=="function"?E=h.ownKeys:Object.getOwnPropertySymbols?E=function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:E=function(t){return Object.getOwnPropertyNames(t)};function se(r){console&&console.warn&&console.warn(r)}var S=Number.isNaN||function(t){return t!==t};function u(){u.init.call(this)}b.exports=u;b.exports.once=ue;u.EventEmitter=u;u.prototype._events=void 0;u.prototype._eventsCount=0;u.prototype._maxListeners=void 0;var P=10;function _(r){if(typeof r!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof r)}Object.defineProperty(u,"defaultMaxListeners",{enumerable:!0,get:function(){return P},set:function(r){if(typeof r!="number"||r<0||S(r))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+r+".");P=r}});u.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};u.prototype.setMaxListeners=function(t){if(typeof t!="number"||t<0||S(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this};function D(r){return r._maxListeners===void 0?u.defaultMaxListeners:r._maxListeners}u.prototype.getMaxListeners=function(){return D(this)};u.prototype.emit=function(t){for(var n=[],e=1;e<arguments.length;e++)n.push(arguments[e]);var s=t==="error",i=this._events;if(i!==void 0)s=s&&i.error===void 0;else if(!s)return!1;if(s){var o;if(n.length>0&&(o=n[0]),o instanceof Error)throw o;var c=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw c.context=o,c}var f=i[t];if(f===void 0)return!1;if(typeof f=="function")A(f,this,n);else for(var p=f.length,V=W(f,p),e=0;e<p;++e)A(V[e],this,n);return!0};function x(r,t,n,e){var s,i,o;if(_(n),i=r._events,i===void 0?(i=r._events=Object.create(null),r._eventsCount=0):(i.newListener!==void 0&&(r.emit("newListener",t,n.listener?n.listener:n),i=r._events),o=i[t]),o===void 0)o=i[t]=n,++r._eventsCount;else if(typeof o=="function"?o=i[t]=e?[n,o]:[o,n]:e?o.unshift(n):o.push(n),s=D(r),s>0&&o.length>s&&!o.warned){o.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=r,c.type=t,c.count=o.length,se(c)}return r}u.prototype.addListener=function(t,n){return x(this,t,n,!1)};u.prototype.on=u.prototype.addListener;u.prototype.prependListener=function(t,n){return x(this,t,n,!0)};function ie(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function M(r,t,n){var e={fired:!1,wrapFn:void 0,target:r,type:t,listener:n},s=ie.bind(e);return s.listener=n,e.wrapFn=s,s}u.prototype.once=function(t,n){return _(n),this.on(t,M(this,t,n)),this};u.prototype.prependOnceListener=function(t,n){return _(n),this.prependListener(t,M(this,t,n)),this};u.prototype.removeListener=function(t,n){var e,s,i,o,c;if(_(n),s=this._events,s===void 0)return this;if(e=s[t],e===void 0)return this;if(e===n||e.listener===n)--this._eventsCount===0?this._events=Object.create(null):(delete s[t],s.removeListener&&this.emit("removeListener",t,e.listener||n));else if(typeof e!="function"){for(i=-1,o=e.length-1;o>=0;o--)if(e[o]===n||e[o].listener===n){c=e[o].listener,i=o;break}if(i<0)return this;i===0?e.shift():oe(e,i),e.length===1&&(s[t]=e[0]),s.removeListener!==void 0&&this.emit("removeListener",t,c||n)}return this};u.prototype.off=u.prototype.removeListener;u.prototype.removeAllListeners=function(t){var n,e,s;if(e=this._events,e===void 0)return this;if(e.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):e[t]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete e[t]),this;if(arguments.length===0){var i=Object.keys(e),o;for(s=0;s<i.length;++s)o=i[s],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(n=e[t],typeof n=="function")this.removeListener(t,n);else if(n!==void 0)for(s=n.length-1;s>=0;s--)this.removeListener(t,n[s]);return this};function R(r,t,n){var e=r._events;if(e===void 0)return[];var s=e[t];return s===void 0?[]:typeof s=="function"?n?[s.listener||s]:[s]:n?ae(s):W(s,s.length)}u.prototype.listeners=function(t){return R(this,t,!0)};u.prototype.rawListeners=function(t){return R(this,t,!1)};u.listenerCount=function(r,t){return typeof r.listenerCount=="function"?r.listenerCount(t):U.call(r,t)};u.prototype.listenerCount=U;function U(r){var t=this._events;if(t!==void 0){var n=t[r];if(typeof n=="function")return 1;if(n!==void 0)return n.length}return 0}u.prototype.eventNames=function(){return this._eventsCount>0?E(this._events):[]};function W(r,t){for(var n=new Array(t),e=0;e<t;++e)n[e]=r[e];return n}function oe(r,t){for(;t+1<r.length;t++)r[t]=r[t+1];r.pop()}function ae(r){for(var t=new Array(r.length),n=0;n<t.length;++n)t[n]=r[n].listener||r[n];return t}function ue(r,t){return new Promise(function(n,e){function s(o){r.removeListener(t,i),e(o)}function i(){typeof r.removeListener=="function"&&r.removeListener("error",s),n([].slice.call(arguments))}k(r,t,i,{once:!0}),t!=="error"&&le(r,s,{once:!0})})}function le(r,t,n){typeof r.on=="function"&&k(r,"error",t,n)}function k(r,t,n,e){if(typeof r.on=="function")e.once?r.once(t,n):r.on(t,n);else if(typeof r.addEventListener=="function")r.addEventListener(t,function s(i){e.once&&r.removeEventListener(t,s),n(i)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof r)}});var K=re(q(),1);var m={};I(m,{get_qr:()=>he,is_beta:()=>C,is_chat_page:()=>de,is_landing_page:()=>pe,is_loading:()=>B,refresh_qr:()=>F,until_loaded:()=>T});var v={};I(v,{base64_to_file:()=>N,blob_to_base64:()=>fe,response:()=>a,sleep:()=>y,timeout:()=>ce});function a(r,t,n,e){return{status:r,flag:t,message:n,data:e}}async function y(r,t){await new Promise(n=>setTimeout(()=>n(t),r))}async function ce(r){throw await setTimeout(null,r),new Error("")}async function N(r,t,n){let e=window.atob(t),s=new Uint8Array(e.length);for(let i=0,o=e.length;i<o;i++)s[i]=e.charCodeAt(i);return new File([s],n||`${new Date().getTime()}.${r}`,{type:r})}async function fe(r){let t=new FileReader;return new Promise(n=>{t.onload=()=>n(t.result.toString()),t.readAsDataURL(r)})}var l={UNEXPECTED:"UNEXPECTED_ERROR",INVALID_PHONE:"INVALID_PHONE",CONNECTION_LOST:"CONNECTION_LOST",UNAUTHORIZED:"UNAUTHORIZED",PAGE_LOAD_FAILED:"PAGE_LOAD_FAILED",ZERO_OBJECT_SIZE:"ZERO_OBJECT_SIZE",REQUEST_TIMEOUT:"REQUEST_TIMEOUT"};var O={CONNECTED:"CONNECTED",DISCONNECTED:"DISCONNECTED",RESUMING:"RESUMING",SYNCING:"SYNCING"};function C(){return!!document.evaluate('//*[text()="BETA"]',document,null,XPathResult.ANY_TYPE,null).iterateNext()}function B(){return!!document.querySelector("progress")||!!document.querySelector("#initial_startup")||!!document.querySelector("#startup")}async function T(r=100,t=3e4){let n=new Date().getTime();for(;;){if(!B())return;if(t>0&&new Date().getTime()-n>t)return a(400,l.PAGE_LOAD_FAILED);await y(r)}}function pe(){return!!document.querySelector(".landing-wrapper")}function de(){return!!document.querySelector("#pane-side")}function he(){return F(),document.querySelector("div[data-ref]")?.getAttribute("data-ref")}function F(){let r=document.querySelector("div[data-ref]")?.querySelector("button");r&&r.click()}async function L(){let r=await ye();return me(r)}function ye(){return new Promise(r=>{let t=new Date().getTime();window.webpackChunkwhatsapp_web_client.push([[`parasite ${t}`],{},(n,e,s)=>{let i=[];for(let o in n.m){let c=n(o);i.push(c)}r(i)}])})}function me(r){let t={},n={GK:e=>e.FEATURE_CHANGE_EVENT?e:null,Store:e=>e?.default?.Chat&&e?.default?.Msg?e.default:null,MediaCollection:e=>e?.default?.prototype?.processAttachments?e.default:null,MediaProcess:e=>e?.BLOB?e:null,Wap:e=>e?.createGroup?e:null,ServiceWorker:e=>e?.default?.killServiceWorker?e.default:null,WapDelete:e=>e?.sendCoversationDelete&&e?.SendConcersationDelete?.length>2?e:null,Conn:e=>e?.default?.ref&&e?.default?.refTTL?e:null,WapQuery:e=>e?.queryExist?e:e?.default?.queryExist?e.default:null,CryptoLib:e=>e?.decryptE2EMedia?e:null,OpenChat:e=>e?.default?.prototype?.openChat?e.default.prototype.openChat:null,UserConstructor:e=>e?.default?.prototype?.isServer?e.default:null,SendTextMsgToChat:e=>e?.sendTextMsgToChat?e.sendTextMsgToChat:null,SendMsgToChat:e=>e?.addAndSendMsgToChat?e:null,RandomID:e=>e?.randomId?e.randomId:null,MsgKey:e=>e?.default?.fromString?e.default:null,SendSeen:e=>e?.sendSeen?e:null,SendClear:e=>e?.sendClear?e:null,SendDelete:e=>e?.sendDelete?e:null,SendJoinGroupViaInvite:e=>e?.sendJoinGroupViaInvite?e:null,MediaPrep:e=>e?.MediaPrep?e:null,MediaObject:e=>e?.getOrCreateMediaObject?e:null,MediaUpload:e=>e?.uploadMedia?e:null,NumberInfo:e=>e?.formattedPhoneNumber?e:null,USyncUser:e=>e?.USyncUser?e.USyncUser:null,USyncQuery:e=>e?.USyncQuery?e.USyncQuery:null,Cmd:e=>e?.Cmd?e:null,MediaTypes:e=>e?.msgToMediaType?e:null,Validators:e=>e?.findLinks?e:null,WidFactory:e=>e?.createWid?e:null,BlockContact:e=>e?.blockContact?e:null,GroupMetadata:e=>e?.default?.handlePendingInvite?e.default:null,Sticker:e=>e?.default?.Sticker?e:null,UploadUtils:e=>e?.default?.encryptAndUpload?e.default:null,Label:e=>e?.LabelCollection?e:null,VCard:e=>e?.vcardFromContactModel?e:null,AppConst:e=>e?.default?.ACK?e.default:null,AppState:e=>e?.STREAM?e:null};for(let e of r)if(!(typeof e!="object"||!e)){if(!Object.keys(n).length)break;Object.entries(n).map(([s,i])=>{let o=i(e);o&&(t[s]=o,delete n[s])})}return t}var j=class{core=null;is_connected=!1;on_initiated;constructor(){console.log("initializing"),this.core?this.on_initiated&&this.on_initiated():T(100).then(this.on_initiated).catch(()=>{}),this.init().then()}async init(){this.core=await L(),this.core.AppState.Socket.on("change:state",async t=>{console.log(`state changed: ${t.state}`)}),this.core.AppState.Socket.on("change:stream",async t=>{switch(console.log(`stream changed: ${t.stream}`),t.stream){case O.CONNECTED:this.is_connected=!0,this.core=await L();break;case O.DISCONNECTED:this.is_connected=!1;break;default:break}})}is_beta(){return!!this.core?.Features?.GK?.features?.MD_BACKEND}async query_user(t){try{if(this.is_beta()||C()){let n=new this.core.USyncQuery().withContactProtocol();n=n.withUser(new this.core.USyncUser().withPhone("+"+t));let e=await n.execute();if(console.log(e),e.list[0].id)switch(e.list[0].contact.type){case"in":return a(200,"","[query user success]",e.list[0].id);case"out":return a(404,l.INVALID_PHONE,`[query user error][invalid phone]: ${t}`);default:break}return a(500,l.UNEXPECTED,"[query user error]")}else{let n=await this.core.WapQuery.queryExists(t+"@c.us");switch(n.status){case 200:return a(200,"","[query user success]",n.jid);case 404:return a(404,l.INVALID_PHONE,`[query user error][invalid phone]: ${t}`);default:return a(500,l.UNEXPECTED,`[query user error][invalid status]: ${n.status}`)}}}catch(n){return console.error(n),a(500,l.UNEXPECTED,"[query user error][unknown error]")}}async query_chat(t){let n,e,s;if(typeof t=="string"){if(n=this.core.Store.Chat.models.find(i=>i.id.user===t),!n){if(C())try{s=this.core.WidFactory.createUserWid(t)}catch(i){return console.error(i),[a(500,l.UNEXPECTED,"[query chat error][create user wid error]")]}else{let i=await this.query_user(t);switch(i.status){case 200:s=i.data;break;case 400:return[a(400,l.INVALID_PHONE,`[query chat error][invalid phone format]: ${t}`)];case 404:return[a(404,l.INVALID_PHONE,`[query chat error][invalid phone]: ${t}`)]}}s&&(n=this.core.Store.Chat.models[0],e=n.id,n.id=s)}}else n=this.core.Store.Chat.models.find(i=>i.id.user===t.user);return[a(200,"","",n),e]}async send_text(t,n){let[e,s]=await this.query_chat(t);if(console.log(this),!n)return a(400,l.ZERO_OBJECT_SIZE,"[send text error][empty message]");try{let i;if(e.status===200)i=e.data;else return e;return await this.core.SendTextMsgToChat(i,n),s&&(i.id=s),a(200,"","[send text success]")}catch(i){return alert(i),a(500,l.UNEXPECTED,"[send text error][unknown error]",i)}}async send_media(t,n,e){let[s,i]=await this.query_chat(t),o=s.data;if(n.length===0)return a(400,l.ZERO_OBJECT_SIZE,"[send media error][empty message]");let c=[...n.map(p=>({file:p})),n.length],f=new this.core.MediaCollection(o);try{if(await f.processAttachments(c,o,1),n.length===1)await f.models[0].sendToChat(o,{caption:e?.caption});else for(let p of f.models)await p.sendToChat(o,{caption:null})}catch(p){return console.error(p),a(500,l.UNEXPECTED,"[send media error][process attachments error]")}return i&&(o.id=i),a(200,"","[send media success]")}async until_connected(t=100,n=1e4){let e=new Date().getTime();for(;new Date().getTime()-e<n;){if(this.is_connected)return;await y(t)}throw new Error}},G=new j;var d=class{#e;files;constructor(t){this.#e=t,this.files=[]}get kind(){return this.#e.kind}get body(){return this.#e.body}get opts(){return this.#e.opts}static async from(t){let n=new d(t);if(n.opts?.attachments?.length>0)for(let e of n.opts.attachments){let s=await N(e.mimetype,e.body,e.filename);n.files.push(s)}return n}};var w=class{#e;constructor(t){this.#e=t}};var H="1.1.7";var X=class extends K.EventEmitter{#e;#i=H;#n=m;#s;#t;#o;#a;#r;models={Chat:w,Message:d};constructor(){super();this.#n=m,this.#s=v,this.#t=G,this.#r={messages:{}}}get remote(){let[t,n]=JSON.parse(localStorage.getItem("last-wid")||localStorage.getItem("last-wid-md")||'""').split("@");return t.indexOf(":")>=0&&(t=t.split(":")[0]),t}set session_key(t){this.#e=t}get session_key(){return this.#e}get version(){return this.#i}get ui(){return this.#n}get utils(){return this.#s}get api(){return this.#t}get is_connected(){return this.#t.is_connected}get_session(){if(this.#n.is_beta())return a(500,l.UNEXPECTED,"[get_session error][beta not yet support]","");{let{WAToken1:t,WAToken2:n,WABrowserId:e,WASecretBundle:s}=JSON.parse(JSON.stringify(localStorage));return a(200,"","",{WAToken1:t,WAToken2:n,WABrowserId:e,WASecretBundle:s})}}set_session(t){return this.#n.is_beta()?a(500,l.UNEXPECTED,"[set_session error][beta not yet support]"):(indexedDB.deleteDatabase("wawc"),Object.entries(t).forEach(([n,e])=>localStorage.setItem(n,e)),a(200,"",""))}async cache_message(t){let n=await d.from(t),e=`${new Date().getTime()}-${(Math.random()*1e6).toFixed(0)}`;return this.#r.messages[e]=n,e}async fetch_files(){let t=document.createElement("input");return t.type="file",t.click(),await new Promise(n=>{t.oninput=e=>{let s=e.target;n([...s.files])}})}async send_cache_message(t,n){try{let e=this.#r.messages[n];return e?this.send_message(t,e):a(404,"[send_cache_message error]: invalid message cache id")}catch{return a(500,"[send_cache_message error]: send cache message failed")}}async send_message(t,n,e=3e3){console.log(this);try{switch(e&&setTimeout(function(){throw Error("timeout")},e),n.kind){case"text":return await this.#t.send_text(t,n.body);case"media":return await this.#t.send_media(t,n.files,{caption:n.opts.caption});default:return a(400,"invalid message")}}catch{return a(500,"unexpected error")}}},Z=new X;(async()=>window.whatsapp=Z)();})();
