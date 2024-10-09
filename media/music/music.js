function processAlbumsData(dataset, mediaType, mediumIndex) {
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        albumStats(dataset, subcategory, mediaType, mediumIndex)
    })
}
function albumStats(dataset, subcategory, mediaType, mediumIndex) {
    const nominalChartTypes = mediaType.nominalChartTypes[mediumIndex]
    let HTMLcontent = generateStatsHeader(dataset, subcategory)
    const albumStats = [
        { label: '# of Albums', func: findLength, dataset: null },
        { label: '# of Songs', func: findSum, dataset: 'num_songs' },
        { label: '# of Minutes', func: findSum, dataset: 'duration' },
        { label: '# of Hours', func: findHours, dataset: 'duration' },
        { label: '# of Days', func: findDays, dataset: 'duration' },
    ]
    albumStats.forEach(stat => {
        HTMLcontent += generateStats(dataset, subcategory, mediaType, mediumIndex, stat.label, stat.func, stat.dataset)
    })
    nominalChartTypes.forEach(nominalChartType => {
        if (!['words'].includes(nominalChartType.id)) {
            HTMLcontent += generateStats(dataset, subcategory, mediaType, mediumIndex, '# of ' + nominalChartType.plural, findUniqueLength, nominalChartType.id)
        }
    })
    HTMLcontent += `</table>`
    const stats = document.getElementById(dataset + '_albums_stats_stats_' + subcategory.suffix)
    stats.innerHTML += HTMLcontent;
    generateEvenMoreStats(dataset, subcategory, mediaType, mediumIndex)
}
// Songs
function processSongsData(dataset, mediaType, mediumIndex) {
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        generateMoreStats(dataset, subcategory, mediaType, mediumIndex)
        randomSongField(dataset, subcategory, mediaType, mediumIndex)
    })
}
function randomSongField(dataset, subcategory, mediaType, mediumIndex) {
    const RSG = document.getElementById(dataset + '_' + mediaType.mediumIDs[mediumIndex] + '_RSG_' + subcategory.suffix)
    let HTMLcontent = ''
    subcategory.id.forEach((id, index) => {
        if (mediaType.mediumData[1][dataset][id].length > 0) {
            HTMLcontent += generateDivisions(subcategory, index)
            HTMLcontent += `<button onclick="displayRandomSong('${dataset}','${id}')">Generate Random Song</button>`
        }
        HTMLcontent += `</div>`
    })
    RSG.innerHTML += HTMLcontent
}
function displayRandomSong(dataset, id) {
    const randomIndex = Math.floor(Math.random() * media[0].mediumData[1][dataset][id].length);
    const randomSong = media[0].mediumData[1][dataset][id][randomIndex];
    let line2 = '-'
    let extraClass = ''
    if (randomSong.dataset == 'Pop') {
        line2 = randomSong.artist
    } else if (randomSong.origin) {
        line2 = randomSong.origin
        extraClass = vgCheck(randomSong.origin)
    } else if (randomSong.artist) {
        line2 = randomSong.artist
    }
    let line3 = randomSong.year
    if (randomSong.platform != undefined) {
        line3 += ' - ' + randomSong.platform
    }
    const songDisplay = document.getElementById(dataset + '_songDisplay');
    const songCount = document.getElementById(dataset + '_RSG_count')
    let numSongs = 1;
    if (songCount) {
        numSongs = parseInt(songCount.innerHTML) + 1
    }
    songDisplay.innerHTML = `
    <h3 id='${dataset}_RSG_count'>${numSongs}</h3>
    <h1>&#9835; ${randomSong.title} &#9835;</h1>
    <h2><span class='${extraClass}'>${line2}</span></h2>
    <h3>${line3}</h3>
    <br>`
}
// All
function prepareAllMusic(dataset, mediaType, mediumIndex) {
    const albumsCopy = mediaType.mediumData[0][dataset].all
    const songsCopy = mediaType.mediumData[1][dataset].all
    let expandedAlbums = [];
    albumsCopy.forEach(album => {
        album.fav = ''
        const numSongs = parseInt(album.num_songs);
        for (let i = 0; i < numSongs; i++) {
            expandedAlbums.push({ ...album });
        }
    });
    songsCopy.forEach(song => {
        if (song.fav == 'F') {
            if (song.album == 'A') {
                song.fav = 'A'
            } else {
                song.fav = 'S'
            }
        } else {
            if (song.album == 'A') {
                song.fav = ''
            } else {
                song.fav = 'NS'
            }
        }
    })
    const otherArrayCopy = [...songsCopy];
    expandedAlbums = expandedAlbums.filter(album => {
        const matchIndex = otherArrayCopy.findIndex(other =>
            other.year == album.year &&
            other.artist == album.artist &&
            other.origin == album.origin
        );
        if (matchIndex != -1) {
            otherArrayCopy.splice(matchIndex, 1);
            return false;
        }
        return true;
    });
    mediaType.mediumData[mediumIndex][dataset].all = [...expandedAlbums, ...songsCopy]
}
function processAllMusicData(dataset, mediaType, mediumIndex) {
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        generateMoreStats(dataset, subcategory, mediaType, mediumIndex)
    })
}