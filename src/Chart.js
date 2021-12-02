import React, { useEffect, useRef, useState } from 'react'



const start_background_color = "white"
const undo_array = []

const drawXAxis =(numXticks, tickSpacing, ctx, w)=>{
    console.log(numXticks)
    for(let i=0; i<=numXticks; i++) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        
        // If line represents X-axis draw in different color
        if(i === numXticks) {
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 5;
        } 
        else{
            ctx.strokeStyle = "#e9e9e9";
            ctx.lineWidth = 1;
        }
        
        if(i === numXticks) {
            ctx.moveTo(w*.1-tickSpacing, tickSpacing*i);
            ctx.lineTo(w, tickSpacing*i);
        }
        else {
            ctx.moveTo(w*.1-tickSpacing, tickSpacing*i+0.5);
            ctx.lineTo(w, tickSpacing*i+0.5);
        }
        ctx.stroke();
    }
}

const drawXticks =(numYticks, tickSpacing, ctx, h, yOffset, dataTag) =>{
    
    for(let i = yOffset; i<=numYticks+yOffset; i++){
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000'

        ctx.moveTo(tickSpacing*i, h*.8-tickSpacing*.5);
        ctx.lineTo(tickSpacing*i, (h*.8)+6);
        ctx.stroke()

        ctx.font= '10px Arial';
        ctx.translate(tickSpacing*i, (h*.8)+6)
        ctx.rotate(-Math.PI / 4)
        ctx.textAlign='right'
        ctx.fillStyle = '#000000'
        ctx.fillText(dataTag, 0,0)
        
        ctx.setTransform(1,0,0,1,0,0)
    }
}
const drawYAxis =(numYticks, tickSpacing, ctx, h, yOffset)=>{
    console.log(numYticks)
    for(let i=yOffset; i<=numYticks+yOffset; i++) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        
        // If line represents X-axis draw in different color
        if(i === yOffset) {
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 5;
        } 
        else{
            ctx.strokeStyle = "#e9e9e9";
            ctx.lineWidth = 1;
        }
        
        if(i === yOffset) {
            ctx.moveTo(tickSpacing*i,0);
            ctx.lineTo( tickSpacing*i, (h*.8));
        }
        else {
            ctx.moveTo(tickSpacing*i+0.5,0 );
            ctx.lineTo(tickSpacing*i+0.5, (h*.8)-5);
        }
        ctx.stroke();
    }
}

const openCSV = () =>{
    const file = './IBM.csv';
    const reader = new FileReader()

    reader.onload = function(e) {
        const textOutput = e.target.result
        console.log(textOutput)
    }

    reader.readAsText(file)
    
}

const Chart =()=>{

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const canvasContainer = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isReset, setIsReset] = useState()


    useEffect(() => {
        setIsReset(false)

        openCSV()

        const canvas = canvasRef.current;
        canvas.width = canvasContainer.current.offsetWidth * .6;
        canvas.height = canvasContainer.current.offsetWidth * .4;
        canvas.style.width = `${canvas.width}px`
        canvas.style.height = `${canvas.height}px`
        
        let tickSpacing = 10

        const context = canvas.getContext("2d")

        context.fillStyle = start_background_color;
        context.fillRect(0, 0, canvas.width, canvas.height);


        let numXticks = Math.floor(canvas.height* .8 /tickSpacing);
        let numYticks = Math.floor(canvas.width * .9 / tickSpacing)
        let yOffset = Math.floor(canvas.width /tickSpacing) - numYticks -1
        drawXAxis(numXticks, tickSpacing, context, canvas.width)
        drawYAxis(numYticks, tickSpacing, context, canvas.height, yOffset)
        drawXticks(numYticks, tickSpacing, context, canvas.height, yOffset, "data")
        
        contextRef.current = context
    }, [isReset])

    

    const leaveCanvas =()=>{
        setIsDrawing(false)
        contextRef.current.closePath()
    }

    const draw =({nativeEvent})=>{
        if (!isDrawing){
            return
        }
        const {offsetX, offsetY} = nativeEvent
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
    }


    const clearDrawing=(e)=>{
        e.preventDefault()
        setIsReset(true)
    }

    const undoLast = (evt) =>{
        evt.preventDefault()
        undo_array.pop();
        if(undo_array.length > 0){
            
            contextRef.current.putImageData(undo_array[undo_array.length-1], 0, 0);
            console.log(undo_array)
        }
        if(undo_array.length === 0){
            clearDrawing(evt)
        }
    }

    

    return (
        <>
            <div className="container px-4 mx-auto flex flex-wrap items-center justify-between"
            >
                <div className="canvas-holder rounded" ref={canvasContainer} >
                
                    <h1 className="header">
                        IBM 20-day Moving Average (Closing) 
                    </h1>
                    <canvas
                        ref={canvasRef}
                        className="canvas-screen"
                        
                    />
                    
                    <div className="button-bar">
                        <button onClick={(e)=>undoLast(e)} type="button" ></button>
                        <button onClick={(e)=>clearDrawing(e)} type="button" ></button>
                        
                        <button  type="button" ></button>
                    </div>
                </div> 
            </div>
        </>
    )
}

export default Chart