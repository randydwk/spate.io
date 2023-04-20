import express, { json } from 'express';
import http from 'http';
import addWebpackMiddleware from './addWebpackMiddleware';
import { Server as IOServer } from 'socket.io';
import Bouboule from '../../common/Bouboule';
import Edible from '../../common/Edible';
import Board from '../../common/Board';
import Bot from '../../common/Bot';

// Paramètres
const BOARD_WIDTH = 5000;
const BOARD_HEIGHT = 5000;
const MAX_EDIBLE = BOARD_WIDTH/10;
const BOT_NUMBER = 10;

// Plateau de Jeu
let board : Board = new Board(BOARD_WIDTH,BOARD_HEIGHT);

let bouboules : Bouboule[] = [];
let edibles : Edible[] = [];

for (let i = 0; i < MAX_EDIBLE/2; i++){
	edibles.push(new Edible(board));
}

for (let i = 0; i < BOT_NUMBER; i++){
	bouboules.push(new Bot(board));
}

// Serveur
const app = express();
const httpServer = http.createServer(app);
const fileOptions = { root: process.cwd() };

const io = new IOServer(httpServer);
io.on('connection', socket => {
	console.log(`Nouvelle connexion du joueur ${socket.id}`);
	socket.emit('board', board);
	
	socket.on('join', (name : string) => {
		const joueur : Bouboule = new Bouboule(socket.id,name,board);
		socket.emit('attribution', joueur.x, joueur.y);
		bouboules.push(joueur);
	})

	socket.on('playerMove', (xSpeed : number, ySpeed : number) => {
		bouboules.forEach(boule => {
			if (boule.id == socket.id){
				boule.xSpeed = xSpeed;
				boule.ySpeed = ySpeed;
			}
		});
	})

	socket.emit('');

	socket.on('disconnect', () => {
		console.log(`Déconnexion du joueur ${socket.id}`);

		// Supprimer joueur de la liste des boules
		for (let i = bouboules.length - 1; i >= 0; i--) {
			if (
				bouboules[i].id == socket.id
			) {
				bouboules.splice(i, 1);
			}
		}
	});
});

// Boucle Principale
let count = 10;
setInterval(() => {
	// Spawn Edibles
	if (count < 0 && edibles.length < MAX_EDIBLE){
		edibles.push(new Edible(board));
		count = 8;
	}
	count --;

	// Bouger Boules
	bouboules.forEach((boule : Bouboule) => {
		boule.weightTransition();
		boule.move(board);
	});

	// Tri
	bouboules.sort((b1 : Bouboule, b2 : Bouboule) => (b1.weight >= b2.weight ? 1 : -1));

	// Calcul Manger
	calculManger();

	// Envoie données
	io.emit('bouboules', bouboules, edibles);
}, 1000 / 60);

// Calcul Manger
function calculManger() {
	bouboules.forEach((boule : Bouboule) => {
		// Manger Edibles
		for (let i = edibles.length - 1; i >= 0; i--) {
			const radius = Bouboule.getRadius(boule);
			if (boule.overlap(edibles[i],radius+25)) {
				edibles[i].moveTo(boule);
			}
			if (boule.overlap(edibles[i],radius)) {
				edibles.splice(i, 1);
				boule.weight += 1;
			}
		}
		// Manger Boules
		for (let i = bouboules.length - 1; i >= 0; i--) {
			if (
				boule.id != bouboules[i].id &&
				boule.overlap(bouboules[i],Bouboule.getRadius(boule)*0.9) &&
				(boule.weight + 30) / (bouboules[i].weight + 30) >= 1.1 &&
				bouboules[i].weight > 0
			) {
				boule.weight += Math.ceil(bouboules[i].weight / 2);
				if (bouboules[i] instanceof Bot){
					bouboules.push(new Bot(board));
				}
				bouboules.splice(i, 1);
			}
			// Détruire les bots trop grands
			if (bouboules[i] instanceof Bot && bouboules[i].weight >= 10000){
				bouboules.splice(i,1);
				bouboules.push(new Bot(board));
			}
		}
	});
}

// Serveur
addWebpackMiddleware(app);

app.use(express.static('client/public'));

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
