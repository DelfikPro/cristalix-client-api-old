/// <reference path="api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import * as vecmath from './api/vecmath';

(function(plugin: any) {

	PluginMessages.on(plugin, 'brawlstars', (bb) => {
		PluginMessages.off(plugin);
		Events.off(plugin);
	})
	
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
			xp: 24357632,
			crystals: 5463,
		}, {
			id: '307264a1-2c69-11e8-b5ea-1cb72caa35fd',
			name: '§9Dev §dFunc',
			join: 1603045732,
			rank: 1,
			xp: 136533,
			crystals: 4521371,
		}, {
			id: '3038738a-2c69-11e8-b5ea-1cb72caa35fd',
			name: '§cADM ¨ff9999ilyafx',
			join: 1603045732,
			rank: 0,
			xp: 1337,
			crystals: 0,
		}, {
			id: '63a6ef42-25de-11e9-8374-1cb72caa35fd',
			name: '§5Sr.M Pepel_ok',
			join: 1603045732,
			rank: 0,
			xp: 999999999,
			crystals: 999999,
		}, {
			id: '7f3fea26-be9f-11e9-80c4-1cb72caa35fd',
			name: '§7ONE1SIDE',
			join: 1603045732,
			rank: 0,
			xp: 84985489,
			crystals: 389
		}]
	};
	
	var columnWidth = 120;
	var columnMargin = 20;
	var columns = 3;
	var rowHeight = 50;
	var rowMargin = 5;

	var guildName = gui.text({
		text: '???',
		scale: 2,
		origin: gui.TOP,
		y: -4,
	});

	var guildMoney = gui.text({
		text: '???',
		origin: gui.CENTER,
		y: 19,
	});

	var totalWidth = columnWidth * columns + columnMargin * (columns - 1);
	var guildExpBar = gui.rect({
		width: totalWidth,
		height: 11,
		origin: gui.CENTER,
		align: gui.TOP,
		y: 35,
		color: {a: 0.5},//{a: 0.7, r: 1, g: 1, b: 1},
		children: [
			gui.rect({
				width: 0,
				height: 11,
				align: gui.LEFT,
				origin: gui.LEFT,
				color: {a: 1, r: 0x2A / 255, g: 0x66 / 255, b: 0xBD / 255} //2A66BD
			}),
			gui.text({
				text: "???",
				align: gui.CENTER,
				origin: gui.CENTER,
			})
		]
	});


	var guildMembers = gui.rect({
		color: {a: 0},
		origin: gui.TOP,
		align: gui.TOP,
		height: 200,
		y: guildExpBar.y.value + guildExpBar.height.value + rowMargin - 5,
		width: columnWidth * columns + columnMargin * (columns - 1)
	})

	var guildBox = gui.rect({
		align: gui.CENTER,
		origin: gui.CENTER,
		color: {a: 0},
		height: 250,
		children: [
			guildName,
			guildMoney,
			guildMembers,
			guildExpBar,
		]
	});

	gui.overlay.push(guildBox);

	gui.register(plugin);

	var resourceLoc: ResourceLocation = null;

	function shorten(n: number): string {
		if (n < 1000) {
			let s = n.toString();
			let i = s.indexOf('.');
			return i < 0 ? s : s.substring(0, n < 100 ? i + 2 : i);
		}
		if (n < 1000_000) return shorten(n / 1000) + "K";
		if (n < 1000_000_000) return shorten(n / 1000_000) + "M";
		if (n < 1000_000_000_000) return shorten(n / 1000_000_000) + "B";
		if (n < 1000_000_000_000_000) return shorten(n / 1000_000_000_000) + "Q";
		return n + '';
	}

	function plurals(n: number, one: string, two: string, five: string): string {
		if (n < 0) n = -n;
		return n + " " + (n % 10 == 1 && n % 100 != 11 ? one :
				n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? two : five);
	}


	function updateInfo(guild: Guild): void {
		let bold = !fontRenderer.getUnicodeFlag();
		guildName.text = (guild.capabilities.tag ? "§7<§f" + guild.capabilities.tag + "§7> §f" : "") + guild.name;
		guildMoney.text = plurals(guild.bank, "кристаллик", "кристаллика", "кристалликов") + " в банке";
		guildMembers.children = [];
		let level = Math.pow(guild.xp / 1000, 2/3);
		(guildExpBar.children[0] as gui.Box).width.value = totalWidth * (level - Math.floor(level));//, 500, easing.outQuint);
		(guildExpBar.children[1] as gui.Text).text = Math.floor(level) + " уровень";
		var column = 0;
		var row = 0;
		var index = 0;
		for (let member of guild.members) {
			index++;
			let rankIcon = member.rank ? gui.rect({
						width: 35,
						height: 35,
						texture: 'minecraft:textures/delfikpro/' + (member.rank == 1 ? 'star' : 'crown') + '.png',
						color: {a:1,b:1,g:1,r:1},
						x: 5,
						y: 26,
					}) : null;
			let memberBox = gui.rect({

				x: column * (columnWidth + columnMargin),// - guildMembers.width.value / 2,
				y: row * (rowHeight + rowMargin),
				
				width: columnWidth,
				height: rowHeight, 
				color: {a: 0.62},
				beforeRender: member.rank ? () => {
					GL11.glTranslatef(0, 0, Math.random() * 0.1);
				} : undefined,
				afterRender: member.rank ? () => {
					GL11.glDepthFunc(GL11.GL_EQUAL);
                    GL11.glPushMatrix();
                    GL11.glTranslatef(-8, 0, 0);
                    GL11.glRotatef(60, 0, 0, 1);
                    GL11.glTranslatef(0, -rowHeight * 0.5, 0);
                    Draw.drawRect(0, 0, columnWidth, rowHeight, /*member.rank == 2 ? 0xAAFFAA55 : 0xAAFFFF55*/0x40000000);
                    GL11.glPopMatrix();

                    rankIcon.render(JavaSystem.currentTimeMillis(), 1, 1);

                    GL11.glDepthFunc(GL11.GL_LEQUAL);
				} : undefined,
				children: [
					gui.rect({
						color: {a: 1, r: 1, g: 1, b: 1},
						width: 4,
						height: 4,
						origin: gui.CENTER,
						align: gui.LEFT,
						x: 8,
						scale: 8.01 * 0.8,
						uMin: 8, vMin: 8,
						uDelta: 8, vDelta: 8,
						textureWidth: 64, textureHeight: 64,
					}),
					gui.rect({
						color: {a: 1, r: 1, g: 1, b: 1},
						width: 4,
						height: 4,
						origin: gui.CENTER,
						align: gui.LEFT,
						x: 8,
						scale: 9.01 * 0.8,
						uMin: 40, vMin: 8,
						uDelta: 8, vDelta: 8,
						textureWidth: 64, textureHeight: 64,
					}),
					gui.text({
						text: member.name,
						align: gui.TOP,
						origin: gui.TOP,
						x: 10,
						y: 4,
					}),
					gui.text({
						text: '¨2a66bd' + shorten(member.xp),
						align: gui.TOP,
						origin: gui.TOP,
						scale: bold ? 1.5 : 2,
						x: 10 - 23,
						y: 19,
					}),
					gui.text({
						text: shorten(member.crystals),
						align: gui.TOP,
						origin: gui.TOP,
						scale: bold ? 1.5 : 2,
						x: 10 + 23,
						y: 19,
					}),
					gui.text({
						text: 'опыт',
						align: gui.TOP,
						origin: gui.TOP,
						x: 10 - 23,
						y: 34 - (bold ? 2 : 0),
					}),
					gui.text({
						text: 'кри',
						align: gui.TOP,
						origin: gui.TOP,
						x: 10 + 23,
						y: 34 - (bold ? 2 : 0),
					}),
				]

			});

			// if (member.rank) 

			guildMembers.children.push(memberBox);

			skinManager.loadSkin(
				new ProfileTexture('https://webdata.c7x.dev/textures/skin/' + member.id, {}), 
				ProfileTextureType.SKIN, (type: ProfileTextureType, location: ResourceLocation, texture: ProfileTexture) => {
					(memberBox.children[0] as gui.Box).texture = location;
					(memberBox.children[1] as gui.Box).texture = location;
					stdout.println("Hello by: " + location);
				}
			);
			if (++column == 3) {
				column = 0;
				++row;
			}
		}
	}

	updateInfo(guild);

	var mcFont = false;
	Events.on(plugin, 'game_loop', () => {
		let res = Draw.getResolution();
		Display.setTitle(res.getScaledWidth() + "x" + res.getScaledHeight());
		var newMcFont = fontRenderer.getUnicodeFlag();
		if (newMcFont != mcFont) {
			mcFont = newMcFont;
			updateInfo(guild);
		}
	})


})(plugin);