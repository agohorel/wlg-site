// GLOBAL
let allLinks = document.getElementsByTagName("a");

// set all links to open in new tap with "noreferrer" attribute
window.onload = () => {
	for (let i = 0; i < allLinks.length; i++){
		if (allLinks[i].target === "_blank"){
			allLinks[i].setAttribute("rel", "noreferrer");
		}
	}	
}

// NAV 
let hamburger = document.querySelector(".navbar__hamburger-container");
let mobileNav = document.querySelector(".mobilenav__container");
let mobileNavItems = document.querySelectorAll(".mobilenav__item");
let isVisible = false;

hamburger.addEventListener("click", () => {
	if (!isVisible){
		mobileNav.style.display = "flex"; // make mobilenav visible
		// start animations
		mobileNav.classList.add("mobilenav__container--slideIn");
		hamburger.classList.add("navbar__hamburger-animation--forwards");
		// start async call to remove animation class after animation finishes
		removeClass(mobileNav, "mobilenav__container--slideIn");
		// toggle hamburger rotation state
		hamburger.classList.remove("navbar__hamburger-animation--backwards");
		isVisible = !isVisible;
	} else {
		mobileNav.classList.add("mobilenav__container--slideOut");
		hamburger.classList.add("navbar__hamburger-animation--backwards");
		removeClass(mobileNav, "mobilenav__container--slideOut");
		hamburger.classList.remove("navbar__hamburger-animation--forwards");
		isVisible = !isVisible;
	}
});

mobileNavItems.forEach((item) => {
	item.addEventListener("click", () => {
		mobileNav.style.display = "none";
		hamburger.classList.add("navbar__hamburger-animation--backwards");
		isVisible = false;
	});
});

function removeClass(element, className){
	setTimeout( () => {
		element.classList.remove(className);
		// make mobilenav invisible after playing slide out animation
		className === "mobilenav__container--slideOut" ? mobileNav.style.display = "none" : null;
	}, 250);
}


// AV SECTION
let seeMoreButtons = document.querySelectorAll(".newspaper__popout-button");
let popoutContainers = document.querySelectorAll(".newspaper__popout-container");

seeMoreButtons.forEach((button) => {
	button.addEventListener("click", function(){
		if (this.parentElement.parentElement.id){
			// clear any existing popouts
			popoutContainers.forEach((container) => {
				container.style.display = "none";
			});
			// get the id of the containing div column
			let id = this.parentElement.parentElement.id;
			// interpolate the desired div selector
			let divToShow = document.querySelector(`#${id}-popout-container`);
			// show the div
			divToShow.style.display = "flex";
		}
	});
});

let goBackButtons = document.querySelectorAll(".newspaper__popout-button--back");

goBackButtons.forEach((button) => {
	button.addEventListener("click", function(){
		if (this.parentElement.parentElement){
			this.parentElement.parentElement.style.display = "none";
		}		
	});
});


// MUSIC SECTION
let slider = document.querySelector(".music__slider");
let yearDisplay = document.querySelector(".music__slider-display");
let musicCardContainer = document.querySelector(".music__card-container");

slider.oninput = () => {
	updateDisplay();
}

function updateDisplay() {
	yearDisplay.innerHTML = slider.value;
	let releasesFromYear = releases[slider.value];
	let cards = document.querySelectorAll(".music__card");
	
	// remove old cards
	for (let i = 0; i < cards.length; i++){
		removeCard(cards[i].className);
	}

	// generate new cards
	for (let i = 0; i < releasesFromYear.length; i++){
		makeCard(releasesFromYear[i], ".music__card-container");
	}
}

function removeCard(target) {
	var element = document.querySelector(`.${target}`);
	element.parentNode.removeChild(element);
}

function makeCard(album, destParent) {
	let card = document.createElement("div");
	let title = document.createElement("h2");
	let label = document.createElement("h3");
	let img = document.createElement("img");
	let links = document.createElement("div");
	let bandcamp = document.createElement("a");
	let spotify = document.createElement("a");
	let appleMusic = document.createElement("a");
	let soundcloud = document.createElement("a");

	// find root element to attach cards to
	document.querySelector(destParent).appendChild(card);
	// append primary child elements to card
	card.appendChild(title); 
	card.appendChild(label); 
	card.appendChild(img); 
	card.appendChild(links);
	// append links to links div
	album.bandcampLink ? links.appendChild(bandcamp) : null;
	album.spotifyLink ? links.appendChild(spotify) : null;
	album.appleMusicLink ? links.appendChild(appleMusic) : null;
	album.soundcloudLink ? links.appendChild(soundcloud) : null;

	// apply classes and attributes
	card.classList.add("music__card");
	title.classList.add("music__card-title");
	label.classList.add("music__card-label");
	img.classList.add("music__card-img");
	img.setAttribute("alt", `${album.title} album artwork`);
	links.classList.add("music__card-links");

	for (let i = 0; i < links.children.length; i++){
		links.children[i].classList.add("music__card-link"); // apply class
		links.children[i].setAttribute("target", "_blank"); // set to open in new window
	}

	// add content to elements
	title.innerHTML = album.title.toLowerCase();
	label.innerHTML = album.label.toLowerCase();

	// use higher res image for hi dpi screens
	if (window.devicePixelRatio > 1){
		album.albumArt ? img.src = `${album.albumArt}.jpg` : null;
	} else {
		album.albumArt ? img.src = `${album.albumArt}_sm.jpg` : null;
	}
	
	album.bandcampLink ? bandcamp.innerHTML = "bandcamp" : null;
	album.bandcampLink ? bandcamp.href = album.bandcampLink : null;
	album.spotifyLink ? spotify.innerHTML = "spotify" : null;
	album.spotifyLink ? spotify.href = album.spotifyLink : null;
	album.appleMusicLink ? appleMusic.innerHTML = "apple music" : null;
	album.appleMusicLink ? appleMusic.href = album.appleMusicLink : null;
	album.soundcloudLink ? soundcloud.innerHTML = "soundcloud" : null;	
	album.soundcloudLink ? soundcloud.href = album.soundcloudLink : null;	
}

// initial update on load
updateDisplay();


// PLUGINS SECTION
function makePluginCard(plugin, destParent) {
	let card = document.createElement("div");
	let name = document.createElement("a");
	let imgAnchor = document.createElement("a");
	let img = document.createElement("img");

	// find root element to attach cards to
	document.querySelector(destParent).appendChild(card);
	
	// append primary child elements to card
	card.appendChild(imgAnchor); 
	imgAnchor.appendChild(img); 
	card.appendChild(name); 
	
	// set hrefs, preferring gumroad links
	plugin.gumroadLink ? imgAnchor.href = plugin.gumroadLink : imgAnchor.href = plugin.bandcampLink;
	plugin.gumroadLink ? name.href = plugin.gumroadLink : name.href = plugin.bandcampLink;

	// apply classes and attributes
	card.classList.add("plugin");
	name.classList.add("plugin__link");
	img.classList.add("plugin__img");
	img.setAttribute("alt", `${plugin.title} artwork`);

	// set link behavior
	imgAnchor.setAttribute("target", "_blank");
	name.setAttribute("target", "_blank");

	// add content to elements
	name.innerHTML = plugin.title;
	
	// add higher res img for hi dpi screens
	if (window.devicePixelRatio > 1){
		plugin.img ? img.src = `${plugin.img}.jpg` : null;
	} else {
		plugin.img ? img.src = `${plugin.img}_sm.jpg` : null;
	}
	
	plugin.gumroadLink ? imgAnchor.href = plugin.gumroadLink : imgAnchor.href = plugin.bandcampLink;
}

for (let i = 0; i < maxPatches.length; i++){
	makePluginCard(maxPatches[i], "#max-patches");
}

for (let i = 0; i < reaktorPatches.length; i++){
	makePluginCard(reaktorPatches[i], "#reaktor-patches");
}

// LESSONS SECTION

const signupIframe = document.querySelector(".lessons__iframe");

// wait until page has loaded to load iframe (causes p5 sketch to hang while loading)
window.addEventListener("load", () => {
	signupIframe.src = "https://docs.google.com/forms/d/e/1FAIpQLScw9-5OErTTOS3-lEnoxvlQpHYNWZKEswzVMqh7E991UQulvg/viewform?embedded=true";
});

// CV SECTION
const cvContainer = document.querySelector(".cv__wrapper");

fetch("https://agohorel.github.io/wlg-site/cv.html")
	.then((response) => {
		// convert loaded file to text
		return response.text();
	})
	.then((html) => {
		// init dom parser
		let parser = new DOMParser();

		// parse txt to html
		let cvHTML = parser.parseFromString(html, "text/html");

		// append html to cv container
		cvContainer.appendChild(cvHTML.body);
	})
	.catch((err) => {
		console.log(`failed to load resource: ${err}`);
	});