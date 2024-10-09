function setupMediumTabs(dataset, label, mediaType, mediaIndex) {
    let HTMLcontent = '';
    // if (mediaType.mediums.length > 1) {
    HTMLcontent += `<ul class="medium-tabs tabs">`
    mediaType.mediumIDs.forEach((medium, mediumIndex) => {
        HTMLcontent += `<li class="${medium} ${dataset}"><a href="#${dataset}_${medium}">${mediaType.mediums[mediumIndex]}</a></li>`
    })
    HTMLcontent += `</ul>`
    // }
    mediaType.mediumIDs.forEach((medium, mediumIndex) => {
        HTMLcontent += mediumTabs(dataset, medium, mediumIndex, mediaType.tabSections[mediumIndex], mediaIndex)
    })
    let currentTab = document.getElementById(mediaType.id + '_' + dataset)
    currentTab.innerHTML = HTMLcontent;
    mediaType.mediumIDs.forEach((medium, mediumIndex) => {
        // Labels
        mediaType.tabSections[mediumIndex].forEach(tabSection => {
            const tab = document.getElementById(dataset + "_" + medium + "_" + tabSection)
            tab.innerHTML =
                `<h3>${mediaType.mediums[mediumIndex]}</h3>
                <h2>${label} - ${tabSection.charAt(0).toUpperCase() + tabSection.slice(1)}</h2>`
        })
        // List / Era / Stats / ABC
        const list = document.getElementById(dataset + '_' + medium + '_list')
        const era = document.getElementById(dataset + '_' + medium + "_era")
        const stats = document.getElementById(dataset + '_' + medium + '_stats')
        const abc = document.getElementById(dataset + '_' + medium + '_ABC')
        mediaType.subcategories[mediumIndex].forEach(subcategory => {
            era.innerHTML += populateEraTab(dataset, medium, subcategory)
            stats.innerHTML += populateStatsTab(dataset, medium, subcategory)
            if (medium != 'all') {
                list.innerHTML += `<div id=${dataset}_${medium}_list_${subcategory.suffix} class="container"></div>`
                abc.innerHTML +=
                    `<div id=${dataset}_${medium}_ABC_${subcategory.suffix}>` +
                    populateNominalChartTab(dataset, medium, 'words', subcategory) +
                    populateChartStats(dataset, medium, 'ABClength', subcategory) +
                    populateChartStats(dataset, medium, 'ABCwords', subcategory) +
                    `</div>`
            }
        })
    })
}
function mediumTabs(dataset, medium, mediumIndex, tabSections, mediaIndex) {
    let HTMLcontent = `
        <div id='${dataset}_${medium}' class='medium-tab-content medium-tab ${medium}' data-mediumIndex='${mediumIndex}' data-mediaIndex='${mediaIndex}'>
        <ul class="tabSection-tabs medium tabs">`
    tabSections.forEach(tabSection => {
        HTMLcontent += `<li class="${medium}_${tabSection} ${dataset} ${tabSection}"><a href="#${dataset}_${medium}_${tabSection}">${tabSection.charAt(0).toUpperCase() + tabSection.slice(1)}</a></li>`
    })
    HTMLcontent +=
        `</ul>
        <div class="tabSection-tab-content medium">`
    tabSections.forEach(tabSection => {
        HTMLcontent += `<div id="${dataset}_${medium}_${tabSection}" class="tab ${tabSection}"></div>`
    })
    HTMLcontent += `</div></div>`
    return HTMLcontent
}
function populateEraTab(dataset, medium, subcategory) {
    const HTMLSection =
        `<div id="${dataset}_${medium}_era_${subcategory.suffix}">
            <div id="${dataset}_${medium}_year_chart_${subcategory.suffix}" class="years"></div>
            <div id="${dataset}_${medium}_year_chartStats_${subcategory.suffix}" class='autoMargin'></div>
            <div id="${dataset}_${medium}_decades_chart_${subcategory.suffix}" class="years"></div>
        </div>`
    return HTMLSection;
}
function populateStatsTab(dataset, medium, subcategory) {
    const HTMLcontent =
        `<div id="${dataset}_${medium}_stats_${subcategory.suffix}">
            <div class='container statsContainer'>
                <div id="${dataset}_${medium}_num_pieChart_${subcategory.suffix}" class='pieChart'></div>
                <div id="${dataset}_${medium}_stats_stats_${subcategory.suffix}" class='chartStats'></div>
            </div>
            <div id="${dataset}_${medium}_stats_moreStats_${subcategory.suffix}" class='autoMargin'></div>
        </div>`
    return HTMLcontent
}
function populateChartStats(dataset, medium, chartType, subcategory) {
    const HTMLcontent =
        `<div id="${dataset}_${medium}_${chartType}_${subcategory.suffix}" class="container">
            <div id="${dataset}_${medium}_${chartType}_chart_${subcategory.suffix}" class="durations_chart"></div>
            <div id="${dataset}_${medium}_${chartType}_chartStats_${subcategory.suffix}" class='chartStats'></div>
        </div>`
    return HTMLcontent
}
function populateNominalChartTab(dataset, medium, chartType, subcategory) {
    const HTMLcontent =
        `<div id=${dataset}_${medium}_${chartType}_${subcategory.suffix}>
            <div id=${dataset}_${medium}_${chartType}_chart_${subcategory.suffix} class="nominal_chart">
        </div>`
    return HTMLcontent
}