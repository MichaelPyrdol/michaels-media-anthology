// Google Cloud Console API Key
const API_KEY = 'AIzaSyAjGqbuuZ_yycY90TBIwCEiFaCjo_pFb-Y';
const SPREADSHEET_ID = '1gqRp8MS1Xy8A0ERUGOfjVoRN_7bowGdC_1Axp1nZgbE';
const albumRange = '!A:K'
const songRange = 'S!A:J'
const mediums = ['albums', 'songs', 'all']
const rangeso = ['Pop', 'Film', 'TV', 'VGM', 'Covers', 'Other']
// const rangeso = ['TV']
const rangeIDs = rangeso.map(dataset => dataset.toLowerCase())
let datasets = [...rangeso];
datasets.push('Combined');
const datasetIDs = datasets.map(dataset => dataset.toLowerCase())
const albumTabSections = ['art', 'era', 'stats', 'artists', 'list', 'durations']
const songTabSections = ['era', 'stats', 'artists', 'media','RSG']
const datasetData = {
    suffix: 'dataset',
    id: rangeIDs,
    identifier: rangeso,
    abbrev: rangeso,
    labels: rangeso,
    colors: ['dodgerblue', 'tomato', 'gold', 'mediumseagreen', 'slateblue', 'darkgray']
}
const allFav = {
    suffix: 'fav',
    id: ['fav', 'nonfav'],
    identifier:['F',''],
    abbrev: ['Super Favs', 'Favs'],
    labels: ['Super Favorites', 'Favorites'],
    colors: ['slateblue', 'dodgerblue']
}
const albumsVi = {
    suffix: 'vi',
    id: ['v', 'mv', 'm', 'mi', 'i'],
    identifier:['V', 'MV', 'M', 'MI', 'I'],
    abbrev: ['V', 'MV', 'M', 'MI', 'I'],
    labels: ['Vocal', 'Mostly Vocal', 'Mixed', 'Mostly Inst.', 'Instrumental'],
    colors: ['tomato', 'orange', 'gold', 'mediumseagreen', 'dodgerblue']
}
const sg = {
    suffix: 'solo_group',
    id: ['solo', 'group'],
    identifier:['S','G'],
    abbrev: ['Solo', 'Group'],
    labels: ['Solo', 'Group'],
    colors: ['tomato', 'mediumseagreen']
}
const mf = {
    suffix: 'gender',
    id: ['male', 'female', 'various'],
    identifier:['M','F','V'],
    abbrev: ['Male', 'Female', 'Various'],
    labels: ['Male', 'Female', 'Various'],
    colors: ['dodgerblue', 'tomato', 'gray']
}
const albumsStreaming = {
    suffix: 'ns',
    id: ['streaming', 'nonstreaming'],
    identifier:['','N'],
    abbrev: ['Streaming', 'Non-streaming'],
    labels: ['Streaming', 'Non-streaming'],
    colors: ['mediumseagreen', 'tomato']
}
const albumSubCategories = [allFav, albumsVi, albumsStreaming, datasetData, sg, mf]
const songsAllFav = {
    suffix: 'fav',
    id: ['fav', 'nonfav'],
    identifier:['F',''],
    abbrev: ['Super Favs', 'Favs'],
    labels: ['Super Favorites', 'Favorites'],
    colors: ['slateblue', 'dodgerblue']
}
const songsVi = {
    suffix: 'vi',
    id: ['v', 'i'],
    identifier:['V','I'],
    abbrev: ['Vocal', 'Instrumental'],
    labels: ['Vocal', 'Instrumental'],
    colors: ['tomato', 'dodgerblue']
}
const songsR = {
    suffix: 'r',
    id: ['fav_r', 'r', 'non_r'],
    identifier:['F','R',''],
    abbrev: ['Recitable Favs', 'Recitable', 'Non-recitable'],
    labels: ['Recitable Favorites', 'Recitable', 'Non-recitable'],
    colors: ['slateblue', 'mediumseagreen', 'tomato']
}
const songsAlbum = {
    suffix: 'album',
    id: ['album', 'nonalbum'],
    identifier:['A',''],
    abbrev: ['Album', 'Non-album'],
    labels: ['Album Songs', 'Non-album Songs'],
    colors: ['dodgerblue', 'tomato']
}
const songsStreaming = {
    suffix: 'ns',
    id: ['streaming', 'nonstreaming'],
    identifier:['','N'],
    abbrev: ['Streaming', 'Non-streaming'],
    labels: ['Streaming', 'Non-streaming'],
    colors: ['mediumseagreen', 'tomato']
}
const songSubCategories = [songsAllFav, songsVi, songsStreaming, datasetData, songsR, songsAlbum]
let albumCategories = ['all']
let songCategories = ['all']
albumSubCategories.forEach(subcategory => {
    subcategory.id.forEach(id => {
        albumCategories.push(id)
    })
})
songSubCategories.forEach(subcategory => {
    subcategory.id.forEach(id => {
        songCategories.push(id)
    })
})
const album_years_config = {
    id: 'album_years',
    title: 'Albums by Year',
    x_axis: 'Year',
    units: 'years'
}
const num_songs_config = {
    id: 'num_songs',
    title: 'Songs Per Album',
    x_axis: '# of Songs',
    units: 'songs'
}
const duration_config = {
    id: 'duration',
    title: 'Album Duration (minutes)',
    x_axis: 'Album Duration (minutes)',
    units: 'minutes'
}
const avg_song_duration_config = {
    id: 'avg_song_duration',
    title: 'Average Song Duration (minutes)',
    x_axis: 'Average Song Duration (minutes)',
    units: 'minutes'
}
const chartTypes = [album_years_config, num_songs_config, duration_config, avg_song_duration_config]
const album_artist_config = {
    id: 'album_artists',
    title: 'Artist'
}
const nationality_config = {
    id: 'nationality',
    title: 'Nationality'
}
const vi_config = {
    id: 'vi',
    title: 'Vocal or Instrumental'
}
const nominalChartTypes = [album_artist_config, nationality_config, vi_config]
const num_albums_config = {
    id: 'num_albums',
    title: '# of Albums'
}
const song_num_songs_config = {
    id: 'song_num_songs',
    title: '# of Songs'
}
const song_years_config = {
    id: 'song_years',
    title: 'Songs by Year',
    x_axis: 'Year',
    units: 'years'
}
const song_artist_config = {
    id: 'song_artists',
    title: 'Artist'
}
const song_origin_config = {
    id: 'song_origin',
    title: 'Origin'
}
const song_platform_config = {
    id: 'song_platform',
    title: 'Platform'
}
const nominalSongChartTypes = [song_artist_config, song_origin_config, song_platform_config]
const albumElementIDs = ["album_years", "durations", 'stats', "album_artists_chart",'album_list'];
const songElementIDs = ["song_years", 'songs_stats', 'song_artists_chart', 'song_media'];
const statTypes = [
    { label: 'Mean', abbrev: 'mean', func: findMean },
    { label: 'Median', abbrev: 'median', func: findMedian },
    { label: 'Mode', abbrev: 'mode', func: findMode },
    { label: 'Std. dev', abbrev: 'stdev', func: findStandardDeviation }
];