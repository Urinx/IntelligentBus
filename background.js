/*
{
"line":
{"direction":1,"endStopName":"鲁磨路光谷广场","firstTime":"6:30","lastTime":"21:25","lineName":"759","lineNo":"759","startStopName":"金融港一路小符湾","stopsNum":19,"opposite":false},
"map":
[
{"stopId":"027-9114","stopName":"金融港一路小符湾","stopNo":"027-9114","jingdu":114.44002997007,"weidu":30.4634574929,"order":1},
{"stopId":"027-9113","stopName":"金融港一路大舒村","stopNo":"027-9113","jingdu":114.44259896638,"weidu":30.461185751505,"order":2},
{"stopId":"027-2232","stopName":"金融港四路大舒村","stopNo":"027-2232","jingdu":114.4365274319,"weidu":30.459506773459,"order":3},
{"stopId":"027-2231","stopName":"金融港四路金融港中路","stopNo":"027-2231","jingdu":114.43084553381,"weidu":30.459224691221,"order":4},
{"stopId":"027-830","stopName":"光谷大道金融港","stopNo":"027-830","jingdu":114.42731924991,"weidu":30.461002533574,"order":5},
{"stopId":"027-1403","stopName":"光谷大道当代国际花园","stopNo":"027-1403","jingdu":114.42707296928,"weidu":30.467221364179,"order":6},
{"stopId":"027-2120","stopName":"光谷大道三李陈","stopNo":"027-2120","jingdu":114.42681617242,"weidu":30.478393569674,"order":7},
{"stopId":"027-866","stopName":"关南路关南一路","stopNo":"027-866","jingdu":114.42020156824,"weidu":30.479415658922,"order":8},
{"stopId":"027-808","stopName":"软件园一路关南小区","stopNo":"027-808","jingdu":114.41444271166,"weidu":30.479630999429,"order":9},
{"stopId":"027-1264","stopName":"软件园一路","stopNo":"027-1264","jingdu":114.41023026363,"weidu":30.479498353786,"order":10},
{"stopId":"027-2230","stopName":"软件园中路","stopNo":"027-2230","jingdu":114.40946502017,"weidu":30.483193965529,"order":11},
{"stopId":"027-44","stopName":"南湖大道刘家村","stopNo":"027-44","jingdu":114.40831391189,"weidu":30.485828349709,"order":12},
{"stopId":"027-1005","stopName":"南湖大道东山头","stopNo":"027-1005","jingdu":114.40290781557,"weidu":30.485695128937,"order":13},
{"stopId":"027-1705","stopName":"民族大道纺织大学","stopNo":"027-1705","jingdu":114.40229252992,"weidu":30.489790949321,"order":14},
{"stopId":"027-276","stopName":"民族大道中南民族大学","stopNo":"027-276","jingdu":114.4026334702,"weidu":30.49558856303,"order":15},
{"stopId":"027-1723","stopName":"民族大道当代学生公寓","stopNo":"027-1723","jingdu":114.40392716956,"weidu":30.500519972011,"order":16},
{"stopId":"027-1721","stopName":"民族大道上钱村","stopNo":"027-1721","jingdu":114.40510306007,"weidu":30.50622058966,"order":17},
{"stopId":"027-857","stopName":"民族大道光谷广场","stopNo":"027-857","jingdu":114.40565725575,"weidu":30.51066369081,"order":18},
{"stopId":"027-1851","stopName":"鲁磨路光谷广场","stopNo":"027-1851","jingdu":114.40589279132,"weidu":30.516262098707,"order":19}],
"opposite":true,
"bus":
[{"arrived":0,"busNum":1,"order":7,"stopId":"027-2120"},
{"arrived":0,"busNum":1,"order":10,"stopId":"027-1264"},
{"arrived":0,"busNum":1,"order":17,"stopId":"027-1721"}]}
 */

var Ajax = function(opt) {
	var req = new XMLHttpRequest();
	req.open("GET", opt.url, true);
	req.onload = opt.callback;
	req.send();
};

var busOpt = {
	url: 'http://www.wbus.cn/getQueryServlet'+'?Type=LineDetail&lineNo=759&direction=1',
	param: {
		Type: 'LineDetail',
		lineNo: 759,
		direction: 1,
	},
	callback: function(e){
		var jsonr = JSON.parse(e.target.responseText);
		var result = jsonr.jsonr.data;
		//console.log(JSON.stringify(result));
	},
};


var getMinDis = function(busArr,dist){
	// ...
};

Ajax(busOpt);

// 