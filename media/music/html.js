function populateHTML(dataset, label) {
    let HTMLcontent = `<ul class="medium-tabs tabs">`
    musicMediums.forEach(medium => {
        HTMLcontent += `<li class="${medium} ${dataset}"><a href="#${dataset}_${medium}">${medium.charAt(0).toUpperCase() + medium.slice(1)}</a></li>`
    })
    HTMLcontent += `</ul>`
    musicMediums.forEach((medium, index) => {
        HTMLcontent += mediumTabs(dataset, medium, musicTabSections[index])
    })
    let currentTab = document.getElementById(dataset)
    currentTab.innerHTML = HTMLcontent;
    musicMediums.forEach((medium, index) => {
        musicTabSections[index].forEach(tabSection => {
            const tab = document.getElementById(dataset + "_" + medium + "_" + tabSection)
            tab.innerHTML = `<h2>${label} - ${tabSection.charAt(0).toUpperCase() + tabSection.slice(1)}</h2>`
        })
        const era = document.getElementById(dataset + '_' + medium + "_era")
        const artists = document.getElementById(dataset + "_" + medium + "_artists")
        subcategories[index].forEach(subcategory => {
            era.innerHTML += populateEraTab(dataset, medium, subcategory)
            artists.innerHTML += `<div id=${dataset}_${medium}_artists_chart_${subcategory.suffix} class="artist_chart"></div>`
        })
    })
    const art = document.getElementById(dataset + "_albums_art")
    art.innerHTML += `<div id="${dataset}_artDiv" class="art2"></div>`
    const stats = document.getElementById(dataset + "_albums_stats")
    albumSubCategories.forEach(subcategory => {
        stats.innerHTML += `
        <div id="${dataset}_stats_${subcategory.suffix}">
            <div class='container statsContainer'>
                <div id="${dataset}_num_albums_pieChart_${subcategory.suffix}" class='pieChart'></div>
                <div id="${dataset}_stats_stats_${subcategory.suffix}" class='chartStats'></div>
            </div>
            <div id="${dataset}_stats_moreStats_${subcategory.suffix}" class='autoMargin'></div>
            <br>
            <div id=${dataset}_nationality_chart_${subcategory.suffix} class='stats_chart'></div>
            <div id=${dataset}_vi_chart_${subcategory.suffix} class='stats_chart'></div>
        </div>`
    })
    const list = document.getElementById(dataset + "_albums_list")
    albumSubCategories.forEach(subcategory => {
        list.innerHTML += `<div id=${dataset}_album_list_${subcategory.suffix} class="list container"></div>`
    })
    const durations = document.getElementById(dataset + "_albums_durations")
    albumSubCategories.forEach(subcategory => {
        let durationsHTML = `<div id="${dataset}_durations_${subcategory.suffix}">`
        albumChartTypes.slice(1).forEach(chartType => {
            durationsHTML += `
            <div id="${dataset}_${chartType.id}_${subcategory.suffix}" class="container">
                <div id="${dataset}_${chartType.id}_chart_${subcategory.suffix}" class="duration_chart"></div>
                <div id="${dataset}_${chartType.id}_chartStats_${subcategory.suffix}" class='chartStats'></div>
            </div>`
        })
        durationsHTML += `</div>`
        durations.innerHTML += durationsHTML
    })
    // Song tabs
    musicMediums.slice(1).forEach((medium, index) => {
        const songStats = document.getElementById(dataset + "_" + medium + "_stats")
        subcategories[index + 1].forEach(subcategory => {
            songStats.innerHTML += `
            <div id="${dataset}_${medium}_stats_${subcategory.suffix}">
                <div class='container statsContainer'>
                    <div id="${dataset}_${medium}_num_songs_pieChart_${subcategory.suffix}" class='pieChart'></div>
                    <div id="${dataset}_${medium}_stats_stats_${subcategory.suffix}" class='chartStats'></div>
                </div>
                <div id="${dataset}_${medium}_stats_moreStats_${subcategory.suffix}" class='autoMargin'></div>
            </div>`
        })
        const media = document.getElementById(dataset + "_" + medium + "_media")
        subcategories[index + 1].forEach(subcategory => {
            media.innerHTML += `
            <div id="${dataset}_${medium}_media_${subcategory.suffix}">
                <div id=${dataset}_${medium}_origin_chart_${subcategory.suffix} class="media_chart"></div>
                <div id=${dataset}_${medium}_platform_chart_${subcategory.suffix} class="media_chart"></div>
            </div>`
        })
    })
    const RSG = document.getElementById(dataset + "_songs_RSG")
    RSG.innerHTML += `
    <div id="${dataset}_songDisplay" class='songDisplay ${dataset}'></div>
    <br>
    <button onclick="displayRandomSong('${dataset}')">Generate Random Song</button>`
}
function populateEraTab(dataset, medium, subcategory) {
    let HTMLSection = `
    <div id="${dataset}_${medium}_years_${subcategory.suffix}">
        <div id="${dataset}_${medium}_years_chart_${subcategory.suffix}" class="years"></div>
        <div id="${dataset}_${medium}_years_chartStats_${subcategory.suffix}" class='yearChartStats'></div>
        <div id="${dataset}_${medium}_decades_chart_${subcategory.suffix}" class="years"></div>
    </div>`
    return HTMLSection;
}