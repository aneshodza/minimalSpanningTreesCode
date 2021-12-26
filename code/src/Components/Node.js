export default function Node(props) {

    return (
        <span className="node" style={{top: props.y, left: props.x, backgroundColor: props.color}} onClick={props.createBridge} >
            <p style={{color: 'black'}}>{props.id}</p>
        </span>
    )
}