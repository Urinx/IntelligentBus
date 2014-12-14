
//################ Constant ################
var busQueryUrl = 'http://www.wbus.cn/getQueryServlet',
	O = Object;
O.o=O.observe;

//############ Common Functions ############
var urljoin = function(url, param) {
	return url+'?'+JSON.stringify(param).replace(/^{|"|}$/g,'').replace(/:/g,'=').replace(/,/g,'&');
};

var Ajax = function(opt) {
	var req = new XMLHttpRequest(),
		url = urljoin(opt.url, opt.param);
	req.open("GET", url, true);
	req.onload = function(e){
		opt.callback(e,opt.self);
	};
	req.send();
};

var notify = function(t,b,i,tag) {
	var notification = new Notification(t,{
		icon:i,
		body:b
	});

	// 5s后关闭
	setTimeout(function() {
		notification.close();
	}, 5e3);
};

var O_o = function(obj, param, fn){
	O.o(obj, function(changes){
		changes.forEach(function(change){
			if (change.name === param) fn(obj, obj[param]);
		});
	});
};

//##########################################

var Bus = function(lineNo, stopId, direction){
	var self = this;
	this.lineNo = lineNo;
	this.stopId = stopId;
	this.direc = direction;
	this.data = {};
	this.status = {
		nearBusNum: null,
		minDistance: null,
		timePredict: null,
		curStopNmae: null,
		curOrder: null,
	};
	this.ajaxOpt = {
		self: self,
		url: busQueryUrl,
		param: {
			Type: 'LineDetail',
			lineNo: lineNo,
			direction: direction
		},
		callback: this.ajaxCallback,
	};

	this.init();
};
Bus.prototype = {
	init: function(){
		var self = this;
		// bind event
		O_o(this, 'data', this.onDataChange);
		// O_o(this.status, 'minDistance', this.alert);
		// setInterval(function(){
		// 	self.update();
		// },10000);
	},
	update: function(){
		Ajax(this.ajaxOpt);
	},
	ajaxCallback: function(e,self){
		var jsonr = JSON.parse(e.target.responseText);
		self.data = jsonr.jsonr.data;
	},
	onDataChange: function(self, data){
		// update status
		self.status.curStopNmae = self.getCurrentStopName(self.stopId,data.map);
		self.status.curOrder = self.getCurrentOrder(self.stopId,data.map);
		self.status.minDistance = self.getMinDistance(self.status.curOrder, data.bus);
		self.status.nearBusNum = self.getNearBusNum(self.status.curOrder, data.bus);
		self.status.timePredict = self.getTimePredict(self.status.minDistance);
	},
	getMinDistance: function(curOrder, busArr){
		var _default = {order:0,arrived:1},
			nearBus = busArr.filter(function(b){
			return b.order <= curOrder;
		}).pop() || _default;
		return curOrder - nearBus.order + (nearBus.arrived ? 0:0.5);
	},
	getNearBusNum: function(curOrder, busArr){
		var nearBus = busArr.filter(function(b){
			return b.order <= curOrder;
		}).pop() || {busNum:0};
		return nearBus.busNum;
	},
	getTimePredict: function(dist){
		return dist*1;
	},
	getCurrentStopName: function(stopId, map){
		return map.filter(function(p){
			return p.stopId === stopId;
		})[0]['stopName'];
	},
	getCurrentOrder: function(stopId, map){
		return map.filter(function(p){
			return p.stopId === stopId;
		})[0]['order'];
	},
	// alert: function(){
	// 	var title_content = '当前有xx辆公交正在驶来\n距xx有xx站距离';
	// 	var body_content = '预计xx分钟内到达';
	// 	notify(title_content, body_content, 'asserts/img/bus-128.png');
	// },
};
//##########################################
var BusNotifyer = function(bus){
	this.bus = bus;
	this.init();
};
BusNotifyer.prototype = {
	init: function(){
		O_o(this.bus.status, 'minDistance', this.alert);
		
		setInterval(function(){
			//console.log(this.bus);
			this.bus.update();
		},10000);
	},
	alert: function(){
		var title_content = '当前有{{busNum}}辆公交正在驶来\n距{{curStopNmae}}有{{minDistance}}站距离';
		var body_content = '预计{{timePredict}}分钟内到达';
		notify(title_content, body_content, 'asserts/img/bus-128.png');
	},
};

//############### Main #####################
var bus = new Bus(718,'027-830',1);
var busNotifyer = new BusNotifyer(bus);