const songs = initializeObject(songCategories);
const song_artist = initializeObject(songCategories);
const song_title = initializeObject(songCategories);
const song_years = initializeObject(songCategories);
const song_origin = initializeObject(songCategories);
const song_platform = initializeObject(songCategories);
function processSongData(data, dataset) {
    songs[dataset].all = convertToObjects(data);
    songSubCategories.forEach(subcategory => {
        subcategory.id.forEach((id, index) => {
            songs[dataset][id] = songs[dataset].all.filter(song => song[subcategory.suffix] == subcategory.identifier[index]);
        })
    })
    songCategories.forEach(category => {
        song_artist[dataset][category] = songs[dataset][category].map(song => song.artist).filter(Boolean);
        song_title[dataset][category] = songs[dataset][category].map(song => song.title).filter(Boolean);
        song_years[dataset][category] = songs[dataset][category].map(song => song.year).filter(Boolean);
        song_origin[dataset][category] = songs[dataset][category].map(song => song.origin).filter(Boolean);
        song_platform[dataset][category] = songs[dataset][category].map(song => song.platform).filter(Boolean);
    })
    const songCats = [song_years]
    const nominalSongCats = [song_artist, song_origin, song_platform]
    songSubCategories.forEach(subcategory => {
        songStats(dataset, subcategory)
        displayRandomSong(dataset)
        if (charts) {
            chartStuff(dataset, song_years_config, songCats, 0, subcategory)
            chartStats(dataset, song_years_config, songCats, 0, subcategory)
            nominalSongChartTypes.forEach((chartType, index) => {
                nominalChart(dataset, chartType, nominalSongCats, index, subcategory)
            })
            pieChart(dataset, song_num_songs_config, songs, subcategory)
        } else {
            fixView(dataset)
        }
    })
}
function songStats(dataset, subcategory) {
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
        <td>${songs[dataset].all.length}</td>`
    subcategory.id.forEach(label => {
        rows += `<td>${songs[dataset][label].length}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Artists</td>
        <td>${[...new Set(song_artist[dataset].all)].length}</td>`
    subcategory.id.forEach(label => {
        rows += `<td>${[...new Set(song_artist[dataset][label])].length}</td>`
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
        <td>${findMode(song_artist[dataset].all)}</td>`
    subcategory.id.forEach(label => {
        rows2 += `<td>${findMode(song_artist[dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    rows2 += `
    <tr>
        <td>Top Origin</td>
        <td>${findMode(song_origin[dataset].all)}</td>`
    subcategory.id.forEach(label => {
        rows2 += `<td>${findMode(song_origin[dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    rows2 += `
    <tr>
        <td>Top Platform</td>
        <td>${findMode(song_platform[dataset].all)}</td>`
    subcategory.id.forEach(label => {
        rows2 += `<td>${findMode(song_platform[dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    HTMLcontent += rows2 + `</table>`
    const stats = document.getElementById(dataset + "_songs_stats_stats_" + subcategory.suffix)
    stats.innerHTML += HTMLcontent;
}
function displayRandomSong(dataset) {
    const randomIndex = Math.floor(Math.random() * songs[dataset].r.length);
    const randomSong = songs[dataset].r[randomIndex];
    let line2 = ''
    if (randomSong.dataset == 'Pop') {
        line2 = randomSong.artist
    } else {
        line2 = randomSong.origin
    }
    let line3 = randomSong.year
    if (randomSong.dataset == 'VGM') {
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