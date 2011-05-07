/**
 * Sample Scenario 2
 * @author fullkawa
 */

try {
	enchant('m3');
}
catch(e) {
	alert('M3Script need "enchant.js" ! \n[' + e.toString() + "]");
}
var s = new Scenario();
var miku = new Character('miku', {
	  baseUrl: "http://m3itfc.appspot.com/figure/miku/",
	  "default": {
	    img: "miku_00.png",
	    fs: 400,
	    ks: 306,
	    ws: 180,
	    bs: 125,
	    cu: 100
	  },
	  "half_smile": "miku_01.png",
	  "smile": "miku_02.png",
	  "slight_bow": "miku_03.png",
	  "bow": "miku_04.png"
});

s.baseURL = "http://m3itfc.appspot.com/";
s.images = {
	'bg_3D': 'img_test/HNI_0004.MPO',
	'bg01': 'Bg_512.jpg',
	'bg01a': {
		base: 'bg01',
		img: 'Bg_512_1.png',
		top: 200,
		left: 100
	}
};

s.sequence = {
	1: {
		transition: 'fadein',
		bg: 'bg01',
		l1: miku.say('Hello, world !').as('[ miku ]'),
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
		bg: 'bg01a',
		l1: miku.wiz('smile'),
		audio: 'audio/se01.mp3'
	},
	4: {
		clear: 'all',
		msg: '- THE END -'
	}
};
s.eos = '<span class="command" onclick="playNext();">&nbsp;&gt;&gt;&gt; click to next</span>';

s.start();
