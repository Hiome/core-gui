(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{186:function(e,t,n){"use strict";n.r(t);n(238);var a=n(241),o=n.n(a),r=(n(36),n(84),n(222),n(223)),c=n.n(r),i=(n(213),n(195)),s=n.n(i),l=(n(200),n(201)),u=n.n(l),m=(n(57),n(44),n(24),n(7)),p=n.n(m),d=n(197),h=n(0),y=n.n(h),g=n(205),f=n(206),E=(n(227),n(228)),b=n.n(E),v=(n(597),n(599)),w=n.n(v),_=(n(218),n(219)),S=n.n(_),k=n(11),R=n.n(k),A=function(e){var t=e.id,n=e.occupancy_count,a=e.name,o=Object(h.useState)(!1),r=o[0],c=o[1];return y.a.createElement(y.a.Fragment,null,y.a.createElement(d.a,{to:"/hs/1/com.hiome/"+t+"/~~",className:"room "+(n>0?"active":""),title:a},y.a.createElement(u.a,{icon:"ellipsis",shape:"circle",ghost:!0,onClick:function(e){return e.preventDefault(),c(!0),!1},style:{marginRight:"10px",verticalAlign:"middle",color:n>0?"#000":"#a0a0a0"}}),n," ",a),y.a.createElement(b.a,{title:a,visible:r,onOk:function(){return c(!1)},onCancel:function(){return c(!1)},okText:"Done",cancelButtonProps:{style:{display:"none"}}},y.a.createElement("p",null,"You can change ",a,"'s occupancy count, but in order to help me learn, please ",y.a.createElement(d.a,{to:"/door"},"tell me which entry I got wrong"),"!"),y.a.createElement("div",{style:{textAlign:"center",marginBottom:"30px"}},y.a.createElement(w.a,{min:0,max:99,autoFocus:!0,value:n,onChange:function(e){return function(e,t,n,a){e=parseInt(e),!isNaN(e)&&e!==a&&e>=0&&(f.a.write("com.hiome/gui/to/com.hiome/"+t+"/occupancy",e),S.a.success("Updated "+n+"'s occupancy to "+e))}(e,t,a,n)},size:"large",type:"number"})),y.a.createElement("p",null,y.a.createElement(d.a,{to:"/door"},y.a.createElement(s.a,{type:"like"})," Calibrate Hiome")),y.a.createElement("p",null,y.a.createElement(d.a,{to:"/hs/1/com.hiome/"+t+"/~~"},y.a.createElement(s.a,{type:"history"})," ",a," Logs")),y.a.createElement("p",null,y.a.createElement(d.a,{to:"/settings/room?id="+t},y.a.createElement(s.a,{type:"setting"})," ",a," Settings"))))};A.propTypes={id:R.a.string.isRequired,occupancy_count:R.a.number.isRequired,name:R.a.string.isRequired};var x=A,C=(n(402),function(e){function t(){for(var t,n=arguments.length,a=new Array(n),o=0;o<n;o++)a[o]=arguments[o];return(t=e.call.apply(e,[this].concat(a))||this).state={rooms:[],loading:!0,missingSensors:0},t}p()(t,e);var n=t.prototype;return n.componentDidMount=function(){var e=this;fetch("/api/1/rooms").then(function(e){return e.json()}).then(function(t){return e.setState({rooms:t,loading:!1})}),fetch("/api/1/sensors?type=door").then(function(e){return e.json()}).then(function(t){return e.setState({missingSensors:t.filter(function(e){return null===e.room_id}).length})}),f.a.subscribe("hs/1/com.hiome/+/occupancy",function(e){this.setState(function(t,n){var a=t.rooms,o=a,r=Array.isArray(o),c=0;for(o=r?o:o[Symbol.iterator]();;){var i;if(r){if(c>=o.length)break;i=o[c++]}else{if((c=o.next()).done)break;i=c.value}var s=i;if(s.id===e.object_id){s.occupancy_count=e.val;break}}return{rooms:a}})}.bind(this))},n.addRoomRow=function(){return y.a.createElement(d.a,{key:"add_sensor",to:"/sensors/add",className:"room active",title:"Add New Sensor"},y.a.createElement(u.a,{icon:"plus",shape:"circle",ghost:!0,style:{marginRight:"10px",verticalAlign:"middle",color:"#000"}})," Add ",this.state.missingSensors," Door",1===this.state.missingSensors?"":"s")},n.renderRooms=function(){if(this.state.loading)return y.a.createElement("div",{style:{textAlign:"center",marginTop:"10em"}},y.a.createElement(c.a,{size:"large",indicator:y.a.createElement(s.a,{type:"loading"})}));if(this.state.rooms.length>0){var e=this.state.rooms.sort(function(e,t){return e.occupancy_count===t.occupancy_count?e.name.localeCompare(t.name):e.occupancy_count<t.occupancy_count?1:e.occupancy_count>t.occupancy_count?-1:0}).map(function(e){return y.a.createElement(x,{key:e.id,id:e.id,name:e.name,occupancy_count:e.occupancy_count})});return this.state.missingSensors>0&&e.push(this.addRoomRow()),e}return y.a.createElement(o.a,{icon:y.a.createElement("span",{role:"img","aria-label":"hurray",style:{fontSize:"5em"}},"🎉"),title:"Welcome to Hiome!",subTitle:y.a.createElement("p",null,"This will be your dashboard, but it's a little empty right now. Let's add a door."),extra:y.a.createElement(u.a,{onClick:function(){return Object(d.c)("/sensors/add")},type:"primary",size:"large",icon:"plus"},"Add New Door")})},n.render=function(){return y.a.createElement(g.a,{title:"Rooms"},this.renderRooms())},t}(h.Component));t.default=C}}]);
//# sourceMappingURL=component---src-pages-index-js-823431ef602567d87168.js.map