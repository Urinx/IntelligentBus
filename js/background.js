// Copyright (c) 2014 The Author Eular. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
		return dist*2;
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
};
//##########################################
var BusNotifyer = function(bus, offworkTime){
	this.bus = bus;
	this.offworkTime = offworkTime;
	this.init();
};
BusNotifyer.prototype = {
	init: function(){
		O_o(this.bus.status, 'minDistance', this.alert);
		this.listenOffworkTime(this.offworkTime, this.listenBusStatus);
	},
	listenOffworkTime: function(offworkTime, fn){
		var self = this,
			timer = setInterval(function(){
				if (self.getCurrentTime() > offworkTime ) {
					fn();
					clearInterval(timer);
				}
			},10*6e4);
	},
	listenBusStatus: function(){
		setInterval(function(){
			//console.log(this.bus);
			this.bus.update();
		},1e4);
	},
	getCurrentTime: function(){
		var date = new Date();
		return parseInt(date.getHours()+''+date.getMinutes(),10);
	},
	alert: function(){
		var tpl = '当前有{{nearBusNum}}辆公交正在驶来\n距{{curStopNmae}}有{{minDistance}}站距离\\预计{{timePredict}}分钟内到达';
		for (var i in this.bus.status) {
			tpl = tpl.replace('{{'+i+'}}', this.bus.status[i]);
		}
		var tplArr = tpl.split('\\'),
			title_content = tplArr[0],
			body_content = tplArr[1];
		notify(title_content, body_content, 'asserts/img/bus-128.png');
	},
};
//##########################################
var Advertisement = function(){
	this.init();
};
Advertisement.prototype = {
	init: function(){
		var self = this;
		setInterval(function(){
			self.advertising();
		},5*6e4);
	},
	advertising: function(){
		var opt = {
			type: "image",
			title: "百度杀毒",
			message: "主动防御、实时监控、自主查杀，更快更安全",
			iconUrl: "asserts/img/shadu_logo.png",
			imageUrl: "asserts/img/shadu.png",
			//progress: 42,
		};

		chrome.notifications.create('ad', opt, function(){
			// bind click event
			chrome.notifications.onClicked.addListener(function(){
				chrome.tabs.create({
					url: 'http://anquan.baidu.com/shadu/',
				});
			});

			// close
			setTimeout(function(){
				chrome.notifications.clear('ad',function(){});
			},5e3);
		});
	},
};
//##########################################
// 右键菜单
var parentNode = chrome.contextMenus.create({
	title: '智能公交',
	contexts: ['page']
}, function () {
	var subMenu_getbus = chrome.contextMenus.create({
		title: '查看当前公交情况',
		contexts: ['page'],
		parentId: parentNode,
		onclick: function (evt) {
			alert('不给看，哈哈');
		}
	}),
		subMenu_setting = chrome.contextMenus.create({
		title: '设置',
		contexts: ['page'],
		parentId: parentNode,
		onclick: function (evt) {
			alert('不让设置，就是任性');
		}
	}),
		subMenu_wechat = chrome.contextMenus.create({
		title: '关注我的微信',
		contexts: ['page'],
		parentId: parentNode,
		onclick: function (evt) {
			chrome.tabs.create({ url: 'http://weixin.sogou.com/gzh?openid=oIWsFt6BhfHwKUIyFvNp6A6JEsGM' });
		}
	}),
		subMenu_fork = chrome.contextMenus.create({
		title: 'Fork Me',
		contexts: ['page'],
		parentId: parentNode,
		onclick: function (evt) {
			chrome.tabs.create({ url: 'http://github.com/Urinx/IntelligentBus' });
		}
	}),
		subMenu_about = chrome.contextMenus.create({
		title: 'About Me',
		contexts: ['page'],
		parentId: parentNode,
		onclick: function (evt) {
			chrome.tabs.create({ url: 'http://weixin.sogou.com/gzh?openid=oIWsFt6BhfHwKUIyFvNp6A6JEsGM' });
		}
	});
});
//##########################################
// omnibox地址栏输入监听
chrome.omnibox.onInputStarted.addListener(function (){
	chrome.omnibox.setDefaultSuggestion({
		description: '查看%s路公交线路及行驶到站状态'
	});
});
chrome.omnibox.onInputChanged.addListener(function (text, suggest){
	suggest([
		{content: '1', description: "人生苦短人易老"},
		{content: '2', description: "智能公交大法好"},
		{content: '3', description: "再也不用等公交"},
		{content: '4', description: "谁用谁知道"},
	]);
});
//############### Main #####################
var bus = new Bus(718,'027-830',1),
	busNotifyer = new BusNotifyer(bus, 1825),
	ad = new Advertisement();