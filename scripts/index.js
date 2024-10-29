let giventags;
let tag1, tag2;
let round = 0;
let score = 0;
let basetag;

function formatTag(tag) {
	let val = tag.replace(/_/g, " ");

	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

async function loadTags() {
	round++;

	let buttontag1 = document.getElementById("tag1");
	let buttontag2 = document.getElementById("tag2");

	tag1 = randomProperty(giventags);
	delete giventags[tag1.tag];
	tag2 = randomProperty(giventags);
	delete giventags[tag2.tag];

	buttontag1.innerHTML = formatTag(tag1.tag);
	buttontag2.innerHTML = formatTag(tag2.tag);

	document.getElementById("roundNum").innerHTML = `Round ${round}`;

	let imgtag1 = document.getElementById("imgtag1");
	let imgtag2 = document.getElementById("imgtag2");

	let imgs1 = await postBy(`${basetag}+${tag1.tag}`);
	let imgs2 = await postBy(`${basetag}+${tag2.tag}`);

	let img1 = imgs1[Math.floor(Math.random() * imgs1.length)];
	let img2 = imgs2[Math.floor(Math.random() * imgs2.length)];

	imgtag1.src = img1.preview_url;
	imgtag2.src = img2.preview_url;

	imgtag1.style.height = `calc(${img1.heigth}px / 40%)`;
	imgtag2.style.height = `calc(${img2.heigth}px / 40%)`;
}

function randomProperty(obj) {
	var keys = Object.keys(obj);
	return {
		tag: keys[(keys.length * Math.random()) << 0],
		val: obj[keys[(keys.length * Math.random()) << 0]],
	};
}

async function postBy(tag) {
	const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${tag}&json=1&limit=1000`;
	const data = await fetch(url);
	const posts = await data.json();

	return posts;
}

async function start() {
	const tag = document.getElementById("tag").value;

	basetag = tag;

	const posts = await postBy(tag);

	let child = {};

	for (let i = 0; i < posts.length; i++) {
		let p = posts[i];

		const tags = p.tags.split(" ");

		for (let k = 0; k < tags.length; k++) {
			let t = tags[k];
			if (t in child) {
				child[t]++;
			} else {
				child[t] = 1;
			}
		}
	}

	let actual = {};
	for (let i in child) {
		if (child[i] >= 5) {
			actual[i] = child[i];
		}
	}

	giventags = actual;

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

	let htag1 = document.getElementById("tag1");
	let htag2 = document.getElementById("tag2");

	htag1.innerHTML = `${htag1.innerHTML} | ${tag1.val} posts`;
	htag2.innerHTML = `${htag2.innerHTML} | ${tag2.val} posts`;

	revealed = true;

	let buttontag1 = document.getElementById("imgtag1");
	let buttontag2 = document.getElementById("imgtag2");

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
	if (!revealed) return;

	let imgtag1 = document.getElementById("imgtag1");
	let imgtag2 = document.getElementById("imgtag2");

	imgtag1.src = "#";
	imgtag2.src = "#";

	document.getElementById("posts").classList.toggle("hidden");
	loadTags();

	let buttontag1 = document.getElementById("imgtag1");
	let buttontag2 = document.getElementById("imgtag2");

	buttontag1.classList.remove("correct", "equal", "wrong");
	buttontag2.classList.remove("correct", "equal", "wrong");

	revealed = false;
}
