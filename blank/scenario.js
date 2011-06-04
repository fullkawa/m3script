scene = {}; // この行は消さないでください

scene[1] = {
	1: {
		msg: 'シーン１ / カット１'
	},
	2: {
		select: {
			msg: "移動します。",
			options: {
				1: { label: 'シーン２へ', linkTo: 'index.html?2' }
			}
		}
	}
};

scene[2] = {
	1: {
		msg: 'シーン２ / カット１'
	}
};
