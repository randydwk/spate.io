import Board from './Board';
import Bouboule from './Bouboule';

export default class Bot extends Bouboule {
	speed : number = 5;
	rad : number = 0;
	
	constructor(board : Board) {
		const id = 'Bot' + Math.round(Math.random() * 9999);
		super(id,id,board);
		this.weight = Math.round(Math.random() * 50);
	}

	move(board : Board) {
		if (Math.random() > 0.98) {
			this.rad = Math.random() * Math.PI * 2 - Math.PI;
		}
		this.speed = Math.max(5 * (1 - this.weight / 800), 1);
		this.xSpeed = Math.cos(this.rad) * this.speed;
		this.ySpeed = Math.sin(this.rad) * this.speed;

		super.move(board);
	}
}
