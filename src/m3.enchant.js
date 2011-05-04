/*
  M3Script / MikuMikuScript

  Copyright (C) 2011 fullkawa<fullkawa@gmail.com>

  This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
  published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
  of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

enchant.m3 = {};

/**
 * Utility class to get image URL
 */
enchant.m3.ImageDic = function() {
	this.urls = {};
};
enchant.m3.ImageDic.prototype = {
	/**
	 * @deprecated use 'set' method TODO: delete this method
	 * @return unique dictionary key
	 */
	getUniqueKey: function(key) {
		var uniqKey;
		var suffix = '';
		while (this.urls[uniqKey = key + suffix] != undefined) {
			(suffix.length == 0) ? suffix = 1 : suffix++;
			if (suffix > 99) throw new Error("Can't get a unique key for '" + key + "'");
		}
		return uniqKey;
	},

	/**
	 * Set image URL
	 * @param key is name in scenario
	 * @param url of image
	 * @param baseUrl is optional, it added before url
	 */
	set: function(key, value, baseUrl) {
		var url;
		if (typeof(value) == 'string') {
			url = value;
		} else {
			if (value.img != undefined && typeof(value.img) == 'string')
			url = value.img;
		}
		if (url != undefined) {
			var fullUrl = getFullURL(url, baseUrl);
			if (this.urls[key] != undefined && this.urls[key] != fullUrl) {
				console.warn('key:' + key + " is already registed by other value.");
			}
			this.urls[key] = fullUrl;
		}
		else {
			console.warn('Failed to get url. value is ...');
			printAllProperties(value);
		}
	},

	/**
	 * @return Array of image URL
	 */
	getURLArray: function() {
		var arr = [];
		for (var key in this.urls) {
			arr.push(this.urls[key]);
		}
		return arr;
	}
};

/**
 * Scenario data
 */
enchant.m3.Scenario = function() {
	var images, sequence;
	this.imgdic = new ImageDic();
	this.seq = [];
	this.seqNo = 0;
	this._current = {};
};
enchant.m3.Scenario.prototype = {
	MAX_SEQUENCE_NO: 999,

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

	/**
	 * play on new game
	 */
	start: function() {
		var s = this;
		window.onload = function() {
			var game = new Game();
			var imgUrls = s.imgdic.getURLArray();
			console.debug(s.imgdic.urls); // FIXME: delete
			game.preload(imgUrls);

			game.keybind(13, 'a'); // enter key
			game.keybind(32, 'a'); // space key
			game.addEventListener(enchant.Event.A_BUTTON_DOWN, playNext);

			// TODO: make Scene object

//			if (s.seq.length == 0) throw new Error('No sequence exists.');
//			game.onload = function() {
//				game.pushScene(s.seq[0]);
//			};
//			game.start();

			alert('start !');
		};
	},
	/**
	 * play on existing game
	 */
	play: function(game) {
		if (game == undefined || !(game instanceof Game)) {
			throw new Error('Argument is not a game instance.');
		}
		game.addEventListener(enchant.Event.A_BUTTON_DOWN, playNext);

		if (this.seq.length == 0) throw new Error('No sequence exists.');
		game.pushScene(this.seq[0]);
	}
};
var playNext = function(){
	this.seqNo++;
	game.replaceScene(this.seq[this.seqNo]);
};
enchant.m3.Scenario.prototype.__defineSetter__("images", function(images) {
	// Get all image URL
	for (var key in images) {
		this.imgdic.set(key, images[key], this.baseURL);
	}
});
enchant.m3.Scenario.prototype.__defineSetter__("sequence", function(sequence) {
	// Get all image URL
	for (var key in sequence) {
		var value = sequence[key];
		var imgdic = this.imgdic;
		enchant.m3.Scenario.prototype.LAYERS.forEach(function(layer) {
			if (value[layer] != undefined) {
				if (typeof(value[layer]) == 'string') {
					// Got already, but...
					if (imgdic.urls[value[layer]] == undefined) {
						console.warn('Not regist image URL in s.images; sequence: '
							+ key + ' > ' + layer + ', name: ' + value[layer]);
					}
				}
				else if (value[layer].render != undefined) {
					var imginfo = value[layer].render();
					imgdic.set(imginfo.key, imginfo.url);
				}
			}
		});
	}
});

enchant.m3.Character = function(name, definition) {
	this.name = name;
	this.definition = definition;

	this.key = '';
	this.pos = this.POSITION.indexOf('CENTER');
	this.msg = '';

	this.imgdic = new ImageDic();
	for (var key in definition) {
		if (key == 'baseUrl') {
			// Not image
		}
		else {
			this.imgdic.set(key, definition[key], definition.baseUrl);
		}
	}
	//	// FIXME: scrWidth ?
//	if (this.scrWidth > 0) {
//		this.centerX = Math.floor(this.scrWidth / 2); // on 3/6
//		this.left2X = Math.floor(this.scrWidth / 3); // on 2/6
//		this.right2X = Math.floor(this.left2X * 2); // on 4/6
//		this.leftX = Math.floor(this.centerX / 3); // on 1/6
//		this.rightX = this.scrWidth - this.leftX; // on 5/6
//	}
//	else {
//		console.warn('scrWidth = 0');
//	}
};
enchant.m3.Character.prototype = {
		/**
		 * X postion of character
		 *   Not a numeric, it is ratio for screen width.
		 *   'LEFT_EDGE' is on left edge of screen. It shows right half of character.
		 *   'LEFT', 'CENTER' and 'RIGHT' is position in 3 person.
		 *   'LEFT2', 'RIGHT2' is postion in 2 person.
		 */
		POSITION: ['LEFT_EDGE', 'LEFT', 'LEFT2', 'CENTER', 'RIGHT2', 'RIGHT', 'RIGHT_EDGE'],

		render: function() {
			return {
				key: this.name + '.' + this.key,
				url: this.imgdic.urls[this.key],
				pos: this.pos,
				msg: this.msg
			};
		},

		say: function(msg) {
			this.msg = msg;
			return this;
		},
		is: function() {
			return this;
		},
		act: function(id) {
			this.key = id;
			return this;
		},
		wiz: function(id) {
			this.key = id;
			return this;
		},
		/**
		 * left position with 3 person
		 */
		onLeft: function(offset) {
			this.pos = this.POSITION.indexOf('LEFT');
			return this;
		},
		/**
		 * left position with 2 person
		 */
		onLeft2: function(offset) {
			this.pos = this.POSITION.indexOf('LEFT2');
			return this;
		},
		onCenter: function(offset) {
			this.pos = this.POSITION.indexOf('CENTER');
			return this;
		},
		/**
		 * right position with 3 person
		 */
		onRight: function(offset) {
			this.pos = this.POSITION.indexOf('RIGHT');
			return this;
		},
		/**
		 * right position with 2 person
		 */
		onRight2: function(offset) {
			this.pos = this.POSITION.indexOf('RIGHT2');
			return this;
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
	// TODO:
});

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

function getFullURL(url, baseUrl) {
	var fullUrl = url;
	if (url != undefined && typeof(url) == 'string' && url.length > 0) {
		if (baseUrl != undefined && typeof(baseUrl) == 'string' && baseUrl.length > 0) {
			if (url.charAt(0) == '/') {
				fullUrl = url.substring(1, url.length);
			}
			if (baseUrl.charAt(baseUrl.length-1) != '/') {
				baseUrl = baseUrl + "/";
			}

			if (url.indexOf('://') > 0) {
				// That url is 'full', so nothing to do.
			}
			else {
				fullUrl = baseUrl + fullUrl;
			}
		}
	}
	return fullUrl;
}

function printAllProperties(obj, indent) {
	if (indent == undefined) {
		indent = ' ';
	} else {
		indent += ' ';
	}
	for (var key in obj) {
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
