function musicPopulateHTML(dataset, mediaType) {
    mediaType.mediumIDs.forEach((medium, index) => {
        const artist = document.getElementById(dataset + "_" + medium + "_artist")
        mediaType.subcategories[index].forEach(subcategory => {
            artist.innerHTML += populateNominalChartTab(dataset, medium, 'artist', subcategory)
        })
    })
    const nationality = document.getElementById(dataset + "_albums_nationality")
    const durations = document.getElementById(dataset + "_albums_durations")
    albumSubCategories.forEach(subcategory => {
        nationality.innerHTML += populateNominalChartTab(dataset, 'albums', 'nationality', subcategory)
        let durationsHTML = `<div id="${dataset}_albums_durations_${subcategory.suffix}">`
        albumChartTypes.slice(3).forEach(chartType => {
            durationsHTML += populateChartStats(dataset, 'albums', chartType.id, subcategory)
        })
        durationsHTML += `</div>`
        durations.innerHTML += durationsHTML
    })
    // Song tabs
    mediaType.mediumIDs.slice(1).forEach((medium, index) => {
        const media = document.getElementById(dataset + "_" + medium + "_media")
        mediaType.subcategories[index + 1].forEach(subcategory => {
            media.innerHTML +=
                `<div id="${dataset}_${medium}_media_${subcategory.suffix}">
                <div id=${dataset}_${medium}_origin_chart_${subcategory.suffix} class="nominal_chart"></div>
                <div id=${dataset}_${medium}_platform_chart_${subcategory.suffix} class="nominal_chart"></div>
            </div>`
        })
    })
    const RSG = document.getElementById(dataset + "_songs_RSG")
    RSG.innerHTML +=
        `<div id="${dataset}_songDisplay" class='${dataset}'></div>
        <br>`
    songSubCategories.forEach(subcategory => {
        RSG.innerHTML +=
            `<div id='${dataset}_songs_RSG_${subcategory.suffix}' class='container'></div>`
    })
}