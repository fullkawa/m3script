/**
 * Test Novel Scenario
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
	baseURL: 'http://m3itfc.appspot.com/figure/miku/',
	shots: {
		ks: { baseY: 268, scale: 0.9 },
		ws: { baseY: 180, scale: 1   },
		bs: { baseY: 130, scale: 1.6 },
		cu: { baseY: 100, scale: 2   }
	},
	images: {
		'default': 'miku_00.png',
		'half_smile': 'miku_01.png',
		'smile': 'miku_02.png',
		'slight_bow': 'miku_03.png',
		'bow': 'miku_04.png'
	}
});

s.baseURL = "http://m3itfc.appspot.com/";
s.images = {
	'title': 'img_test/title.jpg',
	// 'bg_3D': 'img_test/HNI_0004.MPO',
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
		bg: s.img('title'),
		msg: 'This is a Sample Novel.<br/><br/>'
			+ '< HIT SPACE/ENTER KEY >'
	},
	2: {
		select: {
			msg: 'This is selection.<br>What do you do ?',
			options: {
			    1: { label: 'Start', exec: function() { this.params['started'] = true; } },
			    2: { label: 'Exit', linkTo: 'http://www.google.com/' },
			    3: { label: 'option 3'},
			    4: { label: 'option 4'},
			    5: { label: 'option 5'}
			}
		}
	},
	3: {
		transition: 'fadein',
		bg: s.img('bg01'),
		l1: miku.say('Hello, world !').as('[ miku ]'),
		audio: {
			src: 'audio/tetete.mp3',
			loop: true
		}
	},
	4: {
		l1: miku.onLeft().say('I will set a "diff" image to background, now !')
	},
	5: {
		transition: 'fadeout',
		bg: s.img('bg01a'),
		l1: miku.wiz('smile'),
		audio: 'audio/se01.mp3'
	},
	6: {
		clear: 'all',
		msg: '- THE END -'
	}
};

s.start();