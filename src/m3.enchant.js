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
			if (value != undefined && value.img != undefined && typeof(value.img) == 'string')
			url = value.img;
		}
		if (url != undefined) {
			var fullUrl = getFullURL(url, baseUrl);
			if (this.urls[key] != undefined && this.urls[key] != fullUrl) {
				console.warn('key:' + key + ' is already registed by other value.');
			}
			this.urls[key] = fullUrl;
		}
		else {
			console.warn('Failed to get url. value is ...');
			console.debug(value);
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
	this._sequence;
	this._game;
	this.imgdic = new ImageDic();

	/**
	 * @type {String] is optional, it added before image url
	 */
	this.baseURL;

	/**
	 * @type {String} End Of Sentence
	 */
	this.eos = '';
};
enchant.m3.Scenario.prototype = {
	MAX_SEQUENCE_NO: 999,

	LAYERS: ['bg', 'l1', 'l2', 'l3'],
	MSG: 'msg',
	SELECT: 'select',

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
			s._game = new Game();
			var game = s._game;
			game.seq = [];
			game.seqNo = 0;

			game.keybind(13, 'a'); // enter key
			game.keybind(32, 'a'); // space key
			game.addEventListener(enchant.Event.A_BUTTON_DOWN, playNext);
			/* FIXME: not work
			game.addEventListener('click', playNext);
			*/

			var imgUrls = s.imgdic.getURLArray();
			game.preload(imgUrls);

			game.onload = function() {
				var sps = [];
				for (var i = 1; i <= s.MAX_SEQUENCE_NO; i++) {
					var d = s.sequence[i];
					if (d != undefined) {
						// console.debug('--- ' + i);
						sps.push(new Object());
						var sp = sps[sps.length - 1];
						var sp_prev = undefined;
						if (sps.length > 1) {
							sp_prev = sps[sps.length - 2];
						}
						game.seq.push(new Scene());
						var sn = game.seq[game.seq.length - 1];

						s.LAYERS.forEach(function(layer) {
							// console.debug(i+': '+layer);
							sp[layer] = s.getPicture(d, layer);
							if (sp[layer] == undefined) {
								sp[layer] = s.getFigure(d, layer);
							}
							if (sp[layer] == undefined && sp_prev != undefined && sp_prev[layer] != undefined) {
								sp[layer] = sp_prev[layer].clone();
							}
						});

						sp[s.MSG] = new Message(game.width, game.height);
						sp[s.MSG] = s.getMessage(d, sp[s.MSG]);

						s.doClear(d, sp);

						for (var layer in sp) {
							var cld = sp[layer];

							if (cld != undefined) {
								if (layer == s.MSG) {
									if (cld.text.length > 0) {
										s.addMessage(cld, s.eos);
										sn.addChild(cld);
									}
								}
								else {
									sn.addChild(cld);
								}

								if (cld instanceof Figure) {
									s.addMessage(sp[s.MSG], cld[s.MSG], cld['name']);
								}
							}
						}

						sp[s.SELECT] = s.getSelection(d);
						if (sp[s.SELECT] != undefined) {
							sn.addChild(sp[s.SELECT]);
						}
					}
				}
				if (game.seq.length == 0) {
					console.warn('No sequence.');
				}
				else {
					game.pushScene(game.seq[0]);
				}
			};
			game.start();
		};
	},
	/**
	 * play on existing game
	 * FIXME: Not test. enchant.js cannot load images on game.
	 */
	play: function(game) {
		if (game == undefined || !(game instanceof Game)) {
			throw new Error('Argument is not a game instance.');
		}
		this._game = game;
		game.addEventListener(enchant.Event.A_BUTTON_DOWN, playNext);

		if (game.seq.length == 0) throw new Error('No sequence exists.');
		game.pushScene(game.seq[0]);
	},

	/*
	 * Scenario Specification
	 */

	doClear: function(d, sp) {
		var value = d['clear'];
		for (var layer in sp) {
			if ((layer != this.MSG) && (value == 'all' || value == layer)) {
				sp[layer] = undefined;
			}
		}
	},

	getPicture: function(d, layer) {
		var sp;
		if (layer == 'bg') {
			var value = d[layer];
			if (value != undefined) {
				var imgUrl;
				if (typeof(value) == 'string') {
					imgUrl = this.imgdic.urls[value];
				}
				else if (value.img != undefined && typeof(value.img) == 'string') {
					imgUrl = this.imgdic.urls[value.img];
				}
				else {
					console.warn('No image url.');
				}
				var img = this._game.assets[imgUrl];

				sp = new Picture(this._game, img, { url: imgUrl });
			}
		}
		return sp;
	},

	getFigure: function(d, layer) {
		var sp;
		if (this.LAYERS.indexOf(layer) > 0) {
			var value = d[layer];
			if ((value != undefined) && (value instanceof Character == true)) {
				var props = value.getProps();
				if (props != undefined && props.url != undefined) {
					var img = this._game.assets[props.url];
					props.x = Math.floor(this._game.width / 6) * props.xpos - Math.floor(img.width / 2);
					sp = new Figure(img, props);
				}
			}
		}
		return sp;
	},

	/**
	 * @param msg {Message}
	 * @param text {String}	i.e. message
	 * @param name {String}	name in message dialog
	 */
	addMessage: function(msg, text, name) {
		if (name != undefined) {
			msg.text += '<span class="m3_msg_name">' + (new String(name)) + '</span><br/>';
		}
		if (text != undefined) {
			msg.text += new String(text) + '<br/>';
		}
	},

	getMessage: function(d, msg) {
		var text = d[this.MSG];
		if (text != undefined && text.length > 0) {
			this.addMessage(msg, text);
		}
		return msg;
	},

	getSelection: function(d) {
		var lbl;
		var slct = d['select'];
		if (slct != undefined) {
			var msg = slct['msg'];
			var opts = slct['options'];
			if (msg != undefined && opts != undefined) {
				lbl = new Message(Math.floor(this._game.width / 2), this._game.height, 0.4);
				lbl.x = this._game.width / 4;
				lbl.text = msg;
				for (var i = 1; i <= 9; i++) {
					var opt = opts[i];
					if (opt != undefined && opt['label'] != undefined && opt['linkTo'] != undefined) {
						lbl.text += '<div class="command"><a href="' + opt['linkTo'] + '">' + opt['label'] + '</a></div>';
					}
				}
			}
		}
		return lbl;
	}
};
// TODO: もちっとスマートな形にはならないものか？
var playNext = function(){
	var game;
	if (this instanceof Game) {
		game = this;
	}
	else if (this.s != undefined) {
		// 'this' is instance of Window / DOMWindow
		game = this.s._game;
	}

	if (game != undefined) {
		game.seqNo++;
		if (game.seq.length > game.seqNo) {
			game.replaceScene(game.seq[game.seqNo]);
			console.info('Play: ' + game.seqNo + '/' + (game.seq.length - 1));
		} else {
			game.popScene();
			game.stop();
			console.info('Game stoped.');
		}
	}
	else {
		console.warn('Cannot get a game object. "this" is ...');
		console.debug(this);
	}
};
enchant.m3.Scenario.prototype.__defineSetter__('images', function(images) {
	// Get all image URL
	for (var key in images) {
		this.imgdic.set(key, images[key], this.baseURL);
	}
});
enchant.m3.Scenario.prototype.__defineSetter__('sequence', function(sequence) {
	// Get all image URL
	for (var key in sequence) {
		var value = sequence[key];
		var imgdic = this.imgdic;
		this.LAYERS.forEach(function(layer) {
			if (value[layer] != undefined) {
				if (typeof(value[layer]) == 'string') {
					// Got already, but...
					if (imgdic.urls[value[layer]] == undefined) {
						console.warn('Not regist image URL in s.images; sequence: '
							+ key + ' > ' + layer + ', name: ' + value[layer]);
					}
				}
				else if (value[layer].getProps != undefined) {
					var props = value[layer].getProps();
					imgdic.set(props.key, props.url);
				}
			}
		});
	}
	this._sequence = sequence;
});
enchant.m3.Scenario.prototype.__defineGetter__('sequence', function() {
	return this._sequence;
});

/**
 * [ キャラクター定義 ]
 *  シナリオ中に登場するキャラクターはすべてこのクラスのオブジェクトと
 *  なります。
 *
 * @param name
 *  コンストラクタの第一引数は'キャラクター名'です。
 *
 * @param definition
 *  第二引数に各定義を記述したオブジェクトを渡します。
 *  表示に使う画像を 'ポーズ名' : '画像ファイルパス' の形式で記述します。
 *  baseUrl + 上記パス で画像URLを指定します。
 *  フルパスが記述されている時、baseUrlは無視されます。
 *
 *  Webサービス、M3Interface(@see http://m3itfc.appspot.com/)にて画像
 *  ライブラリを提供する予定です。
 */
enchant.m3.Character = function(name, definition) {
	this.id = name;
	this.name = name;
	this.definition = definition;

	this.key = '';
	this.xpos = this.POSITION.indexOf('CENTER');
	this.xoffset = 0;
	this.msg = '';

	this.imgdic = new ImageDic();
	this.addDefinition(definition);

	this._self = this;
};
enchant.m3.Character.prototype = {
		/**
		 * X position of character
		 *   Not a numeric, it is ratio for screen width.
		 *   'LEFT_EDGE' is on left edge of screen. It shows right half of character.
		 *   'LEFT', 'CENTER' and 'RIGHT' is position in 3 person.
		 *   'LEFT2', 'RIGHT2' is postion in 2 person.
		 */
		POSITION: ['LEFT_EDGE', 'LEFT', 'LEFT2', 'CENTER', 'RIGHT2', 'RIGHT', 'RIGHT_EDGE'],

		addDefinition: function(definition) {
			for (var key in definition) {
				if (key == 'baseUrl') {
					// Not image
				}
				else {
					var urlKey = this.getURLKey(this.id, key);
					this.imgdic.set(urlKey, definition[key], definition.baseUrl);

					if (this.imgdic.urls[this.name] == undefined) {
						this.imgdic.set(this.name, definition[key], definition.baseUrl);
					};
				}
			}
		},

		/**
		 * get shallow copy
		 */
		clone: function() {
			var cln = new Character();
			for (var key in this._self) {
				var value = this._self[key];
				if (typeof(value) != 'function') {
					cln[key] = value;
				}
			}
			return cln;
		},

		getURLKey: function(id, key) {
			var urlKey = id;
			if (key != undefined && key.length > 0) {
				urlKey += '.' + key;
			}
			return urlKey;
		},

		/**
		 * @returns character properties
		 *   key: key of ImageDic
		 *   url: key of Game.assets
		 *   xpos: position of character
		 *   name: name in message dialog
		 *   msg: message in message dialog
		 */
		getProps: function(doClearMsg) {
			var urlKey = this.getURLKey(this.id, this.key);
			var props = {
				key:  urlKey,
				url: this.imgdic.urls[urlKey],
				xpos: this.xpos,
				name: this.name,
				msg: this.msg
			};
			return props;
		},

		say: function(msg) {
			this.msg = msg;
			this._self.msg = msg;
			return this.clone();
		},
		as: function(name) {
			this.name = name;
			this._self.name = name;
			return this.clone();
		},
		is: function() {
			return this.clone();
		},
		act: function(key) {
			this.key = key;
			this._self.key = key;
			return this.clone();
		},
		wiz: function(key) {
			this.key = key;
			this._self.key = key;
			return this.clone();
		},
		/**
		 * left position with 3 person
		 */
		onLeft: function(offset) {
			this.xpos = this.POSITION.indexOf('LEFT');
			this._self.xpos = this.xpos;
			if (offset != undefined) {
				this.xoffset = offset;
				this._self.xoffset = offset;
			}
			return this.clone();
		},
		/**
		 * left position with 2 person
		 */
		onLeft2: function(offset) {
			this.xpos = this.POSITION.indexOf('LEFT2');
			this._self.xpos = this.xpos;
			if (offset != undefined) {
				this.xoffset = offset;
				this._self.xoffset = offset;
			}
			return this.clone();
		},
		onCenter: function(offset) {
			this.xpos = this.POSITION.indexOf('CENTER');
			this._self.xpos = this.xpos;
			if (offset != undefined) {
				this.xoffset = offset;
				this._self.xoffset = offset;
			}
			return this.clone();
		},
		/**
		 * right position with 3 person
		 */
		onRight: function(offset) {
			this.xpos = this.POSITION.indexOf('RIGHT');
			this._self.xpos = this.xpos;
			if (offset != undefined) {
				this.xoffset = offset;
				this._self.xoffset = offset;
			}
			return this.clone();
		},
		/**
		 * right position with 2 person
		 */
		onRight2: function(offset) {
			this.xpos = this.POSITION.indexOf('RIGHT2');
			this._self.xpos = this.xpos;
			if (offset != undefined) {
				this.xoffset = offset;
				this._self.xoffset = offset;
			}
			return this.clone();
		}
};

/**
 * Background image, Event CG and so on...
 */
enchant.m3.Picture = enchant.Class.create(enchant.Sprite, {
	/**
	 * @param container means game object
	 * @param img
	 * @param props
	 */
	initialize: function(container, img, props) {
		var width = container.width;
		var height = container.height;
		Sprite.call(this, width, height);
		if (img != undefined) {
			try {
				// for full image
				// TODO: for difference
				var trimmed_img = new Surface(width, height);
				var offsetX = 0;
				var offsetY = 0;
				var whRatio_src = img.width / img.height;
				var whRatio_dist = width / height;
				if (whRatio_dist < whRatio_src) {
					// cut off both side
					offsetX = Math.floor((img.width - img.height / whRatio_dist) / 2);
				} else {
					// cut off ceil and floor
					offsetY = Math.floor((img.height - img.width * whRatio_dist) / 2);
				}
				trimmed_img.draw(img, offsetX, offsetY, img.width - offsetX * 2, img.height - offsetY * 2, 0, 0, width, height);
				this.image = trimmed_img;
			}
			catch(e) {
				console.warn(e);
				this.image = img;
			}
			if (props != undefined) {
				this.url = props.url;
			}
		}
	},

	clone: function() {
		var cln = new Sprite(this.width, this.height);
		cln.image = this.image;
		cln.url = this.url;
		cln.clone = this.clone;

		return cln;
	}
});

/**
 * Character image
 */
enchant.m3.Figure = enchant.Class.create(enchant.Sprite, {
	/**
	 * @param img
	 * @param props is properties of Character object
	 */
	initialize: function(img, props) {
		Sprite.call(this, img.width, img.height);
		this.image = img;

		if (props != undefined) {
			this.msg = props.msg;
			this.name = props.name;
			this.url = props.url;
			this.x = props.x;
		}
	},

	clone: function() {
		var cln = new Sprite(this.width, this.height);
		cln.image = this.image;
		cln.msg = this.msg;
		cln.name = this.name;
		cln.url = this.url;
		cln.x = this.x;
		cln.clone = this.clone;

		return cln;
	}
});

enchant.m3.Message = enchant.Class.create(enchant.Label, {
	/**
	 * @param width {Number} of game screen
	 * @param height {Number} of game screen
	 * @param y_ratio {Number}	y = height * y_ratio
	 */
	initialize: function(width, height, y_ratio) {
		Label.call(this, '');
		this._element.className = 'm3_message';

		this.x = 5;
		if (width != undefined && typeof(width) == 'number' && width > 0) {
			this.x = Math.floor(width * 0.02);
			this.width = width - this.x * 2;
		}
		this.y = 5;
		var yr = 0.75;
		if (y_ratio != undefined && typeof(y_ratio) == 'number' && y_ratio > 0 && y_ratio < 1) {
			yr = y_ratio;
		}
		if (height != undefined && typeof(height) == 'number' && height > 0) {
			this.y = Math.floor(height * yr);
		}
	}
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
				baseUrl = baseUrl + '/';
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
