function initializeObject() {
    const dataStructure = {};
    datasets.forEach(dataset => {
        dataStructure[dataset] = {};
        categories.forEach(category => {
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
            Object.keys(RANGES).forEach(rangeKey => {
                fetchSheetData([RANGES[rangeKey]], rangeKey);
            });
            fetchSheetData(Object.values(RANGES), "combined")
        }, (error) => {
            console.error("Error loading GAPI client for API", error);
        });
}
function fetchSheetData(ranges, dataset) {
    const requests = ranges.map((range) => {
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
        });
    });
    Promise.all(requests).then((responses) => {
        const dataArrays = responses.map(response => response.result.values);
        const combinedData = removeHeadersFromData(dataArrays);
        processData(combinedData, dataset);
    }).catch((error) => {
        console.error("Error: ", error.result.error.message);
    });
}
function removeHeadersFromData(dataArrays) {
    const combinedData = [];
    let isFirstRange = true;
    dataArrays.forEach(data => {
        if (!isFirstRange) {
            data.shift(); // Remove header if not the first range
        }
        combinedData.push(...data);
        isFirstRange = false; // Only the first range will include headers
    });
    return combinedData;
}
function processData(data, dataset) {
    albums[dataset].all = convertToObjects(data);
    albums[dataset].all.forEach(album => {
        let avg_song_duration = (album.duration / album.num_songs).toFixed(1);
        album.avg_song_duration = avg_song_duration;
    });
    albums[dataset].nonfav = albums[dataset].all.filter(album => album.fav == "");
    albums[dataset].fav = albums[dataset].all.filter(album => album.fav == "F");
    albums[dataset].v = albums[dataset].all.filter(album => album.vi == "V");
    albums[dataset].mv = albums[dataset].all.filter(album => album.vi == "MV");
    albums[dataset].m = albums[dataset].all.filter(album => album.vi == "M");
    albums[dataset].mi = albums[dataset].all.filter(album => album.vi == "MI");
    albums[dataset].i = albums[dataset].all.filter(album => album.vi == "I");
    albums[dataset].solo = albums[dataset].all.filter(album => album.solo_group == "S");
    albums[dataset].group = albums[dataset].all.filter(album => album.solo_group == "G");
    albums[dataset].male = albums[dataset].all.filter(album => album.gender == "M");
    albums[dataset].female = albums[dataset].all.filter(album => album.gender == "F");
    categories.forEach(category => {
        album_artist[dataset][category] = albums[dataset][category].map(album => album.artist);
        album_title[dataset][category] = albums[dataset][category].map(album => album.title);
        album_years[dataset][category] = albums[dataset][category].map(album => album.year);
        num_songs[dataset][category] = albums[dataset][category].map(album => album.num_songs);
        duration[dataset][category] = albums[dataset][category].map(album => album.duration);
        avg_song_duration[dataset][category] = albums[dataset][category].map(album => album.avg_song_duration);
        nationality[dataset][category] = albums[dataset][category].map(album => album.nationality);
    });
    if (dataset == 'combined') {
        const combinedArt = document.getElementById('combined_artDiv')
        Object.keys(RANGES).forEach(range => {
            combinedArt.innerHTML += document.getElementById(range + '_artDiv').innerHTML
        })
    } else {
        // Generate album art
        album_title[dataset].all.forEach(title => {
            let fileName = title.replace(/:/g, '-');
            let imgElement = document.createElement('img');
            imgElement.src = `images/${dataset}/${fileName}.jpeg`;
            imgElement.alt = title;
            imgElement.onerror = () => {
                imgElement.src = `images/${dataset}/${title}.jpeg`;
            };
            document.getElementById(dataset + '_artDiv').appendChild(imgElement);
        });
    }
    let chartsReadyCount = 0;
    subCategories.forEach(subcategory => {
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
        rows += `
            <tr>
                <td># of Albums</td>
                <td>${albums[dataset].all.length}</td>`
        subcategory.id.forEach(label => {
            rows += `<td>${albums[dataset][label].length}</td>`
        })
        rows += `</tr>`;
        rows += `
            <tr>
                <td># of Songs</td>
                <td>${findSum(num_songs[dataset].all)}</td>`
        subcategory.id.forEach(label => {
            rows += `<td>${findSum(num_songs[dataset][label])}</td>`
        })
        rows += `</tr>`;
        rows += `
            <tr>
                <td># of Minutes</td>`
        const minutesAll = findSum(duration[dataset].all);
        rows += `<td>${minutesAll}</td>`
        subcategory.id.forEach(label => {
            const minutesID = findSum(duration[dataset][label]);
            rows += `<td>${minutesID}</td>`
        })
        rows += `</tr>`;
        rows += `
            <tr>
                <td># of Hours</td>
                <td>${Math.floor(minutesAll / 60)}h ${minutesAll % 60}m</td>`
        subcategory.id.forEach(label => {
            const minutesID = findSum(duration[dataset][label]);
            rows += `<td>${Math.floor(minutesID / 60)}h ${minutesID % 60}m</td>`
        })
        rows += `</tr>`;
        rows += `
            <tr>
                <td># of Days</td>
                <td>${(minutesAll / 60 / 24).toFixed(1)}</td>`
        subcategory.id.forEach(label => {
            const minutesID = findSum(duration[dataset][label]);
            rows += `<td>${(minutesID / 60 / 24).toFixed(1)}</td>`
        })
        rows += `</tr>`;
        rows += `
            <tr>
                <td># of Artists</td>
                <td>${[...new Set(album_artist[dataset].all)].length}</td>`
        subcategory.id.forEach(label => {
            rows += `<td>${[...new Set(album_artist[dataset][label])].length}</td>`
        })
        rows += `</tr>`;
        rows += `
            <tr>
                <td># of Nationalities</td>
                <td>${[...new Set(nationality[dataset].all)].length}</td>`
        subcategory.id.forEach(label => {
            rows += `<td>${[...new Set(nationality[dataset][label])].length}</td>`
        })
        rows += `</tr>`;
        HTMLcontent += rows + `</table>`
        HTMLcontent += `
            <table>
                <tr>
                    <th></th>
                    <th>All</th>`
        subcategory.abbrev.forEach(label => {
            HTMLcontent += '<th>' + label + '</th>'
        })
        let rows2 = ''
        rows2 += `
            <tr>
                <td>Top Artist</td>
                <td>${findMode(album_artist[dataset].all)}</td>`
        subcategory.id.forEach(label => {
            rows2 += `<td>${findMode(album_artist[dataset][label])}</td>`
        })
        rows2 += `</tr>`;
        rows2 += `
            <tr>
                <td>Top Nationality</td>
                <td>${findMode(nationality[dataset].all)}</td>`
        subcategory.id.forEach(label => {
            rows2 += `<td>${findMode(nationality[dataset][label])}</td>`
        })
        rows2 += `</tr>`;
        HTMLcontent += rows2 + `</table>`
        const stats = document.getElementById(dataset + "_stats_" + subcategory.suffix)
        stats.innerHTML += HTMLcontent;
        const chartData = [['Array', 'Length']];
        subcategory.id.forEach((id,index) => {
            chartData.push([subcategory.labels[index], albums[dataset][id].length]);
        });
        const chartElem = new google.visualization.PieChart(document.getElementById(dataset + "_num_albums_pieChart_" + subcategory.suffix));
        google.visualization.events.addListener(chartElem, 'ready', function () {
            chartsReadyCount++;
            checkAllChartsReady();
        });
        drawPieChart(
            chartElem,
            chartData,
            "# of Albums",
            subcategory.labels,
            subcategory.colors
        );
    })
    const cats = [album_years[dataset], num_songs[dataset], duration[dataset], avg_song_duration[dataset]];
    chartTypes.forEach((chartType, index) => {
        subCategories.forEach(subcategory => {
            let chartData = [];
            subcategory.id.forEach(ids => {
                chartData.push(cats[index][ids])
            })
            const chartElem = new google.visualization.ColumnChart(document.getElementById(dataset + "_" + chartType.id + "_chart_" + subcategory.suffix));
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
                rows += `<td id="${dataset}_${chartType.id}_${statType.abbrev}_all">${statType.func(cats[index].all)}</td>`
                subcategory.id.forEach(label => {
                    rows += `<td id="${dataset}_${chartType.id}_${statType.abbrev}_${label}">${statType.func(cats[index][label])}</td>`
                })
                rows += `</tr>`;
            })
            HTMLcontent += rows + `</table>`
            stats.innerHTML = HTMLcontent;
        })
    })
    subCategories.forEach(subcategory => {
        const frequencyMaps = [];
        subcategory.id.forEach(id => {
            const data = album_artist[dataset][id];
            frequencyMaps.push(countFrequencies(data));
        });
        const chartData = prepareChartData(frequencyMaps, subcategory.labels);
        const chart = new google.visualization.BarChart(document.getElementById(dataset + '_artist_chart_' + subcategory.suffix));
        google.visualization.events.addListener(chart, 'ready', function () {
            chartsReadyCount++;
            checkAllChartsReady();
        });
        drawArtistChart(chart, chartData, "Artists", subcategory.colors);
    })
    fixStats(dataset);
    function checkAllChartsReady() {
        if (chartsReadyCount == chartTypes.length * subCategories.length + 4 + 4) {
            document.getElementById(dataset).style.display = 'none';
        }
    }
    function countFrequencies(arr) {
        return arr.reduce((acc, index) => {
            acc[index] = (acc[index] || 0) + 1;
            return acc;
        }, {});
    }
    function prepareChartData(frequencyMaps, labels) {
        const sortedArtists = Array.from([...new Set(album_artist[dataset].all)]).sort((a, b) => {
            const totalFreqA = frequencyMaps.reduce((sum, map) => sum + (map[a] || 0), 0);
            const totalFreqB = frequencyMaps.reduce((sum, map) => sum + (map[b] || 0), 0);
            return totalFreqB - totalFreqA;
        });
        const dataArray = [["Artist", ...labels]];
        sortedArtists.forEach(artist => {
            const row = [artist];
            frequencyMaps.forEach(frequencyMap => {
                row.push(frequencyMap[artist] || 0);
            });
            dataArray.push(row);
        });
        return dataArray;
    }
    // Hiding sub-charts and sub-stats
    subCategories.slice(1).forEach(subcategory => {
        chartTypes.forEach(chartType => {
            const stats = document.getElementById(dataset + "_" + chartType.id + "_chartStats_" + subcategory.suffix);
            stats.style.display = 'none';
            const chart = document.getElementById(dataset + "_" + chartType.id + "_chart_" + subcategory.suffix);
            chart.style.display = 'none';
        });
        const chart = document.getElementById(dataset + "_artist_chart_" + subcategory.suffix);
        chart.style.display = 'none';
        const stats = document.getElementById(dataset + "_stats_" + subcategory.suffix);
        stats.style.display = 'none';
    })
    // Hiding tabs
    albumTabSections.forEach(albumTabSection => {
        const tab = document.getElementById(dataset + "_" + albumTabSection);
        tab.style.display = 'none';
    })
    const currentTab = document.getElementById(dataset + "_art")
    currentTab.style.display = 'block'
    const pop = document.getElementById("pop")
    pop.style.display = 'block'
}
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