/*
  M3Script / MikuMikuScript

  Copyright 2011 fullkawa

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

$(function(){
	try {
		if ($(".m3screen").css("position") != "absolute") {
			alert('M3Script need "m3script.css" and HTMLElement has class "m3screen" !');
		}
	}
	catch(e) {
		alert("M3Script need jQuery 1.3 later !");
	}
});
var Player = function() {

	// default value
	this.screen = undefined;
	this.scrId = "m3scr";
	this.scrHeight = 0;
	this.scrWidth = 0;
	this.leftX = 0;
	this.left2X = 0;
	this.centerX = 0;
	this.rightX = 0;
	this.right2X = 0;

	this.shotType = "WS"; // Waist Shot

  /**
   * image 'bank'
   */
	this.imgs = {};

	/**
	 * it is similart to a scenario.
	 * it has changed objects only.
	 */
	this.sequence = [];

	/**
	 * it has all objects on that time.
	 */
	this.timeline = {};

	this._step = 0;

	// this.next_imgs = {};
	this.next_sequence = {};
};
Player.prototype = {
	layers: [
		"bg", "l1", "l2", "l3", "msg"
	],
	setScreen: function() {
		if (this.scrId == undefined || this.scrId.length == 0) throw new Error("NoScreenIdException");
		var elms = $("#" + this.scrId);
		if (elms == undefined || elms.length == 0) {
			throw new Error("NoScreenElementException");
		}
		else {
			this.screen = elms.get(0);
			this.scrHeight = elms.height();
			this.scrWidth = elms.width();
			if (this.scrWidth > 0) {
				this.centerX = Math.floor(this.scrWidth / 2); // on 3/6
				this.left2X = Math.floor(this.scrWidth / 3); // on 2/6
				this.right2X = Math.floor(this.left2X * 2); // on 4/6
				this.leftX = Math.floor(this.centerX / 3); // on 1/6
				this.rightX = this.scrWidth - this.leftX; // on 5/6
			}
			else {
				console.warn("scrWidth = 0");
			}
		}
	},
	start: function() {
		this.setScreen();
		this._step = 0;
		this.next();
	},
	// TODO:now 画像表示
	next: function() {
		var seq = this.sequence[this._step];
		console.log("play:" + this._step);
		for (i in Player.prototype.layers) {
			var layerId = Player.prototype.layers[i];
			var layerObj = seq[layerId];
			if (layerObj != undefined) {
				var curElms = $("." + layerId);
				if (curElms != undefined) {
					$(curElms).hide();
				}
				var nextElm = layerObj;
				if (layerObj instanceof Figure) {
					nextElm = layerObj.render();
				}
				$(nextElm).show();
				$(this.screen).append(nextElm);
				if (nextElm != undefined) console.debug("[" + layerId + "] " + nextElm.src);
			}
		}

		/* TODO:delete
		for (key in seq) {
			this.timeline[key] = seq[key];
		}
		for (key in this.timeline) {
			console.debug(" [" + key + "] " + this.timeline[key]);
		}
		*/
		this._step++;
	},
	history: function() {
		// TODO:
	},
	loadNextScenario: function(scenario) {
		// TODO:
	},
	/**
	 * get image from 'bank'
	 * @param {Object} imgId
	 */
	img: function(imgId) {
		var retimg = this.imgs[imgId];
		if (typeof(retimg) == "string") {
			retimg = new Image();
			retimg.src = this.imgs[imgId];
		}
		return retimg;
	},
	end: function() {
		// TODO:
	}
};

var Figure = function(setting) {

  // default value
	this.baseUrl;
	this.imgs = {};
	this.img;
	this.curImgId;
	this.imgOffsetX = 0;
	this.imgOffsetY = 0;

	for (key in setting) {

		var value = setting[key];
		if (key == "baseUrl" || key == "base_url") {
			this.baseUrl = value;
		}
		else {
			var imgSrc = this.baseUrl;
			if (typeof(value) == "string") {
				imgSrc += value;
			}
			else if (typeof(value) == "object") {
				imgSrc += value.img;
			}
			else {
				console.warn("'" + key + ":" + value + "' is not handled.");
			}
			if (isImage(imgSrc)) {
				this.imgs[key] = value;
				if (this.imgs.length == 1) {
					this.imgs[Figure.prototype.DEFAULT_ID] = value;
					this.img = makeLayer(imgSrc);
					this.imgs[Figure.prototype.DEFAULT_ID].img = this.img;
				}
				this.imgs[key].img = imgSrc;
			}
			else {
				console.warn("'" + key + ":" + value + "' is not Image.");
				// printAllProperties(value);
			}
		}
	}
	printAllProperties(this.imgs);
};

Figure.prototype = {
	DEFAULT_ID: "default",

	setImage: function(imgId) {
		if (imgId == undefined || typeof(imgId) != "string" || imgId.length == 0) {
			imgId = Figure.prototype.DEFAULT_ID;
		}
		if (this.imgs[imgId] != undefined) {
			var img = this.imgs[imgId].img;
			if (img instanceof Image) {
				this.img = img;
			}
			else if (typeof(img) == "string") {
				this.img = new Image();
				this.img.src = img;
				this.imgs[imgId].img = this.img;
			}
		}
	},
	render: function() {
		console.debug("this.img is " + typeof(this.img)); // FIXME: delete
		return this.img;
	},

	say: function(msg) {
		this.setImage(this.curImgId);
		// TODO:
		return this;
	},
	is: function() {
		// TODO:
		return this;
	},
	act: function(name) {
		// TODO:
		return this;
	},
	wiz: function(name) {
		// TODO:
		return this;
	},
	/**
	 * left position with 3 people
	 */
	onLeft: function(offset) {
		// TODO:
		return this;
	},
	/**
	 * left position with 2 people
	 */
	onLeft2: function(offset) {
		// TODO:
		return this;
	},
	onCenter: function(offset) {
		// TODO:
		return this;
	},
	/**
	 * right position with 3 people
	 */
	onRight: function(offset) {
		// TODO:
		return this;
	},
	/**
	 * right position with 2 people
	 */
	onRight2: function(offset) {
		// TODO:
		return this;
	}
};

/*
 * utility functions
 */

/**
 * @param {Object} obj
 */
function isImage(obj) {
	var result = false;
	if (obj != undefined) {
		if (obj instanceof Image) {
			result = true;
		}
		else if (typeof(obj) == "string" && obj.length > 0) {
			for (chk in ["png", "jpg", "mpo", "gif", "jpeg"]) {
				if (obj.toLowerCase().indexOf(chk) > 0) {
					result = true; break;
				}
			}
		}
	}
	return result;
}

function makeLayer(src, layerId) {
	var img = new Image();
	img.src = src;
	$(img).hide();
	$(img).addClass("m3layer");
	if (layerId != undefined && layerId.length > 0) {
		$(img).addClass(layerId);
	}
	return img;
}

function printAllProperties(obj, indent) {
	if (indent == undefined) {
		indent = " ";
	} else {
		indent += " ";
	}
	for (key in obj) {
		if (typeof(obj[key]) == "function") {
			console.debug(indent + "key=" + key + " is function");
		}
		else if (typeof(obj[key]) == "object") {
			console.debug(indent + "key=" + key);
			printAllProperties(obj[key], indent);
		}
		else {
			console.debug(indent + "key=" + key + ", value=" + obj[key]);
		}
	}
	console.debug();
}
