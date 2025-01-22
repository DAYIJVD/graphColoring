// Iterative Deepening Search (IDS)  graph coloring.  
function idsColor(graph, numColors) {  
    const colors = new Array(graph.length).fill(0);  
    const steps = [];  
    let depth = 1;  

    while (depth <= graph.length * numColors) {  
        if (depthColoring(graph, colors, 0, numColors, steps, depth)) {  
            return { colors, steps };  
        }  
        depth++;  
    }  
    throw new Error("Coloring not possible with given number of colors.");  
}  
// Attempts to color the graph using a limited depth-first approach.  
function depthColoring(graph, colors, node, numColors, steps, remainingDepth) {  
    if (node === graph.length) return true;   
    if (remainingDepth === 0) return false;   

    for (let color = 1; color <= numColors; color++) {  
        if (canColor(graph, colors, node, color)) {  
            colors[node] = color;  
            steps.push([...colors]);  
            if (depthColoring(graph, colors, node + 1, numColors, steps, remainingDepth - 1)) {  
                return true;  
            }  
            colors[node] = 0;  
        }  
    }  
    return false;  
}  
// Checks if assigning a specific color to a node is safe.  
function canColor(graph, colors, node, color) {  
    for (let neighbor of graph[node]) {  
        if (colors[neighbor] === color) {  
            return false;  
        }  
    }  
    return true;  
}  

export default idsColor;
