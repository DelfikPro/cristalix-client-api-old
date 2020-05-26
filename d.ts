declare class Display {
    static getTitle(): string;

    static isFullscreen(): boolean;

    static setTitle(title: string): void;

    static isActive(): boolean;

    static getAdapter(): string;

    static getVersion(): string;

    static getX(): number;

    static getY(): number;

    static getWidth(): number;

    static getHeight(): number;
}

declare class Draw {
    static getFps(): number;

    static drawHorizontalLine(startX: number, endX: number, y: number, color: number): void;

    static drawVerticalLine(x: number, startY: number, endY: number, color: number): void;

    static drawRect(left: number, top: number, right: number, bottom: number, color: number): void;

    static drawStringWithShadow(text: string, x: number, y: number, color?: number): number;

    static drawString(text: string, x: number, y: number, color?: number, dropShadow?: boolean): number;

    static getStringWidth(text: string): number;

    static getCharWidth(char: number): number;

    static trimStringToWidth(text: string, width: number, reverse?: boolean): string;

    static drawSplitString(text: string, x: number, y: number, wrapWidth: number, textColor?: number): void;
}

declare type EnumFacing = 'DOWN' | 'UP' | 'NORTH' | 'SOUTH' | 'WEST' | 'EAST';
declare type EquipmentSlot = 'FEET' | 'LEGS' | 'CHEST' | 'HEAD' | 'OFFHAND';

declare type ChatEvent = {
    message: string,
    readonly command: boolean,
    cancelled: boolean,
};
declare type KeyPressEvent = {
    key: number,
    cancelled: boolean,
};

declare type EventAction = 'chat_send' | 'gui_overlay_render' | 'game_loop' | 'key_press' | 'server_connect' | 'server_switch' | 'overlay_render' | string;
declare type Listener<T> = (event: T) => void;

declare class Events {
    static on<T>(listener: any, action: EventAction, consumer: Listener<T>, priority?: number): void;

    static off<T>(action: EventAction, consumer: Listener<T>): void;

    static off(listener: any): void;

    static post<T>(action: EventAction | string, event: T): T;
}

declare type GameType = 'NOT_SET' | 'SURVIVAL' | 'CREATIVE' | 'ADVENTURE' | 'SPECTATOR';

declare class Inventory {
    static getMaxDamage(slot: number): number | 0;

    static getItemDamage(slot: number): number | 0;

    static getDurability(slot: number): number | 0;

    static getItemDisplayName(slot: number): string | '';

    static getCount(slot: number): number | 0;

    static isEquipped(slot: number): boolean | false;

    static getActiveSlot(): number | 0;
}

declare class Keyboard {
    KEY_NONE: number;
    KEY_ESCAPE: number;
    KEY_1: number;
    KEY_2: number;
    KEY_3: number;
    KEY_4: number;
    KEY_5: number;
    KEY_6: number;
    KEY_7: number;
    KEY_8: number;
    KEY_9: number;
    KEY_0: number;
    KEY_MINUS: number; /* - on main keyboard */
    KEY_EQUALS: number;
    KEY_BACK: number; /* backspace */
    KEY_TAB: number;
    KEY_Q: number;
    KEY_W: number;
    KEY_E: number;
    KEY_R: number;
    KEY_T: number;
    KEY_Y: number;
    KEY_U: number;
    KEY_I: number;
    KEY_O: number;
    KEY_P: number;
    KEY_LBRACKET: number;
    KEY_RBRACKET: number;
    KEY_RETURN: number; /* Enter on main keyboard */
    KEY_LCONTROL: number;
    KEY_A: number;
    KEY_S: number;
    KEY_D: number;
    KEY_F: number;
    KEY_G: number;
    KEY_H: number;
    KEY_J: number;
    KEY_K: number;
    KEY_L: number;
    KEY_SEMICOLON: number;
    KEY_APOSTROPHE: number;
    KEY_GRAVE: number; /* accent grave */
    KEY_LSHIFT: number;
    KEY_BACKSLASH: number;
    KEY_Z: number;
    KEY_X: number;
    KEY_C: number;
    KEY_V: number;
    KEY_B: number;
    KEY_N: number;
    KEY_M: number;
    KEY_COMMA: number;
    KEY_PERIOD: number; /* . on main keyboard */
    KEY_SLASH: number; /* / on main keyboard */
    KEY_RSHIFT: number;
    KEY_MULTIPLY: number; /* * on numeric keypad */
    KEY_LMENU: number; /* left Alt */
    KEY_SPACE: number;
    KEY_CAPITAL: number;
    KEY_F1: number;
    KEY_F2: number;
    KEY_F3: number;
    KEY_F4: number;
    KEY_F5: number;
    KEY_F6: number;
    KEY_F7: number;
    KEY_F8: number;
    KEY_F9: number;
    KEY_F10: number;
    KEY_NUMLOCK: number;
    KEY_SCROLL: number; /* Scroll Lock */
    KEY_NUMPAD7: number;
    KEY_NUMPAD8: number;
    KEY_NUMPAD9: number;
    KEY_SUBTRACT: number; /* - on numeric keypad */
    KEY_NUMPAD4: number;
    KEY_NUMPAD5: number;
    KEY_NUMPAD6: number;
    KEY_ADD: number; /* + on numeric keypad */
    KEY_NUMPAD1: number;
    KEY_NUMPAD2: number;
    KEY_NUMPAD3: number;
    KEY_NUMPAD0: number;
    KEY_DECIMAL: number; /* . on numeric keypad */
    KEY_F11: number;
    KEY_F12: number;
    KEY_F13: number; /*                     (NEC PC98) */
    KEY_F14: number; /*                     (NEC PC98) */
    KEY_F15: number; /*                     (NEC PC98) */
    KEY_F16: number; /* Extended Function keys - (Mac) */
    KEY_F17: number;
    KEY_F18: number;
    KEY_KANA: number; /* (Japanese keyboard)            */
    KEY_F19: number; /* Extended Function keys - (Mac) */
    KEY_CONVERT: number; /* (Japanese keyboard)            */
    KEY_NOCONVERT: number; /* (Japanese keyboard)            */
    KEY_YEN: number; /* (Japanese keyboard)            */
    KEY_NUMPADEQUALS: number; /*=on numeric keypad (NEC PC98) */
    KEY_CIRCUMFLEX: number; /* (Japanese keyboard)            */
    KEY_AT: number; /*                     (NEC PC98) */
    KEY_COLON: number; /*                     (NEC PC98) */
    KEY_UNDERLINE: number; /*                     (NEC PC98) */
    KEY_KANJI: number; /* (Japanese keyboard)            */
    KEY_STOP: number; /*                     (NEC PC98) */
    KEY_AX: number; /*                     (Japan AX) */
    KEY_UNLABELED: number; /*                        (J3100) */
    KEY_NUMPADENTER: number; /* Enter on numeric keypad */
    KEY_RCONTROL: number;
    KEY_SECTION: number; /* Section symbol (Mac) */
    KEY_NUMPADCOMMA: number; /* , on numeric keypad (NEC PC98) */
    KEY_DIVIDE: number; /* / on numeric keypad */
    KEY_SYSRQ: number;
    KEY_RMENU: number; /* right Alt */
    KEY_FUNCTION: number; /* Function (Mac) */
    KEY_PAUSE: number; /* Pause */
    KEY_HOME; /* Home on arrow keypad */
    KEY_UP: number; /* UpArrow on arrow keypad */
    KEY_PRIOR: number; /* PgUp on arrow keypad */
    KEY_LEFT: number; /* LeftArrow on arrow keypad */
    KEY_RIGHT: number; /* RightArrow on arrow keypad */
    KEY_END: number; /* End on arrow keypad */
    KEY_DOWN: number; /* DownArrow on arrow keypad */
    KEY_NEXT: number; /* PgDn on arrow keypad */
    KEY_INSERT: number; /* Insert on arrow keypad */
    KEY_DELETE: number; /* Delete on arrow keypad */
    KEY_CLEAR: number; /* Clear key (Mac) */
    KEY_LMETA: number; /* Left Windows/Option key */
    KEY_RMETA: number; /* Right Windows/Option key */
    KEY_APPS: number; /* AppMenu key */
    KEY_POWER: number;
    KEY_SLEEP: number;

    static isKeyDown(key: number): boolean;

    static getEventKey(): number;

    static getEventCharacter(): number;
    static getEventKeyState(): boolean;

    static getKeyName(key: number): string;

    static getKeyIndex(keyName: string): number;
}

declare class ScaledResolution {
    getScaledWidth(): number;

    getScaledHeight(): number;

    getScaledWidth_double(): number;

    getScaledHeight_double(): number;

    getScaleFactor(): number;
}

declare class Mouse {
    static isButtonDown(button: number): boolean;

    static getButtonName(button: number): string | undefined;

    static getButtonIndex(buttonName: string): number | -1;

    static getEventButton(): number;

    static getEventButtonState(): boolean;

    static getEventDX(): number;

    static getEventDY(): number;

    static getEventX(): number;

    static getEventY(): number;

    static getEventDWheel(): number;

    static getX(): number;

    static getY(): number;

    static getDX(): number;

    static getDY(): number;

    static getDWheel(): number;

    static getButtonCount(): number;

    hasWheel(): boolean;

    isGrabbed(): boolean;

    getMouseX(resolution: ScaledResolution): number;

    getMouseY(resolution: ScaledResolution): number;
}

declare class Player {
    getPosX(): number | 0.0;

    getPosY(): number | 0.0;

    getPosZ(): number | 0.0;

    getYaw(): number | 0.0;

    getPitch(): number | 0.0;

    getHorizontalFacing(): EnumFacing | undefined;

    getVerticalFacing(): EnumFacing | undefined;

    getHealth(): number | 0.0;

    getMaxHealth(): number | 0.0;

    // TODO getActivePotionEffects

    getGameType(): GameType | undefined;

    getName(): string;

    isConnected(): boolean;

    // TODO etTargetBlockPos(reach: number): BlockPos | undefined;
}

declare class Runtime {
    static exit(code: number): void;

    static halt(code: number): void;

    static freeMemory(): number;

    static maxMemory(): number;

    static totalMemory(): number;
}

declare class System {
    static exit(code: number): void;

    static halt(code: number): void;

    static getOsName(): string;

    static getOsVersion(): string;

    static currentTimeMillis(): number;

    static nanoTime(): number;
}

declare class World {
    static getTime(): number | 0;

    static getTotalTime(): number | 0;
}