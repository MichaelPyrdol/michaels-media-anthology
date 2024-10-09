const franchises = [
    { name: 'Banjo', class: 'banjo' },
    { name: 'Donkey Kong', class: 'dk' },
    { name: 'Final Fantasy', class: 'finalfantasy' },
    { name: 'Half-Life', class: 'half-life' },
    { name: 'Kirby', class: 'kirby' },
    { name: 'Mario', class: 'mario' },
    { name: 'Metroid', class: 'metroid' },
    { name: 'Pikmin', class: 'pikmin' },
    { name: 'Super Smash Bros.', class: 'smash' },
    { name: 'Wario', class: 'wario' },
    { name: 'Zelda', class: 'zelda' }
]
const vgSubCategories = [
    {
        suffix: 'fav',
        id: ['fav', 'nonfav'],
        identifier: ['F', ''],
        abbrev: ['Favorites', 'Played'],
        labels: ['Favorites', 'Played'],
        colors: ['dodgerblue', 'mediumseagreen']
    },
    {
        suffix: 'nsw',
        id: ['nsw', 'remake', 'fnsw', 'nonnsw'],
        identifier: ['', 'R', 'F', 'N'],
        abbrev: ['On NSW', 'Remake', 'Formerly NSW', 'Not on NSW'],
        labels: ['On NSW', 'Remake', 'Formerly NSW', 'Not on NSW'],
        colors: ['mediumseagreen', 'gold', 'orange', 'tomato']
    }
]
const vgChartTypes = []
const vgNominalChartTypes = [
    {
        id: 'developer',
        title: 'Developer'
    },
    {
        id: 'publisher',
        title: 'Publisher'
    },
    {
        id: 'platform',
        title: 'Platform'
    },
    {
        id: 'franchise',
        title: 'Franchise'
    }
]
const vgPieChartTypes = []
const nswSubCategories = [
    {
        suffix: 'fav',
        id: ['fav', 'partialfav', 'nonfav'],
        identifier: ['F', 'P', ''],
        abbrev: ['Favorites', 'Partial Favorites', 'Owned'],
        labels: ['Favorites', 'Partial Favs', 'Owned'],
        colors: ['dodgerblue', 'gold', 'mediumseagreen']
    },
    {
        suffix: 'port',
        id: ['port', 'remake', 'og'],
        identifier: ['P', 'R', ''],
        abbrev: ['Port', 'Remake', 'NSW'],
        labels: ['Port', 'Remake', 'NSW'],
        colors: ['dodgerblue', 'mediumseagreen', 'tomato']
    },
    {
        suffix: 'availability',
        id: ['unavailable', 'online', 'available'],
        identifier: ['N', 'O', ''],
        abbrev: ['Unavailable', 'Online', 'Available'],
        labels: ['Unavailable', 'Online', 'Available'],
        colors: ['tomato', 'gold', 'mediumseagreen']
    },
    {
        suffix: 'played',
        id: ['played', 'partialplay', 'notplayed'],
        identifier: ['', 'P', 'N'],
        abbrev: ['Played', 'Partial', 'Not Played'],
        labels: ['Played', 'Partial', 'Not Played'],
        colors: ['mediumseagreen', 'gold', 'tomato']
    }
]
const nswChartTypes = []
const nominalnswChartTypes = [
    {
        id: 'publisher',
        title: 'Publisher'
    },
    {
        id: 'platform',
        title: 'Platform'
    },
    {
        id: 'franchise',
        title: 'Franchise'
    }
]
const nswPieChartTypes = []