/**
 * Sample Scenario 1
 * @author fullkawa
 */

var s = new Scenario();

s.sequence = {
	1: {
		bg: 'img_test/title.jpg'
	},
	2: {
		message: 'What do you do ?',
		options: {
		    1: { label: 'Start', linkto: '' }, // TODO: どう指定する？
		    2: { label: 'Exit', linkto: '' }
		}
	}
};

s.start();
