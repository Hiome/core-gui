(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{146:function(e,t,n){"use strict";n.r(t);n(161),n(159),n(160),n(75);var a=n(162),o=n.n(a),r=(n(158),n(163)),i=n.n(r),s=n(7),c=n.n(s),l=n(0),m=n.n(l),u=n(155),d=n(153),p=function(e){function t(){for(var t,n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))||this).state={id:null,settingRoom1:!0,room1:null,room1_name:null,room2:null,room2_name:null,rooms:[]},t.updateRoom=function(e){var n=e.target.value,a=e.target.options[e.target.selectedIndex].text,o=t.state.rooms;if("null"===n&&(n=null,a=null),"new"===n){if(!(a=prompt("What is the name of this room?","Living Room")))return;n=Date.now()/1e3|0,fetch("/api/1/rooms",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({id:n,name:a,occupancy_count:0})}),o.push({id:n,name:a,occupancy_count:0})}t.state.settingRoom1?t.setState({room1:n,room1_name:a,rooms:o}):t.setState({room2:n,room2_name:a,rooms:o})},t.nextRoom=function(){null!==t.state.room1&&t.setState({settingRoom1:!1})},t.saveSensor=i()(o.a.mark(function e(){var n,a;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.state.room2){e.next=5;break}return n="external"===t.state.room1?"":t.state.room1,a="external"===t.state.room2?"":t.state.room2,e.next=5,fetch("/api/1/sensors",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({id:t.state.id,room_id:n+"::"+a,name:t.state.room1_name+" <-> "+t.state.room2_name,type:"door"})}).then(function(e){return window.location.href="/sensors"});case 5:case"end":return e.stop()}},e)})),t}c()(t,e);var n=t.prototype;return n.componentDidMount=function(){var e=i()(o.a.mark(function e(){var t,n;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=new URL(document.location).searchParams,this.setState({id:t.get("id"),room1:t.get("r1"),room2:t.get("r2")}),e.next=4,fetch("/api/1/rooms").then(function(e){return e.json()});case 4:n=e.sent,this.setState({rooms:n});case 6:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),n.formQuestion=function(){return this.state.settingRoom1?m.a.createElement("label",{htmlFor:"name"},"Which room is this sensor in?"):m.a.createElement("label",{htmlFor:"name"},"Now walk through the door. Which room are you in now?")},n.renderButton=function(){return this.state.settingRoom1?m.a.createElement("button",{onClick:this.nextRoom},"Next"):m.a.createElement("button",{onClick:this.saveSensor},"Save")},n.renderRoomOptions=function(){var e=[],t=this.state.rooms,n=Array.isArray(t),a=0;for(t=n?t:t[Symbol.iterator]();;){var o;if(n){if(a>=t.length)break;o=t[a++]}else{if((a=t.next()).done)break;o=a.value}var r=o;(this.state.settingRoom1||r.id!==this.state.room1)&&e.push(m.a.createElement("option",{key:"room"+r.id,value:r.id},r.name))}return e},n.renderExternalOption=function(){if(this.state.settingRoom1||"external"!==this.state.room1)return m.a.createElement("option",{value:"external"},"Outside")},n.renderRoomForm=function(){return null===this.state.id?m.a.createElement("p",null,"Invalid QR Code..."):m.a.createElement("div",null,this.formQuestion(),m.a.createElement("select",{onChange:this.updateRoom,value:this.state.settingRoom1?this.state.room1||"null":this.state.room2||"null"},m.a.createElement("option",{value:"null"},"Select a room..."),this.renderRoomOptions(),this.renderExternalOption(),m.a.createElement("option",{value:"new"},"Add New Room")),this.renderButton())},n.render=function(){return m.a.createElement(u.a,null,m.a.createElement(d.a,{title:"Add Sensor"}),m.a.createElement("h1",{style:{textAlign:"center"}},"Add Sensor"),m.a.createElement("div",{style:{margin:"0 auto",textAlign:"center"}},this.renderRoomForm()))},t}(l.Component);t.default=p},149:function(e,t,n){"use strict";n.d(t,"b",function(){return m});var a=n(0),o=n.n(a),r=n(4),i=n.n(r),s=n(33),c=n.n(s);n.d(t,"a",function(){return c.a});n(150);var l=o.a.createContext({}),m=function(e){return o.a.createElement(l.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):o.a.createElement("div",null,"Loading (StaticQuery)")})};m.propTypes={data:i.a.object,query:i.a.string.isRequired,render:i.a.func,children:i.a.func}},150:function(e,t,n){var a;e.exports=(a=n(151))&&a.default||a},151:function(e,t,n){"use strict";n.r(t);n(34);var a=n(0),o=n.n(a),r=n(4),i=n.n(r),s=n(55),c=n(2),l=function(e){var t=e.location,n=c.default.getResourcesForPathnameSync(t.pathname);return o.a.createElement(s.a,Object.assign({location:t,pageResources:n},n.json))};l.propTypes={location:i.a.shape({pathname:i.a.string.isRequired}).isRequired},t.default=l},152:function(e){e.exports={data:{site:{siteMetadata:{title:"Hiome"}}}}},153:function(e,t,n){"use strict";var a=n(154),o=n(0),r=n.n(o),i=n(4),s=n.n(i),c=n(157),l=n.n(c);function m(e){var t=e.description,n=e.lang,o=e.meta,i=e.keywords,s=e.title,c=a.data.site,m=t||c.siteMetadata.description;return r.a.createElement(l.a,{htmlAttributes:{lang:n},title:s,titleTemplate:"%s | "+c.siteMetadata.title,meta:[{name:"description",content:m},{property:"og:title",content:s},{property:"og:description",content:m},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:c.siteMetadata.author},{name:"twitter:title",content:s},{name:"twitter:description",content:m}].concat(i.length>0?{name:"keywords",content:i.join(", ")}:[]).concat(o)})}m.defaultProps={lang:"en",meta:[],keywords:[],description:""},m.propTypes={description:s.a.string,lang:s.a.string,meta:s.a.arrayOf(s.a.object),keywords:s.a.arrayOf(s.a.string),title:s.a.string.isRequired},t.a=m},154:function(e){e.exports={data:{site:{siteMetadata:{title:"Hiome",description:"Your home's personal dashboard.",author:"Hiome Inc"}}}}},155:function(e,t,n){"use strict";var a=n(152),o=n(0),r=n.n(o),i=n(4),s=n.n(i),c=n(149),l=function(e){var t=e.siteTitle;return r.a.createElement("header",{style:{background:"rebeccapurple",marginBottom:"1.45rem"}},r.a.createElement("div",{style:{margin:"0 auto",maxWidth:960,padding:"1.45rem 1.0875rem"}},r.a.createElement("h1",{style:{margin:0}},r.a.createElement(c.a,{to:"/",style:{color:"white",textDecoration:"none"}},t),r.a.createElement(c.a,{style:{margin:"0 20px 0 50px",fontSize:"0.5em",color:"#fff",textDecoration:"none"},to:"/"},"Rooms"),r.a.createElement(c.a,{style:{margin:"0 20px",fontSize:"0.5em",color:"#fff",textDecoration:"none"},to:"/sensors"},"Sensors"))))};l.propTypes={siteTitle:s.a.string},l.defaultProps={siteTitle:""};var m=l,u=(n(156),function(e){var t=e.children;return r.a.createElement(c.b,{query:"755544856",render:function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement(m,{siteTitle:e.site.siteMetadata.title}),r.a.createElement("div",{style:{margin:"0 auto",maxWidth:960,padding:"0px 1.0875rem 1.45rem",paddingTop:0}},r.a.createElement("main",null,t),r.a.createElement("footer",null,"© ",(new Date).getFullYear()," Hiome Inc.")))},data:a})});u.propTypes={children:s.a.node.isRequired};t.a=u}}]);
//# sourceMappingURL=component---src-pages-sensors-add-js-50e7a9575593a34a76b8.js.map