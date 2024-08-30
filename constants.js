// Google Cloud Console API Key
const API_KEY = 'AIzaSyAjGqbuuZ_yycY90TBIwCEiFaCjo_pFb-Y';
const SPREADSHEET_ID = '1gqRp8MS1Xy8A0ERUGOfjVoRN_7bowGdC_1Axp1nZgbE';
const RANGES = {
    pop: 'Pop!A:J',
    film: 'Film!A:J',
    vgm: 'VGM!A:J',
    covers: 'Covers!A:J'
};
const albumTabSections = ['art', 'stats', 'era', 'durations', 'artists']
const categories = ['all', 'nonfav', 'fav', 'v', 'mv', 'm', 'mi', 'i', 'solo', 'group', 'male', 'female'];
const favallfav = ['all', 'fav']
const allFav = {
    suffix: 'isFav',
    id: ['fav', 'nonfav'],
    abbrev: ['Super Favs', 'Favs'],
    labels: ['Super Favorites', 'Favorites'],
    colors: ['slateblue', 'dodgerblue']
}
const vi = {
    suffix: 'vi',
    id: ['v', 'mv', 'm', 'mi', 'i'],
    abbrev: ['V', 'MV', 'M', 'MI', 'I'],
    labels: ['Vocal', 'Mostly Vocal', 'Mixed', 'Mostly Inst.', 'Instrumental'],
    colors: ['tomato', 'orange', 'gold', 'mediumseagreen', 'dodgerblue']
}
const sg = {
    suffix: 'sg',
    id: ['solo', 'group'],
    abbrev: ['Solo', 'Group'],
    labels: ['Solo', 'Group'],
    colors: ['tomato', 'mediumseagreen']
}
const mf = {
    suffix: 'mf',
    id: ['male', 'female'],
    abbrev: ['Male', 'Female'],
    labels: ['Male', 'Female'],
    colors: ['dodgerblue', 'tomato']
}
const subCategories = [allFav, vi, sg, mf]
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
const statTypes = [
    { label: 'Mean', abbrev: 'mean', func: findMean },
    { label: 'Median', abbrev: 'median', func: findMedian },
    { label: 'Mode', abbrev: 'mode', func: findMode },
    { label: 'Std. dev', abbrev: 'stdev', func: findStandardDeviation }
];