let giventags;
let tag1, tag2;
let round = 0;
let score = 0;

function formatTag(tag) {
	let val = tag.replace(/_/g, " ");

	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function loadTags() {
	round++;

	let buttontag1 = document.getElementById("tag1");
	let buttontag2 = document.getElementById("tag2");

	tag1 = randomProperty(giventags);
	delete giventags[tag1.tag];
	tag2 = randomProperty(giventags);
	delete giventags[tag2.tag];

	buttontag1.innerHTML = formatTag(tag1.tag);
	buttontag2.innerHTML = formatTag(tag2.tag);

	let posttag1 = document.getElementById("post1");
	let posttag2 = document.getElementById("post2");

	posttag1.innerHTML = `${tag1.val} posts`;
	posttag2.innerHTML = `${tag2.val} posts`;

	document.getElementById("roundNum").innerHTML = `Round ${round}`;
}

function randomProperty(obj) {
	var keys = Object.keys(obj);
	return {
		tag: keys[(keys.length * Math.random()) << 0],
		val: obj[keys[(keys.length * Math.random()) << 0]],
	};
}

async function start() {
	const tag = document.getElementById("tag").value;

	const data = await fetch(`/bytag/${tag}`);
	const posts = await data.json();

	giventags = posts;

	let children = document.body.children;
	for (let i = 1; i < children.length; i++) {
		let x = children[i];
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}

	loadTags();
}

let revealed = false;

function tryTag(num) {
	if (revealed) return;

	document.getElementById("posts").classList.toggle("hidden");

	revealed = true;
	console.log(num);

	let buttontag1 = document.getElementById("tag1");
	let buttontag2 = document.getElementById("tag2");

	if (tag1.val > tag2.val) {
		buttontag1.classList.add("correct");
		buttontag2.classList.add("wrong");
	} else if (tag1.val < tag2.val) {
		buttontag1.classList.add("wrong");
		buttontag2.classList.add("correct");
	} else {
		buttontag1.classList.add("equal");
		buttontag2.classList.add("equal");
	}

	if (num == 1) {
		if (tag1.val > tag2.val) {
			score += 5;
		}
	} else if (tag1.val < tag2.val) {
		score += 5;
	}

	document.getElementById("scoreNum").innerHTML = `Score ${score}`;
}

function next() {
	document.getElementById("posts").classList.toggle("hidden");
	loadTags();

	let buttontag1 = document.getElementById("tag1");
	let buttontag2 = document.getElementById("tag2");

	buttontag1.classList.remove("correct", "equal", "wrong");
	buttontag2.classList.remove("correct", "equal", "wrong");

	revealed = false;
}
