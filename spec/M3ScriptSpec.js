$(function(){
console.log("*** test ***");

describe("M3Script", function(){

	describe("Player", function(){

		p.start();

		describe("Player.screen", function(){

			it ("setup on start", function(){
				expect(p.screen).toBeDefined();
			});

			it ("has height and width", function(){
				expect(p.scrHeight).toEqual(320);
				expect(p.scrWidth).toEqual(640);
			});

			it ("has 6 grids for positioning", function(){
				expect(p.leftX).toEqual(106);
				expect(p.left2X).toEqual(213);
				expect(p.centerX).toEqual(320);
				expect(p.right2X).toEqual(426);
				expect(p.rightX).toEqual(534);
			});
		});

		it ("can load a next scenario", function(){
			expect(p.loadNextScenario).toBeDefined();
		});

		it ("has a 'imgs'(image bank)", function(){
			expect(p.imgs).toBeDefined();
		});

		describe("imgs", function(){
			it ("can keep images by src", function(){
				expect(p.imgs.town1).toEqual("img/town1.jpg");
			});
		});

		it ("can play 'sequence' step by step", function(){
			expect(p._step).toEqual(1);
			p.next();
			expect(p._step).toEqual(2);
		});

		it ("can show history", function(){
			expect(p.history).toBeDefined();
		});

		describe("sequence", function(){

			var seq = p.sequence;

			it ("can keep a image by src", function(){
				var path = seq[0]["bg"].src.split("/");
				expect(path[path.length-1]).toEqual("HNI_0004.MPO");
			});

			it ("can keep a image by bank", function(){
				var path = seq[2]["bg"].src.split("/");
				expect(path[path.length-1]).toEqual("town1.jpg");
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

			/*
			it ("can keep resources continuously", function(){
				var path = p.timeline["bg"].src.split("/");
				expect(path[path.length-1]).toEqual("HNI_0004.MPO");
				expect(p.timeline["audio"]).toBeDefined();
			});
			*/
		});
	});

	describe("Figure", function(){

		// TODO:
	});

	describe("Model", function(){

		it ("will support in future version", function(){
		});
	});
});
});
