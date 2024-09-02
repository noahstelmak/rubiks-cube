import { TransformMatrix }  from "./transform_matrix.js";

export class MatrixStyle {
    static extract(element){
        let matrixMatch = element.style.transform.match(/matrix3d\(([^)]*)\)/);
        if (matrixMatch && matrixMatch.length > 1) {
            let matrixArray = matrixMatch[1].split(',').map(Number);
            let matrix = [
                [matrixArray[0], matrixArray[1], matrixArray[2], matrixArray[3]],
                [matrixArray[4], matrixArray[5], matrixArray[6], matrixArray[7]],
                [matrixArray[8], matrixArray[9], matrixArray[10], matrixArray[11]],
                [matrixArray[12], matrixArray[13], matrixArray[14], matrixArray[15]]
            ];

            return new TransformMatrix(matrix);
        }
        
    }

    static update(element, matrix){
        if(element.style.transform.includes('matrix3d(')){
            element.style.transform = element.style.transform.replace(/matrix3d\([^)]*\)/ ,`matrix3d(${matrix})`);
        } else {
            element.style.transform = element.style.transform + `matrix3d(${matrix})`;
        }       
    }
}