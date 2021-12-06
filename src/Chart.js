import React, { useEffect, useRef, useState } from 'react'
import data from './IBM'

//global to set the color of the background of the chart
const start_background_color = "white";

/**
 * Function that creates the X Axis on the canvas
 * @param {integer} numXticks - The number of tick marks along the x axis
 * @param {integer} tickSpacing - the calculated distance between the ticks based on the data point and size of chart on y axis
 * @param {integer} xTickSpacing - the calculated distance between the ticks based on the data point and size of chart on x axis 
 * @param {Object} ctx - the context of the canvas
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
 * Function to draw the x ticks on the graph
 * @param {integer} startDate - starting date index for the chart data to be displayed, can be set by user in date picker input
 * @param {integer} endDate - ending date index for the chart data
 * @param {integer} numYticks - number of y data points being displayed
 * @param {integer} numXTicks - number of x data points being displayed
 * @param {integer} tickSpacing - spacing of y axis tick marks
 * @param {integer} xTickSpacing - spacing of x axis tick marks
 * @param {Object} ctx - context object for the canvas
 * @param {integer} yOffset - distance from the lift bound of the canvas to start the chart
 * @param {string} data - string of the data supplied to the application containing both date and average information
 */
const drawXticks =(startDate, endDate,numYticks, numXTicks, tickSpacing, xTickSpacing, ctx,  yOffset, data) =>{
    //Creating a data array from the data based on the string provided and only returning the data for the selected range
    const dataArr = data.split(',').splice(endDate,numYticks+1);
    //additional iterative value
    let position = 0;
    //loop to plot all the date on the x axis
    for(let i = 0; i<=numYticks; i++){
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        
        ctx.moveTo(tickSpacing*position+yOffset, xTickSpacing * numXTicks);
        ctx.lineTo(tickSpacing*position+yOffset, xTickSpacing * numXTicks+xTickSpacing);
        ctx.stroke();

        //setting the data label
        ctx.font= '10px Arial';
        ctx.translate(tickSpacing*position+yOffset, xTickSpacing * numXTicks+ xTickSpacing);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign='right';
        ctx.fillStyle = '#000000';

        //writing date data to chart
        let dataLabel = dataArr[numYticks - i].split("\t")[0].split('-');
        //reformated date string
        let finalLabel = `${dataLabel[1]}-${dataLabel[2]}-${dataLabel[0]}`;
        ctx.fillText(finalLabel, 0,0);
        
        //using transform required resetting the base of the context to 0
        ctx.setTransform(1,0,0,1,0,0);
        position += 1;
    }
}

/**
 * function to draw the y axis on the chart
 * @param {integer} numYticks - number of y axis values to plot
 * @param {integer} tickSpacing - spacing between the data points on the chart calculated from range values
 * @param {Object} ctx - current context of canvas
 * @param {integer} h - height of canvas
 * @param {integer} w - width of canvas
 * @param {integer} yOffset - distance from left bound of canvas to start drawing
 * @param {integer} xTickSpacing - distance between the x values on the graph
 */
const drawYAxis =(numYticks, tickSpacing, ctx, h,w, yOffset, xTickSpacing)=>{
    //semi responsive solution to the graph label that calculates font size off of width of canvas
    const fontHeight = (h*.05);
    //Drawing graph label
    ctx.font= `${fontHeight}px Arial`;
    ctx.textAlign='right';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Date`, w*.5,h*.95);

    //loop to draw all lines for y axis
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
/**
 * Function to draw the y tick data
 * @param {integer} numYticks - number of y axis data points to plot
 * @param {integer} tickSpacing - y axis spacing between the ticks on the graph
 * @param {Object} ctx - context object for current canvas
 * @param {integer} w - width of canvas
 * @param {integer} dataReduction - value calculated to reduce the scale of the graph to help visualize changes better
 * @param {integer} xTickSpacing - x axis tick spacing value
 */

const drawYTicks =(numYticks, tickSpacing, ctx, w, dataReduction, xTickSpacing) =>{
    //Font height based on chart width
    const fontHeight = w*.03;
    //Chart label
    ctx.font= `${fontHeight}px Arial`;
    ctx.textAlign='right';
    ctx.fillStyle = '#000000';
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-w*.2, 30)
    ctx.fillText(`Closing($)`, 0,0)
    ctx.rotate(Math.PI / 2)
    ctx.setTransform(1,0,0,1,0,0);
    //Lopp to draw data points and ticks
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
/**
 * Function get the closing price data
 * @param {string} data - the string of data provided by the system
 * @returns {array} - array of the closing price data from the data string
 */
const parseData = (data)=>{
    let numData = data.split(',').map((dataLine)=>(
        Number(dataLine.split('\t')[1])
    )).sort()
    
    return numData
}

/**
 * Function to returs the dates from the data string
 * @param {string} data - data string
 * @returns {array} - array of the dates from the data 
 */
const returnDates = (data)=>{
    let dateData = data.split(',').map((dataLine)=>(
        dataLine.split('\t')[0]
    ))
    
    return dateData
}

/**
 * Function to return the index of the supplied date in the array of the data provided
 * @param {string} date - date that is selected by the user
 * @param {array} dateArray - array of date data 
 * @returns {integer} - the index of the provided date
 */
const indexDate=(date, dateArray)=>{
    return dateArray.indexOf(date)
}
/**
 * Function to draw the  data onto the  chart
 * @param {string} data - data string from IBM.js
 * @param {integer} endDate - last date of the range
 * @param {integer} numDates - number of data points to plot
 * @param {integer} tickSpacing - space between the Y axis ticks
 * @param {Object} ctx - current canvas context
 * @param {integer} h - height of canvas
 * @param {integer} yOffset - distance from left bound of the canvas to start plotting
 * @param {integer} dataReduction - resizing the graph to show more detail during small changes
 * @param {integer} resolution - the pixels between data points
 * @returns 
 */

const drawData = (data,endDate,numDates, tickSpacing, ctx, h, yOffset, dataReduction, resolution)=>{
    //change data to an array and select only the items required for charting
    let inputDataArr = data.split(',')
    let dataArr = inputDataArr.splice(endDate, numDates+1)
    //Move the context start to the bottom left of the graph 
    ctx.translate(yOffset, (h*.8));
    let position = 0
    //loop to plot data points
    for (let i = numDates; i>=0; i--){
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle ="#000000"
        
        if(i === 0){
            return
        }
        let currentParameter = Number(dataArr[i].split('\t')[1].substr(0,6))
        let nextParameter = Number(dataArr[i-1].split('\t')[1].substr(0,6))

        ctx.moveTo(tickSpacing*position,-( currentParameter-dataReduction) * resolution)
        ctx.lineTo(tickSpacing*(position+1), -(nextParameter-dataReduction) *resolution)
        ctx.stroke()
        position += 1

    }
}

/**
 * Chart component rendered for the application
 * @returns {Component}
 */
const Chart =()=>{

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const canvasContainer = useRef(null);
    const [isReset, setIsReset] = useState();
    const [startDate, setStartDate] = useState(20);
    const [endDate, setEndDate] = useState(0);
    const [numDays, setNumDays] = useState(20);
    const [dateAlert, setDateAlert] = useState(false);
    const [dataDates, setDataDates] = useState([]);
    //Canvas rendered immediately upon load 
    //This will rerender every time the isReset value changes 
    useEffect(() => {
        console.log(numDays);
        setIsReset(false);

        //Construct initial canvas
        const canvas = canvasRef.current;
        canvas.width = canvasContainer.current.offsetWidth * .6;
        canvas.height = canvasContainer.current.offsetWidth * .4;
        canvas.style.width = `${canvas.width}px`;
        canvas.style.height = `${canvas.height}px`;

        const context = canvas.getContext("2d");

        context.fillStyle = start_background_color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const dataArray = parseData(data);
        const dates = returnDates(data);
        setDataDates(dates);
        const dataRange = Math.floor(dataArray[dataArray.length-2] - dataArray[0] ); //finding the range between top and bottom values
        const dataReduction = Math.floor(dataArray[dataArray.length -2] - dataRange); //finding the reduction in each element to help increase the resolution on the graph
        const resolution = Math.floor(canvas.height*.8 / dataRange); // how many pixels per data unit should be rendered for each value
        let tickSpacing = resolution; //Sets the y axis tick spacing
        const numXticks = Math.floor(canvas.height* .8 /tickSpacing);
        const numYticks = numDays;
        const yTickSpacing = Math.floor(canvas.width*.9/numYticks);
        //const numYticks = Math.floor(canvas.width * .9 / tickSpacing)
        const yOffset = canvas.width*.1;
        
        //draw and graph the chart
        drawXAxis(numXticks, tickSpacing,yTickSpacing, context, canvas.width);
        drawYAxis(numYticks, yTickSpacing, context, canvas.height, canvas.width, yOffset,tickSpacing);
        drawXticks(startDate, endDate, numYticks, numXticks, yTickSpacing, tickSpacing, context, yOffset, data);
        drawYTicks(numXticks,tickSpacing,context,canvas.width, dataReduction, yTickSpacing);
        drawData(data, endDate, numDays, yTickSpacing,context,canvas.height,yOffset, dataReduction, resolution);

        contextRef.current = context;
    }, [isReset]);

    /**
     * Function to handle the change of dates by the user in the date inputs
     * @param {Object} evt - event object handed by the change in the input 
     * @param {boolean} type - value to check for end vs start date  
     * @returns {void}
     */
    const _handleDateChange=(evt,type)=>{
        if (type && evt.target.value > startDate){
            setDateAlert(true);
            return;
        }else {
            setDateAlert(false);
            let index = indexDate(evt.target.value, dataDates);
            type ? setEndDate(index) : setStartDate(index);
        }
    };
    /**
     * Function to update chart after user has updated the dates in the date picker
     * @param {Object} evt - evt from button press 
     * @returns 
     */
     const _handleUpdateDateRange=(evt)=>{
        evt.preventDefault()
        setNumDays(startDate - endDate)
        setIsReset(true)
    }
    /**
     * Function to update the chart when a user puts in a new number of days
     * @param {Object} evt - input value captured by the update event
     * @returns 
     */
    const _handleDateInput =(evt) =>{
        if(!evt.target.value){
            return
        }
        setNumDays(evt.target.value)
        setStartDate(evt.target.value)
        setEndDate(0)
        setIsReset(true)
    }
    /**
     * Function to update chart when a preset button is pressed
     * @param {integer} num - number of days based on the preset button values.
     */
    const _handlePresetDates=(num)=>{
        setNumDays(num)
        setStartDate(num)
        setEndDate(0)
        setIsReset(true)
    }
    return (
        <>
            <div>
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
                        </div>
                    </div>
                </div> 
            </div>
        </>
    )
}

export default Chart