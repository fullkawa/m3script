/**
 * Sample Scenario
 * @author Furukawa
 */

/* 以下、デフォルト？ */
// layers で指定した名称がレイヤー名になる
// 表示順は、下→上　あ、これだと距離が…
var layers = ["bg", "l1", "l2", "l3", "msg"];


/* 以上 */

// キャラ定義(2D)
var anna = new Figure({
	base_url: "ttp://m3itfc.appspot.com/data/miku/",
	"standing": "anna_001.png", /* "default"または一番最初のがデフォルト表示に使われる */
	"smile": "anna_002.png",
	"surprised": "anna_003.png"
});

// キャラ定義(3D)
var anna3d = new Model();

// Image Bank
imgs = {
	"town1": "img/town1.jpg",
	"street1": "img/street1.jpg"
};

// Contents
sequence = [
	{ // 0
		transition: "fadein",
		bg: "img/HNI_0004.MPO",
		l1: miku.say("Let's go, Anna !"),
		audio: "bgm/music1.mp3"
	},
	{ // 1
		// 指定のないレイヤは基本的に引き継がれる
		l1: miku.is.onLeft,
		l2: anna.say("Where we go ?").onRight
	},
	{ // 2
		bg: imgs["town1"], // バンクからの指定
		l1: miku.wiz("smile"),
		l2: anna.say("Oh !").act("surprised"),
		flags: {
			"town1": "on",
			"place_cnt": flags["place_cnt"] + 1
		}
	},
	{ // 3
		clear: "all", // 全レイヤクリア
		msg: "- 終わり -"
	},
	{ // 4
		connection: close
	}
];
