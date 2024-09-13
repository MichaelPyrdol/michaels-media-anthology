const all = initializeObject(allCategories,dataTypes[1]);
const allData = initialization(allChartTypes, nominalAllChartTypes, allCategories,dataTypes[1]);
const allCats = allChartTypes.map(cat => allData[cat.id]);
const nominalAllCats = nominalAllChartTypes.map(cat => allData[cat.id]);
function processAllData(dataset) {
    const albumsCopy = albums[dataset].all
    const songsCopy = songs[dataset].all
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
    const otherArrayCopy = [...songs[dataset].all];
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
    all[dataset].all = [...expandedAlbums, ...songsCopy]
    organizeData(dataset, all, 'all', allCats, nominalAllCats, allChartTypes, nominalAllChartTypes, allCategories, allSubCategories)
    allSubCategories.forEach(subcategory => {
        createCharts(dataset, subcategory, all, allChartTypes, nominalAllChartTypes, allPieChartTypes, allCats, nominalAllCats, all_decades_config)
        songStats(all, 'all', dataset, subcategory, allData['all_artists'], allData['all_origin'], allData['all_platform'])
    })
}