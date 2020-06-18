(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{180:function(e,t,n){"use strict";n.r(t);n(200);var o=n(201),r=n.n(o),a=(n(258),n(259)),i=n.n(a),c=n(7),l=n.n(c),s=(n(227),n(228)),u=n.n(s),m=n(0),p=n.n(m),f=n(239),d=n(216),y=n(205),h=u.a.confirm,g=function(e){function t(){for(var t,n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(t=e.call.apply(e,[this].concat(o))||this).disconnectHomekit=function(){h({title:"Are you sure you want to reset HomeKit?",content:"This will force Hiome Core to forget your HomeKit setup. You should remove Hiome from HomeKit first. Only proceed if you're having issues with HomeKit!",onOk:function(){var e=Object(f.connect)("ws://"+window.location.host+":1884");e.on("connect",function(){return e.publish("hiome/1/api",'{"val": "homekitReset", "type": "core", "ts": '+(Date.now()/1e3|0)+"}",function(){return e.end()})})},okText:"Reset",okType:"danger"})},t}return l()(t,e),t.prototype.render=function(){return p.a.createElement(y.a,{title:"Settings"},p.a.createElement(d.a,{page:"homekit"}),p.a.createElement("p",null,"To add Hiome to HomeKit, follow these steps:"),p.a.createElement("ol",null,p.a.createElement("li",null,'Open the iOS Home app, tap the + button, and then "Add Accessory"'),p.a.createElement("li",null,'Tap "I Don\'t Have a Code or Cannot Scan"'),p.a.createElement("li",null,"Select the Hiome bridge"),p.a.createElement("li",null,'Tap "Add Anyway" to the uncertified accessory warning'),p.a.createElement("li",null,"Enter your HomeKit setup code: ",p.a.createElement("strong",null,"102-71-990"))),p.a.createElement("p",null,"You should now see your Hiome sensors in your HomeKit!"),p.a.createElement(i.a,null),p.a.createElement(r.a,{type:"danger",onClick:this.disconnectHomekit,key:"disconnect"},"Reset HomeKit Connection"))},t}(m.PureComponent);t.default=g},216:function(e,t,n){"use strict";n(208);var o=n(209),r=n.n(o),a=n(197),i=n(0),c=n.n(i),l=n(11),s=function(e){var t=e.page;return c.a.createElement(r.a,{selectedKeys:[t],mode:"horizontal"},c.a.createElement(r.a.Item,{key:"doors"},c.a.createElement(a.a,{to:"/settings"},"Doors")),c.a.createElement(r.a.Item,{key:"rooms"},c.a.createElement(a.a,{to:"/settings/rooms"},"Rooms")),c.a.createElement(r.a.Item,{key:"homekit"},c.a.createElement(a.a,{to:"/settings/integrations/homekit"},"HomeKit")),c.a.createElement(r.a.Item,{key:"hue"},c.a.createElement(a.a,{to:"/settings/integrations/hue"},"Hue")),c.a.createElement(r.a.Item,{key:"ifttt"},c.a.createElement(a.a,{to:"/settings/integrations/ifttt"},"IFTTT")))};s.propTypes={page:n.n(l).a.string.isRequired},t.a=s},258:function(e,t,n){"use strict";n(194),n(305)},259:function(e,t,n){"use strict";n(44),n(16),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o,r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var o=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};o.get||o.set?Object.defineProperty(t,n,o):t[n]=e[n]}return t.default=e,t}(n(0)),a=(o=n(189))&&o.__esModule?o:{default:o},i=n(193);function c(){return(c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n},u=function(e){return r.createElement(i.ConfigConsumer,null,function(t){var n,o=t.getPrefixCls,i=e.prefixCls,u=e.type,m=void 0===u?"horizontal":u,p=e.orientation,f=void 0===p?"center":p,d=e.className,y=e.children,h=e.dashed,g=s(e,["prefixCls","type","orientation","className","children","dashed"]),E=o("divider",i),v=f.length>0?"-".concat(f):f,w=(0,a.default)(d,E,"".concat(E,"-").concat(m),(l(n={},"".concat(E,"-with-text").concat(v),y),l(n,"".concat(E,"-dashed"),!!h),n));return r.createElement("div",c({className:w},g,{role:"separator"}),y&&r.createElement("span",{className:"".concat(E,"-inner-text")},y))})};t.default=u}}]);
//# sourceMappingURL=component---src-pages-settings-integrations-homekit-js-4cff99794164cba25fca.js.map