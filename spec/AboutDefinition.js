try {
	enchant('m3');
}
catch(e) {
	alert(e);
}
describe('ImgDefinition', function() {
	var def = new ImgDefinition();

	it ('keep definition', function() {
		expect(def._definition).toBeDefined();
	});

	it ('get definition by "DEF_NAMES" only', function() {
		def.DEF_NAMES = overwrite({
			def1: 'prop1',
			def2: 'prop2'
		}, def.DEF_NAMES);
		def.addDefinition({
			def1: 'value1',
			def2: { prop2: 'value2' },
			def3: 'value3'
		});
		expect(def._definition.def1.prop1).toEqual('value1');
		expect(def._definition.def2.prop2).toEqual('value2');
		expect(def._definition.def3).not.toBeDefined();
	});

	it ('has default definition', function() {
		expect(def._default.current.location).toEqual('');
	});

	it ('has more default by user', function() {
		def.COMMON_DEF_NAMES.push('cmn1', 'cmn2');
		def.addDefinition({
			cmn1: 'load',
			notcmn1: 'not load'
		});
		expect(def._default.cmn1).toBeDefined();
		expect(def._default.cmn1).toEqual('load');
		expect(def._default.notcmn1).not.toBeDefined();
	});
});

describe('ImgBank', function() {
	var i = new ImgBank({
		current: {
			location: 'http://www.sample.com/'
		}
	});

	it ('extends ImgDefinition', function() {
		expect(i._definition).toBeDefined();
		expect(i.addDefinition).toBeDefined();
	});

	it ('has default definitions', function() {
		expect(i._default.current.location).toEqual('http://www.sample.com/');
	});

	it ('has common definitions', function() {
		expect(i.COMMON_DEF_NAMES.length).toEqual(1);
	});

	it ('keeps images', function() {
		i.addDefinition({
			images: {
				'img1': 'http://www.test.com/img1.jpg',
				'img2': 'img2.png'
			}
		});
		expect(i.mg('img1').url).toEqual('http://www.test.com/img1.jpg');
		expect(i.mg('img2').url).toEqual('http://www.sample.com/img2.png');
	});

	it ('provide properties list', function() {
		expect(i._getImageList().img1).toBeDefined();
	});
});

//describe('Character', function() {
//	var anna = new Character('anna', {
//		baseURL: 'http://m3itfc.appspot.com/figure/anna/',
//		shots: {
//			ws: { baseY: 460, scale: 0.9 },
//			cu: { baseY: 350, scale: 1.4 },
//			bs: { baseY: 390, scale: 1.2 },
//			ks: { baseY: 640, scale: 0.8 }
//		},
//		images: {
//			'基本': 'anna_0000.png'  // 標準, デフォルト
//		}
//	});
//
//	it ('extends ImgDefinition', function() {
//		expect(anna._definition).toBeDefined();
//		expect(anna.addDefinition).toBeDefined();
//	});
//
////	it ('stand on CENTER at first', function() {
////		expect(anna.posX).toEqual(anna.POSITIONS.indexOf('CENTER'));
////	});
////
////	it ('stand on LEFT_EDGE / LEFT / LEFT2 / CENTER / RIGHT2 / RIGHT / RIGHT_EDGE', function() {
////		expect(anna.POSITIONS.length).toEqual(7);
////
////		expect(anna.onLeft).toBeDefined();
////		anna.onLeft();
////		expect(anna.posX).toEqual(anna.POSITIONS.indexOf('LEFT'));
////
////		expect(anna.onLeft2).toBeDefined();
////		anna.onLeft2();
////		expect(anna.posX).toEqual(anna.POSITIONS.indexOf('LEFT2'));
////
////		expect(anna.onCenter).toBeDefined();
////		anna.onCenter();
////		expect(anna.posX).toEqual(anna.POSITIONS.indexOf('CENTER'));
////
////		expect(anna.onRight2).toBeDefined();
////		anna.onRight2();
////		expect(anna.posX).toEqual(anna.POSITIONS.indexOf('RIGHT2'));
////
////		expect(anna.onRight).toBeDefined();
////		anna.onRight();
////		expect(anna.posX).toEqual(anna.POSITIONS.indexOf('RIGHT'));
////	});
////
////	it ('can have 4 shots', function() {
////		expect(anna.SHOT_TYPES.length).toEqual(4);
////	});
////
////	it ('can add definitions', function() {
////		var def_0001 = {
////			baseURL: 'http://m3itfc.appspot.com/figure/anna/',
////			images: {
////				'にっこり': {
////					img: 'anna_0001.png',
////					keywords: 'にっこり, ふふーん？'
////				}
////			}
////		};
////		anna._addDefinition(def_0001);
////		expect(anna._defImg['基本']).toBeDefined(); // 元の設定が残っていること
////		expect(anna._defImg['にっこり']).toBeDefined(); // 新しい設定が追加されていること
////	});
////
////	it ('provide properties for Character Viewer', function() {
////		expect(anna._getImageList()).toBeDefined();
////	});
//});
