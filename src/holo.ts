/// <reference path="./d.ts" />
import * as easing from './easing';
import * as gui from './gui';
import { text } from './gui';



(function(plugin: any) {

	gui.register(plugin);

	var test = gui.rect({
		width: 100,
		height: 30,
		color: {a: 0.5, r: 0, b: 0, g: 0},
		children: [
			gui.text({
				text: "Hello, world!"
			})
		],
		scale: 0.0625
	})

	Events.on(plugin, 'render_pass', event => {
		
        let screenState = gui.getScreenState();

        GL11.glPushMatrix();

        var holoX = 0;
        var holoY = 100;
        var holoZ = 0;

        GL11.glTranslatef(holoX - Player.getPosX(), holoY - Player.getPosY(), holoZ - Player.getPosZ());
        GL11.glScalef(1, -1, -1);

		test.render(JavaSystem.currentTimeMillis(), 16, 16);

		GL11.glPopMatrix();

	});


})(plugin);