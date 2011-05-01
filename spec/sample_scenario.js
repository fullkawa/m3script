/**
 * Sample Scenario
 * @author Furukawa
 */

// Character Definition
var anna = new Figure({
	baseUrl: "http://m3itfc.appspot.com/figure/anna/",
	"standing": {
		img: "anna_001.png",
		ws: 180
	},
	"smile": "anna_002.png",
	"surprised": "anna_003.png"
});

// Character Definition (3D)
/* Model will support in future version
var anna3d = new Model();
*/

// Player Definition
var p = new Player();

// Image Bank
p.imgs = {
	"bg01": "img/HNI_0004.MPO",
	"town1": "img/town1.jpg",
	"town1_a": {
		// i.e., "difference"
		img: "img/town1_a.jpg",
		top: 100,
		left: 200
	},
	"street1": "img/street1.jpg"
};

// Contents
p.sequence = [
	{ // 0
		transition: "fadein",
		bg: p.img("bg01"),
		l1: miku.say("Let's go, Anna !"),
		audio: "bgm/music1.mp3"
	},
	{ // 1
		l1: miku.is().onLeft(),
		l2: anna.say("Where we go ?").onRight()
	},
	{ // 2
		bg: p.img("town1"),
		l1: miku.wiz("smile"),
		l2: anna.say("Oh !").act("surprised"),
		flags: {
			"town1": "on",
			"place_cnt": function(){
	  		return this.flags["place_cnt"] + 1;
	  	}
		}
	},
	{ // 3
		clear: "all",
		msg: "- The End -"
	},
	{ // 4
		connection: p.end()
	}
];
