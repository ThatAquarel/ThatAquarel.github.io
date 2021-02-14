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
    DOM.ui = document.querySelector('nav.ui');

    Array.from(DOM.svg.querySelectorAll('g')).forEach((el) => {
        const blob = new Blob(el);
        blobs.push(blob);
        blob.intro();
    });

    Array.from(DOM.ui.querySelectorAll('button')).forEach(function (el) {
        el.addEventListener('click', (ev) => {
            ev.preventDefault();

            open(Math.floor(Math.random() * (6)));
        });
    });

    let current;
    const open = (i) => {
        window.isOpen = true;
        window.reset();
        anime({
            targets: '.ui',
            opacity: ['100%', '0%'],
            easing: 'easeInOutQuad',
            duration: '2s',
            complete: function () {
                document.querySelector('.ui').style.visibility = 'hidden';
            }
        });

        current = i;
        const currentBlob = blobs[current];
        currentBlob.expand().then(() => {
        });
        blobs.filter(el => el !== currentBlob).forEach(blob => blob.hide());
    }

    // const close = () => {
    //     if (!this.isOpen) return;
    //     this.isOpen = false;
    //
    //     blobs[current].collapse().then(() => {
    //         current = -1;
    //     });
    //     blobs.filter(element => element !== blobs[current]).forEach(blob => blob.show());
    // }
}