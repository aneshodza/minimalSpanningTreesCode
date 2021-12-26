export default function Line(props) {
    return (
        <div className="line" style={{top: props.y+6, left: props.x+6, height: props.length, transform: `rotate(${props.rotation}deg)`, backgroundColor: props.color}}>

        </div>
    )
}