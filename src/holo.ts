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

	let topData: TopEntry[] = [
		{key: '__xDark', value: 1000},
		{key: 'Func', value: 968},
		{key: 'ilya_fx', value: 871},
		{key: '_Demaster_', value: 824},
		{key: 'KlashRaick', value: 790},
		{key: 'Pepel_ok', value: 485},
		{key: 'EveryMe', value: 301},
		{key: 'lakaithree', value: 100},
		{key: 'НекийЛач', value: 50},
		{key: 'Test', value: 1},
	]

    // Будет удалено
	PluginMessages.on(plugin, 'museum:top', (buf: ByteBuf) => {
	    let data = JSON.parse(UtilNetty.readString(buf, 65535)).EXPERIENCE
        updateData(data as TopEntry[])
	})

	// Ширина всей таблицы
	var boardWidth = 200;

	// Расстояние между элементами таблицы
	var spacing = 1;

	// Высота маленькой строчки
	var lineHeight = 9;
	
	// Количество больших квадратов
	let squares = 3;

	// Размеры большого квадрата
	let offset = (boardWidth - spacing * (squares - 1)) / squares;

	// Цвет ячеек
	let color = {a: 0.5, r: 0, g: 0, b: 0};

	// Ширина ячеек для номера места (#1 #2 #3)
	let indexWidth = 14;

	// Ширина ячеек для статистики
	let statWidth = 30;

	let board = gui.rect({
		width: boardWidth,
		origin: {x: 0.5, y: 0}
	});

	let entity = gui.rect({

		scale: 0.0625 * 0.5,
		children: [
			board,
			text({
				y: -offset / 2 - 2,
				z: -0.1,
				text: '§6§lТоп по опыту',
				scale: 2,
				origin: BOTTOM,
				align: TOP,
			}),
			text({
				x: -0.5,
				y: -offset / 2 - 2 + 0.5,
				z: -0.05,
				text: '¨222200§lТоп по опыту',
				scale: 2,
				origin: BOTTOM,
				align: TOP,
			}),
			text({
				x: -0.5,
				y: -offset / 2 - 2 - 0.5,
				z: -0.05,
				text: '¨222200§lТоп по опыту',
				scale: 2,
				origin: BOTTOM,
				align: TOP,
			}),
			text({
				x: 0.5,
				y: -offset / 2 - 2 - 0.5,
				z: -0.05,
				text: '¨222200§lТоп по опыту',
				scale: 2,
				origin: BOTTOM,
				align: TOP,
			}),
			text({
				x: 0.5,
				y: -offset / 2 - 2 + 0.5,
				z: -0.05,
				text: '¨222200§lТоп по опыту',
				scale: 2,
				origin: BOTTOM,
				align: TOP,
			})
		],
	});

	function updateData(topData: TopEntry[]): void {
        board.children = [];

		let place = 0;

		// Большие квадраты для самых лучших игроков
		for (let i = 0; i < squares && topData; i++) {
			place++;
			let topInfo = topData.shift();
			if (!topInfo) break;
			board.children.push(gui.rect({
				width: offset,
				height: offset,
				origin: {x: i * (1 / (squares - 1)), y: 0.5},
				align: {x: i * (1 / (squares - 1)), y: 0.5},
				color: {a: 0, r: 0, g: 0, b: 0},
				children: [rect({
					width: offset,
					height: offset,
					color: {a: 0, r: 0, g: 0, b: 0},
					origin: CENTER,
					align: CENTER,
					children: [
						rect({
							color: color,
							height: lineHeight,
							width: indexWidth,
							children: [text({
								z: -1,
								text: '#' + place,
								origin: CENTER, align: CENTER,
							})]
						}),
						rect({
							color: color,
							height: lineHeight,
							origin: TOP_RIGHT,
							align: TOP_RIGHT,
							width: offset - indexWidth - spacing,
							children: [text({
								z: -1,
								text: topInfo.key,
								origin: CENTER, align: CENTER,
							})]
						}),
						rect({
							color: color,
							height: lineHeight,
							origin: BOTTOM,
							align: BOTTOM,
							width: offset,
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
	 
			let y = (smallLineIndex + 0.5) * (lineHeight + spacing) + (offset + spacing) / 2;
			smallLineIndex++;

			board.children.push(gui.rect({
				origin: LEFT, align: LEFT,
				y: y,
				width: indexWidth,
				height: lineHeight,
				color: color,
				children: [text({
					z: -1,
					align: CENTER,
					origin: CENTER,
					text: '#' + place
				})]
			}));

			board.children.push(gui.rect({
				origin: LEFT, align: LEFT,
				x: indexWidth + spacing,
				y: y,
				width: boardWidth - spacing * 2 - statWidth - indexWidth,
				height: lineHeight,
				color: color,
				children: [text({
					z: -1,
					align: CENTER,
					origin: CENTER,
					text: topInfo.key
				})]
			}));

			board.children.push(gui.rect({
				origin: RIGHT, align: RIGHT,
				y: y,
				width: statWidth,
				height: lineHeight,
				color: color,
				children: [text({
					z: -1,
					align: CENTER,
					origin: CENTER,
					text: '§e' + topInfo.value
				})]
			}));
		}
		updateCulling();
	}

	updateData(topData);

	function updateCulling(): void {
		for (let lineWrapper of board.children) {
			let y = lineWrapper.y.value + board.y.value;
			// let angle = y < 0 ? -90 : y > 100 ? 90 : 0;
			let scale = y < 0 ? 0 : y > 100 ? 0 : 1;
			// let line = (lineWrapper as gui.Box).children[0]
			// if (line.rotationX.toValue != angle) line.rotationX.transit(angle, 250, easing.none);
			if (lineWrapper.scale.toValue != scale) lineWrapper.scale.transit(scale, 250, easing.none);
		}
	}

	let scroll = 0;

	Events.on(plugin, 'game_loop', () => {
		let dwheel = Math.round(Mouse.getDWheel() / 10 / lineHeight) * lineHeight;
		if (dwheel) {
			scroll += dwheel;
	        board.y.transit(scroll, 400, easing.outQuint);
		}
	});

	Events.on(plugin, 'render_pass_ticks', (event: RenderPassEvent) => {
        GL11.glPushMatrix();

        let holoX = 5;
        let holoY = 98;
        let holoZ = 0;

        let t = event.partialTicks;

        GL11.glTranslatef(
        	holoX - Player.getPosX() - (Player.getPosX() - Player.getPrevX()) * t, 
        	holoY - Player.getPosY() - (Player.getPosY() - Player.getPrevY()) * t, 
        	holoZ - Player.getPosZ() - (Player.getPosZ() - Player.getPrevZ()) * t
        );
        GL11.glScalef(1, -1, -1);
        // Относительный поворот
		GL11.glRotatef(90, 0, 1, 0);
		updateCulling();


        // GL11.glDepthFunc(GL11.GL_LESS);
		entity.render(JavaSystem.currentTimeMillis(), 16, 16);
        // GL11.glDepthFunc(GL11.GL_LEQUAL);

		GL11.glPopMatrix();

	});
})(plugin);