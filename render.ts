/// <reference path="./d.ts" />
import { V2 } from './math';

export type RenderAlignment = (vec: V2, resolution: ScaledResolution) => V2;
export function alignmentExact(): RenderAlignment {
    return (vec: V2) => vec;
};
export function alignmentTopLeft(): RenderAlignment {
    return (vec: V2) => vec;
}
export function alignmentTopRight(): RenderAlignment {
    return (vec: V2, resolution: ScaledResolution) => ({ x: resolution.getScaledWidth() - vec.x, y: vec.y }) as V2;
}
export function alignmentBottomLeft(): RenderAlignment {
    return (vec: V2, resolution: ScaledResolution) => ({ x: vec.x, y: resolution.getScaledHeight() - vec.y }) as V2;
}
export function alignmentBottomRight(): RenderAlignment {
    return (vec: V2, resolution: ScaledResolution) => ({ x: resolution.getScaledWidth() - vec.x, y: resolution.getScaledHeight() - vec.y }) as V2;
}

export type RenderRegion = {
    readonly pos: V2,
    wh: V2,
    readonly alignment: RenderAlignment,
}

export type RenderText = {
    text: () => string,
    color?: () => number,
    dropShadow?: () => boolean,
};
export function renderText(text: () => string): RenderText {
    return {
        text: text
    };
}

export abstract class RenderElement {
    constructor(public region: RenderRegion) { }

    public abstract render(mousePos: V2, resolution: ScaledResolution): V2;
}

export class RenderRect extends RenderElement {
    constructor(public region: RenderRegion, public background: number) {
        super(region);
    }

    public render(_mousePos: V2, resolution: ScaledResolution): V2 {
        const region = this.region;
        const xy = region.alignment(region.pos, resolution)!;
        const wh = region.wh;
        const { x, y } = xy;
        Draw.drawRect(x, y, x + wh.x, y + wh.y, this.background);
        return xy;
    }
}

export class RenderBoard extends RenderRect {
    private lines: RenderText[] = [];

    constructor(public region: RenderRegion, public background: number) {
        super(region, background);
    }

    public line(...lines: RenderText[]): RenderBoard {
        return this.lines.push(...lines) && this;
    }

    public render(_mousePos: V2, resolution: ScaledResolution): V2 {
        let maxWidth = 0;
        const lines = this.lines.map(line => {
            const text = line.text()!;
            const width = Draw.getStringWidth(text);
            if (width > maxWidth) {
                maxWidth = width;
            }
            const color = line.color;
            const dropShadow = line.dropShadow;
            return {
                text: text,
                color: (color && color()) ?? -1,
                dropShadow: (dropShadow && dropShadow()) ?? false,
                width: width
            }
        });
        this.region.wh = { x: maxWidth + 3, y: lines.length * 9 + 2 };
        const pos = super.render(_mousePos, resolution);
        let { x, y } = pos;
        x += 1;
        y += 3;
        for (const line of lines) {
            Draw.drawString(line.text, x, y, line.color, line.dropShadow);
            y += 9;
        }
        return pos;
    }
}

export class RenderLabel extends RenderRect {
    constructor(public region: RenderRegion, public background: number, readonly text: () => RenderText) {
        super(region, background);
    }
    public render(_mousePos: V2, resolution: ScaledResolution): V2 {
        const pos = super.render(_mousePos, resolution);
        const text = this.text()!;
        const color = text.color;
        const dropShadow = text.dropShadow;
        Draw.drawString(text.text(), pos.x + 1, pos.y + 3, (color && color()) ?? -1, (dropShadow && dropShadow()) ?? false);
        return pos;
    }
}

export class RenderButon extends RenderLabel {
    public enabled: boolean = true;

    constructor(public region: RenderRegion, public background: number, readonly text: () => RenderText) {
        super(region, background, text);
    }

    public isMouseOver(x: number, y: number, resolution: ScaledResolution): boolean {
        if (!this.enabled) {
            return false;
        }
        const region = this.region;
        const pos = region.alignment(region.pos, resolution)!;
        const wh = region.wh;
        return x >= pos.x && x <= pos.x + wh.x && y >= pos.y && y <= pos.y + wh.y;
    }
}