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

/*
 * TODO: delete @deprecated
 */

/**
 * 使用画像のURLを管理するクラス
 * > Utility class to get image URL
 */
enchant.m3.ImageBank = function() {
	this.urls = {};
};
enchant.m3.ImageBank.prototype = {
	/**
	 * 画像URLを登録する
	 * > Set image URL
	 *
	 * @param {String} key
	 *   シナリオ内で指定するときの名前
	 *   > key is name in scenario.
	 *
	 * @param {String/Object} value
	 *   {String}の場合、それは画像URLとみなす
	 *   > If value is string, it is URL of image.
	 *   {Object}の場合、そのimgプロパティを画像URLとみなす
	 *   > If valule is object, its 'img' property is URL of image.
	 *
	 * @param {String} baseURL (optional)
	 *                  baseURL is optional, it added before url
	 */
	set: function(key, value, baseURL) {
		var url;
		if (typeof(value) == 'string') {
			url = value;
		} else {
			if (value != undefined && value.img != undefined && typeof(value.img) == 'string')
			url = value.img;
		}
		if (url != undefined) {
			var fullURL = getFullURL(url, baseURL);
			if (this.urls[key] != undefined && this.urls[key] != fullURL) {
				console.warn('key:' + key + ' is already registed by other value.');
			}
			this.urls[key] = fullURL;
		}
		else {
			console.warn('Failed to get url. value is ...');
			console.debug(value);
		}
	},

	/**
	 * Game.preload の引数となる、画像URL配列を取得する
	 *
	 * @return {Array}
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
 * [ キャラクター定義 ]
 *  シナリオ中に登場するキャラクターはすべてこのクラスのオブジェクトと
 *  なります。
 *
 * @param {String} name
 *  コンストラクタの第一引数は'キャラクター名'です。
 *
 * @param {Object} definition
 *  第二引数に各定義を記述したオブジェクトを渡します。
 *
 *  images :
 *  表示に使う画像を 'ポーズ名' : '画像ファイルパス' の形式で記述します。
 *  baseURL + 上記パス で画像URLを指定します。
 *  フルパスが記述されている時、baseURLは無視されます。
 *
 *  Webサービス、M3Interface(@see http://m3itfc.appspot.com/)にて画像
 *  ライブラリを提供する予定です。
 */
enchant.m3.Character = function(name, definition) {
	/**
	 * キャラクター名(識別子)
	 * @type {String}
	 */
	this.id = name;

	/**
	 * キャラクターが現在取っているポーズの名前
	 * 画像ファイルを取得する祭のキーとなる
	 * @type {String}
	 */
	this.key = '';

	/**
	 * キャラクターが現在取っているポーズの画像ファイルURL
	 * @type {String}
	 */
	this.url = '';

	/**
	 * キャラクターのショット(表示範囲)
	 * @see this.prototype.SHOT_TYPES
	 * @type {String}
	 */
	this.shot_type = this.defaultShotType;

	/**
	 * キャラクターの立ち位置＝X(横)軸方向の表示位置
	 * @see this.prototype.POSITIONS
	 * @type {Number}
	 */
	this.posX = this.POSITIONS['CENTER'];

	/**
	 * キャラクターの表示位置オフセット
	 * @type {Number}
	 */
	this.offsetX = 0;
	this.offsetY = 0;

	/**
	 * メッセージウィンドウに表示されるキャラクター名
	 * ※作中にて変更可能
	 */
	this.name = name;

	/**
	 * キャラクターの現在の台詞
	 */
	this.msg = '';

	/**
	 * キャラクター定義
	 * @type {Object}
	 */
	this._defImg = {};
	this.addDefinition(definition);

	/* @deprecated */
	// this.imgbnk = new ImageBank();

	/**
	 * メソッドチェーンでプロパティを引き継ぐためのコピー
	 */
	this._self = this;
};
enchant.m3.Character.prototype = {
		/**
		 * キャラクターの立ち位置＝X(横)軸方向の表示位置
		 * X position of character
		 *
		 *   座標ではなく、ゲームスクリーン幅を等分割しての指定となります
		 *   Not coordinates, it is ratio for screen width.
		 *
		 *   'LEFT_EDGE'はスクリーンの左端です。キャラ画像の中心＝左端のため、右半分だけが表示されることになります
		 *   'LEFT_EDGE' is on left edge of screen. It shows right half of character.
		 *
		 *   'LEFT', 'CENTER', 'RIGHT'は画面にキャラが三人並んだ時のそれぞれの位置のイメージです
		 *   'LEFT', 'CENTER' and 'RIGHT' is position in 3 person.
		 *
		 *   同様に、'LEFT2', 'RIGHT2'は二人並んだ時の位置のイメージとなります
		 *   'LEFT2', 'RIGHT2' is postion in 2 person.
		 */
		POSITIONS: ['LEFT_EDGE', 'LEFT', 'LEFT2', 'CENTER', 'RIGHT2', 'RIGHT', 'RIGHT_EDGE'],

		/**
		 * キャラクターのショット(表示範囲)
		 *
		 * CU: Close Up 顔(クローズアップ)
		 * BS: Bust Shot 胸から上
		 * WS: Waist Shot 腰から上
		 * KS: Knee Shot ひざから上
		 * FS: Full Shot 全身
		 */
		SHOT_TYPES: ['CU', 'BS', 'WS', 'KS', 'FS'],

		/**
		 * 指定がないときのショット
		 */
		defaultShotType: 'WS',

		/**
		 * キャラ定義を追加/上書きします
		 */
		addDefinition: function(definition) {
			if (definition != undefined) {
				var def_images = definition.images;
				if (def_images != undefined) {
					for (key in def_images) {
						// デフォルトのポーズ名設定
						if (this.key == undefined || this.key.length == 0) this.key = key;
						this._defImg[key] = this.normalizeDefinition(def_images[key], definition.baseURL);
					}
				}
			}
		},

		/**
		 * キャラ定義を正規化します
		 * ここでいう正規化とは、簡易定義も詳細定義も同じフォーマットにすることです
		 *
		 * [フォーマット]
		 *   ショット名
		 *     url
		 *     baseY
		 *     scale
		 *
		 * @param {Object} def ポーズごとの定義
		 */
		normalizeDefinition: function(def, baseURL) {
			var defimg = {};
			if (typeof(def) == 'string') {
				// 簡易的な定義
				defimg[this.defaultShotType].url = getFullURL(def, baseURL);
			}
			else {
				// 詳細な定義
				var shots = def.shots;
				for (shot_type in shots) {
					defimg[shot_type] = shots[shot_type];
					defimg[shot_type].url = getFullURL(def.img, baseURL);
				}
			}
			return defimg;
		},

		/**
		 * @returns キャラクタ表示プロパティ一式 character properties
		 *
		 *   key: ポーズ名
		 *
		 *   url: 画像URL(＝Game.assetsのキー)
		 *        key of Game.assets
		 *
		 *   ratioX: キャラクターのX(横)軸方向の表示位置　※画面幅に対する比率
		 *         position of character
		 *
		 *   baseY: キャラクタ表示時、下限のY座標。ショットによって異なる
		 *
		 *   scale: 表示倍率。ショットによって異なる
		 *
		 *   offsetX, offsetY: 表示位置のオフセット
		 *                     position offset
		 */
		getProps: function() {
			var def = this._defImg[this.key][this.shot_type];

			var scale = (def.scale == undefined) ? 1 : def.scale;
			var baseY = (def.baseY == undefined) ? 0 : def.baseY * scale;
			// ↑FIXME: 簡易定義のときは画像の下端(height)にしたいのだが…

			var props = {
				key: this.key,
				url: def.url,
				ratioX: this.posX / this.POSITIONS.length,
				baseY: baseY,
				scale: scale,
				offsetX: this.offsetX,
				offsetY: this.offsetY
			};
			return props;
		},

		/**
		 * @returns 台詞 character words
		 *
		 *   name: メッセージウィンドウに表示されるときの名前
		 *         name in message window
		 *
		 *   msg: メッセージウィンドウに表示される文章(＝セリフ)
		 *        message in message window
		 */
		getWords: function () {
			var words = {
				name: this.name,
				msg: this.msg
			};
			return words;
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

		say: function(msg) {
			this.msg = this._self.msg = msg;
			return this.clone();
		},
		as: function(name) {
			this.name = this._self.name = name;
			return this.clone();
		},
		is: function() {
			return this.clone();
		},
		act: function(key) {
			this.key = this._self.key = key;
			return this.clone();
		},
		wiz: function(key) {
			this.key = this._self.key = key;
			return this.clone();
		},
		/**
		 * left position with 3 person
		 */
		onLeft: function(offset) {
			this.posX = this._self.posX = this.POSITIONS.indexOf('LEFT');
			return this.withOffset(offset);
		},
		/**
		 * left position with 2 person
		 */
		onLeft2: function(offset) {
			this.posX = this._self.posX = this.POSITIONS.indexOf('LEFT2');
			return this.withOffset(offset);
		},
		onCenter: function(offset) {
			this.posX = this._self.posX = this.POSITIONS.indexOf('CENTER');
			return this.withOffset(offset);
		},
		/**
		 * right position with 3 person
		 */
		onRight: function(offset) {
			this.posX = this._self.posX = this.POSITIONS.indexOf('RIGHT');
			return this.withOffset(offset);
		},
		/**
		 * right position with 2 person
		 */
		onRight2: function(offset) {
			this.posX = this._self.posX = this.POSITIONS.indexOf('RIGHT2');
			return this.withOffset(offset);
		},
		withOffset: function(x, y) {
			if (x != undefined) {
				this.offsetX = this._self.offsetX = x;
			}
			if (y != undefined) {
				this.offsetY = this._self.offsetY = y;
			}
			return this.clone();
		}
};

/**
 * シナリオデータ(画像、テキスト、効果など)のクラス
 * > Scenario data
 */
enchant.m3.Scenario = function() {
	// this._sequence; // @deprecated
	// this._seqcount; // @deprecated
	// this._game; // @deprecated
	// this._imgdic = new ImageBank(); @deprecated

	/**
	 * @type {String]
	 * URLの記述を短縮するために、共通部分を指定することが出来る。
	 */
	this.baseURL = '';

	/**
	 * [ 使用する画像の定義 ]
	 * @type {Object}
	 *
	 * key:
	 *   シナリオ内で指定するときの名前
	 *   > key is name in scenario.
	 *
	 * value:
	 *   画像URL
	 *   > image URL
	 */
	this.images = {};

	/**
	 * [ シナリオ定義 ]
	 */
	this.sequence = {};

	/**
	 * @type {String}
	 * すべての文末に付ける文字列。HTMLタグも使用可能。
	 * > End Of Sentence. HTML tags available.
	 */
	this.eos = '';
};
enchant.m3.Scenario.prototype = {
	/**
	 * シーケンス番号として使える最大値
	 */
	MAX_SEQUENCE_NO: 999,

	/**
	 * レイヤ名
	 * 左から順に、上へ重ねられていく
	 */
	LAYERS: ['bg', 'l1', 'l2', 'l3'],

	AUDIO: 'audio',

	MSG: 'msg',

	SELECT: 'select',

	/*
	initialize: function(game) {
		game.seq = [];
		game.seqNo = 0;

		game.keybind(13, 'a'); // enter key
		game.keybind(32, 'a'); // space key
		game.addEventListener(enchant.Event.A_BUTTON_DOWN, playNext);
		return game;
	},
	*/

	/**
	 * 最初のシーケンスから再生する
	 * > play on new game
	 */
	start: function() {
		// delete: var s = this;
		window.onload = function() {
			var game = new Game();
			var player = new Player(game, this.sequence);
			player.start();

			/* -> Player.constractor
			s._game = new Game();
			var game = s.initialize(s._game);

			game.keybind(13, 'a'); // enter key
			game.keybind(32, 'a'); // space key
			game.addEventListener(enchant.Event.A_BUTTON_DOWN, playNext);

			game.keybind(66, 'b'); // 'b' key
			game.addEventListener(enchant.Event.B_BUTTON_DOWN, playBack);

			s._seqcount = getLength(s.sequence);

			*/
			var imgURLs = player.getImageURLs();
			game.preload(imgURLs);

			game.onload = function() {
				player.playNext();
				/*
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

						sp[s.MSG] = new Message('', { y: game.height * 0.75 });
						sp[s.MSG] = s.getMessage(d, sp[s.MSG]);

						s.doClear(d, sp);

						for (var layer in sp) {
							var cld = sp[layer];

							if (cld != undefined) {
								if (layer == s.MSG) {
									if (cld.text.length > 0) {
										if (game.seq.length < s._seqcount) {
											//cld.addMessage(s.eos);
											sn.addChild(new NextButton(s.eos));
										}
										sn.addChild(cld);
									}
								}
								else {
									sn.addChild(cld);
								}

								if (cld instanceof Figure) {
									sp[s.MSG].addMessage(cld[s.MSG], cld['name']);
								}

								if (game.seq.length == s._seqcount && s.eog != undefined) {
									sp[s.MSG].addMessage(s.eog);
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
				*/
			};
			// game.start();
		};
	}

//	doClear: function(d, sp) {
//		var value = d['clear'];
//		for (var layer in sp) {
//			if ((layer != this.MSG) && (value == 'all' || value == layer)) {
//				sp[layer] = undefined;
//			}
//		}
//	},
//
//	getPicture: function(d, layer) {
//		var sp;
//		if (layer == 'bg') {
//			var value = d[layer];
//			if (value != undefined) {
//				var imgURL;
//				if (typeof(value) == 'string') {
//					imgURL = this._imgdic.urls[value];
//				}
//				else if (value.img != undefined && typeof(value.img) == 'string') {
//					imgURL = this._imgdic.urls[value.img];
//				}
//				else {
//					console.warn('No image url.');
//				}
//				var img = this._game.assets[imgURL];
//
//				sp = new Picture(this._game, img, { url: imgURL });
//			}
//		}
//		return sp;
//	},
//
//	getFigure: function(d, layer) {
//		var sp;
//		if (this.LAYERS.indexOf(layer) > 0) {
//			var value = d[layer];
//			if ((value != undefined) && (value instanceof Character == true)) {
//				var props = value.getProps();
//				if (props != undefined && props.url != undefined) {
//					var img = this._game.assets[props.url];
//					props.x = Math.floor(this._game.width / 6) * props.ratioX - Math.floor(img.width / 2);
//					sp = new Figure(img, props);
//				}
//			}
//		}
//		return sp;
//	}

	/**
	 * @deprecated 以下のメソッド全て
	 *
	 * @param msg {Message}
	 * @param text {String}	i.e. message
	 * @param name {String}	name in message window
	 */
//	addMessage: function(msg, text, name) {
//		if (name != undefined) {
//			msg.text += '<span class="m3_msg_name">' + (new String(name)) + '</span><br/>';
//		}
//		if (text != undefined) {
//			msg.text += new String(text) + '<br/>';
//		}
//	},
//
//	getMessage: function(d, msg) {
//		var text = d[this.MSG];
//		if (text != undefined && text.length > 0) {
//			msg.addMessage(text);
//		}
//		return msg;
//	},
//
//	getSelection: function(d) {
//		var grp = new Group();
//		var slct = d['select'];
//		if (slct != undefined) {
//			var msg = slct['msg'];
//			if (slct['options'] != undefined) {
//				/*
//				lbl = new Message(Math.floor(this._game.width / 2), this._game.height, 0.4);
//				lbl.x = this._game.width / 4;
//				*/
//				if (msg != undefined) {
//					//lbl.text = msg;
//					var sel = new Selection(msg);
//					sel._y = 60;
//					grp.addChild(sel);
//				}
//				var opts = [];
//				for (var i = 1; i <= 5; i++) {
//					var opt = slct['options'][i];
//					if (opt != undefined && opt['label'] != undefined && opt['linkTo'] != undefined) {
//						//lbl.text += '<div class="m3_command"><a href="' + opt['linkTo'] + '">' + opt['label'] + '</a></div>';
//						opts[i-1] = new SelOption(opt['label'], opt['linkTo']);
//						opts[i-1]._y = sel._y + 14 + i * 38;
//						grp.addChild(opts[i-1]);
//					}
//				}
//			}
//		}
//		return grp;
//	}
};
///**
// * @deprecated
// */
//enchant.m3.Scenario.prototype.__defineSetter__('images', function(images) {
//	// Get all image URL
//	for (var key in images) {
//		this._imgdic.set(key, images[key], this.baseURL);
//	}
//});
///**
// * @deprecated
// */
//enchant.m3.Scenario.prototype.__defineSetter__('sequence', function(sequence) {
//	// Get all image URL
//	for (var key in sequence) {
//		var value = sequence[key];
//		var imgbnk = this._imgdic;
//		this.LAYERS.forEach(function(layer) {
//			if (value[layer] != undefined) {
//				if (typeof(value[layer]) == 'string') {
//					// Got already, but...
//					if (imgbnk.urls[value[layer]] == undefined) {
//						console.warn('Not regist image URL in s.images; sequence: '
//							+ key + ' > ' + layer + ', name: ' + value[layer]);
//					}
//				}
//				else if (value[layer].getProps != undefined) {
//					var props = value[layer].getProps();
//					imgbnk.set(props.key, props.url);
//				}
//			}
//		});
//	}
//	this._sequence = sequence;
//});
///**
// * @deprecated
// */
//enchant.m3.Scenario.prototype.__defineGetter__('sequence', function() {
//	return this._sequence;
//});

/**
 * 与えられたgameオブジェクトにてシナリオを再生する
 * 既存のgameオブジェクトを渡すことにより、カットバック的な使い方も可能？
 */
enchant.m3.Player = function(game, scenario) {
	this._game = game;

	/**
	 * 使用画像バンク
	 */
	this.imgbnk = new ImageBank();

	/**
	 * ゲーム画面に表示されている画像要素
	 */
	this.layers = new Layers(scenario.LAYERS);

	/**
	 * メッセージウィンドウ
	 */
	this.msg = new Message();

	/**
	 * 正規化されたシーケンスデータ
	 * this.layers に表示される
	 */
	this.seqs = [];

	/**
	 * 正規化されたメッセージデータ
	 * this.msg に表示される
	 */
	this.msgqs = [];

	/**
	 * 表示中のシーケンス番号
	 */
	this.seqNo = 0;

	/**
	 * 表示しているゲーム画面
	 */
	this.screen = this.build();

	this.setKeybind();

	this.loadScenario(scenario);
};

enchant.m3.Player.prototype = {
	/**
	 * キー → ボタンへの割り当て
	 */
	setKeybind: function() {
		this._game.keybind(13, 'a'); // enter key
		this._game.keybind(32, 'a'); // space key
		this._game.addEventListener(enchant.Event.A_BUTTON_DOWN, this.playNext);

		this._game.keybind(66, 'b'); // 'b' key
		this._game.addEventListener(enchant.Event.B_BUTTON_DOWN, this.playBack);
	},

	/**
	 * シナリオを読み込む
	 * @param scenario {Scenario}
	 */
	loadScenario: function(scenario) {
		/**
		 * scenarioがオブジェクト型だったときに読み込む、最大のシーケンス番号
		 */
		var maxSeqNo = scenario.MAX_SEQUENCE_NO;

		// scenarioが配列だったとき、最大シーケンス番号は配列の最後のインデックス
		if (scenario.length != undefined && scenario.length > 0) {
			maxSeqNo = scenario.length - 1;
		}
		var layers = scenario.LAYERS;
		var msg_layers = scenario.LAYERS;
		msg_layers.push(scenario.MSG);
		for (var i = 0; i<=maxSeqNo; i++) {
			if (scenario[i] != undefined) {
				seqs.push(this.getSequence(scenario[i], layers));
				msgqs.push(this.getMessage(scenario[i], msg_layers));
			}
		}
	},

	/**
	 * シーケンスデータを正規化しながら取得
	 *
	 * @param cut 一カット分のシナリオデータ
	 * @param {Array} layers 取得対象レイヤ
	 */
	getSequence: function(cut, layers) {
		var seq = {};

		for (var key in layers) {
			var layer = cut[key];
			if (layer != undefined) {
				if (typeof(layer) == 'string') {
					seq[key] = { url: this.imgbnk.url[layer], fitScreen: true };
				}
				else if (layer instanceof Character) {
					seq[key] = layer.getProps();
				}
			}
		}

		return seq;
	},

	/**
	 * メッセージデータを取得
	 *
	 * @param cut 一カット分のシナリオデータ
	 * @param {Array} layers 取得対象レイヤ
	 */
	getMessage: function(cut, layers) {
		var msg = "";

		for (var key in layers) {
			var layer = cut[key];
			if (layer != undefined) {
				if (typeof(layer) == 'string' && layer.length > 0) {
					msg += layer + '<br/>';
				}
				else if (layer instanceof Character) {
					var chara = layer.getWords();
					if (chara.msg != undefined && chara.msg.length > 0) {
						msg += chara.name + '<br/>';
						msg += chara.msg + '<br/>';
					}
				}
			}
		}

		return msg;
	},

	/**
	 * ゲーム画面を構成する
	 *
	 * @return {enchant.Scene} ゲーム画面
	 */
	build: function() {
		var screen = new Scene();

		// 各レイヤの表示位置は変動する
		screen.addChild(this.layers);

		var width = this._game.width;
		var height = this._game.height;
		var baseY = height * 0.75;
		this._game.baseY = baseY;

		var margin = 4;
		this.msg.x = margin;
		this.msg.width = width - margin * 2;
		this.msg.y = baseY;
		screen.addChild(this.msg);

		var history_btn = new HistoryBtn();
		history_btn.x = width - this.history_btn.width;
		history_btn.y = baseY - history_btn.height / 2;
		screen.addChild(history_btn);

		var back_btn = new BackBtn('戻る');
		back_btn.x = width - this.back_btn.width;
		back_btn.y = height - back_btn.height;
		screen.addChild(back_btn);

		this._game.pushScene(screen);
		return screen;
	},

	start: function() {
		this._game.preload(this.imgbnk.getURLArray());

		this._game.onload = function() {
			player.playNext();
		};
	},

	/**
	 * 次のシーケンスへ進む
	 */
	playNext: function() {
		this.layers.setSequence(this.seqs[this.seqNo], this.seqs[++this.seqNo]);
		/*
		var game = s._game;

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
		 */
	},

	playBack: function() {
		var game;
		if (this instanceof Game) {
			game = this;
		}
		else if (this.s != undefined) {
			// 'this' is instance of Window / DOMWindow
			game = this.s._game;
		}

		if (game != undefined) {
			if (game.seqNo > 0) {
				game.seqNo--;
				game.replaceScene(game.seq[game.seqNo]);
				console.info('Play: ' + game.seqNo + '/' + (game.seq.length - 1));
			}
		}
		else {
			console.warn('Cannot get a game object. "this" is ...');
			console.debug(this);
		}
	}
};

/**
 * 画面に表示される画像要素のグループ
 */
enchant.m3.Layers = enchant.Class.create(enchant.Group, {
	/**
	 * @param {Array} layer_ids レイヤIDのセット
	 */
	initialize: function(layer_ids) {
		Group.call(this);

		if (layer_ids == undefined || layer_ids.length == undefined) {
			console.warn('layer_ids is illegal.');
		} else {
			this.ids = layer_ids;

			for (var i=0; i<this.ids.length; i++) {
				var id = this.ids[i];
				this[id] = new Layer(id);
				this.addChild(this[id]);
			}
		}

		this.addEventListener(enchant.Event.ENTER_FRAME, function() {
			// TODO: 全レイヤに適用されるanimation/transition
		});
	}
});

/**
 * シーケンス情報をセットする
 * 処理は完全に Layer に委譲される
 *
 * @param seq {Object}
 * @param next_seq {Object} (optional)
 */
enchant.m3.Layers.prototype.setSequence = function(seq, next_seq) {
	for (var i=0; i<this.ids.length; i++) {
		var id = this.ids[i];
		this[id].setSequence(seq, next_seq);
	}
};

/**
 * 画面に表示される一つの画像要素
 * 他の要素と重ねて表示される
 *
 * 表示開始状態(img)と表示終了状態(next_img)を持ち、フレームごとに書き換える
 * ことで、アニメーションに対応している
 */
enchant.m3.Layer = enchant.Class.create(enchant.Group, {
	initialize: function(layer_id) {
		Group.call(this);
		this.id = layer_id;
		var game = enchant.Game.instance;

		/**
		 * 表示開始状態
		 * @type enchant.Sprite
		 */
		this.img = new Sprite(game.width, game.height);
		this.addChild(img);

		/**
		 * 表示終了状態
		 * @type enchant.Sprite
		 */
		this.next_img = new Sprite(game.width, game.height);
		this.addChild(next_img);

		this.addEventListener(enchant.Event.ENTER_FRAME, function() {
			// TODO: animation/transition
		});
	}
});

/**
 * シーケンス情報をセットする
 *
 * @param {Object} seq
 * @param {Object} next_seq (optional)
 */
enchant.m3.Layer.prototype.setSequence = function(seq, next_seq) {
	if (seq != undefined) {
		this.setImage.apply(this.img, seq[this.id]);

		if (next_seq != undefined) {
			this.setImage.apply(this.next_img, next_seq[this.id]);
		}
	}
	else {
		console.warn('seq is undefined.');
	}
};

/**
 * 表示する画像の各プロパティをセットする
 * this = Sprite オブジェクト
 * @param {Object} seq = 対象レイヤのみのシーケンスデータ
 *
 * [セットされるプロパティ]
 *   url	: 画像のURL
 *   x, y, scaleX, scaleY, opacity は enchant.Sprite に準じます
 */
enchant.m3.Layer.prototype.setImage = function(seq) {
	if (seq != undefined) {
		var game = enchant.Game.instance;

		if (seq['url'] != undefined) {
			this.image = game.assets[seq['url']];
		}

		if (seq['fitScreen'] == true) {
			enchant.m3.Layer.prototype.fitScreen.apply(this);
		}
		else {
			var ratioX = seq['ratioX'];
			if (ratioX != undefined && typeof(ratioX) == 'number') {
				this.x = game.width * ratioX - this.width / 2;
			}

			var baseY = seq['baseY'];
			if (baseY != undefined && typeof(baseY) == 'number') {
				this.y = game.baseY - baseY;
			}

			var scale = seq['scale'];
			if (scale != undefined && typeof(scale) == 'number') {
				this.scaleX = scale;
				this.scaleY = scale;
			}
		}

		/**
		 * 直接指定することが出来るプロパティ
		 */
		var enable_props = ['x', 'y', 'scaleX', 'scaleY', 'opacity'];
		for (var key in enable_props) {
			if (seq[key] != undefined) this[key] = seq[key];
		}
	}
	else {
		console.warn('seq is undefined.');
	}
};

/**
 * 画像を縦あるいは横の小さい方が(ゲーム)スクリーンいっぱいになるよう
 * 拡大/縮小する
 * this = Sprite オブジェクト
 */
enchant.m3.Layer.prototype.fitScreen = function() {
	var img = this.image;
	var trimmed_img = new Surface(this.width, this.height);
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
};

///**
// * Background image, Event CG and so on...
// * @deprecated
// */
//enchant.m3.Picture = enchant.Class.create(enchant.Sprite, {
//	/**
//	 * @param container means game object
//	 * @param img
//	 * @param props
//	 */
//	initialize: function(container, img, props) {
//		var width = container.width;
//		var height = container.height;
//		Sprite.call(this, width, height);
//		if (img != undefined) {
//			try {
//				// for full image
//				var trimmed_img = new Surface(width, height);
//				var offsetX = 0;
//				var offsetY = 0;
//				var whRatio_src = img.width / img.height;
//				var whRatio_dist = width / height;
//				if (whRatio_dist < whRatio_src) {
//					// cut off both side
//					offsetX = Math.floor((img.width - img.height / whRatio_dist) / 2);
//				} else {
//					// cut off ceil and floor
//					offsetY = Math.floor((img.height - img.width * whRatio_dist) / 2);
//				}
//				trimmed_img.draw(img, offsetX, offsetY, img.width - offsetX * 2, img.height - offsetY * 2, 0, 0, width, height);
//				this.image = trimmed_img;
//			}
//			catch(e) {
//				console.warn(e);
//				this.image = img;
//			}
//			if (props != undefined) {
//				this.url = props.url;
//			}
//		}
//	}
//});
//enchant.m3.Picture.prototype.clone = function() {
//	var cln = new Sprite(this.width, this.height);
//	cln.image = this.image;
//	cln.url = this.url;
//	cln.clone = this.clone;
//
//	return cln;
//};
//
///**
// * Character image
// * @deprecated
// */
//enchant.m3.Figure = enchant.Class.create(enchant.Sprite, {
//	/**
//	 * @param img
//	 * @param props is properties of Character object
//	 */
//	initialize: function(img, props) {
//		Sprite.call(this, img.width, img.height);
//		this.image = img;
//
//		if (props != undefined) {
//			this.msg = props.msg;
//			this.name = props.name;
//			this.url = props.url;
//			this.x = props.x;
//		}
//	}
//});
//
//enchant.m3.Figure.prototype.clone = function() {
//	var cln = new Sprite(this.width, this.height);
//	cln.image = this.image;
//	cln.msg = this.msg;
//	cln.name = this.name;
//	cln.url = this.url;
//	cln.x = this.x;
//	cln.clone = this.clone;
//
//	return cln;
//};

/**
 * 角丸めされたLabel
 */
enchant.m3.RoundLabel =  enchant.Class.create(enchant.Label, {
	/**
	 * @param text {String}
	 */
	initialize: function(text) {
		this._super = Label.call(this, text);
		this._element.className = 'round_label';

		this.padding = 8; // from m3script.css
	},

	/**
     * RoundLabelのx座標.
     * @type {Number}
	 * @override Node.x
	 */
	x: {
		get: function() {
			return this._x + this.padding;
		},
		set: function(x) {
			this._x = x;
			this._updateCoordinate();
		}
	},

	/**
     * RoundLabelのx座標.
     * @type {Number}
	 * @override Node.y
	 */
	y: {
		get: function() {
			return this._y + this.padding;
		},
		set: function(y) {
			this._y = y;
			this._updateCoordinate();
		}
	},

    /**
     * RoundLabelの横幅.
     * @type {Number}
     * @override Entity.width
     */
    width: {
        get: function() {
            return this._width - this.padding * 2;
        },
        set: function(width) {
            this._style.width = (this._width = width) + 'px';
        }
    },

    /**
     * RoundLabelの高さ.
     * @type {Number}
     * @override Entity.height
     */
    height: {
        get: function() {
            return this._height - this.padding * 2;
        },
        set: function(height) {
            this._style.height = (this._height = height) + 'px';
        }
    }
});

enchant.m3.RoundLabel.prototype.DUMMY = function() {
};

/**
 * メッセージウィンドウ
 */
enchant.m3.Message =  enchant.Class.create(enchant.m3.RoundLabel, {
	/**
	 * @param text {String}
	 */
	initialize: function() {
		RoundLabel.call(this);
		this._element.className = 'm3_message';

		/**
		 * ウィンドウに現在表示されているテキスト
		 */
		this.text = '';

		/**
		 * ウィンドウに表示するテキスト
		 * (文字送り中でまだ表示されていない部分も含む)
		 */
		this.textBuf = '';

		/**
		 * 文字送りのためのカウンタ
		 */
		this.cnt = 0;
		this.addEventListener(enchant.Event.ENTER_FRAME, function() {
			// TODO: 文字送り
			cnt++;
		});

		// タッチしたら「次へ進む」
		this.addEventListener(enchant.Event.TOUCH_START, playNext);
	}
});

/**
 * テキストをメッセージウィンドウに表示する
 * @param text {String} 表示するテキスト
 * @param name {String} 表示するのがキャラクターの台詞の場合、そのキャラクターの名前
 */
enchant.m3.Message.prototype.setMessage = function(text, name) {
	this.text = '';
	this.textBuf = '';
	this.cnt = 0;

	if (name != undefined) {
		this.text = '<span class="m3_msg_name">' + name + '</span><br/>';
	}
	if (text != undefined) {
		this.textBuf = text + '<br/>';
	}
};

/**
 * 履歴ウィンドウボタン
 */
enchant.m3.HistoryBtn = enchant.Class.create(enchant.m3.RoundLabel, {

	initialize: function(text) {
		RoundLabel.call(this, text);
		this._element.className = 'm3_historybtn';

		// タッチしたら、履歴ウィンドウが開く
		this.addEventListener(enchant.Event.TOUCH_START, function() {
			// TODO:
		});
	}
});
enchant.m3.HistoryBtn.prototype.DUMMY = function() {
};

/**
 * メッセージ履歴ウィンドウ
 */
enchant.m3.HistoryMsg = enchant.Class.create(enchant.m3.RoundLabel, {

	initialize: function(text) {
		RoundLabel.call(this, text);
		this._element.className = 'm3_historymsg';

		// タッチしたら、履歴ウィンドウをたたむ
		this.addEventListener(enchant.Event.TOUCH_START, function() {
			// TODO:
		});
	}
});
enchant.m3.HistoryMsg.prototype.DUMMY = function() {
};

/**
 *「戻る」ボタン
 */
enchant.m3.BackBtn = enchant.Class.create(enchant.m3.RoundLabel, {

	initialize: function(text) {
		RoundLabel.call(this, text);
		this._element.className = 'm3_backbtn';

		// タッチしたら「戻る」
		this.addEventListener(enchant.Event.TOUCH_START, playBack);
	}
});
enchant.m3.BackBtn.prototype.DUMMY = function() {
};

/**
 * 選択ウィンドウ
 */
enchant.m3.Selection = enchant.Class.create(enchant.m3.RoundLabel, {

	initialize: function(text) {
		RoundLabel.call(this, text);
		this._element.className = 'm3_selection';
	}
});

enchant.m3.Selection.prototype.DUMMY = function() {
};

/**
 * 選択肢ボタン
 */
enchant.m3.SelOption = enchant.Class.create(enchant.m3.RoundLabel, {

	initialize: function(label, linkTo, options) {
		RoundLabel.call(this, label, options);
		this._element.className = 'm3_seloption';

		this.applyPadding(8, 32); // from m3script.css

		// タッチしたら「リンク先へ移動」
		this.addEventListener(enchant.Event.TOUCH_START, function() {
			if (linkTo != undefined) location.href = linkTo;
		});
	}
});

enchant.m3.SelOption.prototype.DUMMY = function() {
};

/*
 * ユーティリティとして使われる関数
 * > utility functions
 */

/**
 * 取得しうるもっとも長いURL(絶対URLとは限らない)を取得する
 *
 * @type {String} url
 *
 * @type {String} baseURL
 * URLに"http://"等が含まれないとき、baseURLがurlの前に追加される
 */
function getFullURL(url, baseURL) {
	var fullURL = url;
	if (url != undefined && typeof(url) == 'string' && url.length > 0) {
		if (baseURL != undefined && typeof(baseURL) == 'string' && baseURL.length > 0) {
			if (url.charAt(0) == '/') {
				fullURL = url.substring(1, url.length);
			}
			if (baseURL.charAt(baseURL.length-1) != '/') {
				baseURL = baseURL + '/';
			}

			if (url.indexOf('://') > 0) {
				// That url is 'full', so nothing to do.
			}
			else {
				fullURL = baseURL + fullURL;
			}
		}
	}
	return fullURL;
}

/**
 * オブジェクトのプロパティをカウントする
 * ※関数はノーカウント
 *
 * @returns {Number} プロパティ数
 */
function getLength() {
	var len = 0;
	for (key in this) {
		if (typeof(this[key]) != 'function') len++;
	}
	return len;
}
