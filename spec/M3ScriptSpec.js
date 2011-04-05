describe("M3Script", function()
{
	describe("Player", function()
	{
		var plr = new Player("canvas_id");

		it ("is equivalent to HTML Canvas", function()
		{
			expect(plr._canvas).toBeDefined();
		});

		it ("can accept parameters", function(){
			var plr2 = new Player("canvas_id", { msg: "Hello !" });
			expect(plr2).toBeDefined();
		});

		plr.setScenario("sample_scenario.js");

		it ("has a 'imgs'(image bank)", function(){
			expect(plr.imgs).toBeDefined();
		});

		describe("imgs", function(){
			it ("can keep images by src", function(){
				expect(imgs.length).toBeGreaterThan(1);
				expect(imgs["town1"]).toEqual("img/town1.jpg");
			});
		});

		it ("can play 'sequence' step by step", function()
		{
			plr.next();
			expect(plr._step).toEqual(1);
		});

		it ("can show history", function(){
			plr.history();
		});

		describe("sequence", function()
		{
			var seq = plr.sequence;

			it ("can keep a image by src", function(){
				expect(seq[0]["bg"]).toEqual("img/HNI_0004.MPO");
			});

			it ("can keep a image by bank", function(){
				expect(seq[2]["bg"]).toEqual("img/town1.jpg");
			});

			it ("can keep a image by object", function(){
				expect(seq[0]["l1"]).toBeDefined();
			});

			/*
			it ("can keep a model by object", function(){
			});
			*/

			it ("can keep a audio by src", function(){
				expect(seq[0]["audio"]).toBeDefined();
			});

			it ("can keep resources continuously", function(){
				expect(seq[1]["bg"]).toEqual("img/HNI_0004.MPO");
				expect(seq[1]["audio"]).toBeDefined();
			});
		});
	});

	describe("Figure", function()
	{
		// TODO:
	});

	describe("Model", function()
	{
		it ("will support in future version", function(){
		});
	});
});