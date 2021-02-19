"use strict";

Vue.component('SGSplitter', {
    data() {
        return {
            splitter: null,
        }
    },
    props: {},
    computed: {

    },
    watch: {

    },
    methods: {

    },
    mounted() {
        this.splitter = new Splitter(this.$refs.splitter);
    },
    template: `
<div ref="splitter" class="splitter" data-splitter="yes"></div>
    `
});


function Splitter(id, options) {
    this.element = (typeof id === 'string')? document.getElementById(id): id;
    this.options = options || {};

    if (!this.options.cookieKey) this.options.cookieKey = null;
    if (!this.options.minWidth) this.options.minWidth = 0;

    this.binds = {
        start: this.start.bind(this),
        move: this.move.bind(this),
        end: this.end.bind(this)
    };

    this.attach();
}

Splitter.prototype.attach = function () {
    this.left = this.element.previousElementSibling;
    this.right = this.element.nextElementSibling;

    // TODO: load from cookie?

    this.dragging = false;

    this.element.addEventListener('mousedown', this.binds.start);
}

Splitter.prototype.start = function(event) {
    const isLeftButton = (event.which ? (event.which === 1) : false) ||
        (event.button ? (event.button === 1) : false);
    if(!isLeftButton) return;

    event.stopPropagation();
    event.preventDefault();

    this.startPos = this.eventPosition(event);

    // Add transparent cover to avoid IFRAMEs
    if (!this.cover) {
        this.cover = document.createElement('div');
        this.cover.style.position = 'fixed';
        this.cover.style.top = '0px';
        this.cover.style.bottom = '0px';
        this.cover.style.left = '0px';
        this.cover.style.right = '0px';
        this.cover.style.cursor = this.getComputedStyle(this.element, 'cursor');
        document.body.appendChild(this.cover);
    } else {
        this.cover.style.display = 'block';
    }

    document.body.addEventListener('mousemove', this.binds.move);
    document.body.addEventListener('mouseup', this.binds.end);
    this.dragging = true;

    let iframes = document.querySelectorAll('iframe');
    for(let i = 0; i < iframes.length; i++)
        iframes[i].style.pointerEvents = 'none';
}

Splitter.prototype.move = function (event) {
    if(!this.dragging) return;

    event.stopPropagation();
    event.preventDefault();

    let pos = this.eventPosition(event);

    // TODO: resize
    let delta = pos.x - this.startPos.x;
    this.startPos = pos;

    //console.log(delta);

    const leftWidth = this.left.offsetWidth;
    const rightWidth = this.right.offsetWidth;

    //console.log(leftWidth, rightWidth);

    if (delta < 0) {
        if ((leftWidth + delta) < this.options.minWidth) delta -= this.options.minWidth - (leftWidth + delta);
    } else {
        if ((rightWidth - delta) < this.options.minWidth) delta -= this.options.minWidth - (rightWidth - delta);
    }

    this.left.style.width = (leftWidth + delta) + 'px';
    this.right.style.width = (rightWidth - delta) + 'px';
}

Splitter.prototype.end = function (event) {
    if(!this.dragging) return;

    event.stopPropagation();
    event.preventDefault();

    this.cover.style.display = 'none';

    let pos = this.eventPosition(event);

    // TODO: end dragging, fix new sizes

    // TODO: save to cookie?

    let iframes = document.querySelectorAll('iframe');
    for(let i = 0; i < iframes.length; i++)
        iframes[i].style.pointerEvents = 'auto';

    document.body.removeEventListener('mousemove', this.binds.move);
    document.body.removeEventListener('mouseup', this.binds.end);
    this.dragging = false;
}

Splitter.prototype.eventPosition = function (event) {
    let pageX = event.pageX;
    let pageY = event.pageY;
    if (pageX === undefined) {
        pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return {
        x: pageX,
        y: pageY
    };
}

Splitter.prototype.getComputedStyle = function (elem, prop) {
    if (elem.currentStyle) {
        return elem.currentStyle[prop];
    } else if (window.getComputedStyle) {
        return window.getComputedStyle(elem, null).getPropertyValue(prop);
    }
}
