(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{180:function(e,t,n){"use strict";n.r(t);n(202);var a=n(201),o=n.n(a),r=(n(265),n(266)),i=n.n(r),l=n(7),c=n.n(l),s=(n(219),n(220)),u=n.n(s),m=n(0),p=n.n(m),d=n(228),f=n(224),y=n(204),h=n(206),g=u.a.confirm,E=function(e){function t(){for(var t,n=arguments.length,a=new Array(n),o=0;o<n;o++)a[o]=arguments[o];return(t=e.call.apply(e,[this].concat(a))||this).disconnectHomekit=function(){g({title:"Are you sure you want to reset HomeKit?",content:"This will force Hiome Core to forget your HomeKit setup. You should remove Hiome from HomeKit first. Only proceed if you're having issues with HomeKit!",onOk:function(){var e=Object(d.connect)("ws://"+window.location.host+":1884");e.on("connect",function(){return e.publish("hiome/1/api",'{"val": "homekitReset", "type": "core", "ts": '+(Date.now()/1e3|0)+"}",function(){return e.end()})})},okText:"Reset",okType:"danger"})},t}return c()(t,e),t.prototype.render=function(){return p.a.createElement(y.a,{goBack:!0},p.a.createElement(h.a,{title:"Settings"}),p.a.createElement("h1",null,"Settings"),p.a.createElement(f.a,{page:"homekit"}),p.a.createElement("p",null,"To add Hiome to HomeKit, follow these steps:"),p.a.createElement("ol",null,p.a.createElement("li",null,'Open the iOS Home app, tap the + button, and then "Add Accessory"'),p.a.createElement("li",null,'Tap "I Don\'t Have a Code or Cannot Scan"'),p.a.createElement("li",null,"Select the Hiome bridge"),p.a.createElement("li",null,'Tap "Add Anyway" to the uncertified accessory warning'),p.a.createElement("li",null,"Enter your HomeKit setup code: ",p.a.createElement("strong",null,"102-71-990"))),p.a.createElement("p",null,"You should now see your Hiome sensors in your HomeKit!"),p.a.createElement(i.a,null),p.a.createElement(o.a,{type:"danger",onClick:this.disconnectHomekit,key:"disconnect"},"Reset HomeKit Connection"))},t}(m.Component);t.default=E},204:function(e,t,n){"use strict";var a=n(0),o=n.n(a),r=n(11),i=n.n(r),l=n(205),c=(n(218),function(e){var t=e.children,n=e.headline,a=e.goBack,r=e.menuOptions,i=e.menuCallback;return o.a.createElement("div",{id:"wrapper"},o.a.createElement(l.a,{goBack:a,menuOptions:r,menuCallback:i}),n,o.a.createElement("main",{className:"page"},t,o.a.createElement("footer",null,"© Hiome Inc ",(new Date).getFullYear())))});c.propTypes={children:i.a.node.isRequired,headline:i.a.node,goBack:i.a.bool,menuOptions:i.a.arrayOf(i.a.node),menuCallback:i.a.func},c.defaultProps={goBack:!1,headline:null,menuOptions:[],menuCallback:void 0},t.a=c},224:function(e,t,n){"use strict";n(212);var a=n(213),o=n.n(a),r=n(198),i=n(0),l=n.n(i),c=n(11),s=function(e){var t=e.page;return l.a.createElement(o.a,{selectedKeys:[t],mode:"horizontal"},l.a.createElement(o.a.Item,{key:"doors"},l.a.createElement(r.a,{to:"/settings"},"Doors")),l.a.createElement(o.a.Item,{key:"rooms"},l.a.createElement(r.a,{to:"/settings/rooms"},"Rooms")),l.a.createElement(o.a.Item,{key:"homekit"},l.a.createElement(r.a,{to:"/settings/integrations/homekit"},"HomeKit")),l.a.createElement(o.a.Item,{key:"hue"},l.a.createElement(r.a,{to:"/settings/integrations/hue"},"Hue")),l.a.createElement(o.a.Item,{key:"ifttt"},l.a.createElement(r.a,{to:"/settings/integrations/ifttt"},"IFTTT")))};s.propTypes={page:n.n(c).a.string.isRequired},t.a=s},265:function(e,t,n){"use strict";n(195),n(343)},266:function(e,t,n){"use strict";n(44),n(16),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var a=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};a.get||a.set?Object.defineProperty(t,n,a):t[n]=e[n]}return t.default=e,t}(n(0)),r=(a=n(189))&&a.__esModule?a:{default:a},i=n(190);function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(a=Object.getOwnPropertySymbols(e);o<a.length;o++)t.indexOf(a[o])<0&&Object.prototype.propertyIsEnumerable.call(e,a[o])&&(n[a[o]]=e[a[o]])}return n},u=function(e){return o.createElement(i.ConfigConsumer,null,function(t){var n,a=t.getPrefixCls,i=e.prefixCls,u=e.type,m=void 0===u?"horizontal":u,p=e.orientation,d=void 0===p?"center":p,f=e.className,y=e.children,h=e.dashed,g=s(e,["prefixCls","type","orientation","className","children","dashed"]),E=a("divider",i),v=d.length>0?"-".concat(d):d,O=(0,r.default)(f,E,"".concat(E,"-").concat(m),(c(n={},"".concat(E,"-with-text").concat(v),y),c(n,"".concat(E,"-dashed"),!!h),n));return o.createElement("div",l({className:O},g,{role:"separator"}),y&&o.createElement("span",{className:"".concat(E,"-inner-text")},y))})};t.default=u}}]);
//# sourceMappingURL=component---src-pages-settings-integrations-homekit-js-da8bc44ae713ac8a0c87.js.map