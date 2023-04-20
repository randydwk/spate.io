import Board from './Board';
import Edible from './Edible';

export default class Bouboule extends Edible {
	id : string;
	name : string;
	weight : number;
	drawWeight : number;
	xSpeed : number = 0;
	ySpeed : number = 0;

	constructor(id : string, name : string, board : Board) {
		super(board);

		this.id = id;
		this.name = name ? name : 'Bouboule' + (id.charCodeAt(0) + id.charCodeAt(1) + id.charCodeAt(2));
		this.weight = 0;
		this.drawWeight = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
	}

	static getRadius(boule : Bouboule) : number{
		return boule.drawWeight / 5 + 30;
	}

	static draw(context : CanvasRenderingContext2D, boule : Bouboule) : void {
		const radius = Bouboule.getRadius(boule);

		// Boule
		context.beginPath();
		context.arc(boule.x, boule.y, radius, 0, 2 * Math.PI);
		context.fillStyle = boule.color; //'#dea404';
		context.fill();
		context.strokeStyle = boule.borderColor;
		context.lineWidth = 7;
		context.stroke();

		// Texte
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.font = Math.round(radius / 3) + 'px Arial sans';
		context.strokeStyle = 'black';
		context.lineWidth = 3;
		context.strokeText(boule.name, boule.x, boule.y);
		context.fillStyle = 'white';
		context.fillText(boule.name, boule.x, boule.y);
	}

	weightTransition() {
		this.drawWeight += this.weight - this.drawWeight / 5;
	}

	move(board : Board) {
		if (this.x+this.xSpeed > 0 && this.x+this.xSpeed < board.width) this.x += this.xSpeed;
		if (this.y+this.ySpeed > 0 && this.y+this.ySpeed < board.height) this.y += this.ySpeed;
	}
}
