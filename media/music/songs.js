const songs = initializeObject(songCategories,dataTypes[1]);
const songData = initialization(songChartTypes, nominalSongChartTypes, songCategories,dataTypes[1]);
const songCats = songChartTypes.map(cat => songData[cat.id]);
const nominalSongCats = nominalSongChartTypes.map(cat => songData[cat.id]);
function processSongData(data, dataset) {
    songs[dataset].all = convertToObjects(data);
    organizeData(dataset, songs, 'songs', songCats, nominalSongCats, songChartTypes, nominalSongChartTypes, songCategories, songSubCategories)
    songSubCategories.forEach(subcategory => {
        songStats(songs, 'songs', dataset, subcategory, songData['songs_artists'], songData['songs_origin'], songData['songs_platform'])
        displayRandomSong(dataset)
        createCharts(dataset, subcategory, songs, songChartTypes, nominalSongChartTypes, songPieChartTypes, songCats, nominalSongCats, songs_decades_config)
    })
}
function songStats(medium, mediumName, dataset, subcategory, artist, origin, platform) {
    let HTMLcontent = `
    <table>
        <tr>
            <th></th>
            <th>All</th>`
    subcategory.abbrev.forEach(label => {
        HTMLcontent += '<th>' + label + '</th>'
    })
    HTMLcontent += '</tr>'
    let rows = `
    <tr>
        <td># of Songs</td>
        <td>${medium[dataset].all.length}</td>`
    subcategory.id.forEach((label, index) => {
        rows += `<td style="background-color:${subcategory.colors[index]}">${medium[dataset][label].length}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Artists</td>
        <td>${[...new Set(artist[dataset].all)].length}</td>`
    subcategory.id.forEach((label, index) => {
        rows += `<td style="background-color:${subcategory.colors[index]}">${[...new Set(artist[dataset][label])].length}</td>`
    })
    rows += `</tr>`;
    HTMLcontent += rows + `</table>`
    const stats = document.getElementById(dataset + "_" + mediumName + "_stats_stats_" + subcategory.suffix)
    stats.innerHTML += HTMLcontent;
    let moreHTMLcontent = `
    <table>
        <tr>
            <th></th>
            <th>All</th>`
    subcategory.abbrev.forEach(label => {
        moreHTMLcontent += '<th>' + label + '</th>'
    })
    let rows2 = `
    <tr>
        <td>Top Artist</td>
        <td>${findMode(artist[dataset].all)}</td>`
    subcategory.id.forEach((label, index) => {
        rows2 += `<td style="background-color:${subcategory.colors[index]}">${findMode(artist[dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    rows2 += `
    <tr>
        <td>Top Origin</td>
        <td>${findMode(origin[dataset].all)}</td>`
    subcategory.id.forEach((label, index) => {
        rows2 += `<td style="background-color:${subcategory.colors[index]}">${findMode(origin[dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    rows2 += `
    <tr>
        <td>Top Platform</td>
        <td>${findMode(platform[dataset].all)}</td>`
    subcategory.id.forEach((label, index) => {
        rows2 += `<td style="background-color:${subcategory.colors[index]}">${findMode(platform[dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    moreHTMLcontent += rows2 + `</table>`
    const moreStats = document.getElementById(dataset + "_" + mediumName + "_stats_moreStats_" + subcategory.suffix)
    moreStats.innerHTML += moreHTMLcontent;
}
function displayRandomSong(dataset) {
    const randomIndex = Math.floor(Math.random() * (songs[dataset].r.length + songs[dataset].fav_r.length));
    const randomSong = [...songs[dataset].r, ...songs[dataset].fav_r][randomIndex];
    let line2 = ''
    if (randomSong.dataset == 'Pop') {
        line2 = randomSong.artist
    } else {
        line2 = randomSong.origin
    }
    let line3 = randomSong.year
    if (randomSong.platform != undefined) {
        line3 += ' - ' + randomSong.platform
    }
    const songDisplay = document.getElementById(dataset + '_songDisplay');
    songDisplay.innerHTML = `
    <br>
    <h1>&#9835; ${randomSong.title} &#9835;</h1>
    <h2>${line2}</h2>
    <h3>${line3}</h3>
    <br>`;
}