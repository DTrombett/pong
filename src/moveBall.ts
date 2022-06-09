import { exit } from "node:process";
import { setInterval } from "node:timers/promises";
import { trophy, trophyColumns } from "./pixelArts";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";
import { Colors } from "./types";

declare const paused: boolean;
let scored = false;
let lastDirection = true;

/**
 * Create a function to move the ball.
 * @param pingPongTable - The table to use
 * @param rackets - The rackets to use
 * @param ball - The ball to use
 * @param direction - The direction array to use
 * @param scores - The scores array to use
 * @param columns - The number of columns in the table
 * @param middle - The middle of the table
 * @param racketHeight - The height of the rackets
 * @returns The function to move the ball
 */
const moveBall = (
	pingPongTable: PingPongTable,
	rackets: Rackets,
	ball: Coordinates,
	direction: Coordinates,
	scores: Coordinates,
	columns: number,
	middle: number,
	racketHeight: number
) => {
	const render = toRender(pingPongTable, rackets, ball, columns, racketHeight);
	const rows = pingPongTable.length;
	const lastColumn = columns - 2;
	const lastRow = rows - 2;
	// Calculate the points for the win based on the table size
	let winPoints = Math.floor((columns - 5) / 4);

	// The maximum points to win should be 21
	if (winPoints > 21) winPoints = 21;
	return async () => {
		// Don't move the ball if the game is paused or a player has just scored
		if (scored || paused) return;
		// Move the ball
		ball[0] += direction[0];
		ball[1] += direction[1];
		// Check if someone has scored
		if (ball[0] === 1 || ball[0] === lastColumn) {
			const playerNumber = Number(ball[0] === 1);

			// Add a black pixel to the table to show the score
			pingPongTable[2][playerNumber * middle + ++scores[playerNumber] * 2] =
				Colors.BgBlack;
			scored = true;
			// Check if the player has won
			if (scores[playerNumber] === winPoints) {
				let i = 0,
					j = 0;
				// Calculate the position of the trophy
				const distance = Math.round(rows / 2) - Math.round(trophy.length / 2);
				const halfMiddle =
					Math.round(middle / 2) - Math.round(trophy.length / 2);

				// Remove the rackets and the ball from the screen
				rackets[0] = rackets[1] = [NaN, NaN];
				ball[0] = ball[1] = NaN;
				// Render a pixel of the trophy every 10ms
				for await (const _ of setInterval(10)) {
					// Check if the game is paused
					if (paused as boolean) continue;
					// Add the pixel to the table
					pingPongTable[i + distance][j + halfMiddle + playerNumber * middle] =
						trophy[i]?.[j] ?? 0;
					// Find the next pixel
					do
						if (j === trophyColumns - 1) {
							j = 0;
							i++;
						} else j++;
					while (!trophy[i]?.[j] && i < trophy.length);
					// Check if the trophy is finished
					const isLast = i === trophy.length && j === 1;

					// Render the table and then exit if the trophy is finished
					void render().then(() => {
						if (isLast) exit();
					});
					if (isLast) break;
				}
				return;
			}
			// Continue the game after 1 second
			setTimeout(() => {
				scored = false;
			}, 1000);
			// Change the direction of the ball
			lastDirection = !lastDirection;
			direction[0] = lastDirection ? 1 : -1;
			direction[1] = 1;
			// Move the ball back to the middle
			ball[0] = Math.round(columns / 2);
			ball[1] = 1;
			// Render the table
			void render();
			return;
		}
		// Check if the ball has hit the top or bottom of the table
		if (ball[1] === 1 || ball[1] === lastRow) direction[1] *= -1;
		// Check if the ball has hit a racket
		if (
			rackets.some(
				([x, y], i) =>
					ball[0] === x + (i ? -1 : 1) &&
					ball[1] > y - racketHeight &&
					ball[1] < y + racketHeight
			)
		)
			direction[0] *= -1;
		// Render the table
		void render();
	};
};

export default moveBall;
