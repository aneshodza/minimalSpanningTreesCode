import { FindNodeIndexById, FindLineIndexById } from "./OtherFunctions"

export function Prim(nodes, changeLineColor, changeNodeColor, delayTime, addConsoleLine) {
    const delay = delayTime
    let interval = setInterval(() => cycle(), delay)
    var startNode = nodes[Math.floor(Math.random()*nodes.length)]
    var usedNodes = [startNode]
    var tree = []
    var lastChecked = { id: null }
    var smallestLine = null
    var smallestLineWeight = Infinity
    var lineIndex = 0
    var usedNodesIndex = 0
    var startTime = Date.now()
    var loops = 0
    var checks = 0
    nodes.forEach(node => {
        changeNodeColor(node.id, 'black')
        node.lines.forEach(line => {
            changeLineColor(line.id, 'black')
        })
    })

    changeNodeColor(startNode.id, 'red')
    addConsoleLine('')
    addConsoleLine('Starting the algorhitm')
    addConsoleLine('Starting with node ' + startNode.id)
    addConsoleLine('Program cycles every ' + delay + 'ms')
    
    const cycle = () => {
        loops++
        if (usedNodes.length < nodes.length) { // If program is not done yet
            if (usedNodesIndex < usedNodes.length) { // If all used nodes are not looped
                if (lineIndex < usedNodes[usedNodesIndex].lines.length) { // If not all the lines have been checked
                    if (usedNodes.filter(node => usedNodes[usedNodesIndex].lines[lineIndex].node1 === node.id).length === 0 || usedNodes.filter(node => usedNodes[usedNodesIndex].lines[lineIndex].node2 === node.id).length === 0) { // If nodes are not in tree
                        checks++
                        if (tree.filter(line => lastChecked.id === line.id).length === 0) {
                            changeLineColor(lastChecked.id, 'black') // Color last line black
                        }
                        changeLineColor(usedNodes[usedNodesIndex].lines[lineIndex].id, 'blue') // Color current line blue
                        if (usedNodes[usedNodesIndex].lines[lineIndex].weight < smallestLineWeight) { // If current line is smallest one
                            smallestLine = usedNodes[usedNodesIndex].lines[lineIndex] // Set smallest line to current line
                            smallestLineWeight = usedNodes[usedNodesIndex].lines[lineIndex].weight // Set the weight to the current lowest weight
                        }
                        lastChecked = usedNodes[usedNodesIndex].lines[lineIndex]; // Set the last line to the current line
                    }
                    lineIndex++; // Check next line 
                } else { // If all the lines have been checked
                    lineIndex = 0; // Reset the lines
                    usedNodesIndex++; // Check next node
                }
            } else { // If all usedNodes have been checked
                if (usedNodes.filter(node => node.id === smallestLine.node1).length > 0) { // If node 1 is already in the array
                    usedNodes.push(nodes[FindNodeIndexById(smallestLine.node2, nodes)]); // Add node 2
                    changeNodeColor(smallestLine.node2, 'red')
                } else { // If node 2 is already in the array
                    usedNodes.push(nodes[FindNodeIndexById(smallestLine.node1, nodes)]); // Add node 1
                    changeNodeColor(smallestLine.node1, 'red')
                }
                tree.push(smallestLine);
                changeLineColor(smallestLine.id, 'red')
                if (lastChecked.id !== smallestLine.id) {
                    changeLineColor(lastChecked.id, 'black')
                }
                smallestLine = null
                smallestLineWeight = Infinity
                usedNodesIndex = 0;
                lineIndex = 0;
            }
        } else { // If it is done
            addConsoleLine('')
            addConsoleLine('Minimal spanning tree has been mapped')
            addConsoleLine('Statistics:')
            addConsoleLine('Execution took ' + (Date.now() - startTime).toString() + 'ms')
            addConsoleLine('Program looped ' + loops + ' times')
            addConsoleLine('It compared ' + checks + ' times')
            tree.forEach(line => {
                changeLineColor(line.id, 'red')
            });
            clearInterval(interval)
        }
    }
}