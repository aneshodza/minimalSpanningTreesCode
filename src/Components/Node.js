export default function Node(props) {

    return (
        <span className="node" style={{top: props.y, left: props.x, backgroundColor: props.color}} onClick={props.createBridge} >
        </span>
    )
}