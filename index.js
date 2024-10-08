import { rubiksBuilder } from "./lib/rubiks_builder.js";
import { MatrixStyle } from "./lib/matrix_style.js";
import { TransformMatrix } from "./lib/transform_matrix.js";

const viewHeight = document.scrollingElement.scrollHeight;

const size = Math.floor(viewHeight / Math.sqrt(3));

const ssize = Math.floor(size / 3);

document.documentElement.style.setProperty('--size', `${size}px`);
document.documentElement.style.setProperty('--ssize', `${ssize}px`);

const [rubiks_cube, rubiks_pieces] = rubiksBuilder(ssize);

MatrixStyle.update(rubiks_cube, new TransformMatrix().rotate([0, -60, 0]).rotate([30, 0, 0]));

document.querySelector('body').appendChild(rubiks_cube);

var previousTarget = null;
var xyzBuffer = [0, 0, 0];
var axis = null;
var slice = null;
var rotationD = 0;

addEventListener('wheel', (event) => {
    [previousTarget, xyzBuffer, axis, slice, rotationD] = handleInput(
        previousTarget ?? event.target,
        xyzBuffer,
        event.buttons,
        [0, 0, event.wheelDelta / 10],
        axis, slice, rotationD,
    );
})

addEventListener('mousemove', (event) => {
    [previousTarget, xyzBuffer, axis, slice, rotationD] = handleInput(
        previousTarget ?? event.target,
        xyzBuffer,
        event.buttons,
        [event.movementY, -event.movementX, 0],
        axis, slice, rotationD,
    );
})

addEventListener('mouseup', (event) => {
    [previousTarget, xyzBuffer, axis, slice, rotationD] = handleInput(
        null,
        null,
        null,
        null,
        axis, slice, rotationD,
    );
})

function handleInput(target, xyzBuffer, buttons, xyz, axis, slice, rotationD) {
    if (!(buttons & 0x1)) {

        if (rotationD != 0) {
            const rotate = [0, 0, 0];
            rotate[axis] = -((Math.abs(rotationD) + 45) * Math.sign(rotationD)) % 90 + 45 * Math.sign(rotationD);
            slice.forEach(e => {
                const m = MatrixStyle.extract(e).translate([-ssize, -ssize, 0]).rotate(rotate).translate([ssize, ssize, 0]).state;

                m[3][0] = Math.round(m[3][0]);
                m[3][1] = Math.round(m[3][1])
                m[3][2] = Math.round(m[3][2])

                MatrixStyle.update(e, new TransformMatrix(m))

            });

        }
        return [null, [0, 0, 0], null, null, 0];
    }

    if (target.localName == 'rubiks-face') {

        const tbase = MatrixStyle.extract(target);
        const rbase = MatrixStyle.extract(rubiks_cube);

        const [x, y, z] = new TransformMatrix([[xyz[0]], [xyz[1]], [xyz[2]], [0]]).multiply(rbase).state.flat();
        xyz = [x, y, z];


        if (!axis) {
            var xyzBufferAbs = xyzBuffer.map(Math.abs);

            if (xyzBufferAbs.some(v => v > 20)) {
                axis = xyzBufferAbs.reduce((indexMax, value, index, array) => array[indexMax] < value ? index : indexMax, 0);
            } else {
                xyzBuffer = xyzBuffer.map((value, index) => {
                    return value + xyz[index];
                });
            }
        }


        if (axis != null && slice == null) {
            slice = rubiks_pieces.filter(v => MatrixStyle.extract(v).state[3][axis] == MatrixStyle.extract(target.parentElement).state[3][axis]);
        }

        if (axis != null && slice != null) {

            const rotate = [0, 0, 0];
            rotate[axis] = xyz[axis];
            rotationD = rotationD + xyz[axis];


            slice.forEach(e => {
                MatrixStyle.update(e, MatrixStyle.extract(e).translate([-ssize, -ssize, 0]).rotate(rotate).translate([ssize, ssize, 0]));
            });
        }



    } else {
        const matrix = MatrixStyle.extract(rubiks_cube);
        MatrixStyle.update(rubiks_cube, matrix.rotate(xyz));
    }

    return [target, xyzBuffer, axis, slice, rotationD];
}
