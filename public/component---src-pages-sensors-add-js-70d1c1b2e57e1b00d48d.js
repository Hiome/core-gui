(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{177:function(e,t,n){"use strict";n.r(t);n(600);var o=n(624),r=n.n(o),a=(n(607),n(638)),i=n.n(a),s=(n(246),n(251)),l=n.n(s),m=(n(238),n(241)),c=n.n(m),d=(n(200),n(201)),h=n.n(d),u=(n(213),n(195)),p=n.n(u),g=(n(283),n(284)),f=n.n(g),C=(n(88),n(25),n(218),n(219)),w=n.n(C),y=(n(36),n(7)),E=n.n(y),S=(n(613),n(615)),v=n.n(S),k=n(197),_=n(0),b=n.n(_),T=n(205),x=n(206),D=v.a.Step,L=function(e){function t(){for(var t,n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(t=e.call.apply(e,[this].concat(o))||this).state={id:null,name:"",room1:null,room1_name:null,room1_hidden:!1,event1:null,room2:null,room2_name:null,room2_hidden:!1,event2:null,rooms:[],sensors:[],loading:!0,loadingButton:!1,step:0,secondsToCalibration:null,timeSinceBoot:(new Date).getTime()-3e4,waitingForSensorData:!1,multipleSensorsFound:!1,unknownError:!1},t.onchange=function(e,n){t.setState({loadingButton:!0}),fetch("/api/1/rooms/"+e,{method:"PUT",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({hidden:n,occupancy_count:0})}).then(function(o){return e===t.state.room1?t.setState({room1_hidden:n,loadingButton:!1}):t.setState({room2_hidden:n,loadingButton:!1})})},t.addRoom=function(){var e=prompt("What is the name of this room?","Living Room");if(e&&e.trim())if(e=e.trim(),t.state.rooms.map(function(e){return e.name}).indexOf(e)>=0)w.a.error(e+" already exists!");else{var n="room_"+(Date.now()/1e3|0);t.setState({loadingButton:!0}),fetch("/api/1/rooms",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({id:n,name:e,occupancy_count:0===t.state.step?1:0,hidden:!1})}).then(function(o){return t.selectRoom(n,e,!1)})}},t.selectRoom=function(e,n,o){0===t.state.step?t.setState({room1:e,room1_name:n,room1_hidden:o,waitingForSensorData:!0,loadingButton:!1}):t.setState({room2:e,room2_name:n,room2_hidden:o,waitingForSensorData:!0,loadingButton:!1})},t.updateCountdown=function(){var e=t.calibrationTimeRemaining();e<1&&clearInterval(t.timer),t.setState({secondsToCalibration:e})},t}E()(t,e);var n=t.prototype;return n.componentDidMount=function(){var e=this;this.setState({loading:!0}),fetch("/api/1/rooms?include_hidden=true").then(function(e){return e.json()}).then(function(t){return e.setState({rooms:t,loading:!1})}),fetch("/api/1/sensors?type=door").then(function(e){return e.json()}).then(function(t){return e.setState({sensors:t})}),x.a.subscribe("hs/1/com.hiome/+/entry",function(e){!this.state.multipleSensorsFound&&this.state.waitingForSensorData&&e.data.is_valid&&this.state.sensors.some(function(t){return t.id===e.object_id&&null===t.room_id})&&(null===this.state.id||this.state.id===e.object_id?null===this.state.event1?this.setState({id:e.object_id,event1:e.val,waitingForSensorData:!1,step:1}):this.setState({id:e.object_id,event2:e.val,waitingForSensorData:!1,step:2},this.saveSensor):this.setState({multipleSensorsFound:!0}))}.bind(this)),x.a.subscribe("hs/1/com.hiome/+/version",function(e){this.state.timeSinceBoot<e.ts&&this.setState({timeSinceBoot:e.ts})}.bind(this))},n.saveSensor=function(){var e,t,n=this,o="external"===this.state.room1?"":this.state.room1,r="external"===this.state.room2?"":this.state.room2;if(1===this.state.event1&&2===this.state.event2)e=r+"::"+o,t=this.state.room2_name+" to "+this.state.room1_name+" Door";else{if(2!==this.state.event1||1!==this.state.event2)return void this.setState({unknownError:!0});e=o+"::"+r,t=this.state.room1_name+" to "+this.state.room2_name+" Door"}return this.setState({name:t,loading:!0}),fetch("/api/1/sensors",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({id:this.state.id,room_id:e,name:t,type:"door"})}).then(function(e){return n.setState({loading:!1})}),t},n.renderHiddenQ=function(e,t,n,o){var r=this;if("external"!==e){var a=this.state.sensors.map(function(t){if(t.room_id){var n=t.room_id.split("::");if(n[0]===e)return r.state.rooms.find(function(e){return e.id===n[1]});if(n[1]===e)return r.state.rooms.find(function(e){return e.id===n[0]})}return null}).filter(function(e){return e}).map(function(e){return e.name}),i=0===a.length?"a door to":a.length+1+" doors to "+a.join(", ")+(a.length>1?",":"")+" and";return b.a.createElement("p",{style:{whiteSpace:"pre-wrap"}},b.a.createElement("strong",null,t)," now has ",i," ",o,". Are there any other doors in ",t,"? ","  ",b.a.createElement(f.a,{key:"hideRoom"+e,onChange:function(t,n){return r.onchange(e,t)},checked:n,loading:this.state.loadingButton,checkedChildren:"Yes",unCheckedChildren:"No"}))}},n.renderHiddenDescription=function(e,t){if("external"!==e)return t?b.a.createElement("p",null,b.a.createElement(p.a,{type:"exclamation-circle",theme:"twoTone",twoToneColor:"#f8ac30"})," No problem, I'll hide this room for now until all its doors have Hiome Door sensors."):b.a.createElement("p",null,b.a.createElement(p.a,{type:"check-circle",theme:"twoTone",twoToneColor:"#52c41a"})," Awesome, you're all set!")},n.renderFinished=function(){return b.a.createElement(c.a,{status:"success",title:this.state.name+" is ready!",subTitle:"Enjoy your smarter door.",extra:[b.a.createElement(h.a,{key:"add_another",onClick:function(){return window.location.reload()},loading:this.state.loading},"Add Another Door"),b.a.createElement(h.a,{key:"all_done",type:"primary",onClick:function(){return Object(k.c)("/")},loading:this.state.loading},"Done")]},b.a.createElement("div",{style:"external"===this.state.room1||"external"===this.state.room2?{}:{marginBottom:"50px"}},this.renderHiddenQ(this.state.room1,this.state.room1_name,this.state.room1_hidden,this.state.room2_name),this.renderHiddenDescription(this.state.room1,this.state.room1_hidden)),b.a.createElement("div",null,this.renderHiddenQ(this.state.room2,this.state.room2_name,this.state.room2_hidden,this.state.room1_name),this.renderHiddenDescription(this.state.room2,this.state.room2_hidden)))},n.render5ftwarning=function(){return 0===this.state.step?b.a.createElement(l.a,{type:"warning",style:{margin:"20px auto"},message:"Make sure the Hiome Door sensor is powered on and you are standing at least 5 feet away from the door."}):b.a.createElement("br",null)},n.renderRoomList=function(){var e=this,t=this.state.rooms;return this.state.step>0&&(t=t.filter(function(t){return t.id!==e.state.room1})).push({id:"external",name:"I'm Outside My Home"}),0===t.length?b.a.createElement("br",null):b.a.createElement(r.a,{dataSource:t,rowKey:function(e){return"room"+e.id},renderItem:function(t){return b.a.createElement(r.a.Item,null,b.a.createElement(i.a,{style:{textAlign:"center",minWidth:"200px"},hoverable:!0,onClick:function(){return e.selectRoom(t.id,t.name,t.hidden)}},b.a.createElement("div",{style:{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}},t.name)))},loading:this.state.loading,grid:{gutter:25,xs:1,sm:2,md:2,lg:3,xl:4,xxl:5}})},n.renderRooms=function(){return b.a.createElement(b.a.Fragment,null,this.render5ftwarning(),b.a.createElement("p",null,b.a.createElement("strong",null,"Which room are you standing in",1===this.state.step?" now":"","?")),this.renderRoomList(),b.a.createElement(h.a,{style:{height:"50px"},type:"primary",block:!0,icon:"plus",loading:this.state.loadingButton,onClick:this.addRoom},"Add New Room"))},n.renderOpenDoor=function(){return b.a.createElement("svg",{width:"80px",height:"128px",viewBox:"0 0 47 76",version:"1.1",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink"},b.a.createElement("g",{stroke:"none",strokeWidth:"1",fill:"none",fillRule:"evenodd"},b.a.createElement("g",{fillRule:"nonzero"},b.a.createElement("path",{d:"M25.3,17.1 C25.3,14.8 25.4,9.2 25.4,7.1 C32.3,4.9 39.3,2.6 46.2,0.4 C46.3,22.7 46.2,53.2 46.3,75.4 L30.6,75.4 C31.1,74.5 31.4,73.5 31.4,72.4 L31.4,66.5 C31.4,64 31,61.5 30.3,59.1 L28.6,53.3 L28.3,47.4 C28.3,46.7 28.2,46 28.2,45.3 C29.9,46.3 31.7,47.2 33.5,47.9 C34.2,48.2 34.9,48.3 35.6,48.3 C36.8,48.3 37.9,48 38.8,47.3 C39.8,46.6 40.5,45.7 41,44.6 C42.2,41.6 40.7,38.3 37.7,37.1 C35.7,36.3 33.7,35.2 31.9,34 C30.3,32.8 28.8,31.4 27.5,29.9 C26.9,29.2 26.1,28.6 25.2,28.2 L25.2,27.9 C26.4,26.4 27.1,24.5 27.1,22.5 C27.1,20.5 26.6,18.6 25.3,17.1 Z",fill:"#6F3CD1"}),b.a.createElement("path",{d:"M25.5,39.8 C25.4,42.3 25.4,44.9 25.5,47.4 L25.8,53.7 L27.6,59.9 C28.2,62 28.6,64.2 28.6,66.5 L28.6,72.4 C28.6,74 27.3,75.3 25.7,75.3 L25.4,75.3 L25.4,31.4 C25.5,31.5 25.5,31.5 25.6,31.6 C27,33.3 28.7,34.8 30.5,36.1 C32.5,37.5 34.6,38.7 36.9,39.6 C38.4,40.2 39.2,41.9 38.6,43.4 C38.2,44.6 37,45.3 35.9,45.3 C35.5,45.3 35.2,45.2 34.8,45.1 C32,44 29.4,42.6 27.1,40.9 C26.5,40.6 26,40.2 25.5,39.8 Z",fill:"#000000"}),b.a.createElement("path",{d:"M36.8,39.7 C34.5,38.8 32.4,37.6 30.4,36.2 C28.6,34.9 27,33.4 25.5,31.7 C24.9,31 24.1,30.7 23.2,30.7 L21.5,30.7 L21.2,30.7 L15.7,30.7 C14.9,30.6 14.2,30.6 13.4,30.7 C8.3,31.3 5.3,35.7 3.7,38 C2,40.4 0.8,43.1 0.1,46 C-0.3,47.6 0.7,49.2 2.2,49.6 C2.4,49.7 2.7,49.7 2.9,49.7 C4.2,49.7 5.4,48.8 5.7,47.5 C6.3,45.3 7.2,43.2 8.4,41.4 C9.2,40.2 10.4,38.5 11.8,37.5 C12.1,42.4 12.1,47.3 11.7,52.1 L11.6,53.8 L10.6,57.8 C9.9,60.4 8.5,62.8 6.5,64.5 L3.3,67.3 C2.1,68.4 2,70.2 3,71.4 C4.1,72.6 5.9,72.7 7.1,71.7 L10.3,68.9 C13.2,66.3 15.3,63 16.3,59.2 L16.8,57.2 L20.7,57.2 L22,61.6 C22.5,63.2 22.7,64.8 22.7,66.5 L22.7,72.4 C22.7,74 24,75.3 25.6,75.3 C27.2,75.3 28.5,74 28.5,72.4 L28.5,66.5 C28.5,64.3 28.2,62.1 27.5,59.9 L25.7,53.7 L25.4,47.5 C25.3,45 25.3,42.4 25.4,39.8 C25.9,40.2 26.3,40.5 26.8,40.9 C29.2,42.6 31.8,44.1 34.5,45.1 C34.8,45.2 35.2,45.3 35.6,45.3 C36.8,45.3 37.9,44.6 38.3,43.4 C39.1,42 38.3,40.3 36.8,39.7 Z",fill:"#000000"}),b.a.createElement("circle",{fill:"#000000",cx:"18.5",cy:"22.5",r:"5.9"}))))},n.calibrationTimeRemaining=function(){return 20-Math.floor(((new Date).getTime()-this.state.timeSinceBoot)/1e3)},n.renderWalkThroughDoor=function(){var e=this.calibrationTimeRemaining();return 0===this.state.step&&e>0?(this.timer||(this.timer=setInterval(this.updateCountdown,1e3)),b.a.createElement(c.a,{icon:b.a.createElement(p.a,{type:"loading"}),title:"Calibrating Hiome Door",subTitle:b.a.createElement(b.a.Fragment,null,b.a.createElement("p",null,"Almost ready... just ",this.state.secondsToCalibration||e," more seconds!"),b.a.createElement(l.a,{type:"warning",message:"Make sure you're standing at least 5 feet away from the door during calibration."}))})):b.a.createElement(c.a,{icon:b.a.createElement(p.a,{component:this.renderOpenDoor}),title:"Walk "+(1===this.state.step?"back ":"")+"through the door"+(1===this.state.step?" again":"")+".",subTitle:b.a.createElement(b.a.Fragment,null,b.a.createElement(p.a,{type:"loading"}),"   Waiting...")})},n.renderMultipleSensorsError=function(){return b.a.createElement(c.a,{status:"warning",title:"Multiple Possible Sensors Detected",subTitle:"It looks like multiple doors are being used right now.",extra:[b.a.createElement(h.a,{key:"contact",onClick:this.openHelpModal},"Contact Support"),b.a.createElement(h.a,{key:"try_again",type:"primary",onClick:function(){return window.location.reload()}},"Try Again")]},b.a.createElement("div",null,b.a.createElement(p.a,{type:"check-circle",theme:"twoTone",twoToneColor:"#52c41a"})," Make sure other people aren't walking around at the same time."),b.a.createElement("br",null),b.a.createElement("div",null,b.a.createElement(p.a,{type:"check-circle",theme:"twoTone",twoToneColor:"#52c41a"})," Try unplugging other Hiome Door sensors that haven't been configured yet."))},n.renderUnknownError=function(){return b.a.createElement(c.a,{status:"warning",title:"Something Went Wrong",subTitle:"The entry and exit did not match up. Make sure you only walk through the door when instructed.",extra:[b.a.createElement(h.a,{key:"contact",onClick:this.openHelpModal},"Contact Support"),b.a.createElement(h.a,{key:"try_again",type:"primary",onClick:function(){return window.location.reload()}},"Try Again")]})},n.openHelpModal=function(){window.dispatchEvent(new Event("helpMe"))},n.renderStep=function(){return this.state.multipleSensorsFound?this.renderMultipleSensorsError():this.state.unknownError?this.renderUnknownError():0===this.state.step?this.state.room1?this.renderWalkThroughDoor():this.renderRooms():1===this.state.step?this.state.room2?this.renderWalkThroughDoor():this.renderRooms():this.renderFinished()},n.render=function(){return b.a.createElement(T.a,{title:"Add Sensor"},b.a.createElement(v.a,{size:"small",labelPlacement:"vertical",current:this.state.step},b.a.createElement(D,{title:this.state.room1_name||"Current Room"}),b.a.createElement(D,{title:this.state.room2_name||"Adjoining Room"}),b.a.createElement(D,{title:"Finish"})),this.renderStep())},t}(_.Component);t.default=L}}]);
//# sourceMappingURL=component---src-pages-sensors-add-js-70d1c1b2e57e1b00d48d.js.map