const musicMediums = ['albums', 'songs', 'all']
const musicTabSections = [
    ['art', 'era', 'stats', 'artists', 'list', 'durations'], // Albums
    ['era', 'stats', 'artists', 'media', 'RSG'], // Songs
    ['era', 'stats', 'artists', 'media'] // All
]
const datasetData = {
    suffix: 'dataset',
    id: dataTypes[0].datasets.map(dataset => dataset.toLowerCase()),
    identifier: dataTypes[0].datasets,
    abbrev: dataTypes[0].datasets,
    labels: dataTypes[0].datasets,
    colors: ['dodgerblue', 'tomato', 'gold', 'mediumseagreen', 'slateblue', 'darkgray']
}
const fav = {
    suffix: 'fav',
    id: ['fav', 'nonfav'],
    identifier: ['F', ''],
    abbrev: ['Super Favs', 'Favs'],
    labels: ['Super Favorites', 'Favorites'],
    colors: ['slateblue', 'dodgerblue']
}
const streaming = {
    suffix: 'ns',
    id: ['streaming', 'nonstreaming'],
    identifier: ['', 'N'],
    abbrev: ['Streaming', 'Non-streaming'],
    labels: ['Streaming', 'Non-streaming'],
    colors: ['mediumseagreen', 'tomato']
}
const albumsVi = {
    suffix: 'vi',
    id: ['v', 'mv', 'm', 'mi', 'i'],
    identifier: ['V', 'MV', 'M', 'MI', 'I'],
    abbrev: ['V', 'MV', 'M', 'MI', 'I'],
    labels: ['Vocal', 'Mostly Vocal', 'Mixed', 'Mostly Inst.', 'Instrumental'],
    colors: ['tomato', 'orange', 'gold', 'mediumseagreen', 'dodgerblue']
}
const sg = {
    suffix: 'solo_group',
    id: ['solo', 'group'],
    identifier: ['S', 'G'],
    abbrev: ['Solo', 'Group'],
    labels: ['Solo', 'Group'],
    colors: ['tomato', 'mediumseagreen']
}
const mf = {
    suffix: 'gender',
    id: ['male', 'female', 'various'],
    identifier: ['M', 'F', 'V'],
    abbrev: ['Male', 'Female', 'Various'],
    labels: ['Male', 'Female', 'Various'],
    colors: ['dodgerblue', 'tomato', 'gray']
}
const albumSubCategories = [fav, albumsVi, streaming, datasetData, sg, mf]
const songsFav = {
    suffix: 'fav',
    id: ['fav', 'nonfav'],
    identifier: ['F', ''],
    abbrev: ['Super Favs', 'Favs'],
    labels: ['Super Favorites', 'Favorites'],
    colors: ['deeppink', 'tomato']
}
const songsVi = {
    suffix: 'vi',
    id: ['v', 'i'],
    identifier: ['V', 'I'],
    abbrev: ['Vocal', 'Instrumental'],
    labels: ['Vocal', 'Instrumental'],
    colors: ['tomato', 'dodgerblue']
}
const songsR = {
    suffix: 'r',
    id: ['fav_r', 'r', 'non_r'],
    identifier: ['F', 'R', ''],
    abbrev: ['Recitable Favs', 'Recitable', 'Non-recitable'],
    labels: ['Recitable Favorites', 'Recitable', 'Non-recitable'],
    colors: ['slateblue', 'mediumseagreen', 'tomato']
}
const songsAlbum = {
    suffix: 'album',
    id: ['album', 'nonalbum'],
    identifier: ['A', ''],
    abbrev: ['Album', 'Non-album'],
    labels: ['Album Songs', 'Non-album Songs'],
    colors: ['dodgerblue', 'tomato']
}
const songSubCategories = [songsFav, songsVi, streaming, datasetData, songsR, songsAlbum]
const allFav = {
    suffix: 'fav',
    id: ['albumfav', 'songfav', 'nonsongfav', 'nonalbumfav'],
    identifier: ['A', 'S', '', 'NS'],
    abbrev: ['Album Super Favs', 'Song Super Favs', 'Album Favs', 'Song Favs'],
    labels: ['Album Favorites', 'Song Favorites', 'Album', 'Song'],
    colors: ['slateblue', 'deeppink', 'dodgerblue', 'tomato']
}
const allSubCategories = [allFav, albumsVi, streaming, datasetData, songsR]
const subcategories = [albumSubCategories, songSubCategories, allSubCategories]
let albumCategories = ['all']
let songCategories = ['all']
let allCategories = ['all']
let categories = [albumCategories, songCategories, allCategories]
categories.forEach((category, index) => {
    subcategories[index].forEach(subcategory => {
        subcategory.id.forEach(id => {
            category.push(id)
        })
    })
})
const albumChartTypes = [
    {
        id: 'albums_years',
        sheetid: 'year',
        title: 'Albums by Year',
        x_axis: 'Year',
        units: 'years'
    },
    {
        id: 'num_songs',
        sheetid: 'num_songs',
        title: 'Songs Per Album',
        x_axis: '# of Songs',
        units: 'songs'
    },
    {
        id: 'duration',
        sheetid: 'duration',
        title: 'Album Duration (minutes)',
        x_axis: 'Album Duration (minutes)',
        units: 'minutes'
    },
    {
        id: 'avg_song_duration',
        sheetid: 'avg_song_duration',
        title: 'Average Song Duration (minutes)',
        x_axis: 'Average Song Duration (minutes)',
        units: 'minutes'
    }
]
const songs_decades_config={
    id: 'songs_decades',
        sheetid: 'year',
        title: 'Songs by Decade',
        x_axis: 'Decade',
        units: 'years'
}
const albums_decades_config={
    id: 'albums_decades',
        sheetid: 'year',
        title: 'Albums by Decade',
        x_axis: 'Decade',
        units: 'years'
}
const all_decades_config={
    id: 'all_decades',
        sheetid: 'year',
        title: 'Songs by Decade',
        x_axis: 'Decade',
        units: 'years'
}
const nominalAlbumChartTypes = [
    {
        id: 'albums_artists',
        sheetid: 'artist',
        title: 'Artist'
    },
    {
        id: 'nationality',
        sheetid: 'nationality',
        title: 'Nationality'
    },
    {
        id: 'vi',
        sheetid: 'vi',
        title: 'Vocal or Instrumental'
    }
]
const albumPieChartTypes = [
    {
        id: 'num_albums',
        title: '# of Albums'
    }
]
const songChartTypes = [
    {
        id: 'songs_years',
        sheetid: 'year',
        title: 'Songs by Year',
        x_axis: 'Year',
        units: 'years'
    }
]
const nominalSongChartTypes = [
    {
        id: 'songs_artists',
        sheetid: 'artist',
        title: 'Artist'
    },
    {
        id: 'songs_origin',
        sheetid: 'origin',
        title: 'Origin'
    },
    {
        id: 'songs_platform',
        sheetid: 'platform',
        title: 'Platform'
    }
]
const songPieChartTypes = [
    {
        id: 'songs_num_songs',
        title: '# of Songs'
    }
]
const allChartTypes = [
    {
        id: 'all_years',
        sheetid: 'year',
        title: 'Songs by Year',
        x_axis: 'Year',
        units: 'years'
    }
]
const nominalAllChartTypes = [
    {
        id: 'all_artists',
        sheetid: 'artist',
        title: 'Artist'
    },
    {
        id: 'all_origin',
        sheetid: 'origin',
        title: 'Origin'
    },
    {
        id: 'all_platform',
        sheetid: 'platform',
        title: 'Platform'
    }
]
const allPieChartTypes = [
    {
        id: 'all_num_songs',
        title: '# of Songs'
    }
]
// const chartTypes = [albumChartTypes, songChartTypes, allChartTypes]
// const nominalChartTypes = [nominalAlbumChartTypes, nominalSongChartTypes, nominalAllChartTypes]
// const pieChartTypes = [albumPieChartTypes, songPieChartTypes, allPieChartTypes]
const elementIDs = [
    ["albums_years", "durations", 'stats', "albums_artists_chart", 'album_list'],
    ["songs_years", 'songs_stats', 'songs_artists_chart', 'songs_media'],
    ['all_years', 'all_stats', 'all_artists_chart', 'all_media']
]