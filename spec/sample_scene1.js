/**
 * Sample Scenario 2
 * @author fullkawa
 */

var s = new Scenario();
var miku = new Figure('http://m3itfc.appspot.com/figure?id=miku');

s.baseURL = "http://m3itfc.appspot.com/";
s.images = {
	'bg_3D': 'img_test/HNI_0004.MPO',
	'bg01': 'Bg_512.jpg',
	'bg01a': {
		base: 'bg01',
		img: 'Bg_512_1.jpg',
		top: 200,
		left: 100
	}
};

s.sequence = {
	1: {
		transition: 'fadein',
		bg: s.img('bg01'),
		l1: miku.say('Hello, world !'),
		audio: {
			src: 'audio/tetete.mp3',
			loop: true
		}
	},
	2: {
		l1: miku.onLeft().say('I will set a "diff" image to background, now !')
	},
	3: {
		transition: 'fadeout',
		bg: s.img('bg01a'),
		l1: miku.wiz('smile'),
		audio: 'audio/se01.mp3'
	},
	4: {
		clear: 'all',
		msg: '- THE END -'
	}
};

s.next = {
	linkTo: '' // TODO:
};

s.start();
