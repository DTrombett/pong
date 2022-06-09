import { exit } from "node:process";
import { renderPixelArt, trophy, trophyColumns } from "./pixelArts";
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
	render: () => Promise<void>,
	ball: Coordinates,
	direction: Coordinates,
	scores: Coordinates,
	columns: number,
	middle: number,
	racketHeight: number
) => {
	const rows = pingPongTable.length;
	const lastColumn = columns - 2;
	const lastRow = rows - 2;
	// Calculate the points for the win based on the table size
	let winPoints = Math.floor((columns - 5) / 4);

	// The maximum points to win should be 21
	if (winPoints > 21) winPoints = 21;
	return () => {
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
				// Remove the rackets and the ball from the screen
				rackets[0] = rackets[1] = [NaN, NaN];
				ball[0] = ball[1] = NaN;
				void renderPixelArt(
					pingPongTable,
					render,
					trophy,
					trophyColumns,
					Math.round(rows / 2) - Math.round(trophy.length / 2),
					Math.round(middle / 2) -
						Math.round(trophy.length / 2) +
						playerNumber * middle
				).then(() => exit());
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
			ball[0] = middle;
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
