import { useState } from 'react'
import Node from './Node.js'
import { FindLineIndexById, Triangle, FindNodeIndexById } from './OtherFunctions.js'
import { Prim } from './Prim.js';
import Line from './Line.js';
import copyLines from './lines.json';
import copyNodes from './nodes.json';
import { Button, Accordion, InputGroup, FormControl } from 'react-bootstrap';
import Kruskal from './Kruskal.js';

var iPress; var dPress; var tPress
var mousePos;
var newNodeId = 0; var newLineId = 0; var newConsoleId = 0;
var bridge = { firstNode: undefined, secondNode: undefined };

export default function Field() {
    const [nodes, setNodes] = useState([])
    const [lines, setLines] = useState([])
    const [consoleText, setConsoleText] = useState(['Console has been cleared'])
    const [delay, setDelay] = useState(1)
    const [weight, setWeight] = useState(5)

    const addConsoleLine = (line) => {
        consoleText.push(line)
    }

    const clearField = () => {
        setLines([])
        setNodes([])
    }

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
    }

    const nodePress = (node) => {
        if (bridge.firstNode === undefined) {
            bridge.firstNode = node
        } else if (bridge.secondNode === undefined) {
            if (bridge.firstNode.id === node.id) {
                console.log('First point cannot be second point')
                setConsoleText([...consoleText, 'First point cannot be second point'])
            } else {
                bridge.secondNode = node

                if (isNaN(weight)) {
                    setConsoleText([...consoleText, 'Weight can only contain digits!'])
                } else {
                    calcLine()
                    setConsoleText([...consoleText, 'Calculating and drawing line with weight ' + weight + '...'])
                }
            }
        } else {
            console.log('Something went wrong')
            setConsoleText([...consoleText, 'First point cannot be second point'])
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
        createLine(lowerNode, upperNode, triangle, Number(weight))
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
        Prim(nodes, changeLineColor, changeNodeColor, delay, addConsoleLine)
    }

    const executeKruskal = () => {
        Kruskal(addConsoleLine)
    }

    const handleDelay = (delay) => {
        setDelay(delay.replace(/\D/g, ''))
    }

    const handleWeight = (weight) => {
        setWeight(weight.replace(/\D/g, ''))
    }

    return (
        <div className="field">
            {
                nodes.map(node => <Node x={node.x} y={node.y} id={node.id} key={node.id} color={node.color} createBridge={() => nodePress(node)} />)
            }
            {
                lines.map(line => <Line x={line.coords[0]} y={line.coords[1]} id={line.id} key={line.id} length={line.length} rotation={line.angle} color={line.color} weight={line.weight} />)
            }
            <div className="button-flex">
                <Button variant="primary" onClick={() => executePrim()} className='execute-prim'>Execute Prim algorithm</Button>
                <Button variant="primary" onClick={() => executeKruskal()} className='execute-kruskal'>Execute Kruskal algorithm</Button>
                <Button variant="primary" onClick={() => setConsoleText(['Console has been cleared'])} className='clear-console'>Clear console</Button>
                <Button variant="primary" onClick={() => clearField()} className='clear-field'>Clear field</Button>
                <InputGroup className='delay-input'>
                    <FormControl placeholder='Delay' onChange={(e) => handleDelay(e.target.value)}></FormControl>
                    <InputGroup.Text>ms</InputGroup.Text>
                </InputGroup>
                <InputGroup>
                    <FormControl placeholder='Weight' onChange={(e) => handleWeight(e.target.value)}></FormControl>
                </InputGroup>
            </div>
            <Accordion defaultActiveKey='0'>
                <Accordion.Item eventKey='0'>
                    <Accordion.Header className='console-text'>Console</Accordion.Header>
                    <Accordion.Body>
                        {
                            consoleText.map(row => <p className="console-text">{"> " + row}</p>)
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
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
