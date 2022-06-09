import { platform } from "node:os";
import process, { stdin, stdout } from "node:process";
import buildTable from "./buildTable";
import handleKey from "./handleKey";
import moveBall from "./moveBall";
import toRender from "./render";
import type { Coordinates, PingPongTable, Rackets } from "./types";

// Check if the terminal supports colors
if (stdout.getColorDepth() < 4)
	throw new Error("Your terminal does not support required colors :(");
// Inherit number of columns from the terminal
let columns = Math.floor(
	// The number of columns should be odd
	(stdout.columns % 2 === 1 ? stdout.columns : stdout.columns - 1) / 2
);
// The number of rows should be the half of the number of columns
let rows = Math.ceil(columns / 2);
// Be sure that the number of rows isn't more than the rows of the terminal
while (rows >= stdout.rows) {
	columns -= 2;
	rows = Math.ceil(columns / 2);
}
// Check if the table is too small
if (rows < 23 || columns < 41)
	throw new Error("Your terminal is too small to play this game :(");
// Calculate the middle of the table
const middle = Math.floor(columns / 2);
// Calculate the height of the racket based on a ratio of a real racket to the terminal
const racketHeight = Math.round((columns * 15) / 274);
// Calculate the speed based on the table size
const speed = Math.round(
	// On Android the speed should be the half
	(platform() === "android" ? 6_000 : 3_000) / columns
);
const scores: Coordinates = [0, 0];
// The ball should be in the middle of the table and in the second row
const ball: Coordinates = [middle, 1];
// The ball should be moving one pixel to the right and one pixel down
const direction: Coordinates = [1, 1];
// Create the table with the given number of rows
const pingPongTable: PingPongTable = new Array(rows);
// both rackets should be in the middle of the table
const rackets: Rackets = [
	// The first racket should be at 1/4 from the left to the middle
	[Math.round(middle / 4), Math.round(rows / 2)],
	// The second racket should be at 3/4 from the middle
	[columns - Math.ceil(middle / 4), Math.round(rows / 2)],
];
// Create the rendering function
const render = toRender(pingPongTable, rackets, ball, columns, racketHeight);
let oldPaused = false;

// Create a global paused variable to be able to pause the game
(global as typeof globalThis & { paused: boolean }).paused = oldPaused;
declare let paused: boolean;
// Build the table
buildTable(pingPongTable, columns);
// Hide the cursor, move it to the start of the terminal and clear the screen
stdout.write("\x1b[?25l\x1b[1;1H\x1b[0J");
// When the terminal is resized, check if the table can still fit
stdout.on("resize", () => {
	// Change the paused variable only if the game is not already paused or it was paused before
	if (!paused || oldPaused)
		paused = oldPaused = stdout.rows < rows || stdout.columns * 2 < columns;
});
// Set the stdin raw mode to true to get the key presses
stdin.setRawMode(true);
// When a key is pressed, handle it
stdin.on(
	"data",
	handleKey(pingPongTable, rackets, render, columns, racketHeight)
);
// Wait a second before starting moving the ball
setTimeout(
	() =>
		// Set an interval every `speed` milliseconds to move the ball
		setInterval(
			moveBall(
				pingPongTable,
				rackets,
				render,
				ball,
				direction,
				scores,
				columns,
				middle,
				racketHeight
			),
			speed
		),
	1000
);
process.on("exit", () => {
	// When the process is exiting, show the cursor
	stdout.write("\x1b[?25h");
});

// Render the table
await render();
