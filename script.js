// SECTION: Canvas Snow
// Canvas Snow by Paul Lewis:
// https://www.youtube.com/watch?v=VW8qoyYzWGg&t
class Snowflake {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.vx = 0;
		this.vy = 0;
		this.radius = 0;
		this.alpha = 0;

		this.reset();
	}

	reset() {
		this.x = this.randBetween(0, window.innerWidth);
		this.y = this.randBetween(0, -window.innerHeight);
		this.vx = this.randBetween(-3, 3);
		this.vy = this.randBetween(2, 5);
		this.radius = this.randBetween(1, 4);
		this.alpha = this.randBetween(0.1, 0.9);
	}

	randBetween(min, max) {
		return min + Math.random() * (max - min);
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;

		if (this.y + this.radius > window.innerHeight) {
			this.reset();
		}
	}
}

class Snow {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");

		document.body.appendChild(this.canvas);

		window.addEventListener("resize", () => this.onResize());
		this.onResize();
		this.updateBound = this.update.bind(this);
		requestAnimationFrame(this.updateBound);

		this.createSnowflakes();
	}

	onResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}

	createSnowflakes() {
		const flakes = window.innerWidth / 4;

		this.snowflakes = [];

		for (let s = 0; s < flakes; s++) {
			this.snowflakes.push(new Snowflake());
		}
	}

	update() {
		this.ctx.clearRect(0, 0, this.width, this.height);

		for (let flake of this.snowflakes) {
			flake.update();

			this.ctx.save();
			this.ctx.fillStyle = "#FFF";
			this.ctx.beginPath();
			this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
			this.ctx.closePath();
			this.ctx.globalAlpha = flake.alpha;
			this.ctx.fill();
			this.ctx.restore();
		}
		requestAnimationFrame(this.updateBound);
	}
}

new Snow();

// SECTION: Countdown

let audio_allowed = false;

const d = document.getElementById("d");
const h = document.getElementById("h");
const m = document.getElementById("m");
const s = document.getElementById("s");
const time = document.getElementById("time");

function getTrueNumber(num) {
	return num < 10 ? "0" + num : num;
}

var year = new Date().getFullYear();

var comingDate = new Date(`Dec 24, ${year} 24:00:00`);
function calculateRemainingTime() {

	const now = new Date();
	const remainingTime = comingDate.getTime() - now.getTime();
	const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	const mins = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
	const secs = Math.floor((remainingTime % (1000 * 60)) / 1000);

	d.innerHTML = getTrueNumber(days);
	h.innerHTML = getTrueNumber(hours);
	m.innerHTML = getTrueNumber(mins);
	s.innerHTML = getTrueNumber(secs);

	return remainingTime;
}

function initCountdown() {
	const interval = setInterval(() => {
		const remainingTimeInMs = calculateRemainingTime();

		if (remainingTimeInMs <= 0) {
			clearInterval(interval);
			time.innerHTML = "Lets Go!";
			if (audio_allowed) {
				playSound();
			}
		}
	}, 1000);
}

initCountdown();

// SECTION: Github

// get the object.url from this url: https://api.github.com/repos/AnnikenYT/christmasish-countdown-timer/git/refs/heads/main
fetch(
	"https://api.github.com/repos/AnnikenYT/christmasish-countdown-timer/git/refs/heads/main"
).then((response) => {
	response.json().then((data) => {
		const url = data.object.url;
		return fetch(url).then((response) => {
			response.json().then((data) => {
				console.log(data.message);
				document.getElementById("tooltip").innerHTML = `last commit: ${data.message}`;
				// on click, open the data.html_url in a new tab
				document.getElementById("github").addEventListener("click", () => {
					window.open(data.html_url, "_blank");
				});
			});
		});
	});
});

// on load, set the checkbox to audio_allowed
document.getElementById("audio_checkbox").checked = audio_allowed;

function handleChangeAudio() {
	// set the audio_allowed to the state of the checkbox
	audio_allowed = document.getElementById("audio_checkbox").checked;
	console.log("Audio is now " + audio_allowed);
}

function playSound() {
	var audio = new Audio('notify.mp3');
	audio.play();
}
