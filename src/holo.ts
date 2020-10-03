/// <reference path="./api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import * as vecmath from './api/vecmath';
import { text, rect } from './api/gui';


(function(plugin: any) {

	gui.register(plugin);

	let textLines: string[] = [
		"Мне все время кажется что ты",
		"Осталась там за поворотом",
		"Как и все мои мечты",
		"Что тлеют где-то у костра",
		"Помнишь ли ты те дни, когда",
		"Мы были полностью свободны",
		"Те осенние дожди",
		"И разговоры до утра",
		"",
		"Посмотри мне в глаза",
		"Назови моё имя",
		"Неужели всегда",
		"Мы были с тобою такими?",
		"",
		"Снова чьи-то шаги в прихожей",
		"И голос ни на кого не похожий",
		"Сердца заглушил стук",
		"Город всё тяжелее дышит",
		"И либо наша с тобой едет крыша",
		"Либо у всех вокруг",
		"",
		"На твоём лице я вижу словно",
		"Отражение своих мыслей",
		"На линованной бумаге",
		"Пишешь только поперёк",
		"Когда нам нечего терять",
		"Становится уже не страшно",
		"Мир приветливей и краше",
		"Если выйти за порог",
		"",
		"Я так хочу уплыть куда-то далеко",
		"Знаешь, жить в реальности так нелегко",
		"Сегодня день немного хуже, чем прошедший",
		"§dМне 17 лет и я сумасшедший",
	];

	var boardWidth = 200;
	var offset = (boardWidth - 2) / 3;

	var board = gui.rect({
		width: 200,
		origin: {x: 0.5, y: 0},

		children: [
			rect({
				z: -1,
				width: 3, height: 3,
				align: {x: 0, y: 0},
				origin: {x: 0.5, y: 0.5},
				color: {a: 1, r: 1, g: 0, b: 0}
			}),
			rect({
				z: -1,
				width: 3, height: 3,
				align: {x: 1, y: 0},
				origin: {x: 0.5, y: 0.5},
				color: {a: 1, r: 1, g: 0, b: 0}
			})
		]
	});

	var entity = gui.rect({

		scale: 0.0625 * 0.5,
		children: [board],

	});


	board.children.push(gui.rect({
		width: offset,
		height: offset,
		origin: {x: 0, y: 0.5},
		align: {x: 0, y: 0.5},
		color: {a: 0.5, r: 0, g: 0, b: 0},
		children: [
			gui.text({
				align: {x: 0.5, y: 0},
				origin: {x: 0.5, y: 0},
				text: 'Топ 1'
			})
		]
	}));
	board.children.push(gui.rect({
		width: offset,
		height: offset,
		origin: {x: 0.5, y: 0.5},
		align: {x: 0.5, y: 0.5},
		color: {a: 0.5, r: 0, g: 0, b: 0},
		children: [
			gui.text({
				align: {x: 0.5, y: 0},
				origin: {x: 0.5, y: 0},
				text: 'Топ 2'
			})
		]
	}));
	board.children.push(gui.rect({
		width: offset,
		height: offset,
		origin: {x: 1, y: 0.5},
		align: {x: 1, y: 0.5},
		color: {a: 0.5, r: 0, g: 0, b: 0},
		children: [
			gui.text({
				align: {x: 0.5, y: 0},
				origin: {x: 0.5, y: 0},
				text: 'Топ 3'
			})
		]
	}));
	for (let i = 0; i < textLines.length; i++) {
		board.children.push(gui.rect({
			origin: {x: 0.5, y: 0},
			align: {x: 0.5, y: 0},
			y: (i + 0.5) * 10 + (offset + 1) / 2,
			children: [gui.rect({
				width: 200,
				height: 9,
				origin: {x: 0.5, y: 0.5},
				color: {a: 0.5, r: 0, b: 0, g: 0},
				children: [
					gui.text({
						align: {x: 0.5, y: 0},
						origin: {x: 0.5, y: 0},
						text: textLines[i]
					})
				]
			})]
		}));
	}

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

	var scroll = 0;

	Events.on(plugin, 'game_loop', (event) => {
		var dwheel = Mouse.getDWheel() / 10;
		if (dwheel) {
			scroll += dwheel;
	        board.y.transit(scroll, 400, easing.outQuint);
		}
		
	});

	Events.on(plugin, 'render_pass_ticks', (event: RenderPassEvent) => {
		
        let screenState = gui.getScreenState();

        GL11.glPushMatrix();

        var holoX = 5;
        var holoY = 98;
        var holoZ = 0;

        var t = event.partialTicks;

        GL11.glTranslatef(
        	holoX - Player.getPosX() - (Player.getPosX() - Player.getPrevX()) * t, 
        	holoY - Player.getPosY() - (Player.getPosY() - Player.getPrevY()) * t, 
        	holoZ - Player.getPosZ() - (Player.getPosZ() - Player.getPrevZ()) * t
        );
        GL11.glScalef(1, -1, -1);
		
		updateCulling();
		entity.render(JavaSystem.currentTimeMillis(), 16, 16);

		GL11.glPopMatrix();

	});



})(plugin);