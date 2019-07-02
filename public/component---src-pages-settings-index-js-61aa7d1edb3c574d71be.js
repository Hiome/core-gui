(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{182:function(e,t,a){"use strict";a.r(t);var n=a(7),r=a.n(n),o=a(186),i=a(0),c=a.n(i),s=a(190),l=a(188),p=(a(198),function(e){function t(){return e.apply(this,arguments)||this}return r()(t,e),t.prototype.render=function(){return c.a.createElement(s.a,{goBack:!0},c.a.createElement(l.a,{title:"Settings"}),c.a.createElement("div",{className:"headline"},c.a.createElement("h1",null,"Settings")),c.a.createElement("div",{className:"page"},c.a.createElement(o.a,{to:"/settings/rooms",className:"settingsRow"},"Manage Rooms"),c.a.createElement(o.a,{to:"/settings/devices",className:"settingsRow"},"Manage Devices")),c.a.createElement("footer",null,"© Hiome Inc 2019"))},t}(i.Component));t.default=p},185:function(e,t,a){var n;e.exports=(n=a(187))&&n.default||n},186:function(e,t,a){"use strict";var n=a(0),r=a.n(n),o=a(11),i=a.n(o),c=a(57),s=a.n(c);a.d(t,"a",function(){return s.a});a(185),r.a.createContext({});i.a.object,i.a.string.isRequired,i.a.func,i.a.func},187:function(e,t,a){"use strict";a.r(t);a(16);var n=a(0),r=a.n(n),o=a(11),i=a.n(o),c=a(83),s=function(e){var t=e.location,a=e.pageResources;return a?r.a.createElement(c.a,Object.assign({location:t,pageResources:a},a.json)):null};s.propTypes={location:i.a.shape({pathname:i.a.string.isRequired}).isRequired},t.default=s},188:function(e,t,a){"use strict";var n=a(189),r=a(0),o=a.n(r),i=a(11),c=a.n(i),s=a(196),l=a.n(s);function p(e){var t=e.description,a=e.lang,r=e.meta,i=e.keywords,c=e.title,s=n.data.site,p=t||s.siteMetadata.description;return o.a.createElement(l.a,{htmlAttributes:{lang:a},title:c,titleTemplate:"%s | "+s.siteMetadata.title,meta:[{name:"description",content:p},{property:"og:title",content:c},{property:"og:description",content:p},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:s.siteMetadata.author},{name:"twitter:title",content:c},{name:"twitter:description",content:p}].concat(i.length>0?{name:"keywords",content:i.join(", ")}:[]).concat(r)})}p.defaultProps={lang:"en",meta:[],keywords:[],description:""},p.propTypes={description:c.a.string,lang:c.a.string,meta:c.a.arrayOf(c.a.object),keywords:c.a.arrayOf(c.a.string),title:c.a.string.isRequired},t.a=p},189:function(e){e.exports={data:{site:{siteMetadata:{title:"Hiome",description:"Your home's personal dashboard.",author:"Hiome Inc"}}}}},190:function(e,t,a){"use strict";var n=a(0),r=a.n(n),o=a(11),i=a.n(o),c=a(7),s=a.n(c),l=a(186),p=(a(194),function(e){function t(){return e.apply(this,arguments)||this}s()(t,e);var a=t.prototype;return a.goBack=function(e){return e.preventDefault(),window.history.go(-1),!1},a.renderGoBack=function(){if(this.props.goBack)return r.a.createElement(l.a,{to:"/",onClick:this.goBack,id:"goBack",title:"Back to Dashboard",style:{float:"left",padding:"1.45rem 1rem 0.5rem 1rem"}},r.a.createElement("svg",{width:"50",height:"40",xmlns:"http://www.w3.org/2000/svg",version:"1.1",x:"0px",y:"0px",viewBox:"0 0 100 125"},r.a.createElement("g",{fill:"#cbb9ec"},r.a.createElement("path",{d:"M 31.9375 20.96875 A 2.0001996 2.0001996 0 0 0 30.5625 21.59375 L 4.5625 48.59375 A 2.0001996 2.0001996 0 0 0 4.5625 51.375 L 30.5625 78.375 A 2.0001996 2.0001996 0 1 0 33.4375 75.59375 L 10.71875 52 L 94 52 A 2.0001996 2.0001996 0 1 0 94 48 L 10.71875 48 L 33.4375 24.375 A 2.0001996 2.0001996 0 0 0 31.9375 20.96875 z "}))))},a.render=function(){return r.a.createElement("header",{style:{marginBottom:"1.45rem"}},this.renderGoBack(),r.a.createElement("div",{style:{margin:"0 auto",maxWidth:200,padding:"1.45rem 0",textAlign:"center"}},r.a.createElement(l.a,{to:"/",style:{color:"white",textDecoration:"none",padding:"20px"}},r.a.createElement("svg",{id:"headerlogo",width:"25px",height:"42px",version:"1.1",viewBox:"0 0 34 57",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink"},r.a.createElement("g",{fill:"#cbb9ec"},r.a.createElement("path",{id:"marka",d:"m23.656 38v19h-2.1738v-9.4473h-8.5449v9.4473h-2.1738v-19h-9.9547v-2.544h8.162v-0.159c-0.98934-0.848-1.9257-1.8462-2.809-2.9945s-1.6695-2.4292-2.3585-3.8425c-0.689-1.4133-1.2367-2.9503-1.643-4.611-0.40634-1.6607-0.6095-3.445-0.6095-5.353 0-2.6853 0.40633-5.1233 1.219-7.314 0.81267-2.1907 1.9345-4.0633 3.3655-5.618 1.431-1.5547 3.1093-2.756 5.035-3.604s4.0015-1.272 6.2275-1.272c2.332 0 4.4432 0.46816 6.3335 1.4045s3.5157 2.2083 4.876 3.816c1.3603 1.6077 2.4115 3.4803 3.1535 5.618 0.742 2.1377 1.113 4.3902 1.113 6.7575 0 1.9787-0.22083 3.8425-0.6625 5.5915s-1.0158 3.3478-1.7225 4.7965-1.5105 2.7295-2.4115 3.8425-1.8108 2.0405-2.7295 2.7825v0.159h8.268v2.544h-9.9598zm-2.1738 0h-0.21542v-1.855c1.06-0.70667 2.1023-1.6077 3.127-2.703s1.9345-2.3762 2.7295-3.8425 1.4398-3.1093 1.9345-4.929 0.742-3.7895 0.742-5.9095c0-1.7313-0.265-3.5157-0.795-5.353-0.53-1.8373-1.3162-3.5068-2.3585-5.0085-1.0423-1.5017-2.3408-2.7295-3.8955-3.6835s-3.3567-1.431-5.406-1.431c-1.9433 0-3.7012 0.40633-5.2735 1.219s-2.9062 1.9257-4.0015 3.339-1.9433 3.0652-2.544 4.9555-0.901 3.9132-0.901 6.0685c0 1.9787 0.24733 3.869 0.742 5.671s1.1395 3.445 1.9345 4.929c0.795 1.484 1.7048 2.8002 2.7295 3.9485 1.0247 1.1483 2.067 2.0582 3.127 2.7295v1.855h-0.2205v7.1875h8.5449v-7.1875z"}))))))},t}(n.Component));p.propTypes={goBack:i.a.bool},p.defaultProps={goBack:!1};var m=p,d=(a(195),function(e){var t=e.children,a=e.goBack;return r.a.createElement(r.a.Fragment,null,r.a.createElement(m,{goBack:a}),r.a.createElement("div",{style:{margin:"0 auto",padding:"0px 0px 1.45rem"}},r.a.createElement("main",null,t)))});d.propTypes={children:i.a.node.isRequired,goBack:i.a.bool},d.defaultProps={goBack:!1};t.a=d}}]);
//# sourceMappingURL=component---src-pages-settings-index-js-61aa7d1edb3c574d71be.js.map