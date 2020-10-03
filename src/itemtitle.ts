/// <reference path="./api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import { text } from './api/gui';

(function(plugin: any) {

	gui.register(plugin);

	var title = text({
		text: '§7???', 
		align: {x: 0.5, y: 0.6},
		origin: {x: 0.5, y: 1},
		scale: 0,
		shadow: true
	});
	var subtitle = text({
		text: '§7???',
		align: {x: 0.5, y: 0.6},
		y: 1,
		origin: {x: 0.5, y: 0},
		scale: 0,
		shadow: true
	});

	gui.overlay.push(title, subtitle);

	PluginMessages.on(plugin, 'itemtitle', (bb: ByteBuf) => {
		let item = bb.readItemStack();
		title.text = UtilNetty.readString(bb, 65535);
		subtitle.text = UtilNetty.readString(bb, 65535);
		Draw.displayItemActivation(item);
		title.scale.transit(4, 1000, easing.outElastic, () => {
			title.scale.transit(4, 1000, easing.none, () => {
				title.scale.transit(0, 250, easing.none);
				subtitle.scale.transit(0, 250, easing.none);
			})
		});
		subtitle.scale.transit(2, 500, easing.outElastic);
	});

})(plugin);
