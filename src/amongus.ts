/// <reference path="./api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import {rect, text} from './api/gui';

(function(plugin: any) {
	gui.register(plugin);

	let minX = 63;
	let minZ = -10;
	let maxX = -83;
	let maxZ = 95;


	let playerIcon = rect({
		width: 32,
		height: 32,
		texture: "minecraft:mcpatcher/cit/others/hub/tochka.png",
		color: {a: 0.5, r: 1, g: 1, b: 1},
		align: {x: 0.5, y: 0.5},
		origin: {x: 0.5, y: 0.5},
	});
	let map = rect({
		texture: "minecraft:textures/among_us/map.png",
		width: 400,
		height: 400,
		// color: {a: 0.5, r: 0, g: 0, b: 0},
		color: {a: 1, r: 1, g: 1, b: 1},
		align: {x: 0.5, y: -0.5},
		origin: {x: 0.5, y: 0.5},
		children: [
			playerIcon
		]

	});

	gui.overlay.push(map);

	var showMap = false;
	Events.on(plugin, 'game_loop', () => {

		playerIcon.alignX.transit((Player.getPosX() - minX) / (maxX - minX), 50, easing.none);
		playerIcon.alignY.transit((Player.getPosZ() - minZ) / (maxZ - minZ), 50, easing.none);
		playerIcon.rotationZ.transit(Player.getYaw() + 180, 50, easing.none);

		let show = Keyboard.isKeyDown(Keyboard.KEY_TAB);
		if (show != showMap) map.alignY.transit(show ? 0.5 : -0.5, 400, easing.outBack);
		showMap = show;
		playerIcon.enabled = show;

	});

	class Notify {
		constructor(
			readonly address: string,
			readonly element: gui.Element,
			readonly x: number,
			readonly y: number,
			readonly z: number,
		) {}
	}

	let notifies: Notify[] = [
		// new Notify("test", gui.rect({
		// 	width: 16,
		// 	height: 16,
		// 	color: {a: 0, r: 1, g: 0.1, b: 0.1}
		// }), 0, 20, 0)
	];

	PluginMessages.on(plugin, 'amongus:notify', (b) => {

		let address = UtilNetty.readString(b, 65535);
		let x = b.readInt();
		let y = b.readInt();
		let z = b.readInt();
		let type = b.readInt();
		if (type == 1) notifies.push(new Notify(address, new gui.Item({
			item: UtilNetty.readItemStack(b),
			color: {a: 1, r: 1, g: 1, b: 1},
		}), x, y, z)); 
		else if (type == 2) notifies.push(new Notify(address, new gui.Box({
			width: 16,
			height: 16,
			texture: UtilNetty.readString(b, 65535),
			color: {a: 1, r: 1, g: 1, b: 1}, 
		}), x, y, z));

	});

	PluginMessages.on(plugin, 'amongus:hide', (b) => {
		let address = UtilNetty.readString(b, 65535);
		let newNotifies = [];
		for (let notify of notifies) {
			if (notify.address != address) newNotifies.push(notify);
		}
		// ChatExtensions.sendChatMessage('Hiding ' + address + ': before ' + notifies.length + ", after: " + newNotifies.length);
		notifies = newNotifies;
	});

	PluginMessages.on(plugin, 'brawlstars', (b) => {
		Events.off(plugin);
		PluginMessages.off(plugin);
	});

	Events.on(plugin, 'render_pass_ticks', (event: RenderPassEvent) => {

		if (event.pass != 2) return;

		let player = Player;

		for (let notify of notifies) {
			GL11.glPushMatrix();

			GL11.glTranslatef(
				notify.x - player.getPosX() - (player.getPosX() - player.getPrevX()) * event.partialTicks,
				notify.y - player.getPosY() - (player.getPosY() - player.getPrevY()) * event.partialTicks,
				notify.z - player.getPosZ() - (player.getPosZ() - player.getPrevZ()) * event.partialTicks,
			);

			GlStateManager.disableDepth();
			GL11.glScalef(1 / 16, -1 / 16, -1 / 16);

			GL11.glTranslatef(8, 8, 8);
			GL11.glPushAttrib(GL11.GL_COLOR_BUFFER_BIT);
			GL11.glBlendFunc(GL11.GL_SRC_COLOR, GL11.GL_ONE_MINUS_DST_COLOR);

			GL11.glRotatef(player.getYaw() + 180, 0, 1, 0);
			GL11.glRotatef(-player.getPitch(), 1, 0, 0);
			GL11.glTranslatef(-8, -8, -8);

			notify.element.render(JavaSystem.currentTimeMillis(), 0.001, 0.001);
			GL11.glPopAttrib();
			GlStateManager.enableDepth();

			GL11.glPopMatrix();
		}

	})



})(plugin);