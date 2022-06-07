import { stdout } from "node:process";
import { cursorTo } from "node:readline";
import type Queue from "./Queue";
import type { Coordinates, PingPongTable, Rackets } from "./types";
import { Colors } from "./types";

const render = (
	pingPongTable: PingPongTable,
	rackets: Rackets,
	ball: Coordinates,
	queue: Queue,
	columns: number,
	racketHeight: number
) => {
	const last = columns - 1;
	const middle = Math.round((last + 1) / 2);

	return async (): Promise<void> => {
		await queue.wait();
		cursorTo(stdout, 0, 0, () => {
			stdout.write(
				pingPongTable
					.map((row, line) =>
						row
							.map((color, i) => {
								let code = color;

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
					.join("\n"),
				queue.next.bind(queue)
			);
		});
	};
};

export default render;
