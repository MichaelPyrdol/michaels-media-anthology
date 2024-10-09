const root = document.documentElement;
let backgroundColor = getComputedStyle(root).getPropertyValue('--background').trim();
// Google Cloud Console API Key
const API_KEY = 'AIzaSyAjGqbuuZ_yycY90TBIwCEiFaCjo_pFb-Y';
const dataTypes = [
    {
        id: 'albums',
        sheetID: '1xQNaduKID_0DefxZZOawv6ze69WejbLl-fJwpz3Uxik',
        range: '!A:M',
        datasets: ['Pop', 'Film', 'TV', 'VGM', 'Covers', 'Other'],
        colors: ['dodgerblue', 'tomato', 'gold', 'mediumseagreen', 'slateblue', 'darkgray']
    },
    {
        id: 'songs',
        sheetID: '1xQNaduKID_0DefxZZOawv6ze69WejbLl-fJwpz3Uxik',
        range: 'S!A:J',
        datasets: ['Pop', 'Film', 'TV', 'VGM', 'Covers', 'Other'],
        colors: ['dodgerblue', 'tomato', 'gold', 'mediumseagreen', 'slateblue', 'darkgray']
    },
    {
        id: 'movies',
        sheetID: '183TQf4P00LxAOzDaxEjPWh1S2CvFdVFAgi-nykWlXDc',
        range: '!A:F',
        datasets: ['Live-Action', 'Animated', 'Other'],
        colors: ['tomato', 'mediumseagreen', 'darkgray']
    },
    {
        id: 'games',
        sheetID: '1mGvXignLmopmraXDnCUg2mqd2lw3hAv3h0aDJ9pIZvk',
        range: '!A:G',
        datasets: ['VG', 'Compilation'],
        colors: ['mediumseagreen', 'slateblue']
    },
    {
        id: 'nsw',
        sheetID: '1mGvXignLmopmraXDnCUg2mqd2lw3hAv3h0aDJ9pIZvk',
        range: 'N!A:I',
        datasets: ['VG', 'Compilation'],
        colors: ['mediumseagreen', 'slateblue']
    }
]
dataTypes.forEach(dataType => {
    dataType.combined = dataType.datasets
    if (dataType.datasets.length > 1) {
        dataType.combined = [...dataType.datasets, 'Combined']
    }
    dataType.datasetIDs = dataType.combined.map(dataset => dataset.toLowerCase())
    dataType.dataStore = []
})
const media = [
    {
        id: 'music',
        label: 'Music',
        mediums: ['Albums', 'Songs', 'All'],
        dataTypes: [dataTypes[0], dataTypes[1]],
        tabSections:
            [
                ['artist', 'nationality', 'durations'], // Albums
                ['artist', 'media', 'RSG'], // Songs
                ['artist', 'media'] // All
            ],
        subcategories: [albumSubCategories, songSubCategories, allMusicSubCategories],
        chartTypes: [albumChartTypes, songChartTypes, allMusicChartTypes],
        nominalChartTypes: [albumsNominalChartTypes, songsNominalChartTypes, allMusicNominalChartTypes],
        pieChartTypes: [albumPieChartTypes, songPieChartTypes, allMusicPieChartTypes],
        processData: [processAlbumsData, processSongsData, processAllMusicData],
        populateHTML: musicPopulateHTML,
        backgroundColor: 'lightblue'
    },
    {
        id: 'movies',
        label: 'Movie',
        mediums: ['Movies'],
        dataTypes: [dataTypes[2]],
        tabSections: [['director', 'studio']],
        subcategories: [moviesSubCategories],
        chartTypes: [moviesChartTypes],
        nominalChartTypes: [moviesNominalChartTypes],
        pieChartTypes: [moviesPieChartTypes],
        processData: [processMoviesData],
        populateHTML: moviesPopulateHTML,
        backgroundColor: 'lightpink'
    },
    {
        id: 'vg',
        label: 'VG',
        mediums: ['Games', 'NSW'],
        dataTypes: [dataTypes[3], dataTypes[4]],
        tabSections: [
            ['platform', 'franchise', 'developer', 'publisher'],
            ['platform', 'franchise', 'publisher']
        ],
        subcategories: [vgSubCategories, nswSubCategories],
        chartTypes: [vgChartTypes, nswChartTypes],
        nominalChartTypes: [vgNominalChartTypes, nominalnswChartTypes],
        pieChartTypes: [vgPieChartTypes, nswPieChartTypes],
        processData: [processvgData, processnswData],
        populateHTML: vgPopulateHTML,
        backgroundColor: '#a3e6a1'
    }
]
let totalCharts = 0;
media.forEach(mediaType => {
    const datasets = mediaType.dataTypes[0].datasets
    mediaType.categories = []
    mediaType.mediumIDs = []
    mediaType.mediumData = []
    mediaType.categoryData = []
    mediaType.mediumCats = []
    mediaType.mediumNominalCats = []
    mediaType.decades = []
    mediaType.mediums.forEach(medium => {
        mediaType.decades.push({
            id: 'decades',
            title: medium + ' by Decade',
            x_axis: 'Decade',
            units: 'years'
        })
    })
    mediaType.chartTypes.forEach((chartTypeGroup, mediumIndex) => {
        chartTypeGroup.splice(0, 0, {
            id: 'year',
            title: mediaType.mediums[mediumIndex] + ' by Year',
            x_axis: 'Year',
            units: 'years'
        })
        if (mediaType.mediums[mediumIndex] != 'All') {
            chartTypeGroup.splice(1, 0, {
                id: 'ABClength',
                title: mediaType.mediums[mediumIndex] + ' Title Length',
                x_axis: '# of Characters',
                units: 'chars'
            }, {
                id: 'ABCwords',
                title: mediaType.mediums[mediumIndex] + ' - # of Words',
                x_axis: '# of Words',
                units: 'words'
            })
        }
    })
    mediaType.nominalChartTypes.forEach((nominalChartTypeGroup, mediumIndex) => {
        if (mediaType.mediums[mediumIndex] != 'All') {
            nominalChartTypeGroup.splice(0, 0, {
                id: 'words',
                title: 'Words'
            })
        }
        nominalChartTypeGroup.forEach(nominalChartType => {
            nominalChartType.plural = makePlural(nominalChartType.title)
        })
    })
    mediaType.pieChartTypes.forEach((pieChartTypeGroup, mediumIndex) => {
        pieChartTypeGroup.splice(0, 0, {
            id: 'num',
            title: '# of ' + mediaType.mediums[mediumIndex]
        })
    })
    mediaType.subcategories.forEach((subcategoryGroup, mediumIndex) => {
        subcategoryGroup.splice(0, 0, {
            suffix: 'dataset',
            id: datasets.map(dataset => dataset.toLowerCase()),
            identifier: datasets,
            abbrev: datasets,
            labels: datasets,
            colors: mediaType.dataTypes[0].colors
        })
        mediaType.categories.push(['all'])
        subcategoryGroup.forEach(subcategory => {
            subcategory.id.forEach(id => {
                mediaType.categories[mediumIndex].push(id)
            })
            totalCharts +=
                (mediaType.chartTypes[mediumIndex].length +
                    1 +
                    mediaType.nominalChartTypes[mediumIndex].length +
                    mediaType.pieChartTypes[mediumIndex].length)
                * mediaType.dataTypes[0].combined.length
        })
        mediaType.mediumIDs.push(mediaType.mediums[mediumIndex].toLowerCase())
    })
    mediaType.tabSections.forEach((tabSectionGroup, mediumIndex) => {
        tabSectionGroup.splice(0, 0, ...['era', 'stats'])
        if (mediaType.mediumIDs[mediumIndex] != 'all') {
            tabSectionGroup.splice(0, 0, 'list')
            tabSectionGroup.splice(3, 0, 'ABC')
        }
    })
})
const progressBar = document.getElementById('progress-bar')
progressBar.max = totalCharts
const statTypes = [
    { label: 'Mean', abbrev: 'mean', func: findMean },
    { label: 'Median', abbrev: 'median', func: findMedian },
    { label: 'Mode', abbrev: 'mode', func: findMode },
    { label: 'Std. dev', abbrev: 'stdev', func: findStandardDeviation }
];