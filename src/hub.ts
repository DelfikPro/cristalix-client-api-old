/// <reference path="./d.ts" />
import * as easing from './easing';
import * as gui from './gui';
import * as vecmath from './vecmath';
import { text, rect } from './gui';

type HubServerInfo = {
	realmType: string,
	description: string[],
	realmId: number,
	online: number,
	slots: number,
	extraSlots: number,
	status: string,
};

(function(plugin: any) {

	gui.register(plugin);

	// var inner = rect({
	// 	width: 30, height: 20,
	// 	align: {x: 0, y: 1}, // Левый нижний угол
	// 	onLeftClick: (ss) => Runtime.exit(0),
	// 	color: {a: 0.3, r: 1}, // Красный
	// 	origin: {x: 0.5, y: 0.5},
	// 	onHover: (ss, b) => inner.b.value = b ? 1 : 0,
	// });

	// var outer = rect({
	// 	width: 100, height: 50, 
	// 	origin: {x: 0.5, y: 0.5},
	// 	color: {r: 0.1, g: 0.3, b: 0.9},
	// 	onHover: (ss, b) => outer.g.value = b ? 1 : 0,

	// 	children: [
	// 		inner,
	// 		text({
	// 			align: {x: 0, y: 1},
	// 			origin: {x: 0, y: 1},
	// 			x: 16, // +20 пикселей влево относительно 
	// 			text: "Нажми на красный квадрат чтобы твой Dev превратился в ADM"
	// 		})
	// 	]
	// });

	var debug = text({text: '', x: 0, y: 0});
	var debugWrapper = rect({children: [debug], align: {x: 0.1, y: 0.1}});
	gui.overlay.push(debugWrapper);

	// Events.on(plugin, 'game_loop', (e) => {
	// 	var ss = gui.getScreenState();
	// 	outer.x.transit(ss.mouseX, 100, easing.outBack);
	// 	outer.y.transit(ss.mouseY, 100, easing.outBack);
	// 	if (ss.leftClick) {
	// 		inner.rotation.transit(Math.random() * 720 - 360, 500, easing.outQuint);
	// 	}
	// });

	const outScale = 8;
	var mainMenu = rect({align: {x: 0.5, y: 0.5}});
	gui.overlay.push(mainMenu);

	var gameMap : { [key:string]:HubGame; } = {};
	var realmMap : { [key:string]:HubRealm; } = {};

	const rows = 9;
	const columns = 4;
	const sizeX = 110;
	const sizeY = 36;

	var mainMenuState = 0;

	class HubGame extends gui.Box {

		readonly nameText: gui.Text;
		readonly onlineText: gui.Text;
		readonly item: gui.Item;
		readonly accent: gui.Box;
		_info: HubServerInfo;


		constructor(public realmType: string, public displayName: string, public icon: ItemStack, public xPos: number, public yPos: number, inverted: boolean) {	
			super({
				origin: {x: 0.5, y: 0.5},
				width: sizeX, height: sizeY,
				scale: 0,
				color: {a: 0, r: 0, g: 1, b: 0},
				onHover: (ss, b) => {
					this.a.transit(b ? 0.5 : 0, 250, easing.outCubic);
					this.item.rotation.transit(b ? -45 : 0, 250, easing.outCubic);
				},
				onLeftClick: (ss) => {
					sendOpenedGui(this.realmType);
				}
			});

			this.item = new gui.Item({
				scale: 2,
				item: icon, 
				origin: {x: 0.5, y: 0.5},
				align: {x: 0.5, y: 0.5},
			});
			this.accent = rect({
				color: {a: 0.6, r: 0.1, g: 0.1, b: 0.1},
				origin: {x: 0.5, y: 0.5},
				align: {x: 0.5, y: 0.5},
				height: 20,
				width: sizeX
			});
			this.nameText = text({
				text: displayName,
				origin: {x: 0.5, y: 1},
				align: {x: 0.5, y: 0.5},
				y: 0, z: 127, shadow: true
			});
			this.onlineText = text({
				text: '§7???',
				origin: {x: 0.5, y: 0},
				align: {x: 0.5, y: 0.5},
				y: 0, z: 127, shadow: true
			});

			this.children.push(this.item, this.accent, this.nameText, this.onlineText);

		}

		set info(info: HubServerInfo) {
			this._info = info;
			this.onlineText.text = '§7' + info.online + " / " + info.slots;
		}

	}


	class HubRealm extends gui.Box {

		_info: HubServerInfo;
		readonly item: gui.Item;
		readonly onlineText: gui.Text;

		constructor(public game: HubGame) {
			super({
				width: 400,
				height: 32,
				children: [
				]
			});

			this.item = new gui.Item({
				item: game.item.item,
				origin: {x: 0.5, y: 0.5},
				align: {x: 0.5, y: 0.5}
			});
			this.onlineText = text({
				origin: {x: 0, y: 0.5},
				align: {x: 0, y: 0.5},
				text: '???',
				x: 17
			});

			this.children.push(this.item, this.onlineText);

		}


		set info(info: HubServerInfo) {
			this._info = info;
			this.onlineText.text = '§7' + info.online + " / " + info.slots;
		}

	}

	function sendOpenedGui(str: string) {
		let bb = Unpooled.buffer();
		UtilNetty.writeString(bb, str);
		PluginMessages.emit('hubgui', bb);
	}



	function setMainMenuState(state: number) {

		const duration = 400;
		const easer = easing.none;


		for (let child of mainMenu.children) {
			let hubGame = child as HubGame;
			child.rotation.transit(child.rotation.value, 75 * (hubGame.xPos + hubGame.yPos), easing.none, () => {
				child.scale.transit(state == 1 ? 1 : 0, 300, easing.outCubic);
			});
		}

	}


	PluginMessages.on(plugin, 'hubguiaction', (bb: ByteBuf) => {
		mainMenuState = mainMenuState == 1 ? 0 : 1;
		setMainMenuState(mainMenuState);
	});

	PluginMessages.on(plugin, 'hubguiupdate',  (bb: ByteBuf) => {
		let data = UtilNetty.readString(bb, 65535);
		let onlineUpdate: HubServerInfo[] = JSON.parse(data);
		let updated = [];
		for (let unit of onlineUpdate) {
			if (unit.realmId == 0) gameMap[unit.realmType].info = unit;
			else {
				let realmId = unit.realmType + "/" + unit.realmId;
				let existing = realmMap[realmId];
				if (!existing) {
					existing = new HubRealm(gameMap[unit.realmType]);
				}
				updated.push(realmId);
				existing.info = unit;
			}
		}

		for (let key in realmMap) {
			var check = false;
			for (let update of updated) {
				if (update == key) {
					check = true;
					break;
				}
			}
			if (!check) delete realmMap[key];
		}

	});

	Events.on(plugin, 'key_press', (e: KeyPressEvent) => {
		if (e.key === Keyboard.KEY_ESCAPE) {
			
		}
	});

	PluginMessages.on(plugin, 'hubguisetup', (bb: ByteBuf) => {

		let count = bb.readInt();
		mainMenu.children = [];
		gameMap = {};
		for (var i = 0; i < count; i++) {
			let realmType = UtilNetty.readString(bb, 255);
			let displayName = UtilNetty.readString(bb, 65535).replace(/§./g, '');
			let descCount = bb.readInt();
			let description = [];
			if (descCount > 0) {
				for (var j = 0; j < descCount; j++) {
					description.push(UtilNetty.readString(bb, 65535));
				}
			}
			let icon = bb.readItemStack();
			let xPos = i % columns;
			let yPos = Math.floor(i / columns);
			let game = new HubGame(realmType, displayName, icon, xPos, yPos, (xPos + yPos) % 2 == 1);
			gameMap[realmType] = game;
			mainMenu.children.push(game);
		}

		// const xSize = 4.5;
		// const ySize = 2;

		var x = -columns / 2;
		var y = -rows / 2;
		for (let child of mainMenu.children) {
			child.x.value = x * (sizeX);
			child.y.value = y * (sizeY);
			x++;
			if (x > columns / 2) {
				x = -columns / 2;
				y++;
			}
		}

	});


})(plugin);
