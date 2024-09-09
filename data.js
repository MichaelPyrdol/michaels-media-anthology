function convertToObjects(data) {
    const headers = data[0]; // First row of the dataset is data keys
    const rows = data.slice(1);
    const objects = [];
    rows.forEach(row => {
        let rowData = {};
        headers.forEach((header, index) => {
            rowData[header] = row[index];
        });
        objects.push(rowData);
    });
    return objects;
}
function initializeObject(medium) {
    const dataStructure = {};
    datasetIDs.forEach(dataset => {
        dataStructure[dataset] = {};
        medium.forEach(category => {
            dataStructure[dataset][category] = [];
        });
    });
    return dataStructure;
}
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4')
        .then(() => {
            console.log("GAPI client loaded for API");
            const albumPromises = rangeso.map(range => fetchData(range, albumRange));
            const songPromises = rangeso.map(range => fetchData(range, songRange));
            return Promise.all([
                Promise.all(albumPromises),
                Promise.all(songPromises)
            ]);
        })
        .then(([albumDataArrays, songDataArrays]) => {
            rangeso.forEach((range, index) => {
                const albumData = albumDataArrays[index];
                const songData = songDataArrays[index];
                processAlbumData(albumData, range.toLowerCase());
                processSongData(songData, range.toLowerCase());
            });
            const combinedAlbumData = removeHeadersFromData(albumDataArrays);
            const combinedSongData = removeHeadersFromData(songDataArrays);
            processAlbumData(combinedAlbumData, 'combined');
            processSongData(combinedSongData, 'combined');
        })
        .catch((error) => {
            console.error("Error loading GAPI client or processing data", error);
        });
}
function fetchData(dataset, range) {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: dataset + range,
    })
        .then((response) => {
            const values = response.result.values;
            if (values && values.length > 0) {
                const datasetColIndex = values[0].length;
                values[0].push("dataset");
                values.forEach((row, index) => {
                    if (index > 0) {
                        row[datasetColIndex] = dataset;
                    }
                });
            }
            return values;
        })
        .catch((error) => {
            console.error("Error fetching data: ", error.result.error.message);
            throw error;
        });
}
function removeHeadersFromData(dataArrays) {
    const combinedData = [];
    let isFirstRange = true;
    dataArrays.forEach(data => {
        if (!isFirstRange) {
            data.shift();
        }
        combinedData.push(...data);
        isFirstRange = false;
    });
    return combinedData;
}
function checkAllChartsReady() {
    const numCharts =
        // 546
    datasets.length * chartTypes.length * albumSubCategories.length + // Album durations / era
    datasets.length * nominalChartTypes.length * albumSubCategories.length + // Album artist / stats
    datasets.length * albumSubCategories.length + // Pie charts
    datasets.length * songSubCategories.length + // Song era
    datasets.length * songSubCategories.length + // Song stats
    datasets.length * nominalSongChartTypes.length*songSubCategories.length // Song artist / origin / platform
    console.log(chartsReadyCount)
    console.log(numCharts)
    // const progressBar = document.getElementById('progress-bar')
    // progressBar.max = numCharts
    // progressBar.value = chartsReadyCount
    if (chartsReadyCount == numCharts) {
        console.log('done')
        datasetIDs.forEach(dataset => {
            fixStats(dataset);
            fixView(dataset);
        })
    }
}
function fixView(dataset) {
    albumSubCategories.slice(1).forEach(subcategory => {
        albumElementIDs.forEach(elem => {
            document.getElementById(dataset + "_" + elem + "_" + subcategory.suffix).style.display = 'none'
        });
    })
    songSubCategories.slice(1).forEach(subcategory => {
        songElementIDs.forEach(elem => {
            document.getElementById(dataset + "_" + elem + "_" + subcategory.suffix).style.display = 'none'
        });
    })
    albumTabSections.forEach(albumTabSection => {
        document.getElementById(dataset + "_albums_" + albumTabSection).style.display = 'none'
    })
    songTabSections.forEach(songTabSection => {
        document.getElementById(dataset + "_songs_" + songTabSection).style.display = 'none'
    })
    document.getElementById(dataset + "_songs").style.display = 'none'
    document.querySelector('.albums_' + albumTabSections[0]).classList.add('active')
    document.querySelector('.songs_' + songTabSections[0]).classList.add('active')
    document.getElementById(dataset + "_albums_" + albumTabSections[0]).style.display = 'block'
    document.getElementById(dataset + "_songs_" + songTabSections[0]).style.display = 'block'
    document.getElementById(datasetIDs[0]).style.display = 'block'
    document.getElementById(dataset).style.display = 'none';
}
function chartStuff(dataset, chartType, cats, index, subcategory) {
    let chartData = [];
    subcategory.id.forEach(ids => {
        chartData.push(cats[index][dataset][ids])
    })
    const chartArea = document.getElementById(dataset + "_" + chartType.id + "_chart_" + subcategory.suffix)
    if (chartData.every(item => item.length == 0)) {
        chartArea.innerHTML = 'No data!'
        chartsReadyCount++;
        checkAllChartsReady();
    } else {
        const chartElem = new google.visualization.ColumnChart(chartArea);
        google.visualization.events.addListener(chartElem, 'ready', function () {
            chartsReadyCount++;
            checkAllChartsReady();
        });
        drawChart(
            chartElem,
            chartData,
            chartType.title,
            chartType.x_axis,
            subcategory.labels,
            subcategory.colors
        );
    }
}
function nominalChart(dataset, chartType, cats, index, subcategory) {
    const frequencyMaps = [];
    subcategory.id.forEach(id => {
        const data = cats[index][dataset][id];
        frequencyMaps.push(countFrequencies(data));
    });
    const chartArea = document.getElementById(dataset + '_' + chartType.id + '_chart_' + subcategory.suffix)
    if (frequencyMaps.every(item => Object.keys(item).length == 0)) {
        chartArea.innerHTML = 'No data!'
        chartsReadyCount++;
        checkAllChartsReady();
    } else {
        const sortedElements = Array.from([...new Set(cats[index][dataset].all)]).sort((a, b) => {
            const totalFreqA = frequencyMaps.reduce((sum, map) => sum + (map[a] || 0), 0);
            const totalFreqB = frequencyMaps.reduce((sum, map) => sum + (map[b] || 0), 0);
            return totalFreqB - totalFreqA;
        });
        const chartData = [["Artist", ...subcategory.labels]];
        sortedElements.forEach(element => {
            const row = [element];
            frequencyMaps.forEach(frequencyMap => {
                row.push(frequencyMap[element] || 0);
            });
            chartData.push(row);
        });
        const chart = new google.visualization.BarChart(chartArea);
        google.visualization.events.addListener(chart, 'ready', function () {
            chartsReadyCount++;
            checkAllChartsReady();
        });
        drawNominalChart(chart, chartData, chartType.title, subcategory.colors);
    }
}
function pieChart(dataset, chartType, section, subcategory) {
    const chartData = [['Array', 'Length']];
    subcategory.id.forEach((id, index) => {
        chartData.push([subcategory.labels[index], section[dataset][id].length]);
    });
    const chartElem = new google.visualization.PieChart(document.getElementById(dataset + "_" + chartType.id + "_pieChart_" + subcategory.suffix));
    google.visualization.events.addListener(chartElem, 'ready', function () {
        chartsReadyCount++;
        checkAllChartsReady();
    });
    drawPieChart(
        chartElem,
        chartData,
        chartType.title,
        subcategory.labels,
        subcategory.colors
    );
}
function countFrequencies(arr) {
    return arr.reduce((acc, index) => {
        acc[index] = (acc[index] || 0) + 1;
        return acc;
    }, {});
}
function chartStats(dataset, chartType, cats, index, subcategory) {
    const stats = document.getElementById(dataset + "_" + chartType.id + "_chartStats_" + subcategory.suffix);
    let HTMLcontent = `
        <table>
            <tr>
                <th></th>
                <th>All</th>`
    subcategory.abbrev.forEach(label => {
        HTMLcontent += '<th>' + label + '</th>'
    })
    HTMLcontent += '</tr>'
    let rows = '';
    statTypes.forEach(statType => {
        rows += `
        <tr>
            <td>${statType.label}</td>`
        rows += `<td id="${dataset}_${chartType.id}_${statType.abbrev}_${subcategory.suffix}_all">${statType.func(cats[index][dataset].all)}</td>`
        subcategory.id.forEach(label => {
            rows += `<td id="${dataset}_${chartType.id}_${statType.abbrev}_${label}">${statType.func(cats[index][dataset][label])}</td>`
        })
        rows += `</tr>`;
    })
    HTMLcontent += rows + `</table>`
    stats.innerHTML = HTMLcontent;
}