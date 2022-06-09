import type { Presence } from "discord-rpc";

export const rpcActivity: Presence = {
	details: "In a ping pong game (0 - 0)",
	state: "Playing",
	buttons: [
		{ label: "View repository", url: "https://github.com/DTrombett/pong" },
	],
	largeImageKey: "pong",
	largeImageText: "Pong",
	smallImageKey: "play",
	smallImageText: "Playing",
	startTimestamp: new Date(),
};
