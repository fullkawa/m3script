/**
 * Sample Scenario 2
 * @author fullkawa
 */

try {
	enchant('m3');
}
catch(e) {
	alert('M3Script need "enchant.js" ! \n[' + e.toString() + ']');
}
var s = new Scenario();
var anna = new Character('anna', {
	baseURL: 'http://m3itfc.appspot.com/figure/anna/',
	images: {
	}
});

s.baseURL = 'http://m3itfc.appspot.com/';
s.images = {
	'bg01': 'Bg_512.jpg'
};

s.sequence = {
	1: {
		transition: 'fadein',
		bg: s.img('bg01'),
		l1: anna.say('Hello, world !').as('[ あんな ]'),
		audio: {
			src: 'audio/tetete.mp3',
			loop: true
		}
	},
	2: {
		l1: anna.onLeft().say('I will set a "diff" image to background, now !')
	},
	3: {
		transition: 'fadeout',
		bg: s.img('bg01a'),
		l1: anna.wiz('smile'),
		audio: 'audio/se01.mp3'
	},
	4: {
		clear: 'all',
		msg: '- THE END -'
	}
};
s.eos = '&nbsp;&gt;&gt;&gt; click to next';

s.start();
