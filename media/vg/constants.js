// const vgRangeIDs = dataTypes[2].datasets.map(dataset => dataset.toLowerCase())
// let vgDatasets = [...dataTypes[2].datasets];
// vgDatasets.push('Combined');
// const vgDatasetIDs = vgDatasets.map(dataset => dataset.toLowerCase())
// const vgTabSections = ['era', 'stats', 'developers', 'publishers']
// const vgSubCategories = [
//     {
//         suffix: 'fav',
//         id: ['fav', 'nonfav'],
//         identifier: ['F', ''],
//         abbrev: ['Favorites', 'Played'],
//         labels: ['Favorites', 'Played'],
//         colors: ['dodgerblue', 'mediumseagreen']
//     },
//     {
//         suffix: 'nsw',
//         id: ['nsw', 'nonnsw'],
//         identifier: ['', 'R', 'N'],
//         abbrev: ['On NSW', 'Remake', 'Formerly NSW', 'Not on NSW'],
//         labels: ['On NSW', 'Remake', 'Formerly NSW', 'Not on NSW'],
//         colors: ['mediumseagreen', 'gold', 'orange', 'tomato']
//     }
// ]
// let vgCategories = ['all']
// vgSubCategories.forEach(subcategory => {
//     subcategory.id.forEach(id => {
//         vgCategories.push(id)
//     })
// })
// const vgChartTypes = [
//     {
//         id: 'vg_years',
//         sheetid: 'year',
//         title: 'Games by Year',
//         x_axis: 'Year',
//         units: 'years'
//     }
// ]
// const nominalvgChartTypes = [
//     {
//         id: 'developers',
//         sheetid: 'developer',
//         title: 'Developer'
//     },
//     {
//         id: 'publishers',
//         sheetid: 'publisher',
//         title: 'Publisher'
//     },
//     {
//         id: 'vg_platform',
//         sheetid: 'platform',
//         title: 'Platform'
//     }
// ]
// const vgPieChartTypes = [
//     {
//         id: 'num_vg',
//         title: '# of Games'
//     }
// ]
// const vgElementIDs = ['vg_years', 'vg_stats', 'vg_developers', 'vg_publishers']