document.body.style.margin = 0;
document.body.style.padding = 0;

const canvas = document.createElement('canvas');
canvas.id = 'mainCanvas';
document.body.appendChild(canvas);

const resizeCanvas = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const context = canvas.getContext('2d');

class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Body {
	constructor(px,py, vx, vy, radius, density) {
		this.position = new Vector2(px, py);
		this.force = new Vector2(0, 0);
		this.velocity = new Vector2(vx,vy);
		this.radius = radius;
		this.mass = Math.PI * radius * radius * density;
	}
}

let bodies = [];
let lastFrame = null;

const PHCS_G = 0.00001;

const init = () => {
	const r = (c) => Math.random() * 2*c - c;
	bodies.push(new Body(500, 500, 0, 0, 10, 100));
	for(let i = 0;i < 10;i ++) bodies.push(new Body(r(300) + 400, r(300) + 400, r(1), r(1), 10, 1));
	lastFrame = new Date();
}

const render = () => {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = 'black';
	context.strokeStyle = 'red';
	context.lineWidth = 3;
	for(body of bodies) {
		context.beginPath();
		context.arc(body.position.x, body.position.y, body.radius, 0, 2*Math.PI);
		context.fill();

		context.strokeStyle = 'red';
		context.beginPath();
		context.moveTo(body.position.x, body.position.y);
		context.lineTo(body.position.x + body.force.x, body.position.y + body.force.y);
		context.stroke();

		context.strokeStyle = 'blue';
		context.beginPath();
		context.moveTo(body.position.x, body.position.y);
		context.lineTo(body.position.x + body.velocity.x, body.position.y + body.velocity.y);
		context.stroke();
		//context.closePath();
	}
	requestAnimationFrame(render);
}

const simulateStep = () => {
	//return;
	const dTime = 0.05; // moves dTime seconds

	// recalculate forces
	for(body of bodies) {
		body.force.x = 0;
		body.force.y = 0;
		for(other of bodies) {
			if(other === body) continue;
			const _a = body.position.x - other.position.x;
			const _b = body.position.y - other.position.y;
			const d2 = _a*_a + _b*_b;
			const scale = PHCS_G * (other.mass * body.mass) / d2;
			body.force.x += scale * (other.position.x - body.position.x);
			body.force.y += scale * (other.position.y - body.position.y);
		}
	}

	for(body of bodies) {
		body.velocity.x += body.force.x / body.mass * dTime;
		body.velocity.y += body.force.y / body.mass * dTime;
		body.position.x += body.velocity.x * dTime;
		body.position.y += body.velocity.y * dTime;
	}

	setInterval(simulateStep, 100);
}

requestAnimationFrame(render);

init();
simulateStep();
