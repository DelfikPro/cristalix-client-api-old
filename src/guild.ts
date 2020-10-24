/// <reference path="api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import * as vecmath from './api/vecmath';

(function(plugin: any) {
	
	type Guild = {
		name: string,
		xp: number,
		bank: number,
		capabilities: Capabilities,
		members: Member[]
	};

	type Member = {
		id: string,
		name: string,
		join: number,
		rank: number,
		xp: number,
		crystals: number,
	};

	type Capabilities = {
		bank: number,
		slots: number,
		joinMessage: string[] | undefined,
		tag: string | undefined,
	};

	var guild: Guild = {
		name: "Implario",
		xp: 100000,
		bank: 100000,
		capabilities: {
			bank: 150000,
			slots: 45,
			joinMessage: ["Привет"],
			tag: 'Impl'
		},
		members: [{
			id: 'e7c13d3d-ac38-11e8-8374-1cb72caa35fd',
			name: '§9Dev ¨262626DelfikPro',
			join: 1603045732,
			rank: 2,
			xp: 40000,
			crystals: 60000,
		}, {
			id: '307264a1-2c69-11e8-b5ea-1cb72caa35fd',
			name: '§9Dev §dFunc',
			join: 1603045732,
			rank: 1,
			xp: 60000,
			crystals: 40000,
		}]
	};

	var guildName = gui.text({
		text: '???',
		scale: 2,
		origin: gui.TOP,
	});

	var guildExp = gui.text({
		text: '???',
		origin: gui.TOP_RIGHT,
		y: 18,
		x: -2,
	});

	var guildMoney = gui.text({
		text: '???',
		origin: gui.TOP_LEFT,
		y: 18,
		x: 2,
	});

	var guildBox = gui.rect({
		align: gui.TOP,
		y: 2,
		children: [
			guildName,
			guildExp, 
			guildMoney,
		]
	});

	gui.overlay.push(guildBox);
	gui.register(plugin);

	var resourceLoc: ResourceLocation = null;

	skinManager.loadSkin(new ProfileTexture('https://webdata.c7x.dev/textures/skin/327cac64-8b1e-11e8-a6de-1cb72caa35fd', {}), 
		ProfileTextureType.SKIN, (type: ProfileTextureType, location: ResourceLocation, texture: ProfileTexture) => {
			resourceLoc = location;
			stdout.println(location);
		})

	function updateInfo(guild: Guild): void {
		guildName.text = guild.name;
		guildExp.text = "§a" + guild.xp + " 䂚";
		guildMoney.text = "§e " + guild.bank + " 䁿";
	}

	updateInfo(guild);

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

	PluginMessages.on(plugin, 'brawlstars', (bb) => {
		PluginMessages.off(plugin);
		Events.off(plugin);
	})

})(plugin);