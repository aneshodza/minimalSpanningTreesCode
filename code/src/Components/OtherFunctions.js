export function Triangle(firstNode, secondNode) {
    let triangle = {
        A: firstNode,
        B: secondNode,
        C: { x: firstNode.x, y: secondNode.y, id: undefined },
        a: Math.abs(firstNode.x - secondNode.x),
        b: Math.abs(firstNode.y - secondNode.y),
        c: undefined,
        beta: undefined
    }
    triangle.c = Math.sqrt(Math.pow(triangle.a, 2) + Math.pow(triangle.b, 2))
    triangle.beta = Math.asin(triangle.a / triangle.c) * (180 / Math.PI)
    if (firstNode.x > secondNode.x) {
        triangle.beta = 360 - triangle.beta
    }
    return triangle
}

export function FindNodeIndexById(id, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
            return i
        }
    }
}

export function FindLineIndexById(id, lines) {
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].id === id) {
            return i
        }
    }
}

export function Sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}