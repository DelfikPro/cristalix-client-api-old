/// <reference path="api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import * as vecmath from './api/vecmath';

(function(plugin: any) {
	
	var resourceLoc: ResourceLocation = null;

	skinManager.loadSkin(new ProfileTexture('https://webdata.c7x.dev/textures/skin/327cac64-8b1e-11e8-a6de-1cb72caa35fd', {}), 
		ProfileTextureType.SKIN, (type: ProfileTextureType, location: ResourceLocation, texture: ProfileTexture) => {
			resourceLoc = location;
			stdout.println(location);
		})

	var k = keybinds['key.playerlist']
	stdout.println(k.getKeyCode() + " " + k.getKeyDescription() + " " + k.getKeyCategory() + " " + k.getKeyCodeDefault());

	Events.on(plugin, 'gui_overlay_render', (event) => {
		if (resourceLoc) {
			Textures.bindTexture(resourceLoc);
			GL11.glColor4f(1, 1, 1, 1);
			GL11.glPushMatrix();
			GlStateManager.enableBlend();
			GL11.glTranslatef(100, 100, 0);
			GL11.glScalef(16, 16, 16);
			Draw.drawScaledCustomSizeModalRect(0, 0, 8, 8, 8, 8, 4, 4, 64, 64);
			GL11.glScalef(1.125, 1.125, 1.125);
			GL11.glTranslatef(-1/4, -1/4, 0);
			Draw.drawScaledCustomSizeModalRect(0, 0, 40, 8, 8, 8, 4, 4, 64, 64);
			GL11.glPopMatrix();
		}
	});

})(plugin);