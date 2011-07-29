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
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    'にっこり': {
	    	img: 'anna_0001.png', // にっこり, ふふーん？
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    'あのあのあの･･･': {
	    	img: 'anna_0003.png', // あのあのあの･･･
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    '困ります･･･': {
	    	img: 'anna_0005.png', // 困ります･･･
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    '直立': {
	    	img: 'anna_0010.png', // スマイル, 微笑
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    'おじぎ': {
	    	img: 'anna_0020.png', // ごめんなさい！
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    'ごめんなさい･･･': {
	    	img: 'anna_0070.png', // ごめんなさい･･･
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    '照れ': {
	    	img: 'anna_0071.png', // 照れ, 恥ずかしい
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    'すねる': {
	    	img: 'anna_0072.png', // すねる
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    '怒る': {
	    	img: 'anna_0073.png', // 怒る
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
	    },
	    '泣く': {
	    	img: 'anna_0074.png', // 泣く
	    	shots: {
		    	ws: { baseY: 460, scale: 0.9 }
	    	}
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
