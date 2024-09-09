const chartTitleFontSize = 20;
function determineFullRange(valueArrays, x_axis) {
    const allValues = valueArrays.flat();
    let min;
    let max;
    if (x_axis == 'Year') {
        min = 1924;
        max = 2024;
    } else {
        min = Math.min(...allValues);
        max = Math.max(...allValues);
    }
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
    const fullRange = determineFullRange(valueArrays, x_axis);
    const dataArray = [[x_axis, ...labels]];
    fullRange.forEach(value => {
        const row = [value.toString()];
        valueArrays.forEach(valueArray => {
            row.push(getDistribution(valueArray, fullRange)[value]);
        });
        dataArray.push(row);
    });
    let maxValue = ''
    let vAxisTitle = ''
    if (title == 'Songs by Year') {
        maxValue = 80;
        vAxisTitle = '# of Songs';
    } else if (title == 'Albums by Year') {
        maxValue = 10;
        vAxisTitle = '# of Albums';
    }
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
            title: vAxisTitle,
            maxValue: maxValue
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
function drawNominalChart(chart, dataArray, title, colors) {
    const limitedDataArray = [dataArray[0], ...dataArray.slice(1, 31)];
    const data = google.visualization.arrayToDataTable(limitedDataArray);
    const options = {
        title: title,
        titleTextStyle: {
            fontSize: chartTitleFontSize
        },
        chartArea: { width: '40%', height: '80%' },
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