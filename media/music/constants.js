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
const albumSubCategories = [fav, albumsVi, streaming, sg, mf]
// Songs
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
const songSubCategories = [songsFav, songsVi, streaming, songsR, songsAlbum]
const allMusicFav = {
    suffix: 'fav',
    id: ['albumfav', 'songfav', 'nonsongfav', 'nonalbumfav'],
    identifier: ['A', 'S', '', 'NS'],
    abbrev: ['Album Super Favs', 'Song Super Favs', 'Album Favs', 'Song Favs'],
    labels: ['Album Favorites', 'Song Favorites', 'Album', 'Song'],
    colors: ['slateblue', 'deeppink', 'dodgerblue', 'tomato']
}
const allMusicSubCategories = [allMusicFav, albumsVi, streaming, songsR]
const albumChartTypes = [
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
const albumsNominalChartTypes = [
    {
        id: 'artist',
        title: 'Artist'
    },
    {
        id: 'nationality',
        title: 'Nationality'
    }
]
const albumPieChartTypes = []
const songChartTypes = []
const songsNominalChartTypes = [
    {
        id: 'artist',
        title: 'Artist'
    },
    {
        id: 'origin',
        title: 'Origin'
    },
    {
        id: 'platform',
        title: 'Platform'
    }
]
const songPieChartTypes = []
const allMusicChartTypes = []
const allMusicNominalChartTypes = [
    {
        id: 'artist',
        title: 'Artist'
    },
    {
        id: 'origin',
        title: 'Origin'
    },
    {
        id: 'platform',
        title: 'Platform'
    }
]
const allMusicPieChartTypes = []