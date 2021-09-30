function mk_m2w(pos, dir, map) {
    const mapScale    = Math.max(...map.array);
    const imMlt = (a, b) => new Vec2(
        a.x * b.x - a.y * b.y,
        a.x * b.y + a.y * b.x
    );
    const d90 = new Vec2(0, 1);
    return function(vert) {
        let ret = vert.clone();
        ret.y = 1 - ret.y;      // Flip model
        ret.sub(0.5);           // Center model
        ret.mult(0.5);          // Model space to world space scale
        ret = imMlt(ret, d90);  // Model space to world space rotation
        ret = imMlt(ret, dir);  // Model space to world space rotation
        ret.add(pos);           // Model space to world space position
        return ret;
    }
}

function mk_m2n(pos, dir, map) {
    const mapScale    = Math.max(...map.array);
    const m2w = mk_m2w(pos, dir, map);
    return function(vert) {
        let ret = m2w(vert);
        ret.div(mapScale);      // World space to NDC
        return ret;
    }
}

function mk_m2s(pos, dir, map, screen) {
    const screenScale = Math.max(...screen.array);
    const m2n = mk_m2n(pos, dir, map);
    return function(vert) {
        let ret = m2n(vert);
        ret.y = 1 - ret.y;
        ret.mult(screenScale);  // NDC to screen space
        return ret;
    }
}


function mk_n2s(screen) {
    const screenScale = Math.max(...screen.array);
    return function(vert) {
        let ret = vert.clone();
        ret.mult(screenScale);  // NDC to screen space
        return ret;
    }
}
