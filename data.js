// Google Cloud Console API Key
const API_KEY = 'AIzaSyAjGqbuuZ_yycY90TBIwCEiFaCjo_pFb-Y';
const SPREADSHEET_ID = '1gqRp8MS1Xy8A0ERUGOfjVoRN_7bowGdC_1Axp1nZgbE';
const RANGES = {
    pop: 'Album!A:J',
    film: 'Film!A:J',
    vgm: 'VGM!A:J',
    covers: 'Covers!A:J'
};
const categories = ['all', 'nonfav', 'fav', 'v', 'mv', 'm', 'mi', 'i'];
const catIDs = ["years", "num_songs", "duration", "avg_song_duration"];
const datasets = Object.keys(RANGES);
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
const albums = initializeObject();
const artist = initializeObject();
const title = initializeObject();
const years = initializeObject();
const num_songs = initializeObject();
const duration = initializeObject();
const avg_song_duration = initializeObject();
populateHTML();
function populateHTML() {
    Object.keys(RANGES).forEach(dataset => {
        const currentTab = document.getElementById(dataset)
        currentTab.innerHTML = `
        <h1>Era</h1>
            <div class="container">
                <div id="${dataset}_years_stats" class="stats"></div>
                <div class="years_chart">
                    <div id="${dataset}_years" class="years"></div>
                    <div id="${dataset}_years_vi" class="years"></div>
                </div>
            </div>
            <h1>Durations</h1>
            <div class="container">
                <div id="${dataset}_num_songs_stats" class="stats"></div>
                <div class="num_songs_chart">
                    <div id="${dataset}_num_songs" class="num_songs"></div>
                    <div id="${dataset}_num_songs_vi" class="num_songs"></div>
                </div>
            </div>
            <div class="container">
                <div id="${dataset}_duration_stats" class="stats"></div>
                <div class="duration_chart">
                    <div id="${dataset}_duration" class="duration"></div>
                    <div id="${dataset}_duration_vi" class="duration"></div>
                </div>
            </div>
            <div class="container">
                <div id="${dataset}_avg_song_duration_stats" class="stats"></div>
                <div class="avg_song_duration_chart">
                    <div id="${dataset}_avg_song_duration" class="avg_song_duration"></div>
                    <div id="${dataset}_avg_song_duration_vi" class="avg_song_duration"></div>
                </div>
            </div>
            <div id="${dataset}_artist_chart" class="artist_chart"></div>
            <div id="${dataset}_art" class="art"></div>`
    });
}
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4')
        .then(() => {
            console.log("GAPI client loaded for API");
            Object.keys(RANGES).forEach(rangeKey => {
                fetchSheetData(RANGES[rangeKey], rangeKey);
            });
        }, (error) => {
            console.error("Error loading GAPI client for API", error);
        });
}
function fetchSheetData(range, dataset) {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
    }).then((response) => {
        const data = response.result.values;
        albums[dataset].all = convertToObjects(data);
        albums[dataset].nonfav = albums[dataset].all.filter(album => album.fav == "");
        albums[dataset].fav = albums[dataset].all.filter(album => album.fav == "F");
        albums[dataset].v = albums[dataset].all.filter(album => album.vi == "V");
        albums[dataset].mv = albums[dataset].all.filter(album => album.vi == "MV");
        albums[dataset].m = albums[dataset].all.filter(album => album.vi == "M");
        albums[dataset].mi = albums[dataset].all.filter(album => album.vi == "MI");
        albums[dataset].i = albums[dataset].all.filter(album => album.vi == "I");
        categories.forEach(category => {
            artist[dataset][category] = albums[dataset][category].map(album => album.artist);
            title[dataset][category] = albums[dataset][category].map(album => album.title);
            years[dataset][category] = albums[dataset][category].map(album => album.year);
            num_songs[dataset][category] = albums[dataset][category].map(album => album.num_songs);
            duration[dataset][category] = albums[dataset][category].map(album => album.duration);
            avg_song_duration[dataset][category] = albums[dataset][category].map(album => album.avg_song_duration);
        });
        artist[dataset].all_unique = [...new Set(artist[dataset].all)]
        artist[dataset].fav_unique = [...new Set(artist[dataset].fav)]
        // Generate album art
        title[dataset].all.forEach(albumTitle => {
            let fileName = albumTitle.replace(/:/g, '-');
            let imgElement = document.createElement('img');
            imgElement.src = `images/${dataset}/${fileName}.jpeg`;
            imgElement.alt = albumTitle;
            imgElement.onerror = () => {
                imgElement.src = `images/${dataset}/${albumTitle}.jpeg`;
            };
            document.getElementById(dataset + '_art').appendChild(imgElement);
        });
        const titles = ['Albums by Year', 'Songs Per Album', 'Album Duration (minutes)', 'Average Song Duration (minutes)'];
        const x_axis = ['Year', '# of Songs', 'Album Duration (minutes)', 'Average Song Duration (minutes)'];
        const labels = ['Super Favorites', 'Favorites'];
        const labels_vi = ['Vocal', 'Mostly Vocal', 'Mixed', 'Mostly Inst.', 'Instrumental'];
        const colors = ['slateblue', 'dodgerblue'];
        const colors_vi = ['tomato', 'orange', 'gold', 'mediumseagreen', 'dodgerblue'];
        const cats = [years[dataset], num_songs[dataset], duration[dataset], avg_song_duration[dataset]];
        for (i = 0; i < cats.length; i++) {
            drawChart(dataset + "_" + catIDs[i], [cats[i].fav, cats[i].nonfav], titles[i], x_axis[i], labels, colors);
            drawChart(dataset + "_" + catIDs[i] + "_vi", [cats[i].v, cats[i].mv, cats[i].m, cats[i].mi, cats[i].i], titles[i], x_axis[i], labels_vi, colors_vi);
            const stats = document.getElementById(dataset + "_" + catIDs[i] + "_stats");
            stats.innerHTML = `
            <table>
                <tr>
                    <th></th>
                    <th>All</th>
                    <th>Super Favs</th>
                </tr>
                <tr>
                    <td>Mean</td>
                    <td id="${dataset}_${catIDs[i]}_mean_all">${findMean(cats[i].all)}</td>
                    <td id="${dataset}_${catIDs[i]}_mean_fav">${findMean(cats[i].fav)}</td>
                </tr>
                <tr>
                    <td>Median</td>
                    <td id="${dataset}_${catIDs[i]}_median_all">${findMedian(cats[i].all)}</td>
                    <td id="${dataset}_${catIDs[i]}_median_fav">${findMedian(cats[i].fav)}</td>
                </tr>
                <tr>
                    <td>Mode</td>
                    <td id="${dataset}_${catIDs[i]}_mode_all">${findMode(cats[i].all)}</td>
                    <td id="${dataset}_${catIDs[i]}_mode_fav">${findMode(cats[i].fav)}</td>
                </tr>
                <tr>
                    <td>Std. dev</td>
                    <td id="${dataset}_${catIDs[i]}_stdev_all">${findStandardDeviation(cats[i].all)}</td>
                    <td id="${dataset}_${catIDs[i]}_stdev_fav">${findStandardDeviation(cats[i].fav)}</td>
                </tr>
            </table>`
        }
        function countFrequencies(arr) {
            return arr.reduce((acc, artist) => {
                acc[artist] = (acc[artist] || 0) + 1;
                return acc;
            }, {});
        }
        const frequencyMap1 = countFrequencies(artist[dataset].fav);
        const frequencyMap2 = countFrequencies(artist[dataset].nonfav);
        function prepareChartData(frequencyMap1, frequencyMap2) {
            const sortedArtists = artist[dataset].all_unique.sort((a, b) => {
                const totalFreqA = (frequencyMap1[a] || 0) + (frequencyMap2[a] || 0);
                const totalFreqB = (frequencyMap1[b] || 0) + (frequencyMap2[b] || 0);
                if (totalFreqA !== totalFreqB) {
                    return totalFreqB - totalFreqA;
                } else {
                    return (frequencyMap2[a] || 0) - (frequencyMap2[b] || 0);
                }
            });
            const dataArray = [["Artist", ...labels]];
            sortedArtists.forEach(artist => {
                dataArray.push([
                    artist,
                    frequencyMap1[artist] || 0,
                    frequencyMap2[artist] || 0
                ]);
            });
            return dataArray;
        }
        const chartData = prepareChartData(frequencyMap1, frequencyMap2);
        drawChart2(dataset + "_artist_chart", chartData, "Artists", "Artists", labels, colors)
        fixStats(dataset);
        const chartIDs = ["years_vi", "num_songs_vi", "duration_vi", "avg_song_duration_vi"];
        chartIDs.forEach(id => {
            const chart = document.getElementById(dataset + "_" + id);
            if (chart) {
                chart.style.display = 'none';
            }
        });
    }, (error) => {
        document.getElementById('content').innerText = "Error: " + error.result.error.message;
    });
}
function convertToObjects(data) {
    const headers = data[0];
    const rows = data.slice(1);
    const albums = [];
    rows.forEach(row => {
        let rowData = {};
        headers.forEach((header, index) => {
            rowData[header.toLowerCase()] = row[index];
        });
        albums.push(rowData);
    });
    albums.forEach(album => {
        let avg_song_duration = (album.duration / album.num_songs).toFixed(1);
        album.avg_song_duration = avg_song_duration;
    });
    return albums;
}