/// <reference path="./api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import {rect, text} from './api/gui';

type TopEntry = {

	key: string,
	value: number

};

(function(plugin: any) {
	gui.register(plugin);

	const CENTER = {x: 0.5, y: 0.5};
	const LEFT = {x: 0, y: 0.5};
	const RIGHT = {x: 1, y: 0.5};
	const TOP = {x: 0.5, y: 0};
	const BOTTOM = {x: 0.5, y: 1};
	const TOP_RIGHT = {x: 1, y: 0};
	const TOP_LEFT = {x: 0, y: 0};
	const BOTTOM_RIGHT = {x: 1, y: 1};
	const BOTTOM_LEFT = {x: 0, y: 1};

	type TopData = {
		boardWidth: number;
		spacing: number;
		lineHeight: number;
		squares: number;
		indexWidth: number;
		statWidth: number;
		color: gui.Color;
		x: number;
		y: number;
		z: number;
		yaw: number;
	};

	class Top {

		// Размеры большого квадрата
		readonly offset: number;

		// Ширина всей таблицы
		readonly boardWidth: number;

		// Расстояние между элементами таблицы
		readonly spacing: number;

		// Высота маленькой строчки
		readonly lineHeight: number;
	
		// Количество больших квадратов
		readonly squares: number;

	    // Ширина ячеек для номера места (#1 #2 #3)
	    readonly indexWidth: number;

	    // Ширина ячеек для статистики
	    readonly statWidth: number;

	    // Цвет фона ячеек
	    readonly color: gui.Color;

	    readonly x: number;
	    readonly y: number;
	    readonly z: number;
	    readonly yaw: number;


		readonly board: gui.Box;
		readonly entity: gui.Box;

		scroll: number;


		constructor(readonly address: string, data: TopData) {
			this.boardWidth = data.boardWidth || 200;
			this.spacing = data.spacing || 1;
			this.lineHeight = data.lineHeight || 9;
			this.squares = data.squares || 3;
			this.indexWidth = data.indexWidth || 14;
			this.statWidth = data.statWidth || 30;
			this.color = data.color || {a: 0.5, r: 0, g: 0, b: 0};
			this.offset = (this.boardWidth - this.spacing * (this.squares - 1)) / this.squares;
			
			this.x = data.x;
			this.y = data.y;
			this.z = data.z;
			this.yaw = data.yaw || 0;

			this.board = rect({
				width: this.boardWidth,
				origin: {x: 0.5, y: 0}
			});
			this.entity = gui.rect({

				scale: 0.0625 * 0.5,
				children: [
					this.board,
					text({
						y: -this.offset / 2 - 2,
						z: -0.1,
						text: this.address,
						scale: 2,
						origin: BOTTOM,
						align: TOP,
					}),
					text({
						x: -0.5,
						y: -this.offset / 2 - 2 + 0.5,
						z: -0.05,
						text: '¨222200§lТоп по опыту',
						scale: 2,
						origin: BOTTOM,
						align: TOP,
					}),
					text({
						x: -0.5,
						y: -this.offset / 2 - 2 - 0.5,
						z: -0.05,
						text: '¨222200§lТоп по опыту',
						scale: 2,
						origin: BOTTOM,
						align: TOP,
					}),
					text({
						x: 0.5,
						y: -this.offset / 2 - 2 - 0.5,
						z: -0.05,
						text: '¨222200§lТоп по опыту',
						scale: 2,
						origin: BOTTOM,
						align: TOP,
					}),
					text({
						x: 0.5,
						y: -this.offset / 2 - 2 + 0.5,
						z: -0.05,
						text: '¨222200§lТоп по опыту',
						scale: 2,
						origin: BOTTOM,
						align: TOP,
					})
				],
			});
		}


		render(partialTicks: number): void {
			GL11.glPushMatrix();


	        GL11.glTranslatef(
	        	this.x - Player.getPosX() - (Player.getPosX() - Player.getPrevX()) * partialTicks, 
	        	this.y - Player.getPosY() - (Player.getPosY() - Player.getPrevY()) * partialTicks, 
	        	this.z - Player.getPosZ() - (Player.getPosZ() - Player.getPrevZ()) * partialTicks
	        );
	        GL11.glScalef(1, -1, -1);
	        // Относительный поворот
			GL11.glRotatef(this.yaw, 0, 1, 0);
			this.updateCulling();


	        // GL11.glDepthFunc(GL11.GL_LESS);
			this.entity.render(JavaSystem.currentTimeMillis(), 16, 16);
	        // GL11.glDepthFunc(GL11.GL_LEQUAL);

			GL11.glPopMatrix();


		}

		updateData(topData: TopEntry[]): void {
		        this.board.children = [];

				let place = 0;

				// Большие квадраты для самых лучших игроков
				for (let i = 0; i < this.squares && topData; i++) {
					place++;
					let topInfo = topData.shift();
					if (!topInfo) break;
					this.board.children.push(gui.rect({
						width: this.offset,
						height: this.offset,
						origin: {x: i * (1 / (this.squares - 1)), y: 0.5},
						align: {x: i * (1 / (this.squares - 1)), y: 0.5},
						color: {a: 0, r: 0, g: 0, b: 0},
						children: [rect({
							width: this.offset,
							height: this.offset,
							color: {a: 0, r: 0, g: 0, b: 0},
							origin: CENTER,
							align: CENTER,
							children: [
								rect({
									color: this.color,
									height: this.lineHeight,
									width: this.indexWidth,
									children: [text({
										z: -1,
										text: '#' + place,
										origin: CENTER, align: CENTER,
									})]
								}),
								rect({
									color: this.color,
									height: this.lineHeight,
									origin: TOP_RIGHT,
									align: TOP_RIGHT,
									width: this.offset - this.indexWidth - this.spacing,
									children: [text({
										z: -1,
										text: topInfo.key,
										origin: CENTER, align: CENTER,
									})]
								}),
								rect({
									color: this.color,
									height: this.lineHeight,
									origin: BOTTOM,
									align: BOTTOM,
									width: this.offset,
									children: [text({
										z: -1,
										text: '§e' + topInfo.value,
										origin: CENTER, align: CENTER,
									})]
								}),
							]
						})]
							// Тот квадратик, тот что под головой - пустое место
							// rect({
							// 	color: color,
							// 	width: offset,
							// 	height: offset - (spacing + lineHeight) * 2,
							// 	y: lineHeight + spacing
							// })
					}));
				}

				// Простые тонкие строчки
				let smallLineIndex = 0;
				while (topData && place < 100) {
					place++;
					let topInfo = topData.shift();
					if (!topInfo) break;
			 
					let ty = (smallLineIndex + 0.5) * (this.lineHeight + this.spacing) + (this.offset + this.spacing) / 2;
					smallLineIndex++;

					this.board.children.push(gui.rect({
						origin: LEFT, align: LEFT,
						y: ty,
						width: this.indexWidth,
						height: this.lineHeight,
						color: this.color,
						children: [text({
							z: -1,
							align: CENTER,
							origin: CENTER,
							text: '#' + place
						})]
					}));

					this.board.children.push(gui.rect({
						origin: LEFT, align: LEFT,
						x: this.indexWidth + this.spacing,
						y: ty,
						width: this.boardWidth - this.spacing * 2 - this.statWidth - this.indexWidth,
						height: this.lineHeight,
						color: this.color,
						children: [text({
							z: -1,
							align: CENTER,
							origin: CENTER,
							text: topInfo.key
						})]
					}));

					this.board.children.push(gui.rect({
						origin: RIGHT, align: RIGHT,
						y: ty,
						width: this.statWidth,
						height: this.lineHeight,
						color: this.color,
						children: [text({
							z: -1,
							align: CENTER,
							origin: CENTER,
							text: '§e' + topInfo.value
						})]
					}));
				}

				// for (let child of this.board.children) {
				// 	if (!this.isVisible(child)) child.scale.value = 0;
				// }
			}

			isVisible(line: gui.Element): boolean {
				let y = line.y.value + this.board.y.value;
				return y > 0 && y < 100;
			}

			updateCulling(): void {
				// for (let lineWrapper of this.board.children) {
				// 	let scale = this.isVisible(lineWrapper) ? 1 : 0;
				// 	if (lineWrapper.scale.toValue != scale) lineWrapper.scale.transit(scale, 250, easing.none);
				// }
			}


	}

	let tops: Top[] = [];

	Events.on(plugin, 'game_loop', () => {
		let dwheel = Mouse.getDWheel();
		for (let top of tops) {
			let dscroll = Math.round(dwheel / 10 / top.lineHeight) * top.lineHeight;
			ChatExtensions.printChatMessage("§eScroll of " + top.address + ": §f" + dscroll + " " + dwheel + " " + top.lineHeight + " " + top.scroll);
			if (dscroll) {
				top.scroll += dscroll;
		        top.board.y.transit(top.scroll, 400, easing.outQuint);
			}
		}
	});

	Events.on(plugin, 'render_pass_ticks', (event: RenderPassEvent) => {
		for (let top of tops) {
        	top.render(event.partialTicks);
        }
	});


	PluginMessages.on(plugin, 'museum:top-update', (buf: ByteBuf) => {
		let str = UtilNetty.readString(buf, 16777215);
		let data = JSON.parse(str);
		for (let key in data) {
			for (let top of tops) {
				if (top.address == key) {
					top.updateData(data[key])
				}
			}
		}
	});

	PluginMessages.on(plugin, 'museum:top-create', (buf: ByteBuf) => {
		let data = JSON.parse(UtilNetty.readString(buf, 16777215));
		for (let key in data) {
			tops.push(new Top(key, data[key]));
		}
	});


})(plugin);