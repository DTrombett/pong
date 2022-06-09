import type { Buffer } from "node:buffer";
import { platform } from "node:os";
import { exit, stdout } from "node:process";
import type { PingPongTable, Rackets } from "./types";

declare let paused: boolean;
const isAndroid = platform() === "android";
// Keys for android are different because of the different keyboard layouts
export const keys = [
	isAndroid ? "\u001b" /* ESC */ : "w",
	isAndroid ? "\t" /* TAB */ : "s",
	"\x1b[A", // UP
	"\x1b[B", // DOWN
];

const actions: Record<
	string,
	| ((
			rackets: Rackets,
			others: { racketHeight: number; lastRow: number }
	  ) => boolean)
	| undefined
> = {
	[keys[0] /* UP */]: (rackets, { racketHeight }) => {
		// Check if the racket is going to be moved out of the table
		if (rackets[0][1] > racketHeight) {
			rackets[0][1]--;
			return true;
		}
		return false;
	},
	[keys[1] /* DOWN */]: (rackets, { lastRow }) => {
		// Check if the racket is going to be moved out of the table
		if (rackets[0][1] < lastRow) {
			rackets[0][1]++;
			return true;
		}
		return false;
	},
	[keys[2] /* UP */]: (rackets, { racketHeight }) => {
		// Check if the racket is going to be moved out of the table
		if (rackets[1][1] > racketHeight) {
			rackets[1][1]--;
			return true;
		}
		return false;
	},
	[keys[3] /* DOWN */]: (rackets, { lastRow }) => {
		// Check if the racket is going to be moved out of the table
		if (rackets[1][1] < lastRow) {
			rackets[1][1]++;
			return true;
		}
		return false;
	},
};

/**
 * Create a function to handle the keypresses.
 * @param pingPongTable - The table to use
 * @param rackets - The rackets to use
 * @param render - The function to render the table
 * @param columns - The number of columns in the table
 * @param racketHeight - The height of the rackets
 * @returns The function to handle input
 */
const handleKey = (
	pingPongTable: PingPongTable,
	rackets: Rackets,
	render: () => Promise<void>,
	columns: number,
	racketHeight: number
) => {
	const lastRow = pingPongTable.length - racketHeight - 1;

	return (key: Buffer | string) => {
		// The key is usually a Buffer so we need to convert it to a string
		key = key.toString();
		if (
			key === "/" &&
			// Toggle the pause state only if terminal is big enough
			stdout.rows >= pingPongTable.length &&
			stdout.columns * 2 >= columns
		) {
			paused = !paused;
			return;
		}
		// Exit the program if the user presses Ctrl+C
		if (key === "\u0003" /* Ctrl+C */) exit(0);

		// If the game is paused or the key is not a valid action, return
		if (paused || !keys.includes(key)) return;
		// Get the correct action and render only if it returns true
		if (actions[key]?.(rackets, { racketHeight, lastRow }) === true)
			void render();
	};
};

export default handleKey;
