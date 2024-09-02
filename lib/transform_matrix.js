export class TransformMatrix {
    constructor(state = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]) {
        this.state = state;
    }


    translate([x, y, z]) {
        return new TransformMatrix([
            [this.state[0][0], this.state[0][1], this.state[0][2], this.state[0][3]],
            [this.state[1][0], this.state[1][1], this.state[1][2], this.state[1][3]],
            [this.state[2][0], this.state[2][1], this.state[2][2], this.state[2][3]],
            [this.state[3][0] + x, this.state[3][1] + y, this.state[3][2] + z, this.state[3][3]],
        ])
    }

    rotate(xyz) {
        const [x, y, z] = xyz.map((degrees) => degrees2radians(degrees));

        const cx = Math.cos(x);
        const sx = Math.sin(x);
        const cy = Math.cos(y);
        const sy = Math.sin(y);
        const cz = Math.cos(z);
        const sz = Math.sin(z);

        const rx = new TransformMatrix([
            [1, 0, 0, 0],
            [0, cx, -sx, 0],
            [0, sx, cx, 0],
            [0, 0, 0, 1],
        ]);

        const ry = new TransformMatrix([
            [cy, 0, sy, 0],
            [0, 1, 0, 0],
            [-sy, 0, cy, 0],
            [0, 0, 0, 1],
        ]);

        const rz = new TransformMatrix([
            [cz, -sz, 0, 0],
            [sz, cz, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);

        return rx.multiply(ry).multiply(rz).multiply(this);


    }

    multiply(matrix) {
        return new TransformMatrix(matrix.state.map((row, r) => this.state[0].map((_, c) => row.reduce((sum, val, i) => sum + val * this.state[i][c], 0))));
    }

    toString() {
        return this.state.toString();
    }
}

function degrees2radians(degrees) {
    return degrees * Math.PI / 180;
}