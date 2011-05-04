/**
 * Sample Scenario
 * @author fullkawa
 */

//// Character Definition
//var anna = new Figure({
//	baseUrl: 'http://m3itfc.appspot.com/figure/anna/',
//	'standing': {
//		img: 'anna_001.png',
//		ws: 180
//	},
//	'smile': 'anna_002.png',
//	'surprised': 'anna_003.png'
//});
//
//// Character Definition (3D)
///* Model will support in future version
//var anna3d = new Model();
//*/
//
//// Player Definition
//var p = new Player();
//
//// Image Bank
//p.imgs = {
//	'bg01': 'img/HNI_0004.MPO',
//	'town1': 'img/town1.jpg',
//	'town1_a': {
//		// i.e., only 'difference'
//		img: 'img/town1_a.jpg',
//		top: 100,
//		left: 200
//	},
//	'street1': 'img/street1.jpg'
//};
//
//// Contents
//p.sequence = [
//	{ // 0
//		transition: 'fadein',
//		bg: p.img('bg01'),
//		l1: miku.say("Let's go, Anna !"),
//		audio: 'bgm/music1.mp3'
//	},
//	{ // 1
//		l1: miku.is().onLeft(),
//		l2: anna.say('Where we go ?').onRight()
//	},
//	{ // 2
//		bg: p.img('town1'),
//		l1: miku.wiz('smile'),
//		l2: anna.say('Oh !').act('surprised'),
//		flags: {
//			'town1': 'on',
//			'place_cnt': function(){
//	  		return this.flags['place_cnt'] + 1;
//	  	}
//		}
//	},
//	{ // 3
//		clear: 'all',
//		msg: '- The End -'
//	},
//	{ // 4
//		connection: p.end()
//	}
//];


/*
 *
 */

try {
	enchant();
}
catch(e) {
	alert('M3Script need "enchant.js" !');
}

window.onload = function() {
	var game = new Game();
	game.preload('http://m3itfc.appspot.com/Bg_512.jpg', 'http://m3itfc.appspot.com/figure/miku/miku_00.png');
	game.keybind(13, 'a'); // enter key
	game.keybind(32, 'a'); // space key
	game.addEventListener(enchant.Event.INPUT_START, function(){
		var msg2 = new Scene();

		var dialog = new Label('選択してください。');
		dialog.x = 5;
		dialog.y = game.height * 0.9;
		dialog.backgroundColor = "#FFFFFF";
		dialog.opacity = 0.5;
		msg2.addChild(dialog);

		var select1 = new Label('<a href="#">その１</a>');
		select1.buttonMode = true;
		select1.x = 100;
		select1.width = 120;
		select1.y = game.height * 0.4;
		select1.backgroundColor = "orange";
		select1.opacity = 0.5;
		msg2.addChild(select1);

		var select2 = new Label('<a href="#">その２</a>');
		select2.touchEnabled = true;
		select2.x = 100;
		select2.width = 120;
		select2.y = select1.y + 20;
		select2.backgroundColor = "orange";
		select2.opacity = 0.5;
		msg2.addChild(select2);

		game.replaceScene(msg2);
	});

	game.onload = function() {
		var bg = new Sprite(game.width, game.height);
		var bg_img = new Surface(game.width, game.height);
		// bg_img.context.drawImage(game.assets['http://m3itfc.appspot.com/Bg_512.jpg']._element, 0, 0, game.width, game.height);
		bg_img.draw(game.assets['http://m3itfc.appspot.com/Bg_512.jpg'], 0, 0, game.width, game.height);
		bg.image = bg_img;

		console.debug(game.assets['http://m3itfc.appspot.com/figure/miku/miku_00.png']);
		var l1 = new Sprite(180, 280);
		l1.image = game.assets['http://m3itfc.appspot.com/figure/miku/miku_00.png'];
		l1.x = game.width / 2 - 180 / 2;
		l1.y = game.height - 280;

		game.rootScene.addChild(bg);
		game.rootScene.addChild(l1);

		var dialog = new Label('<a href="http://www.google.co.jp/">Hello, world !</a>');
		dialog.x = 5;
		dialog.y = game.height * 0.9;
		dialog.backgroundColor = "#FFFFFF";
		dialog.opacity = 0.8;

		var msg = new Scene();
		msg.addChild(dialog);
		game.pushScene(msg);
	};
	game.start();
};
