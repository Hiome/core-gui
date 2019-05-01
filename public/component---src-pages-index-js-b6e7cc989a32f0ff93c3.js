(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{146:function(e,t,n){"use strict";n.r(t);n(160),n(161),n(75),n(162);var a=n(163),r=n.n(a),o=(n(159),n(164)),i=n.n(o),c=n(7),s=n.n(c),u=n(0),l=n.n(u),p=n(156),m=n(154),d=(n(182),function(e){function t(){for(var t,n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))||this).state={rooms:[]},t}s()(t,e);var n=t.prototype;return n.componentDidMount=function(){var e=i()(r.a.mark(function e(){var t;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/1/rooms").then(function(e){return e.json()});case 2:t=e.sent,this.setState({rooms:t});case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),n.setOcc=function(){var e=i()(r.a.mark(function e(t){var n,a,o,i,c,s,u,l;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=0,!(t.occupancy_count>0)){e.next=6;break}if(window.confirm("Are you sure you want to reset occupancy count to 0?")){e.next=4;break}return e.abrupt("return");case 4:e.next=11;break;case 6:if(n=prompt("How many people are in "+t.name+"?",1),n=parseInt(n),!(isNaN(n)||n<=0)){e.next=10;break}return e.abrupt("return");case 10:n>100&&(n=100);case 11:return e.next=13,fetch("/api/1/rooms",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({id:t.id,name:t.name,occupancy_count:n})}).then(function(e){return e.json()});case 13:a=e.sent,o=this.state.rooms,i=o,c=Array.isArray(i),s=0,i=c?i:i[Symbol.iterator]();case 16:if(!c){e.next=22;break}if(!(s>=i.length)){e.next=19;break}return e.abrupt("break",33);case 19:u=i[s++],e.next=26;break;case 22:if(!(s=i.next()).done){e.next=25;break}return e.abrupt("break",33);case 25:u=s.value;case 26:if((l=u).id!==a.id){e.next=31;break}return l.occupancy_count=a.occupancy_count,this.setState({rooms:o}),e.abrupt("break",33);case 31:e.next=16;break;case 33:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),n.roomRow=function(e){return l.a.createElement("div",{key:e.id,className:"room "+(e.occupancy_count>0?"active":"")},l.a.createElement("span",{className:"clear_occ",onClick:this.setOcc.bind(this,e)},l.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",x:"0px",y:"0px",viewBox:"0 0 100 100",width:"20",height:"20"},l.a.createElement("g",null,l.a.createElement("path",{fill:"#A17EDF",stroke:"none",d:" M 84.25 24.25 Q 86.0037109375 22.4890625 86 20 86.0037109375 17.5109375 84.25 15.75 82.4890625 13.9962890625 80 14 77.5109375 13.9962890625 75.75 15.75 L 50 41.5 24.25 15.75 Q 22.4890625 13.9962890625 20 14 17.5109375 13.9962890625 15.75 15.75 13.9962890625 17.5109375 14 20 13.9962890625 22.4890625 15.75 24.25 L 41.5 50 15.75 75.75 Q 13.9962890625 77.5109375 14 80 13.9962890625 82.4890625 15.75 84.25 17.5109375 86.0037109375 20 86 22.4890625 86.0037109375 24.25 84.25 L 50 58.5 75.75 84.25 Q 77.5109375 86.0037109375 80 86 82.4890625 86.0037109375 84.25 84.25 86.0037109375 82.4890625 86 80 86.0037109375 77.5109375 84.25 75.75 L 58.5 50 84.25 24.25 Z"})))),l.a.createElement("div",{style:{fontSize:"70px",marginBottom:"40px"}},e.occupancy_count),e.name)},n.renderRooms=function(){if(this.state.rooms.length>0){var e=[],t=this.state.rooms,n=Array.isArray(t),a=0;for(t=n?t:t[Symbol.iterator]();;){var r;if(n){if(a>=t.length)break;r=t[a++]}else{if((a=t.next()).done)break;r=a.value}var o=r;e.push(this.roomRow(o))}return e}return l.a.createElement("h2",{style:{textAlign:"center",color:"#A17EDF",margin:"100px"}},"No rooms found.")},n.render=function(){return l.a.createElement(p.a,null,l.a.createElement(m.a,{title:"Rooms"}),l.a.createElement("div",{style:{margin:"0 auto"}},this.renderRooms()))},t}(u.Component));t.default=d},150:function(e,t,n){"use strict";n.d(t,"b",function(){return l});var a=n(0),r=n.n(a),o=n(4),i=n.n(o),c=n(33),s=n.n(c);n.d(t,"a",function(){return s.a});n(151);var u=r.a.createContext({}),l=function(e){return r.a.createElement(u.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};l.propTypes={data:i.a.object,query:i.a.string.isRequired,render:i.a.func,children:i.a.func}},151:function(e,t,n){var a;e.exports=(a=n(152))&&a.default||a},152:function(e,t,n){"use strict";n.r(t);n(34);var a=n(0),r=n.n(a),o=n(4),i=n.n(o),c=n(55),s=n(2),u=function(e){var t=e.location,n=s.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(c.a,Object.assign({location:t,pageResources:n},n.json))};u.propTypes={location:i.a.shape({pathname:i.a.string.isRequired}).isRequired},t.default=u},153:function(e){e.exports={data:{site:{siteMetadata:{title:"Hiome"}}}}},154:function(e,t,n){"use strict";var a=n(155),r=n(0),o=n.n(r),i=n(4),c=n.n(i),s=n(158),u=n.n(s);function l(e){var t=e.description,n=e.lang,r=e.meta,i=e.keywords,c=e.title,s=a.data.site,l=t||s.siteMetadata.description;return o.a.createElement(u.a,{htmlAttributes:{lang:n},title:c,titleTemplate:"%s | "+s.siteMetadata.title,meta:[{name:"description",content:l},{property:"og:title",content:c},{property:"og:description",content:l},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:s.siteMetadata.author},{name:"twitter:title",content:c},{name:"twitter:description",content:l}].concat(i.length>0?{name:"keywords",content:i.join(", ")}:[]).concat(r)})}l.defaultProps={lang:"en",meta:[],keywords:[],description:""},l.propTypes={description:c.a.string,lang:c.a.string,meta:c.a.arrayOf(c.a.object),keywords:c.a.arrayOf(c.a.string),title:c.a.string.isRequired},t.a=l},155:function(e){e.exports={data:{site:{siteMetadata:{title:"Hiome",description:"Your home's personal dashboard.",author:"Hiome Inc"}}}}},156:function(e,t,n){"use strict";var a=n(153),r=n(0),o=n.n(r),i=n(4),c=n.n(i),s=n(150),u=function(e){var t=e.siteTitle;return o.a.createElement("header",{style:{marginBottom:"1.45rem"}},o.a.createElement("div",{style:{margin:"0 auto",maxWidth:960,padding:"1.45rem 1.0875rem"}},o.a.createElement("h1",{style:{margin:0,textAlign:"center"}},o.a.createElement(s.a,{to:"/",style:{color:"white",textDecoration:"none"}},t))))};u.propTypes={siteTitle:c.a.string},u.defaultProps={siteTitle:""};var l=u,p=(n(157),function(e){var t=e.children;return o.a.createElement(s.b,{query:"755544856",render:function(e){return o.a.createElement(o.a.Fragment,null,o.a.createElement(l,{siteTitle:e.site.siteMetadata.title}),o.a.createElement("div",{style:{margin:"0 auto",maxWidth:960,padding:"0px 1.0875rem 1.45rem",paddingTop:0}},o.a.createElement("main",null,t)))},data:a})});p.propTypes={children:c.a.node.isRequired};t.a=p}}]);
//# sourceMappingURL=component---src-pages-index-js-b6e7cc989a32f0ff93c3.js.map