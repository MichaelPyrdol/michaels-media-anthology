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
function initializeObject(categories, datasetIDs) {
    const dataStructure = {};
    datasetIDs.forEach(dataset => {
        dataStructure[dataset] = {};
        categories.forEach(category => {
            dataStructure[dataset][category] = [];
        });
    });
    return dataStructure;
}
function initialization(chartTypes, nominalChartTypes, categories, datasetIDs) {
    const mediumCats = []
    const bothChartTypes = [...chartTypes, ...nominalChartTypes]
    bothChartTypes.forEach(chartType => {
        mediumCats.push(chartType.id)
    })
    const mediumData = mediumCats.reduce((acc, category) => {
        acc[category] = initializeObject(categories, datasetIDs);
        return acc;
    }, {});
    return mediumData;
}
function organizeData(dataset, mediaType, mediumIndex) {
    if (mediaType.mediumIDs[mediumIndex] == 'albums') {
        mediaType.mediumData[mediumIndex][dataset].all.forEach(album => {
            let avg_song_duration = (album.duration / album.num_songs).toFixed(1);
            album.avg_song_duration = avg_song_duration;
            album.r = ''
            if (album.dataset == 'Pop' || album.dataset == 'Other') {
                album.origin = album.title
            }
        });
    } else if (mediaType.mediumIDs[mediumIndex] == 'songs') {
        mediaType.mediumData[mediumIndex][dataset].all.forEach(song => {
            const matchingAlbum = mediaType.mediumData[0][dataset].all.find(album =>
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
    } else if (mediaType.id == 'vg') {
        mediaType.mediumData[mediumIndex][dataset].all.forEach(vg => {
            vg.franchise = ''
            franchises.forEach(franchise => {
                if (vg.title.includes(franchise.name)) {
                    vg.franchise = franchise.name
                }
            })
        })
    }
    mediaType.mediumData[mediumIndex][dataset].all.forEach(thing => {
        thing.ABClength = thing.title.length
        thing.ABCwords = thing.title.trim().split(/\s+/).length
        thing.words = thing.title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1))
    })
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        subcategory.id.forEach((id, index) => {
            mediaType.mediumData[mediumIndex][dataset][id] = mediaType.mediumData[mediumIndex][dataset].all.filter(item => item[subcategory.suffix] == subcategory.identifier[index]);
        })
    })
    mediaType.categories[mediumIndex].forEach(category => {
        mediaType.mediumCats[mediumIndex].forEach((cat, index) => {
            cat[dataset][category] = mediaType.mediumData[mediumIndex][dataset][category].map(item => item[mediaType.chartTypes[mediumIndex][index].id]).filter(Boolean);
        })
        mediaType.mediumNominalCats[mediumIndex].forEach((cat, index) => {
            cat[dataset][category] = mediaType.mediumData[mediumIndex][dataset][category].map(item => item[mediaType.nominalChartTypes[mediumIndex][index].id]).filter(Boolean);
        })
    });
}
function createCharts(dataset, subcategory, mediaType, mediumIndex) {
    if (charts) {
        mediaType.chartTypes[mediumIndex].forEach((chartType, index) => {
            createChart(dataset, mediaType, mediumIndex, chartType, mediaType.mediumCats[mediumIndex][index], subcategory)
            createStats(dataset, mediaType, mediumIndex, chartType, mediaType.mediumCats[mediumIndex][index], subcategory)
        })
        createChart(dataset, mediaType, mediumIndex, mediaType.decades[mediumIndex], mediaType.mediumCats[mediumIndex][0], subcategory)
        mediaType.nominalChartTypes[mediumIndex].forEach((chartType, index) => {
            createNominalChart(dataset, mediaType, mediumIndex, chartType, mediaType.mediumNominalCats[mediumIndex][index], subcategory)
        })
        mediaType.pieChartTypes[mediumIndex].forEach(chartType => {
            createPieChart(dataset, mediaType, mediumIndex, chartType, subcategory)
        })
    } else {
        fixView(dataset, mediaType, mediumIndex, '')
    }
}
function checkAllChartsReady(dataset, mediaType, mediumIndex) {
    // console.log(chartsReadyCount)
    // console.log(numCharts)
    const progressBar = document.getElementById('progress-bar')
    progressBar.value++
    if (chartsReadyCount == numCharts) {
        // console.log('done')
        chartsReadyCount = 0;
        numCharts = 0;
        fixView(dataset, mediaType, mediumIndex, 'none');
    }
}
function fixStats(dataset, mediaType, mediumIndex) {
    const mediumName = mediaType.mediumIDs[mediumIndex]
    const generalElems = ['year_mean', 'year_median']
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        subcategory.id.forEach(id => {
            generalElems.forEach(elem => {
                const toRound = document.getElementById(dataset + "_" + mediumName + '_' + elem + '_' + id)
                if (toRound) {
                    if (toRound.innerHTML != '-') {
                        toRound.innerHTML = Math.round(toRound.innerHTML);
                    }
                }
            })
            const stdev = document.getElementById(dataset + "_" + mediumName + '_year_stdev_' + id)
            if (stdev) {
                if (stdev.innerHTML != "-") {
                    stdev.innerText += ' years';
                }
            }
        })
        const stdev = document.getElementById(dataset + "_" + mediumName + '_year_stdev_' + subcategory.suffix + '_all')
        if (stdev) {
            if (stdev.innerHTML != "-") {
                stdev.innerText += ' years';
            }
        }
        generalElems.forEach(elem => {
            const roundAll = document.getElementById(dataset + "_" + mediumName + '_' + elem + '_' + subcategory.suffix + '_all')
            if (roundAll) {
                if (roundAll.innerHTML != '-') {
                    roundAll.innerHTML = Math.round(roundAll.innerHTML);
                }
            }
        })
    })
    if (mediumName == 'albums') {
        const elemsToRound = ['num_songs_mean', 'num_songs_stdev']
        mediaType.subcategories[mediumIndex].forEach(subcategory => {
            subcategory.id.forEach(id => {
                elemsToRound.forEach(elem => {
                    const toRound = document.getElementById(dataset + "_albums_" + elem + '_' + id)
                    if (toRound) {
                        if (toRound.innerHTML != '-') {
                            toRound.innerHTML = Math.round(toRound.innerHTML);
                        }
                    }
                })
                const num_songs_sum = findSum(mediaType.categoryData[mediumIndex]['num_songs'][dataset][id]);
                const duration_sum = findSum(mediaType.categoryData[mediumIndex]['duration'][dataset][id]);
                const avg_song_duration_mean = duration_sum / num_songs_sum;
                const avg_song_duration_mean_elem = document.getElementById(dataset + '_albums_avg_song_duration_mean_' + id);
                if (avg_song_duration_mean_elem) {
                    if (avg_song_duration_mean_elem.innerHTML != '-') {
                        avg_song_duration_mean_elem.innerText = avg_song_duration_mean.toFixed(1);
                    }
                }
                mediaType.chartTypes[mediumIndex].slice(1).forEach(chartType => {
                    const stdev = document.getElementById(dataset + "_albums_" + chartType.id + '_stdev_' + id)
                    if (stdev) {
                        if (stdev.innerHTML != "-") {
                            stdev.innerText += ' ' + chartType.units;
                        }
                    }
                })
            })
            elemsToRound.forEach(elem => {
                const roundAll = document.getElementById(dataset + "_albums_" + elem + "_" + subcategory.suffix + '_all')
                if (roundAll) {
                    if (roundAll.innerHTML != '-') {
                        roundAll.innerHTML = Math.round(roundAll.innerHTML);
                    }
                }
            })
            mediaType.chartTypes[mediumIndex].slice(1).forEach(chartType => {
                const stdev_all = document.getElementById(dataset + "_albums_" + chartType.id + '_stdev_' + subcategory.suffix + '_all')
                if (stdev_all) {
                    if (stdev_all.innerHTML != "-") {
                        stdev_all.innerText += ' ' + chartType.units;
                    }
                }
            })
        })
    }
}
function createChart(dataset, mediaType, mediumIndex, chartType, cat, subcategory) {
    let chartData = [];
    subcategory.id.forEach(ids => {
        chartData.push(cat[dataset][ids])
    })
    const chartArea = document.getElementById(dataset + "_" + mediaType.mediumIDs[mediumIndex] + '_' + chartType.id + "_chart_" + subcategory.suffix)
    if (chartData.every(item => item.length == 0)) {
        chartArea.innerHTML = 'No data!'
        chartsReadyCount++;
        checkAllChartsReady(dataset, mediaType, mediumIndex);
    } else {
        const chartElem = new google.visualization.ColumnChart(chartArea);
        google.visualization.events.addListener(chartElem, 'ready', function () {
            chartsReadyCount++;
            checkAllChartsReady(dataset, mediaType, mediumIndex);
        });
        drawChart(
            chartElem,
            chartData,
            chartType.title,
            chartType.x_axis,
            mediaType.mediums[mediumIndex],
            subcategory.labels,
            subcategory.colors
        );
    }
}
function createNominalChart(dataset, mediaType, mediumIndex, chartType, cat, subcategory) {
    const frequencyMaps = [];
    let allData = cat[dataset].all
    let newAllArr = []
    if (Array.isArray(allData) && Array.isArray(allData[0])) {
        allData.forEach(arr => {
            newAllArr.push(...arr)
        })
        allData = newAllArr
    }
    subcategory.id.forEach(id => {
        let data = cat[dataset][id];
        let newArr = []
        if (Array.isArray(data) && Array.isArray(data[0])) {
            data.forEach(arr => {
                newArr.push(...arr)
            })
            data = newArr
        }
        frequencyMaps.push(countFrequencies(data));
    });
    const chartArea = document.getElementById(dataset + '_' + mediaType.mediumIDs[mediumIndex] + '_' + chartType.id + '_chart_' + subcategory.suffix)
    if (frequencyMaps.every(item => Object.keys(item).length == 0)) {
        chartArea.innerHTML = 'No data!'
        chartsReadyCount++;
        checkAllChartsReady(dataset, mediaType, mediumIndex);
    } else {
        const sortedElements = Array.from([...new Set(allData)]).sort((a, b) => {
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
            checkAllChartsReady(dataset, mediaType, mediumIndex);
        });
        drawNominalChart(chart, chartData, chartType.title, chartType.title, mediaType.mediums[mediumIndex], subcategory.colors);
    }
}
function createPieChart(dataset, mediaType, mediumIndex, chartType, subcategory) {
    const chartData = [['Array', 'Length']];
    subcategory.id.forEach((id, index) => {
        chartData.push([subcategory.labels[index], mediaType.mediumData[mediumIndex][dataset][id].length]);
    });
    const chartElem = new google.visualization.PieChart(document.getElementById(dataset + '_' + mediaType.mediumIDs[mediumIndex] + '_' + chartType.id + "_pieChart_" + subcategory.suffix));
    google.visualization.events.addListener(chartElem, 'ready', function () {
        chartsReadyCount++;
        checkAllChartsReady(dataset, mediaType, mediumIndex);
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
function createStats(dataset, mediaType, mediumIndex, chartType, cat, subcategory) {
    const mediumName = mediaType.mediumIDs[mediumIndex]
    let isDataset = dataset != 'combined' && subcategory.suffix == 'dataset'
    let HTMLcontent = generateStatsHeader(dataset, subcategory)
    let rows = '';
    statTypes.forEach(statType => {
        rows += `
        <tr>
            <td>${statType.label}</td>`
        rows += `<td id="${dataset}_${mediumName}_${chartType.id}_${statType.abbrev}_${subcategory.suffix}_all">${statType.func(cat[dataset].all)}</td>`
        if (!isDataset) {
            subcategory.id.forEach((label, index1) => {
                rows += `<td id="${dataset}_${mediumName}_${chartType.id}_${statType.abbrev}_${label}" style="background-color:${subcategory.colors[index1]}">${statType.func(cat[dataset][label])}</td>`
            })
        }
        rows += `</tr>`
    })
    if (['albums', 'nsw'].includes(mediumName)) {
        rows += `
        <tr>
        <td>Min</td>`
        const minAll = Math.min(...cat[dataset].all)
        rows += `<td>${generateImage(mediaType.mediumData[mediumIndex][dataset].all.find(album => parseFloat(album[chartType.id]) == minAll), mediumName, 48, minAll)}</td>`
        if (!isDataset) {
            subcategory.id.forEach((label, index1) => {
                const min = Math.min(...cat[dataset][label])
                rows += `<td style="background-color:${subcategory.colors[index1]}">${generateImage(mediaType.mediumData[mediumIndex][dataset][label].find(album => parseFloat(album[chartType.id]) == min), mediumName, 48, min)}</td>`
            })
        }
        rows += `</tr>`;
        rows += `
        <tr>
        <td>Max</td>`
        const maxAll = Math.max(...cat[dataset].all)
        rows += `<td>${generateImage(mediaType.mediumData[mediumIndex][dataset].all.find(album => parseFloat(album[chartType.id]) == maxAll), mediumName, 48, maxAll)}</td>`
        if (!isDataset) {
            subcategory.id.forEach((label, index1) => {
                const max = Math.max(...cat[dataset][label])
                rows += `<td style="background-color:${subcategory.colors[index1]}">${generateImage(mediaType.mediumData[mediumIndex][dataset][label].find(album => parseFloat(album[chartType.id]) == max), mediumName, 48, max)}</td>`
            })
        }
        rows += `</tr>`;
    }
    HTMLcontent += rows + `</table>`
    const stats = document.getElementById(dataset + "_" + mediumName + '_' + chartType.id + "_chartStats_" + subcategory.suffix);
    stats.innerHTML = HTMLcontent;
}
function generateImage(thing, medium, size, hover) {
    if (thing) {
        let extension = '.jpeg'
        // if (medium == 'vg') {
        //     extension = '.png'
        // }
        let fileName = thing.title.replace(/:/g, '-');
        let imgElement = document.createElement('img');
        imgElement.src = `images/${medium}/${thing.dataset.toLowerCase()}/${fileName + extension}`;
        let fallbackAttempted = false;
        imgElement.onerror = () => {
            if (!fallbackAttempted) {
                fallbackAttempted = true;
                imgElement.src = `images/${thing.dataset.toLowerCase()}/${thing.title + extension}`;
            } else {
                imgElement.onerror = null;
            }
        };
        let hoverText = thing.title
        if (thing.artist) {
            hoverText = `<p>${thing.artist}<br>~<br>${thing.title}</p>`
        }
        if (hover) {
            hoverText = hover
        }
        const image = `
        <div class="containey" style="width:${size}px">
            <img src="${imgElement.src}" alt="${thing.title}" class="image" style="width:${size}px">
            <div class="overlay">${hoverText}</div>
        </div>`
        return image
    }
    return '-'
}
function generateList(dataset, subcategory, mediaType, mediumIndex) {
    const mediumName = mediaType.mediumIDs[mediumIndex]
    let listHTML = ''
    subcategory.id.forEach((id, index) => {
        if (mediaType.mediumData[mediumIndex][dataset][id].length > 0) {
            let images = false
            if (['albums', 'nsw'].includes(mediumName)) {
                images = true
                listHTML += generateDivisions(subcategory, index)
            } else {
                listHTML += generateDivisions(subcategory, index, ' extraPadding')
            }
            if (images) {
                listHTML += `<div class='art2'>`
                mediaType.mediumData[mediumIndex][dataset][id].forEach(thing => {
                    listHTML += generateImage(thing, mediumName, 128)
                })
                listHTML += `</div>`
            } else {
                listHTML += `<table class='autoMargin'>`
                mediaType.mediumData[mediumIndex][dataset][id].forEach((thing, thingIndex) => {
                    let col2 = '-'
                    let col3 = ''
                    let titleClass = ''
                    let extraClass = ''
                    if (thing.dataset == 'Pop') {
                        col2 = thing.artist
                    } else if (thing.origin) {
                        col2 = thing.origin
                        extraClass = vgCheck(thing.origin)
                    } else if (thing.artist) {
                        col2 = thing.artist
                    } else if (thing.studio) {
                        col2 = thing.studio
                        if (thing.studio == 'Walt Disney Animation Studios') {
                            extraClass = 'wdas'
                        } else if (thing.studio == 'Pixar') {
                            extraClass = 'pixar'
                        } else if (thing.studio == 'Studio Ghibli') {
                            extraClass = 'ghibli'
                        }
                    } else if (thing.director) {
                        col2 = thing.director
                    } else if (mediaType.id == 'vg') {
                        col2 = thing.publisher
                        extraClass = thing.publisher.toLowerCase()
                        col3 = `<td class='${thing.platform.toLowerCase()}' style='background-color:${backgroundColor}'>${thing.platform}</td>`
                        titleClass = vgCheck(thing.title)
                    }
                    listHTML +=
                        `<tr>
                            <td class=${thing.dataset.toLowerCase()} style='width:3px;padding:2px;text-align:center'>
                                <span style='font-size:8px;transform: rotate(-90deg);display: inline-block;'>${thingIndex + 1}</span>
                            </td>
                            <td style='background-color:${backgroundColor}'>${thing.year}</td>
                            <td class='${titleClass}' style='background-color:${backgroundColor}'>${thing.title}</td>
                            <td class='${extraClass}' style='background-color:${backgroundColor}'>${col2}</td>
                            ${col3}
                        </tr>`
                })
                listHTML += `</table>`
            }
            listHTML += `</div>`
        }
    })
    const list = document.getElementById(dataset + '_' + mediumName + '_list_' + subcategory.suffix)
    list.innerHTML = listHTML
}
function vgCheck(item) {
    const franchise = franchises.find(franchise => item.includes(franchise.name));
    return franchise ? franchise.class : '';
}
function generateDivisions(subcategory, index, extraClass) {
    let theExtraClass = ''
    if (extraClass) {
        theExtraClass = extraClass
    }
    const HTMLcontent =
        `<div class='width${theExtraClass}' style='background-color:${subcategory.colors[index]}'>
        <h3>${subcategory.labels[index]}</h3>`
    return HTMLcontent
}
function generateStatsHeader(dataset, subcategory) {
    let HTMLcontent = '<table>'
    HTMLcontent +=
        `<tr>
            <th></th>`
    if (subcategory.suffix == 'dataset' && dataset != 'combined') {
        HTMLcontent += `<th><br></th>`
    } else {
        HTMLcontent += `<th>All</th>`
        subcategory.abbrev.forEach(label => {
            HTMLcontent += '<th>' + label + '</th>'
        })
    }
    HTMLcontent += '</tr>'
    return HTMLcontent
}
function generateStats(dataset, subcategory, mediaType, mediumIndex, rowLabel, func, query) {
    let dataSource = mediaType.mediumData[mediumIndex][dataset]
    if (query) {
        dataSource = mediaType.categoryData[mediumIndex][query][dataset]
    }
    let HTMLcontent = ''
    if (dataSource.all.length > 0) {
        HTMLcontent += `
        <tr>
            <td>${rowLabel}</td>
            <td>${func(dataSource.all)}</td>`
        if (subcategory.suffix == 'dataset' && dataset != 'combined') {

        } else {
            subcategory.id.forEach((label, index) => {
                HTMLcontent += `<td style="background-color:${subcategory.colors[index]}">${func(dataSource[label])}</td>`
            })
        }
        HTMLcontent += `</tr>`;
    }
    return HTMLcontent
}
function generateMoreStats(dataset, subcategory, mediaType, mediumIndex) {
    const mediumName = mediaType.mediumIDs[mediumIndex]
    const nominalChartTypes = mediaType.nominalChartTypes[mediumIndex]
    let HTMLcontent = generateStatsHeader(dataset, subcategory)
    HTMLcontent += generateStats(dataset, subcategory, mediaType, mediumIndex, '# of ' + mediaType.mediums[mediumIndex], findLength)
    nominalChartTypes.forEach(nominalChartType => {
        if (!['words'].includes(nominalChartType.id)) {
            HTMLcontent += generateStats(dataset, subcategory, mediaType, mediumIndex, '# of ' + nominalChartType.plural, findUniqueLength, nominalChartType.id)
        }
    })
    HTMLcontent += `</table>`;
    const stats = document.getElementById(dataset + "_" + mediumName + "_stats_stats_" + subcategory.suffix)
    stats.innerHTML += HTMLcontent;
    generateEvenMoreStats(dataset, subcategory, mediaType, mediumIndex)
}
function generateEvenMoreStats(dataset, subcategory, mediaType, mediumIndex) {
    const mediumName = mediaType.mediumIDs[mediumIndex]
    const nominalChartTypes = mediaType.nominalChartTypes[mediumIndex]
    let moreHTMLcontent = generateStatsHeader(dataset, subcategory)
    nominalChartTypes.forEach(nominalChartType => {
        if (!['words'].includes(nominalChartType.id)) {
            moreHTMLcontent += generateStats(dataset, subcategory, mediaType, mediumIndex, 'Top ' + nominalChartType.title, findMode, nominalChartType.id)
        }
    })
    const moreStats = document.getElementById(dataset + "_" + mediumName + "_stats_moreStats_" + subcategory.suffix)
    moreStats.innerHTML += moreHTMLcontent;
}