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
	shots: {
    	ws: { baseY: 460, scale: 0.8 },
		cu: { baseY: 320, scale: 1.3 },
		bs: { baseY: 390, scale: 1.1 },
		ks: { baseY: 560, scale: 0.5 }
	},
	baseURL: 'http://m3itfc.appspot.com/figure/anna/',
	images: {
	    '基本': { img: 'anna_0000.png', keywords: '標準, デフォルト' },
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

var miku = new Character('miku', {
	baseURL: 'http://m3itfc.appspot.com/figure/miku/',
	shots: {
		ks: { baseY: 268, scale: 1.1 },
		ws: { baseY: 180, scale: 1.2 },
		bs: { baseY: 130, scale: 1.8 },
		cu: { baseY: 100, scale: 2.2 }
	},
	images: {
		'default': 'miku_00.png'
	}
});

var i = new ImgBank({
	baseURL: 'http://m3itfc.appspot.com/',
	images: {
		'bg01': 'Bg_512.jpg'
	}
});

var s = new Scenario();

var shot_type = 'ws';
if (location.search != undefined && location.search.indexOf('shot_type=') > 0) {
	shot_type = location.search.substring(location.search.indexOf('shot_type=')+'shot_type='.length);
	console.debug('shot_type: '+shot_type);
}

s.shot_type = shot_type;
anna.shot_type = shot_type; // FIXME: delete

s.sequence = [
	/*
	{
		layers: {
			transition: 'fade'
		}
	},
	*/
	{
		// FIXME: ん～、単独でtransitionをかけたいときはどう指定させよう？
		bg: i.mg('bg01'),
		l1: anna.say('「は、はじめましてっ！　『峪　あんな』です。」').as('あんな'),
		audio: {
			src: 'audio/tetete.mp3',
			loop: true
		}
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
		l1: anna.act('照れ').say('「“やま”へんに“たに”で、“たに”って読みますっ！」')
	},
	{
		l1: anna.act('ごめんなさい･･･').say('「『“やま”ｲﾗﾈ (ﾟ⊿ﾟ)』って、よく言われます･･･」')
	},
	{
		l1: anna.onLeft(),
		l2: miku.onCenter(),
		l3: anna.onRight()
	},
	{
		l1: anna.onLeft2(),
		l2: miku.onRight2(),
		l3: i.mg('clear')
	},
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
s.eog = 'おわり';

s.start();
