describe('m3script', function() {

	describe('Scenario', function() {

		var s;

		it ('is independent from Game object', function() {
			s = new Scenario();
		});

		it ('consists of sequence', function() {
			expect(s.sequence).toBeDefined();
		});

		it ('has 999 sequences by default', function() {
			expect(s.MAX_SEQUENCE_NO).toEqual(999);
		});

		it ('can play on player', function() {
			expect(s.start).toBeDefined();
		});
	});

	describe('Player', function() {
		// TODO:
	});

	describe('Layers', function() {
		// TODO:
	});

	describe('Layer', function() {
		// TODO:
	});

	describe('RoundLabel', function() {
		// TODO:
	});

	describe('Message', function() {
		// TODO:
	});

	describe('HistoryBtn', function() {
		// TODO:
	});

	describe('HistoryMsg', function() {
		// TODO:
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

		it ('can clone', function() {
			var obj1 = {
				num: 1,
				str: 'a',
				ary: [1,2,3],
				obj: {
					hoge: 'piyo'
				}
			};
			var obj2 = clone(obj1);
			expect(obj2.num).toEqual(1);
			expect(obj2.str).toEqual('a');
			expect(obj2.ary[2]).toEqual(3);
			expect(obj2.obj.hoge).toEqual('piyo');
		});
	});
});
