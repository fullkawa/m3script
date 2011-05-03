console.log('*** test ***');

describe('M3Script', function(){

	describe('ImageDic', function(){

		it ('get a unique key by itself.', function() {
			var imgdic = new ImageDic();
			var key1 = imgdic.getUniqueKey('hoge');
			expect(key1).toEqual('hoge');

			imgdic.imgs[key1] = {};
			var key2 = imgdic.getUniqueKey('hoge');
			expect(key2).toEqual('hoge1');

			imgdic.imgs[key2] = {};
			var key3 = imgdic.getUniqueKey('hoge');
			expect(key3).toEqual('hoge2');
		});

		it ('produce image urls for Game.preload.', function() {
			var imgdic = new ImageDic();
			imgdic.imgs = {
				key1: "url1",
				key2: "url2",
				key3: "url3"
			};
			var urls = imgdic.getURLArray();
			expect(urls.join(',')).toEqual('url1,url2,url3');
		});
	});

	describe('Scenario', function(){

		var s = new Scenario();
		it ('can play on new game.', function(){
			expect(s.start).toBeDefined();
		});
		it ('can play on existing game.', function() {
			expect(s.play).toBeDefined();
		});
	});

	describe('Picture', function(){

		// TODO:
	});

	describe('Figure', function(){

		// TODO:
	});

	describe('Message', function(){

		// TODO:
	});

	describe('Connector', function(){

		// TODO:
	});

	describe('Close', function(){

		// TODO:
	});

	describe('Jump', function(){

		// TODO:
	});

	describe('Navigation', function(){

		// TODO:
	});
});
