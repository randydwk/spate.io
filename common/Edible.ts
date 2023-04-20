import Board from "./Board";
import Bouboule from "./Bouboule";

export default class Edible {
	static radius : number = 10;

	x : number;
	y : number;
	color : string;
	borderColor : string;

	constructor (board : Board){
		// Random Position
		this.x = Math.random() * (board.width - 100) + 50;
		this.y = Math.random() * (board.height - 100) + 50;

		// Color
		const r : number = Math.floor(Math.random() * 205);
		const g : number = Math.floor(Math.random() * 205);
		const b : number = Math.floor(Math.random() * 205);
		this.color = Edible.rgb(r + 50, g + 50, b + 50);
		this.borderColor = Edible.rgb(r, g, b);
	}

	static rgb(red: number, green : number, blue : number) {
		var decColor = 0x1000000 + blue + 0x100 * green + 0x10000 * red;
		return '#' + decColor.toString(16).substr(1);
	}

	static draw(context : CanvasRenderingContext2D, edible : Edible) {
		context.beginPath();
		context.arc(edible.x, edible.y, Edible.radius, 0, 2 * Math.PI);
		context.fillStyle = edible.color;
		context.fill();
	}

	overlap(otherBall : Edible, radius : number) {
		const distance = Math.sqrt(
			Math.pow(this.x - otherBall.x, 2) + Math.pow(this.y - otherBall.y, 2)
		);
		return distance < radius;
	}

	moveTo(bouboule : Bouboule){
		this.x += (bouboule.x-this.x)/200;
		this.y += (bouboule.y-this.y)/200;
	}
}
