export default function Line(props) {
    return (
        <div className="line" style={{top: props.y+9, left: props.x+9, height: props.length, transform: `rotate(${props.rotation}deg)`, backgroundColor: props.color}}>
            <p style={{
                marginTop: `calc(${props.length+12}px/3)`,
                transform: props.rotation > 180 ? `rotate(${90}deg)` : `rotate(${270}deg)`,
                marginLeft: `${6-props.weight.toString().length*4}px`
            }}>
                {props.weight}
            </p>
        </div>
    )
}