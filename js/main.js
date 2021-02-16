{
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
    DOM.ui = document.querySelectorAll('nav.ui > button');
    DOM.close = document.querySelector('.close-menu');
    DOM.hidden = document.querySelector('article.hidden');

    Array.from(DOM.svg.querySelectorAll('g')).forEach((el) => {
        const blob = new Blob(el);
        blobs.push(blob);
        blob.intro();
    });

    let page = -1;
    Array.from(DOM.ui).forEach((el, i) => {
        el.addEventListener('click', (ev) => {
            ev.preventDefault();

            el.disabled = true;
            DOM.close.disabled = false;

            page = i;
            if (page === 0) {
                document.title = 'Aquarel - Downloads';
            } else if (page === 1) {
                document.title = 'Aquarel - Socials';
            }

            open(Math.floor(Math.random() * (6)));
        });
    });

    let current = -1;
    const open = (i) => {
        window.isOpen = true;

        window.reset();
        anime({
            targets: '.ui',
            opacity: ['100%', '0%'],
            easing: 'easeInOutQuad',
            duration: '2s',
            complete: function () {
                document.querySelector('.ui').style.display = 'hidden';
            }
        });

        current = i;
        const currentBlob = blobs[current];
        currentBlob.expand().then(() => {
            DOM.hidden.style.display = 'initial';
            anime({
                targets: '.hidden',
                opacity: ['0%', '100%'],
                easing: 'easeInOutQuad',
                duration: '1s'
            });
        });
        blobs.filter(el => el !== currentBlob).forEach(blob => blob.hide());
    }

    DOM.close.addEventListener('click', (ev) => {
        ev.preventDefault();

        Array.from(DOM.ui).forEach((el) => {
            el.disabled = false;
        });
        DOM.close.disabled = true;

        document.title = 'Aquarel';
        close();
    });

    const close = () => {
        if (!window.isOpen) return;

        document.querySelector('.ui').style.display = 'visible';
        setTimeout(function () {
            anime({
                targets: '.ui',
                opacity: ['0%', '100%'],
                easing: 'easeInOutQuad',
                duration: '2s',
            });
        }, 1000);

        anime({
            targets: '.hidden',
            opacity: ['100%', '0%'],
            easing: 'easeInOutQuad',
            duration: '2s',
        });
        DOM.hidden.style.display = 'none';

        setTimeout(function () {
            window.isOpen = false;
            window.init();
        }, 2000);

        blobs[current].collapse().then(() => {
            current = -1;
            page = -1;
        });
        blobs.filter(element => element !== blobs[current]).forEach(blob => blob.show());
    }
}