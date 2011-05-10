console.log('*** test ***');

describe('M3Script', function() {

	describe('ImageDic', function() {

		/* TODO: delete
		it ('get a unique key by itself.', function() {
			var imgdic = new ImageDic();
			var key1 = imgdic.getUniqueKey('hoge');
			expect(key1).toEqual('hoge');

			imgdic.urls[key1] = {};
			var key2 = imgdic.getUniqueKey('hoge');
			expect(key2).toEqual('hoge1');

			imgdic.urls[key2] = {};
			var key3 = imgdic.getUniqueKey('hoge');
			expect(key3).toEqual('hoge2');
		});
		*/

		it ('produce image urls for Game.preload.', function() {
			var imgdic = new ImageDic();
			imgdic.urls = {
				key1: "url1",
				key2: "url2",
				key3: "url3"
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

		it ('can play on new game.', function() {
			expect(s.start).toBeDefined();
		});

		it ('can play on existing game.', function() {
			expect(s.play).toBeDefined();
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

		window.onload = function() {
			var game = new Game();
			game.onload = function() {
				it ('could be a text only.', function() {
					var text = 'hoge';
					var msg = new Message(text);
					expect(msg._msg).toEqual('hoge');
				});

				it ('could be a name and text.', function() {
					var name = 'miku';
					var text = '"hoge"';
					var msg = new Message(text, name);
					expect(msg._msg).toEqual('<span class="m3_msg_name">miku</span><br/>"hoge"');
				});
			};
		};
	});

	describe('Connector', function() {

		// TODO:
	});

	describe('Close', function() {

		// TODO:
	});

	describe('Jump', function() {

		// TODO:
	});

	describe('Navigation', function() {

		// TODO:
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
