/**
 * Spec Scenario
 * @author fullkawa
 */

try {
	enchant('m3');
}
catch(e) {
	alert('M3Script need "enchant.js" ! \n[' + e.toString() + ']');
}

var anna = new Character('anna', {
	shots: {
    	ws: { baseY: 460, scale: 0.8 },
		cu: { baseY: 320, scale: 1.3 },
		bs: { baseY: 390, scale: 1.1 },
		ks: { baseY: 560, scale: 0.5 }
	},
	baseURL: 'http://m3itfc.appspot.com/figure/anna/',
	images: {
	    '基本': { img: 'anna_0000.png', keywords: '標準, デフォルト' },
	    'にっこり': { img: 'anna_0001.png', keywords: 'にっこり, ふふーん？' },
	    'あのあのあの': { img: 'anna_0003.png', keywords: 'あのあのあの･･･' }
	}
});

var miku = new Character('miku', {
	shots: {
		ks: { baseY: 268, scale: 1.1 },
		ws: { baseY: 180, scale: 1.2 },
		bs: { baseY: 130, scale: 1.8 },
		cu: { baseY: 100, scale: 2.2 }
	},
	baseURL: 'http://m3itfc.appspot.com/figure/miku/',
	images: {
		'default': 'miku_00.png'
	}
});

var i = new ImgBank({
	baseURL: 'http://m3itfc.appspot.com/',
	images: {
		'bg01': 'Bg_512.jpg',
		'bg01a': {
			base: 'bg01',
			img: 'Bg_512_1.png',
			top: 200,
			left: 100
		}
	}
});

var s = new Scenario();
var scene = [];

scene['index'] = [
	{
		msg: {
			text: 'どの仕様について確認しますか？',
			select: {
				1: { label: '基本', linkTo: 'SpecScenario.html#basic' },
				9: { label: '開発中', linkTo: 'SpecScenario.html#dev' }
			}
		}
	}
];

scene['dev'] = [
	// TODO:
];

scene['basic'] = [
	{
		bg: i.mg('bg01'),
		l1: anna,
		msg: '* 一番シンプルな構成の表示 *',
		audio: {
			src: 'audio/tetete.mp3',
			loop: true
		}
	},
	{
		l1: anna.wiz('にっこり').say('「指定が無いレイヤは前のシーケンスでの指定がそのまま引き継がれます。」'),
		msg: '* ポーズ、台詞の指定 *'
	},
	{
		bg: i.mg('clear'),
		msg: '* レイヤ(単独)のクリア *'
	},
	{
		bg: i.mg('bg01a'),
		msg: '* 背景の差分表示 *'
	},
	{
		l1: anna.onLeft2().say('「こんにちは。」'),
		l2: miku.onRight2().say('「 Hello, world ! 」'),
		msg: '* キャラの表示位置指定と二人表示 *'
	},
	{
		l1: anna.onLeft(),
		l2: miku.onCenter(),
		l3: anna.onRight(),
		msg: '* 三人表示 *'
	},
	{
		layers: i.mg('clear'),
		msg: '* 全レイヤクリア *'
	},
	/*
	{
		l1: anna.say('「あのあのあのっ、お名前･･･教えてもらえますか？」'),
		msg: {
			input: {
				message: '名前を入力してください。',
				'default': '山田 太郎',
				after: function(value) {
					this.param['name'] = value;
				}
			}
		}
	},
	{
		l1: anna.say('「' + this.param['name'] + ' ･･･さん？」'),
		msg: {
			confirm: {
				cancel: 'sample_anna.html?seqNo=2'
			}
		}
	},
	*/
	{
	/*
		msg: {
			text: 'ショットを選択して下さい。',
			select: {
				1: { label: 'cu', linkTo: 'sample_anna.html?shot_type=cu' },
				2: { label: 'bs', linkTo: 'sample_anna.html?shot_type=bs' },
				3: { label: 'ws', linkTo: 'sample_anna.html?shot_type=ws' },
				4: { label: 'ks', linkTo: 'sample_anna.html?shot_type=ks' }
			}
		}
	*/
		select: {
			msg: 'ショットを選択して下さい。',
			options: {
				1: { label: 'cu', linkTo: 'sample_anna.html?shot_type=cu' },
				2: { label: 'bs', linkTo: 'sample_anna.html?shot_type=bs' },
				3: { label: 'ws', linkTo: 'sample_anna.html?shot_type=ws' },
				4: { label: 'ks', linkTo: 'sample_anna.html?shot_type=ks' }
			}
		}
	/* */
	}
];

var play = scene['index'];
if (location.hash != undefined && location.hash.length > 1) {
	var s_idx = '#'.length;
	var scname = location.hash.substring(s_idx);
	if (scene[scname] != undefined) {
		play = scene[scname];
	}
}
s.sequence = play;

var shot_type = 'ws';
if (location.search != undefined && location.search.indexOf('shot_type=') > 0) {
	var s_idx = location.search.indexOf('shot_type=') + 'shot_type='.length;
	shot_type = location.search.substring(s_idx);
	console.debug('shot_type: '+shot_type);
}
s.shot_type = shot_type;
anna.shot_type = shot_type; // FIXME: delete

s.eog = 'おわり';

//s.start();

window.onload = function() {
	var player = new Player(s);
	player.start();
};
