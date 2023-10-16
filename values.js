//Operations with the data
const values = [
    {city: "Adana", men: 97, women: 34},
    {city: "Antalya", men: 118, women: 38},
    {city: "Ankara", men: 218, women: 59},
    {city: "Bursa", men: 113, women: 33},
    {city: "Gaziantep", men: 63, women: 26},
    {city: "Istanbul", men: 405, women: 103},
    {city: "Izmir", men: 165, women: 41},
    {city: "Kocaeli", men: 74, women: 18},
    {city: "Konya", men: 79, women: 23},
    {city: "Sanliurfa", men: 44, women: 22},
].sort(function(a, b) {return a.city.localeCompare(b.city)});

const totalSuicidesMen = 3111;
const totalSuicidesWomen = 1035;

values.forEach(function(d) {
    d["totalRatio"] = ((d.men + d.women) / (totalSuicidesMen + totalSuicidesWomen) * 100).toPrecision(2);
    d["genderRatio"] = (d.men/d.women).toPrecision(2);
});

//Bars
const maxValue = Math.max(...values.map(d => d.totalRatio));

const plotHeight = 450;
const xStart = 10;
const barSpacing = 42;
const yAxisGroup = document.querySelector('.y.axis');
        
values.forEach(function(d, i) {
    d["height"] = d.totalRatio / maxValue * plotHeight;
    d["y"] = plotHeight - d.height;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("class", "bar");
    rect.setAttribute("x", xStart + i * barSpacing); 
    rect.setAttribute("y", d.y);
    rect.setAttribute("width", 31);
    rect.setAttribute("height", d.height);
    yAxisGroup.parentNode.insertBefore(rect, yAxisGroup.nextSibling);
});

//Axes
const xAxisGroup = document.querySelector('.x.axis');
values.forEach(function(d, index) {
    const tickGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const tickText = document.createElementNS("http://www.w3.org/2000/svg", "text");

    tickLine.setAttribute("y2", "6");
    tickLine.setAttribute("x2", "0");

    tickText.setAttribute("dy", ".71em");
    tickText.setAttribute("y", "9");
    tickText.setAttribute("x", "0");
    tickText.setAttribute("style", "text-anchor: middle;");
    tickText.textContent = d.city;

    tickGroup.appendChild(tickLine);
    tickGroup.appendChild(tickText);

    const xPosition = 25.5 + barSpacing * index;
    tickGroup.setAttribute("transform", `translate(${xPosition},0)`);

    xAxisGroup.appendChild(tickGroup);
});

// Y axis
const numIntervals = 12; 
const intervalValue = maxValue / (numIntervals - 1);
const yValues = Array.from({ length: numIntervals }, (value, index) => (intervalValue * index).toPrecision(2) + "%").reverse();
const verticalSpacing = plotHeight / (numIntervals - 1);

yValues.forEach(function (yValue, index) {
    const tickGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const tickText = document.createElementNS("http://www.w3.org/2000/svg", "text");

    tickLine.setAttribute("x2", "-6");
    tickLine.setAttribute("y2", "0");

    tickText.setAttribute("dy", ".32em");
    tickText.setAttribute("x", "-9");
    tickText.setAttribute("y", "0");
    tickText.setAttribute("style", "text-anchor: end;");
    tickText.textContent = yValue;

    const yPosition = verticalSpacing * index;

    tickGroup.setAttribute("transform", `translate(0,${yPosition})`);

    tickGroup.appendChild(tickLine);
    tickGroup.appendChild(tickText);

    yAxisGroup.appendChild(tickGroup);
});


// Gender line
const linePath = document.querySelector(".gender-line");
const tickMarks = document.querySelector(".tick-marks");

const pathData = values.map((d, i) => {
    const x = 25.5 + i * barSpacing; 
    const y = 420 - d.genderRatio * 80;

    const tickMark = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    tickMark.setAttribute("cx", x);
    tickMark.setAttribute("cy", y);
    tickMark.setAttribute("r", 3); 
    tickMark.setAttribute("fill", "black"); 

    tickMarks.appendChild(tickMark);

    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
});

linePath.setAttribute("d", pathData.join(" "));

for (let i = 0; i < values.length; i++) {
    const rightTickGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const rightTickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const rightTickText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    let v = 420 - values[i].genderRatio * 80;

    rightTickLine.setAttribute("x2", "420");
    rightTickLine.setAttribute("x1", "410");
    rightTickLine.setAttribute("y2", "0");
    rightTickText.setAttribute("dy", ".32em");
    rightTickText.setAttribute("x", "438");
    rightTickText.setAttribute("y", "0");
    rightTickText.setAttribute("style", "text-anchor: end;");
    rightTickText.textContent = values[i].genderRatio;

    rightTickGroup.setAttribute("transform", `translate(0,${v})`);

    rightTickGroup.appendChild(rightTickLine);
    rightTickGroup.appendChild(rightTickText);
    yAxisGroup.appendChild(rightTickGroup);
}

