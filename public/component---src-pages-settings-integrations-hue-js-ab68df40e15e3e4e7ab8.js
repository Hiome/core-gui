(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{180:function(e,t,n){"use strict";n.r(t);n(264);var o=n(268),r=n.n(o),a=(n(204),n(191)),i=n.n(a),c=(n(217),n(219)),l=n.n(c),s=(n(199),n(198)),u=n.n(s),h=(n(82),n(9),n(7)),d=n.n(h),f=n(0),p=n.n(f),m=n(247),g=n(213),y=n(196),b=n(203),C=function(e){function t(){for(var t,n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(t=e.call.apply(e,[this].concat(o))||this).state={status:"start",onlyControlAtNight:!0},t.scanForBridge=function(){t.setState({status:"start"});var e=Object(m.connect)("ws://"+window.location.host+":1884");e.on("connect",function(){return e.publish("_hiome/integrate/hue","connect")})},t.disconnectHue=function(){t.setState({status:"start"});var e=Object(m.connect)("ws://"+window.location.host+":1884");e.on("connect",function(){return e.publish("_hiome/integrate/hue","disconnect")}),setTimeout(function(){e.publish("_hiome/integrate/hue","connect")},1e3)},t.controlAtNightToggle=function(e,n){t.setState({onlyControlAtNight:e});var o=Object(m.connect)("ws://"+window.location.host+":1884");o.on("connect",function(){return o.publish("_hiome/integrate/hue/settings/onlyControlAtNight",e?"true":"false",{retain:!0})})},t}d()(t,e);var n=t.prototype;return n.componentDidMount=function(){var e=Object(m.connect)("ws://"+window.location.host+":1884");e.on("connect",function(){e.subscribe("_hiome/integrate/hue",{qos:1}),e.subscribe("_hiome/integrate/hue/settings/onlyControlAtNight",{qos:1})}),e.on("message",function(t,n,o){if(null!=n&&"connect"!==n.toString()&&"disconnect"!==n.toString())if("_hiome/integrate/hue/settings/onlyControlAtNight"!==t){var r=JSON.parse(n.toString());this.setState({status:r.status}),"no_link_pushed"===r.status&&setTimeout(function(){e.publish("_hiome/integrate/hue","connect")},2e4)}else this.setState({onlyControlAtNight:"true"===n.toString()})}.bind(this))},n.renderHueButton=function(){return p.a.createElement("svg",{width:"78px",height:"74px",viewBox:"0 0 39 37",version:"1.1",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink"},p.a.createElement("g",{stroke:"none",strokeWidth:"1",fill:"none",fillRule:"evenodd"},p.a.createElement("g",{fillRule:"nonzero"},p.a.createElement("g",{fill:"#4990E2"},p.a.createElement("path",{d:"M28,2.16300593 L4,2.16300593 C2.9,2.16300593 2,3.05862595 2,4.15327265 L2,28.0194666 C2,29.1141133 2.9,30.0097333 4,30.0097333 L28,30.0097333 C29.1,30.0097333 30,29.1141133 30,28.0194666 L30,4.15327265 C30,3.05862595 29.1,2.16300593 28,2.16300593 Z M4,0 L28,0 C30.21,0 32,1.78128871 32,3.98053343 L32,28.0194666 C32,30.2187113 30.21,32 28,32 L4,32 C1.79,32 0,30.2187113 0,28.0194666 L0,3.98053343 C0,1.78128871 1.79,0 4,0 Z M16,22.75 C12.2720779,22.75 9.25,19.7279221 9.25,16 C9.25,12.2720779 12.2720779,9.25 16,9.25 C19.7279221,9.25 22.75,12.2720779 22.75,16 C22.75,19.7279221 19.7279221,22.75 16,22.75 Z M16,21.25 C18.8994949,21.25 21.25,18.8994949 21.25,16 C21.25,13.1005051 18.8994949,10.75 16,10.75 C13.1005051,10.75 10.75,13.1005051 10.75,16 C10.75,18.8994949 13.1005051,21.25 16,21.25 Z M9.5,7 C8.94771525,7 8.5,6.55228475 8.5,6 C8.5,5.44771525 8.94771525,5 9.5,5 C10.0522847,5 10.5,5.44771525 10.5,6 C10.5,6.55228475 10.0522847,7 9.5,7 Z M16,7 C15.4477153,7 15,6.55228475 15,6 C15,5.44771525 15.4477153,5 16,5 C16.5522847,5 17,5.44771525 17,6 C17,6.55228475 16.5522847,7 16,7 Z M22.5,7 C21.9477153,7 21.5,6.55228475 21.5,6 C21.5,5.44771525 21.9477153,5 22.5,5 C23.0522847,5 23.5,5.44771525 23.5,6 C23.5,6.55228475 23.0522847,7 22.5,7 Z",id:"Shape"})),p.a.createElement("g",{transform:"translate(25.049963, 25.208721) rotate(-34.000000) translate(-25.049963, -25.208721) translate(14.549963, 11.708721)",stroke:"#000000",fill:"#FFFFFF"},p.a.createElement("path",{d:"M17.3860309,10.3492743 L17.3860309,8.90823286 C17.3821463,7.93619786 16.6068874,7.15029831 15.6518977,7.15029831 C14.6969081,7.15029831 13.9216491,7.93619786 13.9177645,8.90823286 L13.9177645,7.46534571 C13.9174111,6.56591382 13.2526624,5.81059723 12.3743708,5.71167406 C11.4960791,5.6127509 10.6851722,6.20186241 10.4916312,7.07945571 L10.4916312,1.95806 C10.4877828,0.985998692 9.71251309,0.20005841 8.75749773,0.20005841 C7.80248238,0.20005841 7.02721269,0.985998692 7.02336427,1.95806 L7.02336427,14.9040357 L3.69216427,11.1462971 C3.00611793,10.3721325 1.8438986,10.2822521 1.05081518,10.9420281 C0.257731752,11.6018041 0.112946146,12.7789982 0.721764267,13.61741 L8.14203093,23.8395186 C9.94970491,26.3297864 13.1234576,27.3579924 16.0127302,26.3894022 C18.9020028,25.420812 20.8542996,22.6741662 20.8542987,19.5779 L20.8542987,10.3492743 C20.8505051,9.37717305 20.0752192,8.59117093 19.1201648,8.59117093 C18.1651104,8.59117093 17.3898245,9.37717305 17.3860309,10.3492743 L17.3860309,10.3492743 Z",id:"Shape"})))))},n.fail=function(){return p.a.createElement(l.a,{status:"error",title:"Something Went Wrong",subTitle:"Hiome was unable to connect to Philips Hue.",extra:[p.a.createElement(u.a,{onClick:function(){return window.dispatchEvent(new Event("helpMe"))},key:"contact_us"},"Contact Support"),p.a.createElement(u.a,{onClick:this.scanForBridge,type:"primary",key:"try_again"},"Try Again")]})},n.noBridgesFound=function(){return p.a.createElement(l.a,{status:"warning",title:"No Philips Hue Bridge Found",subTitle:"Make sure your Hue Bridge is on the same network as Hiome Core.",extra:[p.a.createElement(u.a,{onClick:function(){return window.dispatchEvent(new Event("helpMe"))},key:"contact_us"},"Contact Support"),p.a.createElement(u.a,{onClick:this.scanForBridge,type:"primary",key:"try_again"},"Try Again")]})},n.renderLoadingText=function(){return"no_link_pushed"===this.state.status?"Hue Bridge found, waiting for Link button":"Searching for Hue Bridge"},n.start=function(){return p.a.createElement(p.a.Fragment,null,p.a.createElement(l.a,{icon:this.renderHueButton(),title:"Connect Philips Hue with Hiome Core",subTitle:"Push the Link button on your Hue Bridge to control your lights based on occupancy.",extra:[p.a.createElement("p",{key:"loading"},p.a.createElement(i.a,{type:"loading"}),"   ",this.renderLoadingText())]}))},n.connected=function(){return p.a.createElement(l.a,{status:"success",title:"Hiome is connected to Philips Hue!",extra:[p.a.createElement(u.a,{type:"danger",onClick:this.disconnectHue,key:"disconnect"},"Disconnect from Hue Bridge")]},p.a.createElement("p",null,p.a.createElement("strong",null,"Create rooms in the Hue app with the same names as your Hiome rooms.")),p.a.createElement("p",null,"When a room in Hiome is occupied",this.state.onlyControlAtNight?" after sunset":"",', all lights in the Hue room with the same name will be turned on. For example, if your Living Room is occupied, the "Living Room" group in Hue will be turned on. When the room is no longer occupied, all lights in the room will be turned off.'),p.a.createElement("p",{style:{whiteSpace:"pre-wrap"}},p.a.createElement("strong",null,"Only turn on lights after sunset?")," ","  ",p.a.createElement(r.a,{onChange:this.controlAtNightToggle,checked:this.state.onlyControlAtNight,checkedChildren:"Yes",unCheckedChildren:"No"})),p.a.createElement("p",null,this.state.onlyControlAtNight?"Your lights will only turn on after sunset.":"Your lights will be controlled all day."))},n.renderPage=function(){return"start"===this.state.status||"no_link_pushed"===this.state.status?this.start():"connected"===this.state.status?this.connected():"no_bridges_found"===this.state.status?this.noBridgesFound():"fail"===this.state.status?this.fail():void 0},n.render=function(){return p.a.createElement(y.a,{goBack:!0},p.a.createElement(b.a,{title:"Settings"}),p.a.createElement("h1",null,"Settings"),p.a.createElement(g.a,{page:"hue"}),this.renderPage())},t}(f.Component);t.default=C},196:function(e,t,n){"use strict";var o=n(0),r=n.n(o),a=n(11),i=n.n(a),c=n(202),l=(n(210),function(e){var t=e.children,n=e.headline,o=e.goBack;return r.a.createElement("div",{id:"wrapper"},r.a.createElement(c.a,{goBack:o}),n,r.a.createElement("main",{className:"page"},t,r.a.createElement("footer",null,"© Hiome Inc 2019")),r.a.createElement("div",{className:"helloScroller"},r.a.createElement("span",{role:"img","aria-hidden":!0},"👋")))});l.propTypes={children:i.a.node.isRequired,headline:i.a.node,goBack:i.a.bool},l.defaultProps={goBack:!1,headline:null},t.a=l},213:function(e,t,n){"use strict";n(206);var o=n(207),r=n.n(o),a=n(195),i=n(0),c=n.n(i),l=n(11),s=function(e){var t=e.page;return c.a.createElement(r.a,{selectedKeys:[t],mode:"horizontal"},c.a.createElement(r.a.Item,{key:"doors"},c.a.createElement(a.a,{to:"/settings"},"Doors")),c.a.createElement(r.a.Item,{key:"rooms"},c.a.createElement(a.a,{to:"/settings/rooms"},"Rooms")),c.a.createElement(r.a.Item,{key:"homekit"},c.a.createElement(a.a,{to:"/settings/integrations/homekit"},"HomeKit")),c.a.createElement(r.a.Item,{key:"hue"},c.a.createElement(a.a,{to:"/settings/integrations/hue"},"Hue")))};s.propTypes={page:n.n(l).a.string.isRequired},t.a=s},264:function(e,t,n){"use strict";n(192),n(319)},268:function(e,t,n){"use strict";n(120),n(16),n(57),n(44),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=d(n(0)),r=d(n(11)),a=h(n(269)),i=h(n(185)),c=h(n(201)),l=h(n(279)),s=h(n(191)),u=n(189);function h(e){return e&&e.__esModule?e:{default:e}}function d(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var o=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};o.get||o.set?Object.defineProperty(t,n,o):t[n]=e[n]}return t.default=e,t}function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(){return(p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function m(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function g(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function y(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function C(e,t){return(C=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var w=function(e){function t(){var e;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(e=y(this,b(t).apply(this,arguments))).saveSwitch=function(t){e.rcSwitch=t},e.renderSwitch=function(t){var n,r=t.getPrefixCls,u=e.props,h=u.prefixCls,d=u.size,f=u.loading,g=u.className,y=void 0===g?"":g,b=u.disabled,C=r("switch",h),w=(0,i.default)(y,(m(n={},"".concat(C,"-small"),"small"===d),m(n,"".concat(C,"-loading"),f),n)),k=f?o.createElement(s.default,{type:"loading",className:"".concat(C,"-loading-icon")}):null;return o.createElement(l.default,{insertExtraNode:!0},o.createElement(a.default,p({},(0,c.default)(e.props,["loading"]),{prefixCls:C,className:w,disabled:b||f,ref:e.saveSwitch,loadingIcon:k})))},e}var n,r,h;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&C(e,t)}(t,o.Component),n=t,(r=[{key:"focus",value:function(){this.rcSwitch.focus()}},{key:"blur",value:function(){this.rcSwitch.blur()}},{key:"render",value:function(){return o.createElement(u.ConfigConsumer,null,this.renderSwitch)}}])&&g(n.prototype,r),h&&g(n,h),t}();t.default=w,w.__ANT_SWITCH=!0,w.propTypes={prefixCls:r.string,size:r.oneOf(["small","default","large"]),className:r.string}},269:function(e,t,n){e.exports=n(270)},270:function(e,t,n){"use strict";n.r(t);n(120),n(24),n(18),n(9),n(35),n(44),n(16);var o=n(0),r=n.n(o),a=n(11),i=n.n(a),c=n(83);function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function f(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var m=n(185),g=function(e){function t(e){var n,o,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),o=this,r=h(t).call(this,e),n=!r||"object"!=typeof r&&"function"!=typeof r?f(o):r,p(f(f(n)),"handleClick",function(e){var t=n.state.checked,o=n.props.onClick,r=!t;n.setChecked(r,e),o&&o(r,e)}),p(f(f(n)),"handleKeyDown",function(e){37===e.keyCode?n.setChecked(!1,e):39===e.keyCode&&n.setChecked(!0,e)}),p(f(f(n)),"handleMouseUp",function(e){var t=n.props.onMouseUp;n.node&&n.node.blur(),t&&t(e)}),p(f(f(n)),"saveNode",function(e){n.node=e});var a=!1;return a="checked"in e?!!e.checked:!!e.defaultChecked,n.state={checked:a},n}var n,a,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}(t,o["Component"]),n=t,i=[{key:"getDerivedStateFromProps",value:function(e){var t={},n=e.checked;return"checked"in e&&(t.checked=!!n),t}}],(a=[{key:"componentDidMount",value:function(){var e=this.props,t=e.autoFocus,n=e.disabled;t&&!n&&this.focus()}},{key:"setChecked",value:function(e,t){var n=this.props,o=n.disabled,r=n.onChange;o||("checked"in this.props||this.setState({checked:e}),r&&r(e,t))}},{key:"focus",value:function(){this.node.focus()}},{key:"blur",value:function(){this.node.blur()}},{key:"render",value:function(){var e,t=this.props,n=t.className,o=t.prefixCls,a=t.disabled,i=t.loadingIcon,c=t.checkedChildren,u=t.unCheckedChildren,h=s(t,["className","prefixCls","disabled","loadingIcon","checkedChildren","unCheckedChildren"]),d=this.state.checked,f=m((p(e={},n,!!n),p(e,o,!0),p(e,"".concat(o,"-checked"),d),p(e,"".concat(o,"-disabled"),a),e));return r.a.createElement("button",l({},h,{type:"button",role:"switch","aria-checked":d,disabled:a,className:f,ref:this.saveNode,onKeyDown:this.handleKeyDown,onClick:this.handleClick,onMouseUp:this.handleMouseUp}),i,r.a.createElement("span",{className:"".concat(o,"-inner")},d?c:u))}}])&&u(n.prototype,a),i&&u(n,i),t}();g.propTypes={className:i.a.string,prefixCls:i.a.string,disabled:i.a.bool,checkedChildren:i.a.any,unCheckedChildren:i.a.any,onChange:i.a.func,onMouseUp:i.a.func,onClick:i.a.func,tabIndex:i.a.number,checked:i.a.bool,defaultChecked:i.a.bool,autoFocus:i.a.bool,loadingIcon:i.a.node},g.defaultProps={prefixCls:"rc-switch",checkedChildren:null,unCheckedChildren:null,className:"",defaultChecked:!1},Object(c.polyfill)(g),t.default=g}}]);
//# sourceMappingURL=component---src-pages-settings-integrations-hue-js-ab68df40e15e3e4e7ab8.js.map