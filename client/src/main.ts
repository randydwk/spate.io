import Bot from '../../common/Bot';
import Bouboule from '../../common/Bouboule';
import Edible from '../../common/Edible';
import Board from '../../common/Board';
import { io } from 'socket.io-client';

// Paramètres
const GRID_SIZE = 100;

// Canvas et context
const canvas = document.querySelector('.canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

// Menu jouer / rejouer
const prompt : HTMLDivElement = document.querySelector(".prompt")!;
const creditsBtn : HTMLButtonElement = prompt.querySelector(".creditsBtn")!;
prompt.addEventListener("submit",event => {
	event.preventDefault();
	let name : string = (<HTMLInputElement>document.getElementById("name")).value;
	socket.emit('join', name);
	prompt.setAttribute("style", "display: none;");
});

creditsBtn.addEventListener("click", event => {
	event.preventDefault();
	console.log("coucou");
	credits.style.removeProperty("display");
	prompt.setAttribute("style", "display: none;");
});

const credits : HTMLDivElement = document.querySelector(".credits")!;
const backBtn : HTMLButtonElement = credits.querySelector(".backBtn")!;
backBtn.addEventListener("click", event => {
	event.preventDefault();
	prompt.style.removeProperty("display");
	credits.setAttribute("style", "display: none;");
});

// Connexion Joueur
let playerID : string;
let maBoule : Bouboule;
let living : boolean = false;
const socket = io();

socket.on('attribution', (x : number, y : number) => {
	playerID = socket.id;
	living = true;
	score.style.removeProperty("display");
});

// Plateau de Jeu
let board : Board;
socket.on('board', (_board : Board) => {
	board = _board;
})

let bouboules : Bouboule[] = [];
let edibles : Edible[] = [];

// Calcul Déplacement
canvas.addEventListener('mousemove', e => {
	let xSpeed = 0;
	let ySpeed = 0;
	let speed = Math.min(
		distanceTo(e.clientX, e.clientY, canvas.width / 2, canvas.height / 2) / 30,
		5
	);
	if (maBoule != undefined) speed = Math.max(speed * (1 - maBoule.weight / 800), 1);

	const deltaX = canvas.width / 2 - e.clientX;
	const deltaY = canvas.height / 2 - e.clientY;
	const rad = Math.atan2(deltaY, deltaX);
	xSpeed = -Math.cos(rad) * speed;
	ySpeed = -Math.sin(rad) * speed;

	socket.emit('playerMove', xSpeed, ySpeed);
});

function distanceTo(x1 : number, y1 : number, x2 : number, y2 : number) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// Récupération Données
socket.on('bouboules', (listeBouboules : Bouboule[], listeEdibles : Edible[]) => {
	// Joueurs
	bouboules = [];
	listeBouboules.forEach(boule => {
		bouboules.push(boule);
	});

	const boule : Bouboule | undefined = bouboules.find(boule => boule.id == socket.id);
	if (boule != undefined && maBoule != undefined){
		scaleFactor -= (boule.drawWeight-maBoule.drawWeight)/4000;
	}
	if (boule == undefined){
		if (living) {
			prompt.style.removeProperty("display");
			score.setAttribute("style", "display: none;");
			const title = prompt.querySelector('.title') as HTMLTitleElement;
			title.innerHTML = `Perdu :( - Score : ${maBoule.weight}`;
			living = false;
		}
	} else {
		maBoule = boule;
	}

	// Mettre les scores à jour sur l'interface
	scoresUpdate();

	// Points
	edibles = [];
	listeEdibles.forEach(edible => {
		edibles.push(edible);
	});
});

// Scores
const leaderboard = document.querySelector('.scores') as HTMLTableElement;
const score = document.querySelector('.scoreperso') as HTMLDivElement;

function scoresUpdate(){
	leaderboard.innerHTML = '';
	for (let i = bouboules.length-1; i >= Math.max(0,bouboules.length-10); i--){
		leaderboard.innerHTML += `<tr ${(maBoule != undefined && bouboules[i].id == maBoule.id) ? "class=\"me\"" : ""}>
		<td>${bouboules.length-i}.</td>
		<td>${bouboules[i].name}</td>
		<td>${bouboules[i].weight}</td>
		</tr>`;
	}

	if (maBoule != undefined) score.innerHTML = `<p>Score : ${maBoule.weight}</p>`;
}

// Rendu graphique
let scaleFactor = 1;
context.save();
function render() {
	// Arrière Plan
	if (board != undefined){
		context.clearRect(-canvas.clientWidth/2, -canvas.clientHeight/2, board.width + canvas.clientWidth, board.height + canvas.clientHeight);

		context.save();

		if (maBoule != undefined){
			context.scale(scaleFactor,scaleFactor);
			console.log(1-scaleFactor);
			context.translate(-maBoule.x + (canvas.width*((1-scaleFactor)*2+1)) / 2,-maBoule.y + (canvas.height*((1-scaleFactor)*2+0.5))-Bouboule.getRadius(maBoule)/2);
		}

		drawGrid();

		// Joueurs et Points
		edibles.forEach(edible => {
			Edible.draw(context,edible);
		});

		bouboules.forEach((boule) => {
			Bouboule.draw(context,boule);
		});

		context.restore();
	}
	requestAnimationFrame(render);
}

// Grid
function drawGrid() {
	context.beginPath();
	context.lineWidth = 1;
	context.strokeStyle = '#192835';
	for (let x = 0; x < board.width / GRID_SIZE+1; x++) {
		context.moveTo(GRID_SIZE * x, 0);
		context.lineTo(GRID_SIZE * x, board.height);
	}
	for (let y = 0; y < board.height / GRID_SIZE+1; y++) {
		context.moveTo(0, GRID_SIZE * y);
		context.lineTo(board.width, GRID_SIZE * y);
	}
	context.stroke();
}

render();
