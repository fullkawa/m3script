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
			var baseUrl = 'http://www.sample.com/img/';
			imgdic.set('key2', 'img2.png', baseUrl);

			// No slash at last
			var baseUrl_noSlash = 'http://www.sample.com/img';
			imgdic.set('key3', 'img3.png', baseUrl_noSlash);

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
			var game = new Game();
			s.sequence = {
				1: {},
				2: {}
			};
			s._game = s.initialize(game);
			console.debug('seqNo='+s._game.seqNo);
		});
	});

	describe('Character', function() {

		var c = new Character('piyo', {
			baseUrl: 'http://www.hoge.com/',
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

	describe('Message', function() {
		it ('Its default position and size -> x:5, y:5, width:300', function() {
			var game = new Game();
			var default_msg = new Message();
			expect(default_msg.x).toEqual(5);
			expect(default_msg.y).toEqual(5);
			expect(default_msg.width).toEqual(300);
		});

		it ('Its standard(game window = 320 x 320) position and size -> x:6, y:240, width:308', function() {
			var game = new Game();
			var standard_msg = new Message(320, 320);
			expect(standard_msg.x).toEqual(6);
			expect(standard_msg.y).toEqual(240);
			expect(standard_msg.width).toEqual(308);
		});
	});

	describe('Utility Functions', function() {

		it ('can getFullURL', function() {
			var baseUrl1 = 'http://www.hoge.com/';
			var baseUrl2 = 'http://www.hoge.com';

			var url1 = 'pic.png';
			expect(getFullURL(url1)).toEqual('pic.png');

			expect(getFullURL(url1, baseUrl1)).toEqual('http://www.hoge.com/pic.png');

			expect(getFullURL(url1, baseUrl2)).toEqual('http://www.hoge.com/pic.png');

			var url2 = '/pic.png';
			expect(getFullURL(url2, baseUrl1)).toEqual('http://www.hoge.com/pic.png');

			var url3 = 'http://www.piyo.com/pic.png';
			expect(getFullURL(url3, baseUrl1)).toEqual('http://www.piyo.com/pic.png');
		});
	});
});
