/*
  M3Script / MikuMikuScript

  Copyright (C) 2011 fullkawa<fullkawa@gmail.com>

  This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
  published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
  of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

try {
	var lib = document.createElement('script');
	lib.type = "text/javascript";
	lib.src = "file:///C:/Users/Furukawa/M3Script/src/enchant.js";
	document.head.appendChild(lib);
	lib.onload = function() {
		enchant('m3');
	};
}
catch(e) {
	alert('M3Script need "enchant.js" ! \n[' + e.toString() + "]");
}

/**
 * Utility class to get image url
 */
var ImageDic = function() {
	/**
	 * Base URL
	 *   If
	 * @type String
	 */
	this.base;

	/**
	 * Image properties
	 *   If typeof(value) is 'String', it is URL.
	 *   If not, key:img is URL and key:top or left is position of 'difference' image
	 */
	this.imgs = {};
};
ImageDic.prototype = {
	/**
	 * @return Array of image URL
	 */
	getURLArray: function() {
		// TODO:
	},
	/**
	 *
	 */
	img: function(img_id) {
		// TODO;
	}
};

/**
 * Scenario data
 */
var Scenario = function() {
	this.seqNo = 0;
};
Scenario.prototype = {
	LAYERS: ["bg", "l1", "l2", "l3"],

	/**
	 * CU: Close Up
	 * BS: Bust Shot
	 * WS: Waist Shot
	 * KS: Knee Shot
	 * FS: Full Shot
	 */
	SHOT_TYPES: ['CU', 'BS', 'WS', 'KS', 'FS'],
	defaultShotType: 'WS',

	images: {
		get: function() {
			// TODO:
		},
		set: function() {
			// TODO:
		}
	},
	sequence: {
		get: function() {
			// TODO:
		},
		set: function() {
			// TODO:
		}
	},
	next: {
		get: function() {
			// TODO:
		},
		set: function() {
			// TODO:
		}
	},

	start: function() {
		window.onload = function() {
			alert("ready !");
		};
		// TODO: まずはここをベースに作っていく？
	}
};

/**
 * Background image, Event CG and so on...
 */
enchant.m3.Picture = enchant.Class.create(enchant.Sprite, {
	// TODO:
});

/**
 * Character image
 */
enchant.m3.Figure = enchant.Class.create(enchant.Sprite, {
	/**
	 * X value on left position
	 * @type Number
	 */
	leftX: 0,

	/**
	 * X value on left with 2 characters
	 * @type Number
	 */
	left2X: 0,

	/**
	 * X value on center position
	 * @type Number
	 */
	centerX: 0,

	/**
	 * X value on right position
	 * @type Number
	 */
	rightX: 0,

	/**
	 * X value on right with 2 characters
	 * @type Number
	 */
	right2X: 0,

	initialize: function(setting) {
		if (typeof(setting) == 'string') {
			// TODO:URLから読み込み
		}
		else if (typeof(setting) == 'object') {

		}
		else {
			throw new Error('Figure cannot initialize : typeof(setting) is ' + typeof(setting));
		}
		// FIXME: scrWidth ?
		if (this.scrWidth > 0) {
			this.centerX = Math.floor(this.scrWidth / 2); // on 3/6
			this.left2X = Math.floor(this.scrWidth / 3); // on 2/6
			this.right2X = Math.floor(this.left2X * 2); // on 4/6
			this.leftX = Math.floor(this.centerX / 3); // on 1/6
			this.rightX = this.scrWidth - this.leftX; // on 5/6
		}
		else {
			console.warn('scrWidth = 0');
		}

		for (key in setting) {

			var value = setting[key];
			if (key == 'baseUrl' || key == 'base_url') {
				this.baseUrl = value;
			}
			else {
				var imgSrc = this.baseUrl;
				if (typeof(value) == 'string') {
					imgSrc += value;
				}
				else if (typeof(value) == 'object') {
					imgSrc += value.img;
				}
				else {
					console.warn('"' + key + ':' + value + '" is not handled.');
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
					console.warn('"' + key + ':' + value + '" is not Image.');
					// printAllProperties(value);
				}
			}
		}
		printAllProperties(this.imgs); // FIXME: delete
	}
});
Figure.prototype = {
		DEFAULT_ID: 'default',

		setImage: function(imgId) {
			if (imgId == undefined || typeof(imgId) != 'string' || imgId.length == 0) {
				imgId = Figure.prototype.DEFAULT_ID;
			}
			if (this.imgs[imgId] != undefined) {
				var img = this.imgs[imgId].img;
				if (img instanceof Image) {
					this.img = img;
				}
				else if (typeof(img) == 'string') {
					this.img = new Image();
					this.img.src = img;
					this.imgs[imgId].img = this.img;
				}
			}
		},
		render: function() {
			console.debug('this.img is ' + typeof(this.img)); // FIXME: delete
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

enchant.m3.Message = enchant.Class.create(enchant.Label, {
	// TODO:
});

enchant.m3.Connector = enchant.Class.create(enchant.Scene, {
	// TODO:
});

enchant.m3.Close = enchant.Class.create(enchant.m3.Connector, {
	// TODO:
});

enchant.m3.Jump = enchant.Class.create(enchant.m3.Connector, {
	// TODO:
});

enchant.m3.Navigation = enchant.Class.create(enchant.m3.Connector, {
	// TODO:
});


/*
 * utility functions
 */

function printAllProperties(obj, indent) {
	if (indent == undefined) {
		indent = ' ';
	} else {
		indent += ' ';
	}
	for (key in obj) {
		if (typeof(obj[key]) == 'function') {
			console.debug(indent + 'key=' + key + ' is function');
		}
		else if (typeof(obj[key]) == 'object') {
			console.debug(indent + 'key=' + key);
			printAllProperties(obj[key], indent);
		}
		else {
			console.debug(indent + 'key=' + key + ', value=' + obj[key]);
		}
	}
	console.debug();
}
