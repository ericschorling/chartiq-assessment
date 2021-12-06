import React, { useEffect, useRef, useState } from 'react'
import data from './IBM'

//global to set the color of the background of the chart
const start_background_color = "white"

/**
 * Function that creates the X Axis on the canvas
 * @param {integer} numXticks - The number of tick marks along the x axis
 * @param {integer} tickSpacing - the calculated distance between the ticks based on the data point and size of chart on y axis
 * @param {integer} xTickSpacing - the calculated distance between the ticks based on the data point and size of chart on x axis 
 * @param {object} ctx - the context of the canvas
 * @param {integer} w - width of the canvas
 */
const drawXAxis =(numXticks, tickSpacing, xTickSpacing, ctx, w)=>{
    for(let i=0; i<=numXticks; i++) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        
        // If line represents X-axis draw in different color
        if(i === numXticks) {
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 3;
        } 
        else{
            ctx.strokeStyle = "#e9e9e9";
            ctx.lineWidth = 1;
        }
        //Draw x axis with updated formating 
        if(i === numXticks) {
            ctx.moveTo(w*.1-tickSpacing, tickSpacing*i);
            ctx.lineTo(w, tickSpacing*i);
        }
        else {
            ctx.moveTo(w*.1-tickSpacing, tickSpacing*i);
            ctx.lineTo(w-((w*.1)-(xTickSpacing*numXticks)), tickSpacing*i+0.5);
        }
        ctx.stroke();
    }
}

/**
 * 
 * @param {integer} startDate - starting date index for the chart data to be displayed, can be set by user in date picker input
 * @param {integer} endDate - ending date index for the chart data
 * @param {integer} numYticks - number of y data points being displayed
 * @param {integer} numXTicks - number of x data points being displayed
 * @param {integer} tickSpacing - spacing of y axis tick marks
 * @param {integer} xTickSpacing - spacing of x axis tick marks
 * @param {object} ctx 
 * @param {integer} h 
 * @param {integer} yOffset 
 * @param {array} data 
 */
const drawXticks =(startDate, endDate,numYticks, numXTicks, tickSpacing, xTickSpacing, ctx, h, yOffset, data) =>{
    const dataArr = data.split(',').splice(endDate,numYticks+1)
    console.log(dataArr)
    console.log(numYticks, startDate, endDate)
    let position = 0
    for(let i = 0; i<=numYticks; i++){
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        
        ctx.moveTo(tickSpacing*position+yOffset, xTickSpacing * numXTicks);
        ctx.lineTo(tickSpacing*position+yOffset, xTickSpacing * numXTicks+xTickSpacing);
        ctx.stroke();
    
        ctx.font= '10px Arial';
        ctx.translate(tickSpacing*position+yOffset, xTickSpacing * numXTicks+ xTickSpacing);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign='right';
        ctx.fillStyle = '#000000';
        console.log(dataArr[numYticks-i])
        let dataLabel = dataArr[numYticks - i].split("\t")[0].split('-')
        let finalLabel = `${dataLabel[1]}-${dataLabel[2]}-${dataLabel[0]}`
        ctx.fillText(finalLabel, 0,0);
        
        ctx.setTransform(1,0,0,1,0,0);
        position += 1
    }
}
const drawYAxis =(numYticks, tickSpacing, ctx, h,w, yOffset, xTickSpacing)=>{
    const fontHeight = (h*.05)
    ctx.font= `${fontHeight}px Arial`;
    ctx.textAlign='right';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Date`, w*.5,h*.95)
    for(let i=0; i<=numYticks; i++) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        
        // If line represents X-axis draw in different color
        if(i === 0) {
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 5;
        } 
        else{
            ctx.strokeStyle = "#e9e9e9";
            ctx.lineWidth = 1;
        }
        
        if(i === yOffset) {
            ctx.moveTo(tickSpacing*i,0+xTickSpacing);
            ctx.lineTo( tickSpacing*i, (h*.8));
        }
        else {
            ctx.moveTo(tickSpacing*i+yOffset,0+xTickSpacing );
            ctx.lineTo(tickSpacing*i+yOffset, (h*.8));
        }
        ctx.stroke();
    }
}
const drawYTicks =(numYticks, tickSpacing, ctx, w, dataReduction, xTickSpacing) =>{
    const fontHeight = w*.03
    ctx.font= `${fontHeight}px Arial`;
    ctx.textAlign='right';
    ctx.fillStyle = '#000000';
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-w*.2, 30)
    ctx.fillText(`Closing($)`, 0,0)
    ctx.rotate(Math.PI / 2)
    ctx.setTransform(1,0,0,1,0,0);
    for(let i = 1; i<=numYticks; i++){
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        //ctx.translate( yOffset*tickSpacing, h*0.5);
        ctx.moveTo(w*.1-tickSpacing, tickSpacing*i);
        ctx.lineTo(w*.1+xTickSpacing/tickSpacing, tickSpacing*i);
        ctx.stroke();

        ctx.font= '10px Arial';
        ctx.textAlign='right';
        ctx.fillStyle = '#000000';
        ctx.fillText(`$${((numYticks-i) + dataReduction)}`, w*.1-tickSpacing, tickSpacing*i);
        
        ctx.setTransform(1,0,0,1,0,0);
    }
}
const parseData = (data)=>{
    let numData = data.split(',').map((dataLine)=>(
        Number(dataLine.split('\t')[1])
    )).sort()
    
    return numData
}
const returnDates = (data)=>{
    let dateData = data.split(',').map((dataLine)=>(
        dataLine.split('\t')[0]
    ))
    
    return dateData
}

const indexDate=(date, dateArray)=>{
    console.log(date)
    console.log(dateArray.indexOf(date))
    return dateArray.indexOf(date)
}

const drawData = (data,endDate, startDate, numDates, tickSpacing, ctx, h, yOffset, dataReduction, resolution)=>{
    let inputDataArr = data.split(',')
    let dataArr = inputDataArr.splice(endDate, numDates+1)
    console.log(dataArr)
    ctx.translate(yOffset, (h*.8));
    let position = 0
    for (let i = numDates; i>=0; i--){
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle ="#000000"
        
        if(i === 0){
            return
        }
        let currentParameter = Number(dataArr[i].split('\t')[1].substr(0,6))
        let nextParameter = Number(dataArr[i-1].split('\t')[1].substr(0,6))
        console.log(currentParameter,nextParameter, dataReduction, resolution)
        //i = datalength
        ctx.moveTo(tickSpacing*position,-( currentParameter-dataReduction) * resolution)
        ctx.lineTo(tickSpacing*(position+1), -(nextParameter-dataReduction) *resolution)
        ctx.stroke()
        position += 1

    }
}


const Chart =()=>{

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const canvasContainer = useRef(null)
    const [isReset, setIsReset] = useState()
    const [startDate, setStartDate] = useState(20)
    const [endDate, setEndDate] = useState(0)
    const [numDays, setNumDays] = useState(20)
    const [dateAlert, setDateAlert] = useState(false)
    const [dataDates, setDataDates] = useState([])
    
    useEffect(() => {
        console.log(numDays)
        setIsReset(false)


        const canvas = canvasRef.current;
        canvas.width = canvasContainer.current.offsetWidth * .6;
        canvas.height = canvasContainer.current.offsetWidth * .4;
        canvas.style.width = `${canvas.width}px`
        canvas.style.height = `${canvas.height}px`
        
        let tickSpacing = 20

        const context = canvas.getContext("2d")

        context.fillStyle = start_background_color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const dataArray = parseData(data)
        const dates = returnDates(data)
        setDataDates(dates)
        const dataRange = Math.floor(dataArray[dataArray.length-2] - dataArray[0] ) //finding the range between top and bottom values
        const dataReduction = Math.floor(dataArray[dataArray.length -2] - dataRange) //finding the reduction in each element to help increase the resolution on the graph
        const resolution = Math.floor(canvas.height*.8 / dataRange) // how many pixels per data unit should be rendered for each value
        tickSpacing = resolution
        const numXticks = Math.floor(canvas.height* .8 /tickSpacing);
        const numYticks = numDays
        const yTickSpacing = Math.floor(canvas.width*.9/numYticks)
        //const numYticks = Math.floor(canvas.width * .9 / tickSpacing)
        const yOffset = canvas.width*.1
        
        drawXAxis(numXticks, tickSpacing,yTickSpacing, context, canvas.width)
        drawYAxis(numYticks, yTickSpacing, context, canvas.height, canvas.width, yOffset,tickSpacing)
        drawXticks(startDate, endDate, numYticks, numXticks, yTickSpacing, tickSpacing, context, canvas.height, yOffset, data)
        drawYTicks(numXticks,tickSpacing,context,canvas.width, dataReduction, yTickSpacing)
        drawData(data, endDate, startDate, numDays, yTickSpacing,context,canvas.height,yOffset, dataReduction, resolution)

        contextRef.current = context
    }, [isReset])

    const _handleDateChange=(evt,type)=>{
        if (type && evt.target.value > startDate){
            setDateAlert(true);
            return;
        }else {
            setDateAlert(false);
            let index = indexDate(evt.target.value, dataDates)
            type ? setEndDate(index) : setStartDate(index);
            //setNumDays(startDate - endDate)
            console.log(startDate, endDate, numDays)
            //setIsReset(true)
        }
    };

    const _handleDateInput =(evt) =>{
        if(!evt.target.value){
            return
        }
        setNumDays(evt.target.value)
        setStartDate(evt.target.value)
        setEndDate(0)
        setIsReset(true)
    }
    const _handleUpdateDateRange=(evt)=>{
        evt.preventDefault()
        setNumDays(startDate - endDate)
        setIsReset(true)
    }
    const _handlePresetDates=(num)=>{
        setNumDays(num)
        setStartDate(num)
        setEndDate(0)
        setIsReset(true)
    }
    return (
        <>
            <div className="container px-4 mx-auto flex flex-wrap items-center justify-between"
            >
                <div className="rounded" ref={canvasContainer} >
                
                    <h1 className="header">
                        IBM Closing Price 20-day Moving Average
                    </h1>
                    <div className="canvas-container">
                        <canvas
                            ref={canvasRef}
                            className="canvas-screen"
                            
                        />  
                    </div>
            
                    
                    <div className="button-bar">
                        <div className="button-holder">
                            <input 
                                type="date"
                                min="2020-12-01"
                                max="2021-12-01"
                                id="date-start"
                                className='date-picker'
                                onChange={(evt)=>{_handleDateChange(evt)}}>
                            </input>
                            <input 
                                type="date"
                                min="2020-12-01"
                                max="2021-12-01"
                                id="date-start"
                                className={`date-picker ${dateAlert ? 'alert' : null}`}
                                onChange={(evt)=>{_handleDateChange(evt, true)}}>
                            </input>
                            <button onClick={(evt)=>_handleUpdateDateRange(evt)}>Update</button>
                            <label for="days-input">Enter Days to View</label>
                            <input type="text" id="days-input" onChange={(evt)=>{_handleDateInput(evt)}}></input>
                        </div>
                        <div className="button-holder">
                            <button onClick={(evt)=>{_handlePresetDates(5)}}>1 Week</button>
                            <button onClick={(evt)=>{_handlePresetDates(30)}}>1 Month</button>
                            <button onClick={(evt)=>{_handlePresetDates(90)}}>3 Months</button>
                            <button onClick={(evt)=>{_handlePresetDates(253)}}>All Time</button>
                        </div>
                    </div>
                </div> 
            </div>
        </>
    )
}

export default Chart