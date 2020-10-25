/// <reference path="api/d.ts" />
import * as easing from './api/easing';
import * as gui from './api/gui';
import * as vecmath from './api/vecmath';

(function(plugin: any) {
	
	type Party = {
	    leader: string;
		members: Member[];
	    invites: Member[];
	    offline: Member[];
	};

	function getMember(party: Party, uuid: string): Member {
		for (let member of party.members) if (member.id == uuid) return member;
		for (let member of party.invites) if (member.id == uuid) return member;
		for (let member of party.offline) if (member.id == uuid) return member;
		return null;
	}

	type Member = {
		id: string,
		name: string,
		displayName: string,
	};

	var party: Party = {
		leader: '307264a1-2c69-11e8-b5ea-1cb72caa35fd',
		members: [
			{
				id: 'e7c13d3d-ac38-11e8-8374-1cb72caa35fd',
				name: 'DelfikPro',
				displayName: '§9Dev ¨262626DelfikPro',
			}, 
			{
				id: '307264a1-2c69-11e8-b5ea-1cb72caa35fd',
				name: 'Func',
				displayName: '§9Dev §dFunc',
			},
			{
				id: '327cac64-8b1e-11e8-a6de-1cb72caa35fd',
				name: 'UndFrame',
				displayName: '§9Dev §fUndFrame'
			},
		],
		offline: [],
		invites: [],
	};

	class MemberInfo {

		rect: gui.Box;

		constructor(readonly member: Member) {
			this.rect = this.createRect();
		}

		createRect(): gui.Box {
			var name = this.member.displayName;
			return gui.rect({
				width: Draw.getStringWidth(name) + 2,
				children: [
					gui.text({
						text: name,
						align: gui.TOP,
						origin: gui.TOP,
						// shadow: true
					})
				]
			});
		}

	}

	var memberInfos: MemberInfo[] = [];
	var staleMemberInfos: MemberInfo[] = [];

	function updateInfo(party: Party) {
		var newMemberInfos: MemberInfo[] = [];
		staleMemberInfos = [];
		var y = 0;
		if (memberInfos) {
			for (let memberInfo of memberInfos) {
				let member = getMember(party, memberInfo.member.id);
				if (!member) {
					staleMemberInfos.push(memberInfo);
					memberInfo.rect.originX.transit(1.1, 400, easing.none, () => {
						updateInfo(party);
					});
				} else {
					newMemberInfos.push(memberInfo)
					memberInfo.rect.y.transit(y, 400, easing.none);
				}
				y += 9;
			}
		}
		for (let member of party.members) {
			var found = false;
			for (let info of newMemberInfos) {
				if (info.member.id == member.id) found = true;
			}
			if (found) continue;
			var info = new MemberInfo(member);
			info.rect.y.value = y;
			info.rect.originX.value = 1.1;
			info.rect.originX.transit(0, 400, easing.none)
			newMemberInfos.push(info);
			y += 9;
		}

		memberInfos = newMemberInfos

	}

	updateInfo(party);

	var party: Party = {
		leader: '307264a1-2c69-11e8-b5ea-1cb72caa35fd',
		members: [
			{
				id: 'e7c13d3d-ac38-11e8-8374-1cb72caa35fd',
				name: 'DelfikPro',
				displayName: '§9Dev ¨262626DelfikPro',
			},
			{
				id: '327cac64-8b1e-11e8-a6de-1cb72caa35fd',
				name: 'UndFrame',
				displayName: '§9Dev §fUndFrame'
			},
			{
				id: '303c31eb-2c69-11e8-b5ea-1cb72caa35fd',
				name: '_Demaster_',
				displayName: '§cOWN §7_Demaster_',
			}
		],
		offline: [],
		invites: [],
	};


	Events.on(plugin, 'gui_overlay_render', () => {

		let state = gui.getScreenState();
		GL11.glPushMatrix();
		GL11.glTranslatef(1, 2, 0);
		// for (let member of memberInfos) {
		// 	member.rect.render(state.time, state.width, state.height);
		// }
		// for (let member of staleMemberInfos) {
		// 	member.rect.render(state.time, state.width, state.height);
		// }
		GL11.glPopMatrix();

	});

	var inviteText = '§9Dev §dFunc §fприглашает вас на тусовку';

	var inviteBack = gui.rect({
		width: Draw.getStringWidth(inviteText) + 16,
		height: 20,
		color: {a: 0.5, r: 0.1, g: 0.1, b: 0.1},
		y: 10,
		origin: gui.TOP_RIGHT,
	})
	var inviteBox = gui.rect({
		width: Draw.getStringWidth(inviteText) + 16,
		height: 20,
		color: {a: 0.5, r: 0.1, g: 0.1, b: 0.1},
		y: 10,
		origin: gui.TOP_RIGHT,
		children: [
			gui.text({
				text: inviteText,
				origin: gui.CENTER,
				align: gui.CENTER,
			}),
			gui.rect({
				width: 16,
				height: 16,
				y: 2,
				origin: gui.TOP_RIGHT,
				align: gui.BOTTOM_RIGHT,
				texture: 'minecraft:textures/delfikpro/yes1.png',
				color: {a:1,r:1,g:1,b:1},
				onHover: (ss: gui.ScreenState, hovered: boolean) => {
					// if (hovered)
				}
				// color: {a: 0.7, r: 0.15, g: 0.8, b: 0.15},
			}),
			gui.rect({
				width: 16,
				height: 16,
				x: -18,
				y: 2,
				origin: gui.TOP_RIGHT,
				align: gui.BOTTOM_RIGHT,
				texture: 'minecraft:textures/delfikpro/no1.png',
				color: {a:1,r:1,g:1,b:1},
				// color: {a: 0.8, r: 0.15, g: 0.15, b: 0.15},
				// children: [
				// 	gui.text({
				// 		text: '§0䂄',
				// 		// shadow: true,
				// 		origin: gui.CENTER,
				// 		align: gui.CENTER,
				// 		scale: 0.8,
				// 		y: 1,
				// 	})
				// ]
			})
		]
	});
	gui.register(plugin);
	gui.overlay.push(inviteBack, inviteBox);


	Events.on(plugin, 'key_press', (event: KeyPressEvent) => {
		if (event.key == Keyboard.KEY_U) {
			updateInfo(party);
		} else if (event.key == Keyboard.KEY_I) {
			inviteBox.rotationZ.transit(inviteBox.rotationZ.value, 300, easing.none, () => {
				inviteBox.originX.transit(0, 500, easing.bothQuart);
			});
			inviteBack.originX.transit(0, 500, easing.bothQuart);
		}
	})



	PluginMessages.on(plugin, 'brawlstars', (bb) => {
		PluginMessages.off(plugin);
		Events.off(plugin);
	})

})(plugin);