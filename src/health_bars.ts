/// <reference path="./api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import * as vecmath from './api/vecmath';
import { text, rect } from './api/gui';


(function(plugin: any) {

	gui.register(plugin);

	var padding = 0.5;

	var healthText = gui.text({ 
		text: '10§7/20',
		origin: gui.CENTER,
		align: gui.CENTER,
		shadow: true,
		// z: -0.05,
	});
	var healthIndicator = gui.rect({
		width: 10,
		height: 3,
		x: padding,
		origin: gui.LEFT,
		align: gui.LEFT,
		color: {a: 1, r: 0.2, g: 0.9, b: 0.2},
		// z: -0.1,
	});

	var healthBar = gui.rect({

		width: 16,
		height: 3 + padding * 2,
		scale: 1 / 16,
		origin: gui.CENTER,
		color: {a: 0.5, r: 0, g: 0, b: 0},
		children: [
			healthIndicator,
			gui.rect({
				height: 6,
				width: 1,
				scale: 0.5,
				origin: gui.CENTER,
				align: {x: 0.33, y: 0.5},
				color: {a: 0.5, r: 0, g: 0, b: 0}
			}),
			gui.rect({
				height: 6,
				width: 1,
				scale: 0.5,
				origin: gui.CENTER,
				align: {x: 0.66, y: 0.5},
				color: {a: 0.5, r: 0, g: 0, b: 0}
			}),
			// healthText
		]

	});


	Events.on(plugin, 'name_template_render', (event: NameRenderEvent) => {

		let entity = event.entity;
		if (!(entity instanceof EntityLivingBase)) return;

		let player = minecraft.getPlayer();

		let part = entity.getHealth() / entity.getMaxHealth();
		if (part == 1) return;

		GL11.glPushMatrix();

		let partialTicks = timer.renderPartialTicks();

		let e = entity.getPositionEyes(partialTicks);

		let pX = player.getX();
		let pY = player.getY();
		let pZ = player.getZ();
		let pLastX = player.getLastX();
		let pLastY = player.getLastY();
		let pLastZ = player.getLastZ();
		let eX = entity.getX();
		let eY = entity.getY();
		let eZ = entity.getZ();
		let eLastX = entity.getLastX();
		let eLastY = entity.getLastY();
		let eLastZ = entity.getLastZ();


		GL11.glTranslatef(
			/*(eLastX + (eX - eLastX) * partialTicks)*/e.getX() - (pLastX + (pX - pLastX) * partialTicks),
			/*(eLastY + (eY - eLastY) * partialTicks)*/e.getY() - (pLastY + (pY - pLastY) * partialTicks) + 0.8,
			/*(eLastZ + (eZ - eLastZ) * partialTicks)*/e.getZ() - (pLastZ + (pZ - pLastZ) * partialTicks)
		);

		GL11.glScalef(1, -1, -1);

		// GL11.glTranslatef(healthBar.width.value / 2, healthBar.height.value / 2, 0);
		GL11.glRotatef(player.getRotationYaw() + 180, 0, 1, 0);
		GL11.glRotatef(-player.getRotationPitch(), 1, 0, 0);


		// GL11.glRotatef(player.getRotationYaw() + 180, 0, 1, 0);
		// GL11.glRotatef(-player.getRotationPitch(), 1, 0, 0);


		healthIndicator.width.value = entity.getHealth() * 2;
		healthBar.width.value = entity.getMaxHealth() * 2 + padding * 2;


		let green = part * 2;
		if (green > 1) green = 1;
		let red = (1 - part) * 2;
		if (red > 1) red = 1;
		healthIndicator.g.value = green;
		healthIndicator.r.value = red;
		healthText.text = eY + " " + eLastY;//entity.getHealth() + "/" + entity.getMaxHealth();


		GlStateManager.disableLighting();
		GL11.glEnable(GL11.GL_TEXTURE_2D);

		// GlStateManager.enableBlend();
		// GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0);

		healthBar.render(JavaSystem.currentTimeMillis(), 0.001, 0.001);
		GlStateManager.enableLighting();

		GL11.glPopMatrix();
	});


	PluginMessages.on(plugin, 'brawlstars', (b) => {
		Events.off(plugin);
		PluginMessages.off(plugin);
	});


})(plugin);
