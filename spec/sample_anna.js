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
var anna = new Character('anna', {
	baseURL: 'http://m3itfc.appspot.com/figure/anna/',
	shots: {
    	ws: { baseY: 460, scale: 0.9 },
		cu: { baseY: 320, scale: 1.4 },
		bs: { baseY: 390, scale: 1.2 },
		ks: { baseY: 560, scale: 0.6 },
		fs: { baseY: 610, scale: 0.35 }
	},
	images: {
	    '基本': {
	    	img: 'anna_0000.png',
	    	keywords: '標準, デフォルト'
	    },
	    'にっこり': {
	    	img: 'anna_0001.png',
	    	keywords: 'にっこり, ふふーん？'
	    },
	    'あのあのあの･･･': {
	    	img: 'anna_0003.png',
	    	keywords: 'あのあのあの･･･'
	    },
	    '困ります･･･': {
	    	img: 'anna_0005.png',
	    	keywords: '困ります･･･'
	    },
	    '直立': {
	    	img: 'anna_0010.png',
	    	keywords: 'スマイル, 微笑'
	    },
	    'おじぎ': {
	    	img: 'anna_0020.png',
	    	keywords: 'ごめんなさい！'
	    },
	    'ごめんなさい･･･': {
	    	img: 'anna_0070.png',
	    	keywords: 'ごめんなさい･･･'
	    },
	    '照れ': {
	    	img: 'anna_0071.png',
	    	keywords: '照れ, 恥ずかしい'
	    },
	    'すねる': {
	    	img: 'anna_0072.png',
	    	keywords: 'すねる'
	    },
	    '怒る': {
	    	img: 'anna_0073.png',
	    	keywords: '怒る'
	    },
	    '泣く': {
	    	img: 'anna_0074.png',
	    	keywords: '泣く'
	    }
	}
});

var i = new ImgBank({
	baseURL: 'http://m3itfc.appspot.com/',
	images: {
		'bg01': 'Bg_512.jpg'
	}
});

var s = new Scenario();
s.sequence = [
	{
		transition: 'fadein',
		bg: i.mg('bg01'),
		l1: anna.say('「は、はじめましてっ！　『峪　あんな』です。」').as('あんな'),
		audio: {
			src: 'audio/tetete.mp3',
			loop: true
		}
	},
	{
		l1: anna.act('照れ').say('「“やま”へんに“たに”で、“たに”って読みますっ！」')
	},
	{
		l1: anna.act('ごめんなさい･･･').say('「『“やま”ｲﾗﾈ (ﾟ⊿ﾟ)』って、よく言われます･･･」')
	}
];
s.eog = 'おわり';

s.start();
