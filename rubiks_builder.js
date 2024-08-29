import { TransformMatrix } from "./transform_matrix.js";
import { MatrixStyle } from "./matrix_style.js";
import { size, ssize } from "./consts.js";

export function rubiksBuilder() {
    const rubiks_cube = document.createElement('rubiks-cube');
    const rubiks_pieces = [];

    for (let i = 0; i < 27; i++) {
        const vector = [~~(i / 9) - 1, ~~(i / 3) % 3 - 1, i % 3 - 1];
        const [x, y, z] = vector;

        if (x === 0 && y === 0 && z == 0) {
            continue;
        }

        const rubiks_piece = buildRubiksPiece(vector);
        rubiks_cube.appendChild(rubiks_piece)
        rubiks_pieces.push(rubiks_piece);
    }

    return [rubiks_cube, rubiks_pieces];
}

function buildRubiksPiece(vector) {
    const [x, y, z] = vector;
    const rubiks_piece = document.createElement('rubiks-piece');

    let matrix = new TransformMatrix()
        .translate([
            (x + 1) * ssize,
            (y + 1) * ssize,
            (z) * ssize
        ]);

    MatrixStyle.update(rubiks_piece, matrix);
    for (let axis = 0; axis <= 2; axis++) {
        const direction = vector[axis];

        if (direction == 0) {
            continue;
        }

        const rubiks_face = buildRubiksFace(axis, direction);
        rubiks_piece.appendChild(rubiks_face);
    }

    return rubiks_piece;
}

function buildRubiksFace(axis, direction) {
    const rubiks_face = document.createElement('rubiks-face');

    const colors = ['red', 'orange', 'white', 'yellow', 'green', 'blue'];
    const color = colors[axis * 2 + (direction + 1) / 2]

    let matrix = new TransformMatrix()
        .translate([
            0,
            0,
            direction * ssize / 2,
        ])
        .rotate([
            90 * (axis == 1 & 1),
            -90 * (axis == 0 & 1),
            0,
        ]);


    MatrixStyle.update(rubiks_face, matrix);

    rubiks_face.style.backgroundColor = color;

    return rubiks_face;
}