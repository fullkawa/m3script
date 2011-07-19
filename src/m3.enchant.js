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
	this.posX = this.POSITIONS.indexOf('CENTER');

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
		 * cu: Close Up 顔(クローズアップ)
		 * bs: Bust Shot 胸から上
		 * ws: Waist Shot 腰から上
		 * ks: Knee Shot ひざから上
		 * fs: Full Shot 全身
		 */
		SHOT_TYPES: ['cu', 'bs', 'ws', 'ks', 'fs'],

		/**
		 * 指定がないときのショット
		 */
		defaultShotType: 'ws',

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
				defimg[this.defaultShotType] = { url: getFullURL(def, baseURL) };
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
		 * @return キャラクタ表示プロパティ一式 character properties
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

			var scale = 1;
			var baseY = 0;
			// ↑FIXME: 簡易定義のときは画像の下端(height)にしたいのだが…
			if (def != undefined) {
				if (def.scale != undefined) scale = def.scale;
				if (def.baseY != undefined) baseY = def.baseY * scale;
			}
			var props = {
				key: this.key,
				url: def.url,
				ratioX: this.posX / (this.POSITIONS.length - 1),
				baseY: baseY,
				scale: scale,
				offsetX: this.offsetX,
				offsetY: this.offsetY
			};
			return props;
		},

		/**
		 * @return 台詞 character words
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
	 * @return {Object} 画像(一枚絵・背景)表示プロパティ一式
	 *
	 * @param {String} key imagesのキー
	 */
	img: function(key) {
		var props = { fitScreen: true };

		var value = this.images[key];
		if (value != undefined) {
			if (typeof(value) == 'string') {
				props.url = getFullURL(value, this.baseURL);
			}
			else {
				// TODO: 差分定義
			}
		}

		return props;
	},

	/**
	 * 最初のシーケンスから再生する
	 * > play on new game
	 */
	start: function() {
		var scenario = this;
		window.onload = function() {
			var game = new Game();
			var player = new Player(game, scenario);
			player.start();
		};
	}
};

/**
 * 与えられたgameオブジェクトにてシナリオを再生する
 * 既存のgameオブジェクトを渡すことにより、カットバック的な使い方も可能？
 */
enchant.m3.Player = function(game, scenario) {
	this._game = game;

	/**
	 * 画像バンク
	 * key, value {String} 画像URL
	 */
	this.imgs = {};

	/**
	 * ゲーム画面に表示されている画像要素
	 */
	this.layers = new Layers(this.LAYERS);

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
	 * ゲーム画面
	 */
	this.scene = this.build();

	this.setKeybind();

	this.loadScenario(scenario);
};

enchant.m3.Player.prototype = {
	/**
	 * レイヤ名
	 * 左から順に、上へ重ねられていく
	 */
	LAYERS: ['bg', 'l1', 'l2', 'l3'],

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

		for (var i = 0; i<=maxSeqNo; i++) {
			var cut = scenario.sequence[i];
			if (cut != undefined) {
				this.seqs.push(this.getSequence(cut));
				this.msgqs.push(this.getMessage(cut));
			}
		}
	},

	/**
	 * シーケンスデータを正規化しながら取得する
	 *
	 * @param cut 一カット分のシナリオデータ
	 */
	getSequence: function(cut) {
		var seq = {};

		for (var i=0; i<this.LAYERS.length; i++) {
			var key = this.LAYERS[i];
			var layer = cut[key];
			if (layer != undefined) {
				if (layer instanceof Character) {
					// 立ち絵の場合
					seq[key] = layer.getProps();
				}
				else {
					// 背景(一枚絵)の場合
					seq[key] = layer;
				}
				this.stockImages(seq[key]);
			}
		}

		return seq;
	},

	/**
	 * 使用される画像URLを重複なしで保持する
	 */
	stockImages: function(seq) {
		var url = seq.url;
		if (url != undefined && typeof(url) == 'string') {
			this.imgs[url] = url;
		}
	},

	/**
	 * 使用画像URLを配列で全て取得する
	 * @return {Array}
	 */
	getImageURLArray: function() {
		var arr = [];
		for (var key in this.imgs) {
			var url = this.imgs[key];
			if (url != undefined && typeof(url) == 'string') arr.push(url);
		}
		return arr;
	},

	/**
	 * メッセージデータを取得する
	 *
	 * @param cut 一カット分のシナリオデータ
	 */
	getMessage: function(cut, layers) {
		var msg = "";
		var layers = this.LAYERS.concat(['msg']);

		for (var i=0; i<layers.length; i++) {
			var key = layers[i];
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
		screen.backgroundColor = 'black';

		/*
		 * 各画面要素の追加
		 */
		screen.addChild(this.layers);

		screen.addChild(this.msg);

		var history_btn = new HistoryBtn('履歴');
		screen.addChild(history_btn);

		var back_btn = new BackBtn('戻る');
		screen.addChild(back_btn);

		this._game.pushScene(screen);

		/*
		 * 各画面要素のレイアウト
		 * clientWidth/Height は pushScene 後にようやく取得できる
		 */
		var width = this._game.width;
		var height = this._game.height;
		var baseY = this._game.baseY = height / (4/3);

		// 各レイヤの表示位置はシーケンスにて変動するので省略

		var margin = 4;
		this.msg.x = margin;
		this.msg.y = baseY;
		this.msg.width = width - margin * 2;
		this.msg.height = height - margin - baseY;

		history_btn.x = width - history_btn._element.clientWidth;
		history_btn.y = baseY - history_btn._element.clientHeight + this.msg.padding;

		back_btn.x = width - back_btn._element.clientWidth;
		back_btn.y = height - back_btn._element.clientHeight;

		return screen;
	},

	/**
	 * 次のシーケンスへ進む
	 */
	playNext: function() {
		this.layers.setSequence(this.seqs[this.seqNo], this.seqs[++this.seqNo]);
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
	},

	start: function() {
		this._game.preload(this.getImageURLArray());

		var player = this;
		this._game.onload = function() {
			player.playNext();
		};
		this._game.start();
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
		this.addChild(this.img);

		/**
		 * 表示終了状態
		 * @type enchant.Sprite
		 */
		this.next_img = new Sprite(game.width, game.height);
		this.next_img.visible = false;
		this.addChild(this.next_img);

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
		if (seq[this.id] != undefined) this.setImage.call(this.img, seq[this.id]);

		if (next_seq != undefined) {
			if (next_seq[this.id] != undefined) this.setImage.call(this.next_img, next_seq[this.id]);
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
			this.width = this.image.width;
			this.height = this.image.height;

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
	var whRatio_dist = this.width / this.height;
	if (whRatio_dist < whRatio_src) {
		// cut off both side
		offsetX = Math.floor((img.width - img.height / whRatio_dist) / 2);
	} else {
		// cut off ceil and floor
		offsetY = Math.floor((img.height - img.width * whRatio_dist) / 2);
	}
	trimmed_img.draw(img, offsetX, offsetY, img.width - offsetX * 2, img.height - offsetY * 2, 0, 0, this.width, this.height);
	this.image = trimmed_img;
};


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
			return this._x;
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
			return this._y;
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
        	return this._width;
        },
        set: function(width) {
            this._style.width = (this._width = width - this.padding * 2) + 'px';
        }
    },

    /**
     * RoundLabelの高さ.
     * @type {Number}
     * @override Entity.height
     */
    height: {
        get: function() {
            return this._height;
        },
        set: function(height) {
            this._style.height = (this._height = height - this.padding * 2) + 'px';
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
		this._element.className += ' m3_message';

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
			this.cnt++;
		});

		// タッチしたら「次へ進む」
		this.addEventListener(enchant.Event.TOUCH_START, enchant.m3.Player.playNext);
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
		this._element.className += ' m3_historybtn';

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
		this._element.className += ' m3_historymsg';

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
		this._element.className += ' m3_backbtn';

		// タッチしたら「戻る」
		this.addEventListener(enchant.Event.TOUCH_START, enchant.m3.Player.playBack);
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
 * ユーティリティとして使われるクラス、関数
 * > utility classes and functions
 */

/**
 * 取得しうるもっとも長いURL(絶対URLとは限らない)を取得する
 *
 * @param {String} url
 *
 * @param {String} baseURL
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
 * @return {Number} プロパティ数
 */
function getLength() {
	var len = 0;
	for (key in this) {
		if (typeof(this[key]) != 'function') len++;
	}
	return len;
}
