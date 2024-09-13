// Google Cloud Console API Key
const API_KEY = 'AIzaSyAjGqbuuZ_yycY90TBIwCEiFaCjo_pFb-Y';
const dataTypes = [
    {
        id: 'albums',
        sheetID: '1xQNaduKID_0DefxZZOawv6ze69WejbLl-fJwpz3Uxik',
        range: '!A:M',
        datasets: ['Pop', 'Film', 'TV', 'VGM', 'Covers', 'Other']
    },
    {
        id: 'songs',
        sheetID: '1xQNaduKID_0DefxZZOawv6ze69WejbLl-fJwpz3Uxik',
        range: 'S!A:J',
        datasets: ['Pop', 'Film', 'TV', 'VGM', 'Covers', 'Other']
    },
    {
        id: 'movie',
        sheetID: '183TQf4P00LxAOzDaxEjPWh1S2CvFdVFAgi-nykWlXDc',
        range: '!A:D',
        datasets: ['LA', 'Animated', 'Other']
    },
    {
        id: 'vg',
        sheetID: '1mGvXignLmopmraXDnCUg2mqd2lw3hAv3h0aDJ9pIZvk',
        range: '!A:F',
        datasets: ['VG']
    }
]
dataTypes.forEach(dataType => {
    dataType.combined = [...dataType.datasets, 'Combined']
    dataType.datasetIDs = dataType.combined.map(dataset => dataset.toLowerCase())
})
const media = ['Music', 'Movies', 'VG']
const statTypes = [
    { label: 'Mean', abbrev: 'mean', func: findMean },
    { label: 'Median', abbrev: 'median', func: findMedian },
    { label: 'Mode', abbrev: 'mode', func: findMode },
    { label: 'Std. dev', abbrev: 'stdev', func: findStandardDeviation }
];