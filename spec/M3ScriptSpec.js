try {
	enchant('m3');
}
catch(e) {
	alert(e);
}
describe('M3Script', function() {

	describe('ImageDic', function() {

		it ('can store image URL.', function() {
			var imgdic = new ImageDic();

			// No Base URL
			imgdic.set('key1', 'img1.png');

			// Normal
			var baseURL = 'http://www.sample.com/img/';
			imgdic.set('key2', 'img2.png', baseURL);

			// No slash at last
			var baseURL_noSlash = 'http://www.sample.com/img';
			imgdic.set('key3', 'img3.png', baseURL_noSlash);

			expect(imgdic.urls['key1']).toEqual('img1.png');
			expect(imgdic.urls['key2']).toEqual('http://www.sample.com/img/img2.png');
			expect(imgdic.urls['key3']).toEqual('http://www.sample.com/img/img3.png');
		});

		it ('produce image urls for Game.preload.', function() {
			var imgdic = new ImageDic();
			imgdic.urls = {
				key1: 'url1',
				key2: 'url2',
				key3: 'url3'
			};
			var urls = imgdic.getURLArray();
			expect(urls.join(',')).toEqual('url1,url2,url3');
		});
	});

	describe('Scenario', function() {

		var s = new Scenario();

		it ('consists of images.', function() {
			// TODO:
		});

		it ('consists of sequence', function() {
			// TODO:
		});

		it ('has 999 sequences at most', function() {
			expect(s.MAX_SEQUENCE_NO).toEqual(999);
		});

		it ('has four layers', function() {
			expect(s.LAYERS.length).toEqual(4);
		});

		it ('has "bg" layer, it is for background', function() {
			expect(s.LAYERS[0]).toEqual('bg');
		});

		it ('has "l1","l2","l3" layer, it is for character', function() {
			expect(s.LAYERS[1]).toEqual('l1');
			expect(s.LAYERS[2]).toEqual('l2');
			expect(s.LAYERS[3]).toEqual('l3');
		});

		it ('shows character on waist shot by default', function() {
			expect(s.defaultShotType).toEqual('WS');
		});

		it ('can play on new game.', function() {
			expect(s.start).toBeDefined();
		});

		it ('can play on existing game.', function() {
			expect(s.play).toBeDefined();
		});

		it ('can play step by step', function() {
			window.s = s;
			var game = new Game();
			window.s._game = window.s.initialize(game);
			window.s.sequence = {
				1: {},
				2: {}
			};
			expect(window.s._game.seqNo).toEqual(0);

			playNext();
			expect(window.s._game.seqNo).toEqual(1);
		});
	});

	describe('Character', function() {

		var c = new Character('piyo', {
			baseURL: 'http://www.hoge.com/',
			'smile': 'smile.png'
		});

		it ('can get clone object.', function() {
			var cln = c.clone();
			expect(c === cln).not.toBeTruthy();
		});

		it ('can get properties.', function() {
			expect(c.getProps).toBeDefined();
		});
	});

	describe('Picture', function() {

		// TODO:
	});

	describe('Figure', function() {

		// TODO:
	});

	describe('RoundLabel', function() {
		it ('is subclass of Label', function() {
			var rlbl = new RoundLabel('hoge');
			expect(rlbl instanceof Label).toBeTruthy();
		});
	});

	describe('Message', function() {
		it ('Its default position and size -> x:4, y:0, width:276', function() {
			var game = new Game();
			var default_msg = new Message();
			expect(default_msg.x).toEqual(4);
			expect(default_msg.y).toEqual(0);
			expect(default_msg.width).toEqual(276);
		});
	});

	describe('Selection', function() {
		// TODO:
	});

	describe('SelOption', function() {
		// TODO:
	});

	describe('Utility Functions', function() {

		it ('can getFullURL', function() {
			var baseURL1 = 'http://www.hoge.com/';
			var baseURL2 = 'http://www.hoge.com';

			var url1 = 'pic.png';
			expect(getFullURL(url1)).toEqual('pic.png');

			expect(getFullURL(url1, baseURL1)).toEqual('http://www.hoge.com/pic.png');

			expect(getFullURL(url1, baseURL2)).toEqual('http://www.hoge.com/pic.png');

			var url2 = '/pic.png';
			expect(getFullURL(url2, baseURL1)).toEqual('http://www.hoge.com/pic.png');

			var url3 = 'http://www.piyo.com/pic.png';
			expect(getFullURL(url3, baseURL1)).toEqual('http://www.piyo.com/pic.png');
		});
	});
});
