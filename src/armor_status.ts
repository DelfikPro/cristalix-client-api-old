/// <reference path="./api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import * as vecmath from './api/vecmath';
import { text, rect } from './api/gui';


(function(plugin: any) {

	gui.register(plugin);

	let itemInfos: gui.Box[] = []
	for (var i = 0; i < 5; i++) itemInfos.push(new gui.Box({
		height: 18,
		children: [
			new gui.Item({
				item: null,
				origin: {x: 0, y: 0.5},
				align: {x: 0, y: 0.5},
			}), 
			new gui.Text({
				text: '',
				shadow: true,
				scale: 2,
				origin: {x: 0, y: 0.5},
				align: {x: 0, y: 0.5},
			})]
	}));
	gui.overlay.push(...itemInfos);

	let hudMode: number = Config.load('hud')?.hudMode || 0

	function init(hudMode: number): void {

		let hor = hudMode > 0 ? -1 : 1;
		let ver = hudMode == 2 ? -1 : 1;
		let hori = -hor / 2 + 0.5;
		let veri = -ver / 2 + 0.5;

		const easer = easing.outCubic;
		const duration = 600;

		for (var i = 0; i < 5; i++) {
			let itemInfo: gui.Box = itemInfos[i];
			itemInfo.enabled = false;
			itemInfo.x.transit(2 * hor, duration, easer);
			itemInfo.y.transit((2 + 17 * i) * ver - 9 * veri, duration, easer);
			itemInfo.originX.transit(hori, duration, easer);
			itemInfo.originY.transit(veri, duration, easer);
			itemInfo.alignX.transit(hori, duration, easer);
			itemInfo.alignY.transit(veri, duration, easer);
			itemInfo.children[1].x.transit(20 * hor, duration, easer);

			itemInfo.children[0].originX.transit(hori, duration, easer);
			itemInfo.children[0].alignX.transit(hori, duration, easer);
			itemInfo.children[1].originX.transit(hori, duration, easer);
			itemInfo.children[1].alignX.transit(hori, duration, easer);
		}
	}

	init(hudMode);

	const hudPositions = ['в левом верхнем', 'в правом верхнем', 'в правом нижнем']

	Events.on(plugin, 'chat_send', (e: ChatEvent) => {
		if (e.message == '/hud') {
			if (++hudMode > 2) hudMode = 0;
			e.cancelled = true;
			Config.save('hud', {hudMode: hudMode});
			init(hudMode);
			// ChatExtensions.sendChatMessage('§aИнформация о броне теперь отображается ' + hudPositions[hudMode] + ' углу.');
		}
	});


	Events.on(plugin, 'game_loop', (e) => {

		let slots = [Inventory.getActiveSlot(), 39, 38, 37, 36, 35];

		for (let itemInfo of itemInfos) {
			itemInfo.enabled = false
		}

		let index = 0;
		for (let slot of slots) {
			let itemStack = Inventory.getStackInSlot(slot);
			let amount = Inventory.getCount(slot);
			if (!itemStack || !amount) continue;
			let durability = Inventory.getDurability(slot);
			let maxDamage = Inventory.getMaxDamage(slot);

			if (index >= itemInfos.length) break;

			let itemInfo: gui.Box = itemInfos[index++];
			(itemInfo.children[0] as gui.Item).item = itemStack;
			(itemInfo.children[1] as gui.Text).text = maxDamage ? durability + '§7/§f' + maxDamage : amount > 1 ? amount + "" : "";

			itemInfo.enabled = true
		}

	});

	PluginMessages.on(plugin, 'museum:disable', (bb)=>{
		ChatExtensions.printChatMessage("Museum disabled!");
	});
	PluginMessages.on(plugin, 'disable', (bb)=>{
		ChatExtensions.printChatMessage("Disabled!");
		PluginMessages.off(plugin);
		Events.off(plugin);
	})

})(plugin);

