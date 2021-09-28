'use strict';

class Vec2 {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        const v = new Vec2(this.x, this.y);
        return v;
    }
    add(other) {
        if (other instanceof Vec2) {
            this.x += other.x;
            this.y += other.y;
        } else {
            this.x += other;
            this.y += other;
        }
    }
    sub(other) {
        if (other instanceof Vec2) {
            this.x -= other.x;
            this.y -= other.y;
        } else {
            this.x -= other;
            this.y -= other;
        }
    }
    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }
    normalize() {
        const m = this.magnitude;
        if (m != 0) {
            this.x /= m;
            this.y /= m;
        }
    }
    get normalized() {
        const ret = this.clone();
        ret.normalize();
        return ret;
    }
    get magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    get array() {
        return [this.x, this.y];
    }
    static lerp(a, b, t) {
        const lerp = (a, b, t) => a * (1 - t) + b * t;
        return new Vec2(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
    }
    static bezier(a, b, c, d, t) {
        const e = Vec2.lerp(a, b, t);
        const f = Vec2.lerp(b, c, t);
        const g = Vec2.lerp(c, d, t);
        const h = Vec2.lerp(e, f, t);
        const i = Vec2.lerp(f, g, t);
        const j = Vec2.lerp(h, i, t);
        return j;
    }
}
