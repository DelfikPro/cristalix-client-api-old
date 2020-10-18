/// <reference path="./api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import { text } from './api/gui';

(function(plugin: any) {

	gui.register(plugin);

	var title = gui.rect({
		align: gui.CENTER
	});

	gui.overlay.push(title);

	PluginMessages.on(plugin, 'title', (bb: ByteBuf) => {
		let scale = bb.readInt();
		let linesAmount = bb.readInt();
		for (var i = 0; i < linesAmount; ++i) {
			title.children.push(gui.text({
				origin: gui.CENTER,
				align: gui.CENTER,
				y: (i - linesAmount + 1) / 2 * 9,
			}));
		}
		title.scale.value = scale;
		title.rotationZ.transit(title.rotationZ.value, 1000, easing.none, () => {
			title.enabled = false;
		});
		title.enabled = true;
	});

})(plugin);
