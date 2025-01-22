 function convertMatrixToGraph(matrix) {
    const graph = [];
    for (let i = 0; i < matrix.length; i++) {
        graph[i] = [];
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                graph[i].push(j);
            }
        }
    }
    return graph;
}
export {
    convertMatrixToGraph
}