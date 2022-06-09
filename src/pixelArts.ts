/* eslint-disable no-sparse-arrays */
import { setInterval } from "node:timers/promises";
import type { PingPongTable, PixelArt } from "./types";
import { Colors } from "./types";

declare let paused: boolean;

/**
 * Pixel arts are 2d arrays of colors.
 * Every pixel art also exports the number of columns as it's not easy to retrieve it from the array.
 */

/**
 * Create a function to render a pixel art.
 * @param pingPongTable - The table to use
 * @param rackets - The rackets to use
 * @param ball - The ball to use
 * @param columns - The number of columns in the table
 * @param racketHeight - The height of the rackets
 * @returns The function to render a pixel art
 */
export const renderPixelArt = (
	pingPongTable: PingPongTable,
	render: () => Promise<void>,
	art: PixelArt,
	artColumns: number,
	xOffset = 0,
	yOffset = 0
) => {
	let i = 0,
		j = 0;

	return new Promise<void>(async (resolve) => {
		// Render a pixel of the art every 10ms
		for await (const _ of setInterval(10)) {
			// Check if the game is paused
			if (paused) continue;
			// Add the pixel to the table
			pingPongTable[i + xOffset][j + yOffset] = art[i]?.[j] ?? 0;
			// Find the next pixel
			do
				if (j === artColumns - 1) {
					j = 0;
					i++;
				} else j++;
			while (!art[i]?.[j] && i < art.length);
			// Check if the art is finished
			const isLast = i === art.length && j === 1;

			// Render the art and then resolve the promise if it's finished
			void render().then(() => {
				if (isLast) resolve();
			});
			if (isLast) break;
		}
	});
};

export const trophy: PixelArt = [
	[, , , ...new Array(11).fill(Colors.BgBlack)],
	[
		,
		,
		,
		Colors.BgBlack,
		...new Array(8).fill(Colors.BgYellow),
		Colors.BgRed,
		Colors.BgBlack,
	],
	[
		...new Array(4).fill(Colors.BgBlack),
		Colors.BgYellow,
		Colors.BgWhite,
		...new Array(6).fill(Colors.BgYellow),
		Colors.BgRed,
		...new Array(4).fill(Colors.BgBlack),
	],
	[
		Colors.BgBlack,
		,
		,
		Colors.BgBlack,
		Colors.BgYellow,
		Colors.BgWhite,
		...new Array(6).fill(Colors.BgYellow),
		Colors.BgRed,
		Colors.BgBlack,
		,
		,
		Colors.BgBlack,
	],
	[
		Colors.BgBlack,
		,
		,
		Colors.BgBlack,
		Colors.BgYellow,
		Colors.BgWhite,
		...new Array(6).fill(Colors.BgYellow),
		Colors.BgRed,
		Colors.BgBlack,
		,
		,
		Colors.BgBlack,
	],
	[
		Colors.BgBlack,
		Colors.BgBlack,
		,
		Colors.BgBlack,
		Colors.BgYellow,
		Colors.BgWhite,
		...new Array(6).fill(Colors.BgYellow),
		Colors.BgRed,
		Colors.BgBlack,
		,
		Colors.BgBlack,
		Colors.BgBlack,
	],
	[
		,
		Colors.BgBlack,
		Colors.BgBlack,
		Colors.BgBlack,
		Colors.BgYellow,
		Colors.BgWhite,
		...new Array(6).fill(Colors.BgYellow),
		Colors.BgRed,
		Colors.BgBlack,
		Colors.BgBlack,
		Colors.BgBlack,
	],
	[
		,
		,
		,
		Colors.BgBlack,
		Colors.BgBlack,
		...new Array(6).fill(Colors.BgYellow),
		Colors.BgRed,
		Colors.BgBlack,
		Colors.BgBlack,
	],
	[
		,
		,
		,
		,
		Colors.BgBlack,
		Colors.BgBlack,
		...new Array(4).fill(Colors.BgYellow),
		Colors.BgRed,
		Colors.BgBlack,
		Colors.BgBlack,
	],
	[
		,
		,
		,
		,
		,
		Colors.BgBlack,
		Colors.BgBlack,
		Colors.BgYellow,
		Colors.BgYellow,
		Colors.BgRed,
		Colors.BgBlack,
		Colors.BgBlack,
	],
	[, , , , , , , Colors.BgBlack, Colors.BgYellow, Colors.BgBlack],
	[, , , , , , , Colors.BgBlack, Colors.BgYellow, Colors.BgBlack],
	[, , , , , , , Colors.BgBlack, Colors.BgYellow, Colors.BgBlack],
	[
		,
		,
		,
		,
		,
		,
		Colors.BgBlack,
		Colors.BgBlack,
		Colors.BgYellow,
		Colors.BgBlack,
		Colors.BgBlack,
	],
	[
		,
		,
		,
		,
		,
		Colors.BgBlack,
		...new Array(4).fill(Colors.BgYellow),
		Colors.BgRed,
		Colors.BgBlack,
	],
	[, , , , , ...new Array(7).fill(Colors.BgBlack)],
];
export const trophyColumns = 17;
