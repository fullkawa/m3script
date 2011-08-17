try {
	enchant('m3');
}
catch(e) {
	alert(e);
}
describe('Definition', function() {
	var def = new Definition();

	it ('has definition', function() {
		def.PROP_NAMES = {
			def1: 'prop1',
			def2: 'prop2'
		};
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
		def.COMMON_DEF_NAMES = ['cmn1', 'cmn2'];
		def.addDefinition({
			cmn1: 'load',
			notcmn1: 'not load'
		});
		expect(def._default.cmn1).toBeDefined();
		expect(def._default.notcmn1).not.toBeDefined();
	});
});

describe('ImgBank', function() {
	var i = new ImgBank({
		baseURL: 'http://www.sample.com/'
	});

	it ('extends Definition', function() {
		expect(i._definition).toBeDefined();
		expect(i.addDefinition).toBeDefined();
	});

	it ('has default definitions', function() {
		expect(i._default.baseURL).toBeDefined();
	});

	it ('has common definitions', function() {
		expect(i.COMMON_DEF_NAMES.length).toEqual(2);
	});

	describe('baseURL', function() {

		it ('is default definition', function() {
			expect(i._default.baseURL.url).toEqual('http://www.sample.com/');
		});
	});

	it ('keeps images', function() {
		i.addDefinition({
			images: {
				'img1': 'http://www.test.com/img1.jpg'
			}
		});
		expect(i.mg('img1').url).toEqual('http://www.test.com/img1.jpg');
	});

	it ('provide properties list', function() {
		expect(i._getImageList().img1).toBeDefined();
	});
});
