/**
 * Sample Scenario 1
 * @author fullkawa
 */

try {
	enchant('m3');
}
catch(e) {
	alert('M3Script need "enchant.js" ! \n[' + e.toString() + "]");
}
var s = new Scenario();

s.baseURL = "http://m3itfc.appspot.com/";
s.images = {
	'title': 'img_test/title.jpg'
};

s.sequence = {
	1: {
		bg: 'title',
		msg: '< HIT SPACE/ENTER KEY >'
	},
	2: {
		select: {
			msg: 'This is selection.<br>What do you do ?',
			options: {
			    1: { label: 'Start', linkTo: 'sample.html?scene1' },
			    2: { label: 'Exit', linkTo: 'http://www.google.com/' },
			    3: { label: 'option 3', linkTo: '.'},
			    4: { label: 'option 4', linkTo: '.'},
			    5: { label: 'option 5', linkTo: '.'}
			}
		}
	}
};

s.start();
