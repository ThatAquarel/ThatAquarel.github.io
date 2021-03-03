{
    document.SameSite = 'Strict';

    function debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    class Blob {
        constructor(el, options) {
            this.DOM = {};
            this.DOM.el = el;
            this.options = {};
            Object.assign(this.options, options);
            this.init();
        };

        init() {
            this.rect = this.DOM.el.getBoundingClientRect();
            this.descriptions = [];
            this.layers = Array.from(this.DOM.el.querySelectorAll('path'), t => {
                t.style.transformOrigin = `${this.rect.left + this.rect.width / 2}px ${this.rect.top + this.rect.height / 2}px`;
                t.style.opacity = '0';
                this.descriptions.push(t.getAttribute('d'));
                return t;
            });

            window.addEventListener('resize', debounce(() => {
                this.rect = this.DOM.el.getBoundingClientRect();
                this.layers.forEach(layer => layer.style.transformOrigin = `${this.rect.left + this.rect.width / 2}px ${this.rect.top + this.rect.height / 2}px`);
            }, 20));
        };

        intro() {
            anime.remove(this.layers);
            anime({
                targets: this.layers,
                duration: 1800,
                delay: (t, i) => i * 120,
                easing: [0.2, 1, 0.1, 1],
                scale: [0.2, 1],
                opacity: {
                    value: [0, 1],
                    duration: 300,
                    delay: (t, i) => i * 120,
                    easing: 'linear'
                }
            });
        };

        expand() {
            //return new Promise((resolve, reject) => {
            return new Promise((resolve) => {
                let halfway = false;
                anime({
                    targets: this.layers,
                    duration: 1000,
                    delay: (t, i) => i * 50 + 200,
                    easing: [0.8, 0, 0.1, 0],
                    d: (t) => t.getAttribute('id'),
                    update: function (anim) {
                        if (anim.progress > 75 && !halfway) {
                            halfway = true;
                            resolve();
                        }
                    }
                });
            });
        };

        collapse() {
            //return new Promise((resolve, reject) => {
            return new Promise((resolve) => {
                let halfway = false;
                anime({
                    targets: this.layers,
                    duration: 800,
                    delay: (t, i, total) => (total - i - 1) * 50 + 400,
                    easing: [0.2, 1, 0.1, 1],
                    d: (t, i) => this.descriptions[i],
                    update: function (anim) {
                        if (anim.progress > 75 && !halfway) {
                            halfway = true;
                            resolve();
                        }
                    }
                });
            });
        };

        hide() {
            anime.remove(this.layers);
            anime({
                targets: this.layers,
                duration: 800,
                delay: (t, i, total) => (total - i - 1) * 80,
                easing: 'easeInOutExpo',
                scale: 0,
                opacity: {
                    value: 0,
                    duration: 500,
                    delay: (t, i, total) => (total - i - 1) * 80,
                    easing: 'linear'
                }
            });
        };

        show() {
            setTimeout(() => this.intro(), 400);
        };
    }

    window.Blob = Blob;
    window.isOpen = false;

    const DOM = {};
    let blobs = [];
    DOM.svg = document.querySelector('svg.scene');
    DOM.buttons = document.querySelectorAll('nav.ui > button');
    DOM.ui = document.querySelector('.ui');
    DOM.close = document.querySelector('.close-menu');
    DOM.hidden = document.querySelector('.hidden');

    Array.from(DOM.svg.querySelectorAll('g')).forEach((el) => {
        const blob = new Blob(el);
        blobs.push(blob);
        blob.intro();
    });

    let page = -1;
    Array.from(DOM.buttons).forEach((el, i) => {
        el.addEventListener('click', (ev) => {
            ev.preventDefault();

            page = i;
            if (page === 0) {
                document.title = 'Aquarel - Downloads';
            } else if (page === 1) {
                document.title = 'Aquarel - Socials';
            }

            open(Math.floor(Math.random() * (6)));
        });
    });

    let current_blob = -1;
    let animUi = -1;
    const open = (i) => {
        window.isOpen = true;

        window.reset();
        animUi = anime({
            targets: '.ui',
            opacity: ['1', '0'],
            easing: 'easeInOutQuad',
            duration: '2s',
            autoplay: false,
            complete: function () {
                DOM.ui.style.opacity = '0';
                DOM.ui.style.pointerEvents = 'none';
            }
        });
        animUi.play();

        current_blob = i;
        const currentBlob = blobs[current_blob];
        currentBlob.expand().then(() => {
            DOM.hidden.style.opacity = '1';
            DOM.hidden.style.pointerEvents = 'all';
        });
        blobs.filter(el => el !== currentBlob).forEach(blob => blob.hide());
    }

    DOM.close.addEventListener('click', (ev) => {
        ev.preventDefault();

        document.title = 'Aquarel';
        close();
    });

    const close = () => {
        if (!window.isOpen) return;
        window.isOpen = false;

        DOM.ui.style.pointerEvents = 'initial';
        setTimeout(() => {
            animUi.play();
            animUi.reverse();

            setTimeout(() => {
                window.init();
            }, 1500);
        }, 1000);

        DOM.hidden.style.opacity = '0';
        DOM.hidden.style.pointerEvents = 'none';

        blobs[current_blob].collapse().then(() => {
            current_blob = -1;
            page = -1;
            animUi = -1;
        });
        blobs.filter(element => element !== blobs[current_blob]).forEach(blob => blob.show());
    }
}