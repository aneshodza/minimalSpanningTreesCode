import { useState } from 'react'
import Node from './Node.js'
import { FindLineIndexById, Triangle, FindNodeIndexById } from './OtherFunctions.js'
import { Prim } from './Prim.js';
import Line from './Line.js';
import copyLines from './lines.json';
import copyNodes from './nodes.json';
import { Button } from 'react-bootstrap';

var iPress; var dPress; var tPress
var mousePos;
var newNodeId = 0; var newLineId = 0;
var bridge = { firstNode: undefined, secondNode: undefined };

export default function Field() {
    const [nodes, setNodes] = useState([])
    const [lines, setLines] = useState([])

    tPress = () => {
        setNodes(copyNodes)
        setLines(copyLines)
        newNodeId = 9
        newLineId = 16
    }

    iPress = () => {
        console.log(nodes)
        console.log(lines)
    }

    dPress = () => {
        setNodes([...nodes, { x: mousePos.x, y: mousePos.y, id: newNodeId, lines: [], color: undefined }])
        newNodeId++
        console.log(nodes)
        console.log(lines)
    }

    const nodePress = (node) => {
        if (bridge.firstNode === undefined) {
            bridge.firstNode = node
        } else if (bridge.secondNode === undefined) {
            if (bridge.firstNode.id === node.id) {
                console.log('First point cannot be second point')
            } else {
                bridge.secondNode = node
                calcLine()
            }
        } else {
            console.log('Something went wrong')
        }

    }

    const calcLine = () => {
        let lowerNode
        let upperNode
        if (bridge.firstNode.y > bridge.secondNode.y) {
            upperNode = bridge.firstNode
            lowerNode = bridge.secondNode
        } else {
            upperNode = bridge.secondNode
            lowerNode = bridge.firstNode
        }
        let triangle = Triangle(upperNode, lowerNode)
        createLine(lowerNode, upperNode, triangle, Math.floor(Math.random() * 10))
    }

    const createLine = (lowerNode, upperNode, triangle, weight) => {
        let newLine = { id: newLineId, node1: lowerNode.id, node2: upperNode.id, length: triangle.c, angle: triangle.beta, weight: weight, coords: [lowerNode.x, lowerNode.y], color: undefined }
        setLines([...lines, newLine])
        lowerNode.lines = [...lowerNode.lines, newLine]
        upperNode.lines = [...upperNode.lines, newLine]
        newLineId++
        bridge = { firstNode: undefined, secondNode: undefined }
    }

    const changeLineColor = (id, color) => {
        if (id !== null) {
            lines[FindLineIndexById(id, lines)] = { ...lines[FindLineIndexById(id, lines)], color: color }
            setNodes([...nodes, { x: mousePos.x, y: mousePos.y, id: newNodeId, lines: [] }])
            setNodes(nodes.slice(0, nodes.length))
        }
    }

    const changeNodeColor = (id, color) => {
        nodes[FindNodeIndexById(id, nodes)] = { ...nodes[FindNodeIndexById(id, nodes)], color: color }
        setNodes([...nodes, { x: mousePos.x, y: mousePos.y, id: newNodeId, lines: [] }])
        setNodes(nodes.slice(0, nodes.length))
    }

    const executePrim = () => {
        Prim(nodes, changeLineColor, changeNodeColor, true)
    }

    return (
        <div className="field">
            {
                nodes.map(node => <Node x={node.x} y={node.y} id={node.id} key={node.id} color={node.color} createBridge={() => nodePress(node)} />)
            }
            {
                lines.map(line => <Line x={line.coords[0]} y={line.coords[1]} id={line.id} key={line.id} length={line.length} rotation={line.angle} color={line.color} />)
            }
            <Button variant="outline-primary" onClick={() => executePrim()}>Prim</Button>
        </div>
    )
}

window.addEventListener('keyup', (e) => {
    e.preventDefault()
    if (e.code === 'KeyD') {
        dPress()
    } else if (e.code === 'KeyI') {
        iPress()
    } else if (e.code === 'KeyT') {
        tPress()
    }
})

window.addEventListener('mousemove', (e) => {
    e.preventDefault()
    mousePos = { x: e.clientX - 10, y: e.clientY - 10 }
})
