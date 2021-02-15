{
    const body = document.querySelector("body");
    const container = document.querySelector(".ui");
    const background = document.querySelector("#background");

    const rotate = 75;

    container.style.transition = "all 0.2s";
    background.style.transition = "all 0.2s";
    setTimeout(function () {
        container.style.transition = "none"
        background.style.transition = "none";
    }, 3000);

    const skew = window.innerWidth / 5;
    let x = 0;
    let y = 0;
    let z = 50;

    body.addEventListener("mousemove", (ev) => {
        x = (window.innerWidth / 2 - (ev.pageX - skew));
        y = (window.innerHeight / 2 - ev.pageY);

        setTransform();
    });

    body.addEventListener("wheel", (ev) => {
        z += ev.deltaY * -0.01;

        setTransform();
    });

    body.addEventListener("mouseenter", () => {
        window.init();
    });

    body.addEventListener("mouseleave", () => {
        window.reset();
    });

    function setTransform() {
        if (window.isOpen) return;

        container.style.transform = `rotateX(${y / -rotate}deg) rotateY(${x / rotate}deg) translate(0, -50%) translateZ(${z}px)`;
        background.style.transform = `rotateX(${y / -rotate}deg) rotateY(${x / rotate}deg) translate(0, -50%)`;
    }

    window.init = () => {
        container.style.transition = "all 0.1s";
        background.style.transition = "all 0.1s";
    }

    window.reset = () => {
        container.style.transition = "all 0.5s";
        container.style.transform = "rotateX(0deg) rotateY(0deg) translate(0, -50%)";
        background.style.transition = "all 0.5s";
        background.style.transform = "rotateX(0deg) rotateY(0deg) translate(0, -50%)";

        x = 0;
        y = 0;
        z = 50;
    }
}