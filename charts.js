const chartTitleFontSize = 20;
function determineFullRange(valueArrays, x_axis) {
    const allValues = valueArrays.flat();
    let min;
    let max;
    if (x_axis == 'Year') {
        min = 1924;
        max = 2024;
    } else if (x_axis == 'Decade') {
        min = 1920;
        max = 2020;
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
        legend: {
            position: 'left',
            alignment: 'center'
        },
        colors: colors,
        backgroundColor: "lightblue",
        chartArea: { width: '100%' },
    };
    chart.draw(data, options);
}
function drawChart(chart, valueArrays, title, x_axis, labels, colors) {
    let fullRange = determineFullRange(valueArrays, x_axis);
    if (title.split(' ')[2] == 'Decade') {
        fullRange = fullRange.map(year => Math.floor(year / 10) * 10);
        fullRange = [...new Set(fullRange)];
    }
    const dataArray = [[x_axis, ...labels]];
    fullRange.forEach(value => {
        const row = [value.toString()];
        valueArrays.forEach(valueArray => {
            if (title.split(' ')[2] == 'Decade') {
                valueArray = valueArray.map(year => Math.floor(year / 10) * 10)
            }
            row.push(getDistribution(valueArray, fullRange)[value]);
        });
        dataArray.push(row);
    });
    let maxValue = ''
    let vAxisTitle = ''
    if (title == 'Songs by Year') {
        maxValue = 120;
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
        legend: {
            position: 'top'
        },
        isStacked: true,
        colors: colors,
        backgroundColor: "lightblue",
        chartArea: { width: '80%' },
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
        hAxis: {
            title: '# of Albums',
            minValue: 0,
            textStyle: {
                fontSize: 11
            }
        },
        vAxis: {
            title: 'Artist'
        },
        legend: {
            position: 'top'
        },
        isStacked: true,
        colors: colors,
        backgroundColor: "lightblue",
        chartArea: { width: '40%', height: '80%' },
    };
    chart.draw(data, options);
}