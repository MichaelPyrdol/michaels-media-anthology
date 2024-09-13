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
function initializeObject(medium, dataType) {
    const dataStructure = {};
    dataType.datasetIDs.forEach(dataset => {
        dataStructure[dataset] = {};
        medium.forEach(category => {
            dataStructure[dataset][category] = [];
        });
    });
    return dataStructure;
}
function initialization(mediumChartTypes, nominalMediumChartTypes, mediumCategories, dataType) {
    const mediumCats = []
    const bothChartTypes = [...mediumChartTypes, ...nominalMediumChartTypes]
    bothChartTypes.forEach(chartType => {
        mediumCats.push(chartType.id)
    })
    const mediumData = mediumCats.reduce((acc, category) => {
        acc[category] = initializeObject(mediumCategories, dataType);
        return acc;
    }, {});
    return mediumData;
}
function organizeData(dataset, medium, mediumName, mediumCats, nominalMediumCats, mediumChartTypes, nominalMediumChartTypes, mediumCategories, mediumSubCategories) {
    if (mediumName == 'albums') {
        medium[dataset].all.forEach(album => {
            let avg_song_duration = (album.duration / album.num_songs).toFixed(1);
            album.avg_song_duration = avg_song_duration;
            album.r = ''
            if (album.dataset == 'Pop' || album.dataset == 'Other') {
                album.origin = album.title
            }
        });
    } else if (mediumName == 'songs') {
        songs[dataset].all.forEach(song => {
            const matchingAlbum = albums[dataset].all.find(album =>
                album.year == song.year &&
                album.artist == song.artist &&
                album.origin == song.origin
            );
            if (matchingAlbum) {
                song.album = 'A';
            } else {
                song.album = ''
            }
        });
    }
    mediumSubCategories.forEach(subcategory => {
        subcategory.id.forEach((id, index) => {
            medium[dataset][id] = medium[dataset].all.filter(item => item[subcategory.suffix] == subcategory.identifier[index]);
        })
    })
    mediumCategories.forEach(category => {
        mediumCats.forEach((cat, index) => {
            cat[dataset][category] = medium[dataset][category].map(item => item[mediumChartTypes[index].sheetid]).filter(Boolean);
        })
        nominalMediumCats.forEach((cat, index) => {
            cat[dataset][category] = medium[dataset][category].map(item => item[nominalMediumChartTypes[index].sheetid]).filter(Boolean);
        })
    });
}
function createCharts(dataset, subcategory, medium, chartTypes, nominalChartTypes, pieChartTypes, cats, nominalCats, decades) {
    if (charts) {
        chartTypes.forEach((chartType, index) => {
            chartStuff(dataset, chartType, cats[index], subcategory)
            chartStats(dataset, chartType, cats[index], subcategory)
        })
        chartStuff(dataset, decades, cats[0], subcategory)
        nominalChartTypes.forEach((chartType, index) => {
            nominalChart(dataset, chartType, nominalCats[index], subcategory)
        })
        pieChartTypes.forEach((chartType, index) => {
            pieChart(dataset, chartType, medium, subcategory)
        })
    } else {
        fixView(dataset)
    }
}
function checkAllChartsReady(dataset) {
    const numCharts =
        albumSubCategories.length * albumChartTypes.length + // Album durations / era
        albumSubCategories.length + // Album decade
        albumSubCategories.length * nominalAlbumChartTypes.length + // Album artist / stats
        albumSubCategories.length * albumPieChartTypes.length + // Album pie charts
        songSubCategories.length * songChartTypes.length + // Song era
        songSubCategories.length + // Song decade
        songSubCategories.length * songPieChartTypes.length + // Song pie charts
        songSubCategories.length * nominalSongChartTypes.length + // Song artist / origin / platform
        allSubCategories.length * allChartTypes.length +
        allSubCategories.length + // All decades
        allSubCategories.length * nominalAllChartTypes.length +
        allSubCategories.length * allPieChartTypes.length
    console.log(chartsReadyCount)
    console.log(numCharts)
    // const progressBar = document.getElementById('progress-bar')
    // progressBar.max = numCharts
    // progressBar.value = chartsReadyCount
    if (chartsReadyCount == numCharts) {
        console.log('done')
        chartsReadyCount = 0;
        fixView(dataset, 'none');
        fixStats(dataset);
    }
}
function fixView(dataset, expandCollapse) {
    musicMediums.forEach((medium, index) => {
        let theSubcategories = subcategories[index]
        let theMusicTabSections = musicTabSections[index]
        if (expandCollapse == 'none') {
            theSubcategories = theSubcategories.slice(1)
            theMusicTabSections = theMusicTabSections.slice(1)
        }
        theSubcategories.forEach(subcategory => {
            elementIDs[index].forEach(elem => {
                document.getElementById(dataset + "_" + elem + "_" + subcategory.suffix).style.display = expandCollapse
            });
        })
        theMusicTabSections.forEach(tabSection => {
            document.getElementById(dataset + "_" + medium + "_" + tabSection).style.display = expandCollapse
        })
    })
    let theMusicMediums = musicMediums
    if (expandCollapse == 'none') {
        theMusicMediums = theMusicMediums.slice(1)
    }
    theMusicMediums.forEach(medium => {
        document.getElementById(dataset + "_" + medium).style.display = expandCollapse
    })
    document.getElementById(dataset).style.display = expandCollapse

}
function fixStats(dataset) {
    const generalElems = ['years_mean', 'years_median']
    musicMediums.forEach((medium, index) => {
        subcategories[index].forEach(subcategory => {
            subcategory.id.forEach(id => {
                generalElems.forEach(elem => {
                    const toRound = document.getElementById(dataset + "_" + medium + '_' + elem + '_' + id)
                    if (toRound.innerHTML != '-') {
                        toRound.innerHTML = Math.round(toRound.innerHTML);
                    }
                })
                const stdev = document.getElementById(dataset + "_" + medium + '_years_stdev_' + id)
                if (stdev.innerHTML != "-") {
                    stdev.innerText += ' years';
                }
            })
            generalElems.forEach(elem => {
                const roundAll = document.getElementById(dataset + "_" + medium + '_' + elem + '_' + subcategory.suffix + '_all')
                if (roundAll.innerHTML != '-') {
                    roundAll.innerHTML = Math.round(roundAll.innerHTML);
                }
            })
        })
    })
    const elemsToRound = ['num_songs_mean', 'num_songs_stdev']
    albumSubCategories.forEach(subcategory => {
        subcategory.id.forEach(id => {
            elemsToRound.forEach(elem => {
                const toRound = document.getElementById(dataset + "_" + elem + '_' + id)
                if (toRound.innerHTML != '-') {
                    toRound.innerHTML = Math.round(toRound.innerHTML);
                }
            })
            const num_songs_sum = findSum(num_songs[dataset][id]);
            const duration_sum = findSum(duration[dataset][id]);
            const avg_song_duration_mean = duration_sum / num_songs_sum;
            const avg_song_duration_mean_elem = document.getElementById(dataset + '_avg_song_duration_mean_' + id);
            if (avg_song_duration_mean_elem.innerHTML != '-') {
                avg_song_duration_mean_elem.innerText = avg_song_duration_mean.toFixed(1);
            }
            albumChartTypes.slice(1).forEach(chartType => {
                const stdev = document.getElementById(dataset + "_" + chartType.id + '_stdev_' + id)
                if (stdev.innerHTML != "-") {
                    stdev.innerText += ' ' + chartType.units;
                }
            })
        })
        elemsToRound.forEach(elem => {
            const roundAll = document.getElementById(dataset + "_" + elem + "_" + subcategory.suffix + '_all')
            if (roundAll.innerHTML != '-') {
                roundAll.innerHTML = Math.round(roundAll.innerHTML);
            }
        })
        albumChartTypes.slice(1).forEach(chartType => {
            const stdev_all = document.getElementById(dataset + "_" + chartType.id + '_stdev_' + subcategory.suffix + '_all')
            if (stdev_all.innerHTML != "-") {
                stdev_all.innerText += ' ' + chartType.units;
            }
        })
    })
}
function chartStuff(dataset, chartType, cat, subcategory) {
    let chartData = [];
    subcategory.id.forEach(ids => {
        chartData.push(cat[dataset][ids])
    })
    const chartArea = document.getElementById(dataset + "_" + chartType.id + "_chart_" + subcategory.suffix)
    if (chartData.every(item => item.length == 0)) {
        chartArea.innerHTML = 'No data!'
        chartsReadyCount++;
        checkAllChartsReady(dataset);
    } else {
        const chartElem = new google.visualization.ColumnChart(chartArea);
        google.visualization.events.addListener(chartElem, 'ready', function () {
            chartsReadyCount++;
            checkAllChartsReady(dataset);
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
function nominalChart(dataset, chartType, cat, subcategory) {
    const frequencyMaps = [];
    subcategory.id.forEach(id => {
        const data = cat[dataset][id];
        frequencyMaps.push(countFrequencies(data));
    });
    const chartArea = document.getElementById(dataset + '_' + chartType.id + '_chart_' + subcategory.suffix)
    if (frequencyMaps.every(item => Object.keys(item).length == 0)) {
        chartArea.innerHTML = 'No data!'
        chartsReadyCount++;
        checkAllChartsReady(dataset);
    } else {
        const sortedElements = Array.from([...new Set(cat[dataset].all)]).sort((a, b) => {
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
            checkAllChartsReady(dataset);
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
        checkAllChartsReady(dataset);
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
function chartStats(dataset, chartType, cat, subcategory) {
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
        rows += `<td id="${dataset}_${chartType.id}_${statType.abbrev}_${subcategory.suffix}_all">${statType.func(cat[dataset].all)}</td>`
        subcategory.id.forEach((label, index1) => {
            rows += `<td id="${dataset}_${chartType.id}_${statType.abbrev}_${label}" style="background-color:${subcategory.colors[index1]}">${statType.func(cat[dataset][label])}</td>`
        })
        rows += `</tr>`
    })
    if (chartType.id.split('_')[1] != 'years') {
        rows += `
        <tr>
        <td>Shortest</td>`
        const minAll = Math.min(...cat[dataset].all)
        rows += `<td id="${dataset}_${chartType.id}_shortest_${subcategory.suffix}_all">${generateImage(albums[dataset].all.find(album => parseFloat(album[chartType.id]) == minAll), 48, minAll)}</td>`
        subcategory.id.forEach((label, index1) => {
            const min = Math.min(...cat[dataset][label])
            rows += `<td id="${dataset}_${chartType.id}_shortest_${label}" style="background-color:${subcategory.colors[index1]}">${generateImage(albums[dataset][label].find(album => parseFloat(album[chartType.id]) == min), 48, min)}</td>`
        })
        rows += `</tr>`;
        rows += `
        <tr>
        <td>Longest</td>`
        const maxAll = Math.max(...cat[dataset].all)
        rows += `<td id="${dataset}_${chartType.id}_shortest_${subcategory.suffix}_all">${generateImage(albums[dataset].all.find(album => parseFloat(album[chartType.id]) == maxAll), 48, maxAll)}</td>`
        subcategory.id.forEach((label, index1) => {
            const max = Math.max(...cat[dataset][label])
            rows += `<td id="${dataset}_${chartType.id}_shortest_${label}" style="background-color:${subcategory.colors[index1]}">${generateImage(albums[dataset][label].find(album => parseFloat(album[chartType.id]) == max), 48, max)}</td>`
        })
        rows += `</tr>`;
    }
    HTMLcontent += rows + `</table>`
    stats.innerHTML = HTMLcontent;
}