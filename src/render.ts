import { stdout } from "node:process";
import { cursorTo } from "node:readline";
import type Queue from "./Queue";
import type { Coordinates, PingPongTable, Rackets } from "./types";
import { Colors } from "./types";

const render =
	(
		ball: Coordinates,
		pingPongTable: PingPongTable,
		queue: Queue,
		racketHeight: number,
		rackets: Rackets
	) =>
	async (): Promise<void> => {
		await queue.wait();
		cursorTo(stdout, 0, 0, () => {
			stdout.write(
				pingPongTable
					.map((row, line) =>
						row
							.map(
								(code, i) =>
									`\x1b[${
										code ||
										(rackets.some(
											([x, y]) =>
												i === x &&
												line > y - racketHeight &&
												line < y + racketHeight
										)
											? Colors.BgRed
											: line === ball[1] && i === ball[0]
											? Colors.BgYellow
											: Colors.BgGreen)
									}m  \x1b[m`
							)
							.join("")
					)
					.join("\n"),
				queue.next.bind(queue)
			);
		});
	};

export default render;
