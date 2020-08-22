/// <reference path="./d.ts" />

import * as vecmath from './vecmath';

// private static FloatBuffer colorBuffer = GLAllocation.createDirectFloatBuffer(16);
var colorBuffer = Unpooled.directBuffer(16);

// private static final Vec3d LIGHT0_POS = new Vec3d(0.2, 1.0, -0.7).normalize();
var LIGHT0_POS = vecmath.normalize3({x: 0.2, y: 1.0, z: -0.7});

// private static final Vec3d LIGHT1_POS = new Vec3d(-0.2, 1.0, 0.7).normalize();
var LIGHT1_POS = vecmath.normalize3({x: -0.2, y: 1.0, z: 0.7});


export function disableStandardItemLighting(): void {
	GlStateManager.disableLighting();
	GlStateManager.disableLight(0);
	GlStateManager.disableLight(1);
	GlStateManager.disableColorMaterial();
}

export function enableStandardItemLighting(): void {
	GlStateManager.enableLighting();
	GlStateManager.enableLight(0);
	GlStateManager.enableLight(1);
	GlStateManager.enableColorMaterial();
	GlStateManager.colorMaterial(1032, 5634);
	var f = 0.4;
	var f1 = 0.6;
	var f2 = 0.0;
	GL11.glLight(GL11.GL_LIGHT0, GL11.GL_POSITION, setColorBuffer(LIGHT0_POS.x, LIGHT0_POS.y, LIGHT0_POS.z, 0).nioBuffer().asFloatBuffer());
	GL11.glLight(GL11.GL_LIGHT0, GL11.GL_DIFFUSE, setColorBuffer(f1, f1, f1, 1.0).nioBuffer().asFloatBuffer());
	GL11.glLight(GL11.GL_LIGHT0, GL11.GL_AMBIENT, setColorBuffer(0.0, 0.0, 0.0, 1.0).nioBuffer().asFloatBuffer());
	GL11.glLight(GL11.GL_LIGHT0, GL11.GL_SPECULAR, setColorBuffer(f2, f2, f2, 1.0).nioBuffer().asFloatBuffer());
	GL11.glLight(GL11.GL_LIGHT1, GL11.GL_POSITION, setColorBuffer(LIGHT1_POS.x, LIGHT1_POS.y, LIGHT1_POS.z, 0).nioBuffer().asFloatBuffer());
	GL11.glLight(GL11.GL_LIGHT1, GL11.GL_DIFFUSE, setColorBuffer(f1, f1, f1, 1.0).nioBuffer().asFloatBuffer());
	GL11.glLight(GL11.GL_LIGHT1, GL11.GL_AMBIENT, setColorBuffer(0.0, 0.0, 0.0, 1.0).nioBuffer().asFloatBuffer());
	GL11.glLight(GL11.GL_LIGHT1, GL11.GL_SPECULAR, setColorBuffer(f2, f2, f2, 1.0).nioBuffer().asFloatBuffer());
	GlStateManager.shadeModel(7424);
	GL11.glLightModel(GL11.GL_LIGHT_MODEL_AMBIENT, setColorBuffer(f, f, f, 1.0).nioBuffer().asFloatBuffer());
}

/**
 * Update and return colorBuffer with the RGBA values passed as arguments
 */
 function setColorBuffer(r: number, g: number, b: number, a: number): ByteBuf {
	colorBuffer.resetReaderIndex();
	colorBuffer.resetWriterIndex();
	colorBuffer.writeFloat(r).writeFloat(g).writeFloat(b).writeFloat(a);
	return colorBuffer;
}

/**
 * Sets OpenGL lighting for rendering blocks as items inside GUI screens (such as containers).
 */
export function enableGUIStandardItemLighting(): void {
	GL11.glPushMatrix();
	GL11.glRotatef(-30.0, 0.0, 1.0, 0.0);
	GL11.glRotatef(165.0, 1.0, 0.0, 0.0);
	enableStandardItemLighting();
	GL11.glPopMatrix();
}