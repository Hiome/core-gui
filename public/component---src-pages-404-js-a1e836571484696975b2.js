(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{144:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(152),i=a(156),c=a(154),s=a(180),l=a.n(s);t.default=function(){return r.a.createElement(i.a,null,r.a.createElement(c.a,{title:"Not Found"}),r.a.createElement("object",{data:l.a,type:"image/svg+xml",style:{display:"block",margin:"10px auto",width:"90%",maxWidth:"372px",height:"275px",top:0}},"Startled"),r.a.createElement("h1",{style:{textAlign:"center",margin:"5%"}},"Well, this is awkward."),r.a.createElement("p",{style:{textAlign:"center",lineHeight:"1.8em"}},"We can't find the page you're looking for.",r.a.createElement("br",null),r.a.createElement(o.a,{to:"/"},"Go to your dashboard")," or ",r.a.createElement(o.a,{to:"mailto:support@hiome.com?subject=Something%20broke",title:"Let us know what you were looking for"},"let us know what happened"),"."))}},151:function(e,t,a){var n;e.exports=(n=a(153))&&n.default||n},152:function(e,t,a){"use strict";var n=a(0),r=a.n(n),o=a(4),i=a.n(o),c=a(33),s=a.n(c);a.d(t,"a",function(){return s.a});a(151),r.a.createContext({});i.a.object,i.a.string.isRequired,i.a.func,i.a.func},153:function(e,t,a){"use strict";a.r(t);a(34);var n=a(0),r=a.n(n),o=a(4),i=a.n(o),c=a(55),s=a(2),l=function(e){var t=e.location,a=s.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(c.a,Object.assign({location:t,pageResources:a},a.json))};l.propTypes={location:i.a.shape({pathname:i.a.string.isRequired}).isRequired},t.default=l},154:function(e,t,a){"use strict";var n=a(155),r=a(0),o=a.n(r),i=a(4),c=a.n(i),s=a(159),l=a.n(s);function p(e){var t=e.description,a=e.lang,r=e.meta,i=e.keywords,c=e.title,s=n.data.site,p=t||s.siteMetadata.description;return o.a.createElement(l.a,{htmlAttributes:{lang:a},title:c,titleTemplate:"%s | "+s.siteMetadata.title,meta:[{name:"description",content:p},{property:"og:title",content:c},{property:"og:description",content:p},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:s.siteMetadata.author},{name:"twitter:title",content:c},{name:"twitter:description",content:p}].concat(i.length>0?{name:"keywords",content:i.join(", ")}:[]).concat(r)})}p.defaultProps={lang:"en",meta:[],keywords:[],description:""},p.propTypes={description:c.a.string,lang:c.a.string,meta:c.a.arrayOf(c.a.object),keywords:c.a.arrayOf(c.a.string),title:c.a.string.isRequired},t.a=p},155:function(e){e.exports={data:{site:{siteMetadata:{title:"Hiome",description:"Your home's personal dashboard.",author:"Hiome Inc"}}}}},156:function(e,t,a){"use strict";var n=a(0),r=a.n(n),o=a(4),i=a.n(o),c=a(7),s=a.n(c),l=a(152),p=(a(157),function(e){function t(){return e.apply(this,arguments)||this}s()(t,e);var a=t.prototype;return a.renderGoBack=function(){if(this.props.goBack)return r.a.createElement(l.a,{to:"/",id:"goBack",title:"Back to Dashboard",style:{float:"left",padding:"1.45rem 1rem 0.5rem 1rem"}},r.a.createElement("svg",{width:"50",height:"40",xmlns:"http://www.w3.org/2000/svg",version:"1.1",x:"0px",y:"0px",viewBox:"0 0 100 125"},r.a.createElement("g",{fill:"#cbb9ec"},r.a.createElement("path",{d:"M 31.9375 20.96875 A 2.0001996 2.0001996 0 0 0 30.5625 21.59375 L 4.5625 48.59375 A 2.0001996 2.0001996 0 0 0 4.5625 51.375 L 30.5625 78.375 A 2.0001996 2.0001996 0 1 0 33.4375 75.59375 L 10.71875 52 L 94 52 A 2.0001996 2.0001996 0 1 0 94 48 L 10.71875 48 L 33.4375 24.375 A 2.0001996 2.0001996 0 0 0 31.9375 20.96875 z "}))))},a.render=function(){return r.a.createElement("header",{style:{marginBottom:"1.45rem"}},this.renderGoBack(),r.a.createElement("div",{style:{margin:"0 auto",maxWidth:200,padding:"1.45rem 0",textAlign:"center"}},r.a.createElement(l.a,{to:"/",style:{color:"white",textDecoration:"none",padding:"20px"}},r.a.createElement("svg",{id:"headerlogo",width:"25px",height:"42px",version:"1.1",viewBox:"0 0 34 57",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink"},r.a.createElement("g",{fill:"#cbb9ec"},r.a.createElement("path",{id:"marka",d:"m23.656 38v19h-2.1738v-9.4473h-8.5449v9.4473h-2.1738v-19h-9.9547v-2.544h8.162v-0.159c-0.98934-0.848-1.9257-1.8462-2.809-2.9945s-1.6695-2.4292-2.3585-3.8425c-0.689-1.4133-1.2367-2.9503-1.643-4.611-0.40634-1.6607-0.6095-3.445-0.6095-5.353 0-2.6853 0.40633-5.1233 1.219-7.314 0.81267-2.1907 1.9345-4.0633 3.3655-5.618 1.431-1.5547 3.1093-2.756 5.035-3.604s4.0015-1.272 6.2275-1.272c2.332 0 4.4432 0.46816 6.3335 1.4045s3.5157 2.2083 4.876 3.816c1.3603 1.6077 2.4115 3.4803 3.1535 5.618 0.742 2.1377 1.113 4.3902 1.113 6.7575 0 1.9787-0.22083 3.8425-0.6625 5.5915s-1.0158 3.3478-1.7225 4.7965-1.5105 2.7295-2.4115 3.8425-1.8108 2.0405-2.7295 2.7825v0.159h8.268v2.544h-9.9598zm-2.1738 0h-0.21542v-1.855c1.06-0.70667 2.1023-1.6077 3.127-2.703s1.9345-2.3762 2.7295-3.8425 1.4398-3.1093 1.9345-4.929 0.742-3.7895 0.742-5.9095c0-1.7313-0.265-3.5157-0.795-5.353-0.53-1.8373-1.3162-3.5068-2.3585-5.0085-1.0423-1.5017-2.3408-2.7295-3.8955-3.6835s-3.3567-1.431-5.406-1.431c-1.9433 0-3.7012 0.40633-5.2735 1.219s-2.9062 1.9257-4.0015 3.339-1.9433 3.0652-2.544 4.9555-0.901 3.9132-0.901 6.0685c0 1.9787 0.24733 3.869 0.742 5.671s1.1395 3.445 1.9345 4.929c0.795 1.484 1.7048 2.8002 2.7295 3.9485 1.0247 1.1483 2.067 2.0582 3.127 2.7295v1.855h-0.2205v7.1875h8.5449v-7.1875z"}))))))},t}(n.Component));p.propTypes={goBack:i.a.bool},p.defaultProps={goBack:!1};var d=p,m=(a(158),function(e){var t=e.children,a=e.goBack;return r.a.createElement(r.a.Fragment,null,r.a.createElement(d,{goBack:a}),r.a.createElement("div",{style:{margin:"0 auto",padding:"0px 0px 1.45rem"}},r.a.createElement("main",null,t)))});m.propTypes={children:i.a.node.isRequired,goBack:i.a.bool},m.defaultProps={goBack:!1};t.a=m},180:function(e,t,a){e.exports=a.p+"static/startled-a4a9bd676a0a80cbb2b8f86a1a557455.svg"}}]);
//# sourceMappingURL=component---src-pages-404-js-a1e836571484696975b2.js.map