const chartTitleFontSize=20;
function determineFullRange(valueArrays) {
    const allValues = valueArrays.flat();
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const hasDecimals = allValues.some(value => value % 1 !== 0);
    const step = hasDecimals ? 0.1 : 1;
    const fullRange = [];
    for (let i = min; i <= max; i += step) {
        const formattedValue = i % 1 !== 0 ? i.toFixed(1) : i.toString();
        fullRange.push(formattedValue);
    }
    return fullRange;
}
function getDistribution(valueArray, fullRange) {
    const valueCount = {};
    fullRange.forEach(value => {
        valueCount[value] = 0;
    });
    valueArray.forEach(value => {
        if (valueCount[value] != undefined) {
            valueCount[value]++;
        }
    });
    return valueCount;
}
function drawPieChart(chart, arrays, title, labels, colors) {
    const data = google.visualization.arrayToDataTable(arrays);
    const options = {
        title: title,
        titleTextStyle: {
            fontSize: 12
        },
        colors: colors,
        chartArea: { width: '40%' },
        legend: {
            position: 'top'
        },
        backgroundColor: "lightblue"
    };
    chart.draw(data, options);
}
function drawChart(chart, valueArrays, title, x_axis, labels, colors) {
    const fullRange = determineFullRange(valueArrays);
    const dataArray = [[x_axis, ...labels]];
    fullRange.forEach(value => {
        const row = [value.toString()];
        valueArrays.forEach(valueArray => {
            row.push(getDistribution(valueArray, fullRange)[value] || 0);
        });
        dataArray.push(row);
    });
    const data = google.visualization.arrayToDataTable(dataArray);
    const options = {
        title: title,
        titleTextStyle: {
            fontSize: chartTitleFontSize
        },
        chartArea: { width: '80%' },
        hAxis: {
            title: x_axis,
            minValue: 0,
            textStyle: {
                fontSize: 11
            },
            slantedText: true,
            slantedTextAngle: 90
        },
        vAxis: {
            title: '# of Albums',
            format: '0'
        },
        isStacked: true,
        legend: {
            position: 'top'
        },
        colors: colors,
        backgroundColor: "lightblue"
    };
    chart.draw(data, options);
}
function drawArtistChart(chart, dataArray, title, colors) {
    const data = google.visualization.arrayToDataTable(dataArray);
    const options = {
        title: title,
        titleTextStyle: {
            fontSize: chartTitleFontSize
        },
        chartArea: { width: '40%' },
        hAxis: {
            title: '# of Albums',
            minValue: 0,
            textStyle: {
                fontSize: 11
            }
        },
        vAxis: {
            title: 'Artist',
            format: '0'
        },
        isStacked: true,
        legend: {
            position: 'top'
        },
        colors: colors,
        backgroundColor: "lightblue"
    };
    chart.draw(data, options);
}