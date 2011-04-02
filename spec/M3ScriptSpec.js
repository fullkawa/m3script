describe("M3Script", function()
{
	describe("Scene", function()
	{
		var scene1 = new Scene("test");

		it ("should have an ID", function()
		{
			expect(scene1.id).toEqual("test");
		});

		it ("consists of 'Sequence'", function()
		{
			expect(scene1.sequence).toBeDefined();
		});

		it ("has a bank", function(){
			expect(scene1.bank).toBeDefined();
		});

		it ("should have a 'Connector'", function()
		{
			expect(scene1.connector).toBeDefined();
		});

		it ("is a single by default", function(){
			expect(scene1.connector).toEqual(new Close());
		});
	});

	describe("Connector", function()
	{
		it ("can get next scene", function(){
			var connect = new Connector();
			expect(connect.getNextScene()).toBeDefined();
		});

		describe("Close", function(){
			var connect = new Close();
			expect(connect.getNextScene()).toBeNull();
		});

		describe("Jump", function(){
			var connect = new Jump("scene2");
			expect(connect.getNextScene()).toEqual("scene2");
		});

		describe("Choice", function(){
			var connect = new Choice();
			connect.addMessage("Which do you like ?");
			connect.addOption("Coffee", "scene2");
			connect.addOption("Tea", "scene3");
			connect.addOption("Ice water", "scene4");
			expect(connect.getNextScene(0)).toEqual("scene2");
		});

		describe("If", function(){
			var cond = function(value) { (value > 50) ? true : false; };
			var connect = new If(cond, "scene2", "scene3");
			expect(connect.getNextScene(60)).toEqual("scene2");
		});
	});

	describe("Sequence", function()
	{
		var scene = new Scene("test");
		var seq = scene.sequence;

		it ("should be zero length at first", function(){
			expect($.isArray(seq)).toBeTruthy();
			expect(seq.length).toEqual(0);
		});

		it ("can add a new one", function(){
			var new_seq = seq.getNext();
			expect(seq.length).toEqual(1);
			expect(new_seq).toBeDefined();
		});

		it ("can keep a image by src", function(){
			seq[0].addImage("bg/background01.png", TO_BG);
			expect(seq[0].getResources().length).toEqual(1);
		});

		it ("can keep a image by object", function(){
			var anna = new Anna();
			seq[0].addImage(anna, TO_L1);
			expect(seq[0].getResources().length).toEqual(2);
		});

		it ("can keep a model by object", function(){
			var miku = new Miku();
			seq[0].addModel(miku, TO_L2);
			expect(seq[0].getResources().length).toEqual(3);
		});

		it ("can keep a audio by src", function(){
			seq[0].addAudio("bgm/bgm01.mp3");
			expect(seq[0].getResources().length).toEqual(4);
		});

		it ("can keep several resources at once", function(){
			var miku = new Miku();
			var anna = new Anna();
			var new_seq = seq.getNext()
				.addImage("bg/background01.png", TO_BG)
				.addModel(miku.stand().withSmile(), TO_L1, { position: right })
				.addImage(anna.on("standing"), TO_L2, { position: left });
			expect(new_seq.getResources().length).toEqual(3);
		});

		it ("can keep resources by continuance", function(){
			var new_seq = seq.getContinuance();
			expect(new_seq.getResources().length).toEqual(3);
			expect(seq.length).toEqual(3);
		});

		it ("should be in order", function()
		{
			// TODO:
		});
	});

	describe("Image", function()
	{
		// TODO:
	});

	describe("Model", function()
	{
		// TODO:
	});
});