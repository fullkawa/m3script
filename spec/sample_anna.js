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
	    '基本': {
	    	img: 'anna_0000.png',  // 標準, デフォルト
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 },
	    		cu: { baseY: 320, scale: 1.4 },
	    		bs: { baseY: 390, scale: 1.2 },
	    		ks: { baseY: 560, scale: 0.6 },
	    		fs: { baseY: 610, scale: 0.35 }
	    	}
	    },
	    'にっこり': {
	    	img: 'anna_0001.png' // にっこり, ふふーん？
	    },
	    'あのあのあの･･･': {
	    	img: 'anna_0003.png' // あのあのあの･･･
	    },
	    '困ります･･･': {
	    	img: 'anna_0005.png' // 困ります･･･
	    },
	    '直立': {
	    	img: 'anna_0010.png' // スマイル, 微笑
	    },
	    'おじぎ': {
	    	img: 'anna_0020.png' // ごめんなさい！
	    },
	    'ごめんなさい･･･': {
	    	img: 'anna_0070.png' // ごめんなさい･･･
	    },
	    '照れ': {
	    	img: 'anna_0071.png' // 照れ, 恥ずかしい
	    },
	    'すねる': {
	    	img: 'anna_0072.png' // すねる
	    },
	    '怒る': {
	    	img: 'anna_0073.png' // 怒る
	    },
	    '泣く': {
	    	img: 'anna_0074.png' // 泣く
	    }
	}
});

s.baseURL = 'http://m3itfc.appspot.com/';
s.images = {
	'bg01': 'Bg_512.jpg'
};

s.sequence = [
	{
		transition: 'fadein',
		bg: s.img('bg01'),
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

s.start();
