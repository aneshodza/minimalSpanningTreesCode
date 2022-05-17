import { useState } from 'react'
import Node from './Node.js'
import { FindLineIndexById, Triangle, FindNodeIndexById } from './OtherFunctions.js'
import { Prim } from './Prim.js';
import Line from './Line.js';
import copyLines from './lines.json';
import copyNodes from './nodes.json';
import { Button, Accordion, InputGroup, FormControl } from 'react-bootstrap';
import Kruskal from './Kruskal.js';
import reactDom from 'react-dom';

var iPress; var dPress; var tPress
var mousePos;
var newNodeId = 0; var newLineId = 0;
var bridge = { firstNode: undefined, secondNode: undefined };

export default function Field() {
    const [nodes, setNodes] = useState([])
    const [lines, setLines] = useState([])
    const [consoleText, setConsoleText] = useState(['Console has been cleared'])
    const [delay, setDelay] = useState(1)
    const [weight, setWeight] = useState(50)
    const [real, setReal] = useState(false)

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
                bridge.firstNode = undefined
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
        console.log(weight)
        if (real) {
            newLine = { id: newLineId, node1: lowerNode.id, node2: upperNode.id, length: triangle.c, angle: triangle.beta, weight: Math.floor(triangle.c), coords: [lowerNode.x, lowerNode.y], color: undefined }
        }
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

    const changeWeight = (i) => {
        let temp = lines
        temp[i].weight = weight
        setLines([...temp])
        addConsoleLine(`Gave line new weight of ${weight}`)
    }

    const moveSingleNode = (i) => {
        let temp = nodes
        temp[i].x = mousePos.x
        temp[i].y = mousePos.y
        temp[i].lines.forEach(line => {
            let upperNode
            let lowerNode
            let node1
            let node2
            console.log(temp[i])
            console.log({node1: line.node1, node2: line.node2})
            if (line.node1 === temp[i].id) {
                node1 = temp[i]
                node2 = nodes[FindNodeIndexById(line.node2, nodes)]
            } else {
                node2 = temp[i]
                node1 = nodes[FindNodeIndexById(line.node1, nodes)]
            }
            console.log({node1: node1, node2: node2})
            if (node1.y > node2.y) {
                upperNode = node1
                lowerNode = node2
            } else {
                upperNode = node2
                lowerNode = node1
            }
            line.node1 = lowerNode.id
            line.node2 = upperNode.id
            let triangle = Triangle(upperNode, lowerNode)
            line.length = triangle.c
            line.angle = triangle.beta
            line.coords = [lowerNode.x, lowerNode.y]
        })
        setNodes([...temp])
    }

    const moveNode = (i) => {
        console.log(i)
        document.addEventListener('click', () => moveSingleNode(i), {once: true})
    }

    
    return (
        <div className="field">
            {
                nodes.map((node, i) =>
                    <Node x={node.x} y={node.y} id={node.id} key={node.id} color={node.color} createBridge={() => nodePress(node)} movenode={() => moveNode(i)}/>
                )
            }
            {
                lines.map((line, i) => 
                    <Line x={line.coords[0]} y={line.coords[1]} id={line.id} key={line.id} length={line.length} rotation={line.angle} color={line.color} weight={line.weight} changeweight={() => changeWeight(i)}/>
                )
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
                <div style={{display: 'flex', flexDirection: 'row'}}>
                <InputGroup>
                    <FormControl placeholder='Weight' onChange={(e) => handleWeight(e.target.value)}></FormControl>
                </InputGroup>
                </div>
                <div>
                    <input type="checkbox" name='real' onClick={() => setReal(!real)} />
                    <label for='real' style={{marginLeft: '5px'}}>Use real lengths</label>
                </div>
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
