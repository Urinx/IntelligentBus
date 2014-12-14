// Copyright (c) 2014 The Author Eular. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

document.addEventListener('DOMContentLoaded', function () {

	// Fork me Buttun
	document.querySelector('.link-fb.forkme').addEventListener('click',function(){
		chrome.tabs.create({
			url: 'http://github.com/Urinx/IntelligentBus',
		});
	});

	// blog Buttun
	document.querySelector('.link-fb.blog').addEventListener('click',function(){
		chrome.tabs.create({
			url: 'http://urinx.github.io',
		});
	});

});