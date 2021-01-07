const body = document.querySelector("body");
const container = document.querySelector(".ui");
const background = document.querySelector("#content");

const rotate = 75;

container.style.transition = "all 0.2s"
background.style.transition = "all 0.2s";
setTimeout(function () {
    container.style.transition = "none"
    background.style.transition = "none";
}, 3000);

let x = 0;
let z = 50;
let y = 0;

body.addEventListener("mousemove", (evt) => {
    let skew = window.innerWidth / 5;
    x = (window.innerWidth / 2 - (evt.pageX - skew));
    y = (window.innerHeight / 2 - evt.pageY);

    setTransform();
});

body.addEventListener("wheel", (evt) => {
    z += evt.deltaY * -0.01;

    setTransform();
});

body.addEventListener("mouseenter", (evt) => {
    container.style.transition = "all 0.1s";
    background.style.transition = "all 0.1s";

    setTimeout(function () {
        container.style.transition = "none";
        background.style.transition = "none";
    }, 500);
});

body.addEventListener("mouseleave", (evt) => {
    container.style.transition = "all 0.5s";
    container.style.transform = "rotateX(0deg) rotateY(0deg) translate(0, -50%)"
    background.style.transition = "all 0.5s";
    background.style.transform = "rotateX(0deg) rotateY(0deg) translate(0, -50%)"
});

function setTransform(){
    container.style.transform = `rotateX(${y / -rotate}deg) rotateY(${x / rotate}deg) translate(0, -50%) translateZ(${z}px)`;
    background.style.transform = `rotateX(${y / -rotate}deg) rotateY(${x / rotate}deg) translate(0, -50%)`;
}