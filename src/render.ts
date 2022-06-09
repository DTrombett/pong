import { stdout } from "node:process";
import type { Coordinates, PingPongTable, Rackets } from "./types";
import { Colors } from "./types";

/**
 * Create a function to render the ping pong table.
 * @param pingPongTable - The table to use
 * @param rackets - The rackets to use
 * @param ball - The ball to use
 * @param columns - The number of columns in the table
 * @param racketHeight - The height of the rackets
 * @returns The function to render the table
 */
const render = (
	pingPongTable: PingPongTable,
	rackets: Rackets,
	ball: Coordinates,
	columns: number,
	racketHeight: number
) => {
	const last = columns - 1;
	const middle = Math.floor(columns / 2);

	return async (): Promise<void> => {
		// Move the cursor to the top left corner
		stdout.write(
			`\x1b[1;1H${pingPongTable
				.map((row, line) =>
					row
						.map((color, i) => {
							let code = color;

							// If there's no color check if there's a racket, ball or if it's a border, otherwise it's part of the table and should be green
							if (!code)
								if (
									rackets.some(
										([x, y]) =>
											i === x &&
											line > y - racketHeight &&
											line < y + racketHeight
									)
								)
									code = Colors.BgRed;
								else if (line === ball[1] && i === ball[0])
									code = Colors.BgYellow;
								else if (i === 0 || i === middle || i === last)
									code = Colors.BgWhite;
								else code = Colors.BgGreen;
							return `\x1b[${code}m  \x1b[m`;
						})
						.join("")
				)
				.join("\n")}\n`
		);
	};
};

export default render;
