/// <reference path="./api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import { text } from './api/gui';

(function(plugin: any) {
	let show = true;

	Events.on(plugin, 'key_press', (e: KeyPressEvent) => {
		if (e.key === Keyboard.KEY_J) {
			show = !show
			title.enabled = show;
		}
	});

	gui.register(plugin);

	const title = gui.rect({
		color: {a: 0, r: 0, g: 1, b: 0},
		align: {x: 0.02, y: 0.02},
	});

	let yScale = 0;
	for (let entry of [
		"Находите останки, меняйте музей,",
		"летайте! Посетители кидают монеты, ",
		"собирайте их. Как начать раскопки?",
		"Меню > Экспедиции -> Остров Бриз",
		"Кол-во ударов ограничено!",
		"Лавка продает еду (перед музеем),",
		"но еда кончается, поэтому",
		"заказывайте продукты, забирайте груз",
		"у желтой метки и относите обратно.",
		"Магазин построек /shop",
		"",
		"!!! Нажмите J, чтобы скрыть/показать подсказки!"
	]) {
		title.children.push(gui.text({
			text: entry,
			origin: {x: 0, y: -yScale},
			align: {x: 0, y: -yScale},
			shadow: true
		}));
		yScale += 1.07;
	}
	title.enabled = show;
	gui.overlay.push(title);
})(plugin);