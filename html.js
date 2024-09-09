function populateHTML(dataset, label) {
    let currentTab = document.getElementById(dataset)
    let HTMLcontent = `<ul class="medium-tabs tabs">`
    mediums.forEach(medium => {
        HTMLcontent += `<li class="${medium} ${dataset}"><a href="#${dataset}_${medium}">${medium.charAt(0).toUpperCase() + medium.slice(1)}</a></li>`
    })
    HTMLcontent += `
        </ul>
        <div id='${dataset}_albums' class='medium-tab-content medium-tab albums'>
        <ul class="album-tabs tabs">`
    albumTabSections.forEach(albumTabSection => {
        HTMLcontent += `<li class="albums_${albumTabSection} ${dataset}"><a href="#${dataset}_albums_${albumTabSection}">${albumTabSection.charAt(0).toUpperCase() + albumTabSection.slice(1)}</a></li>`
    })
    HTMLcontent +=
        `</ul>
        <div class="album-tab-content">`
    albumTabSections.forEach(albumTabSection => {
        HTMLcontent += `<div id="${dataset}_albums_${albumTabSection}" class="tab albums_${albumTabSection} active"></div>`
    })
    HTMLcontent += `</div>
    </div>
    <div id='${dataset}_songs' class='medium-tab-content medium-tab songs'>
    <ul class="song-tabs tabs">`
    songTabSections.forEach(songTabSection => {
        HTMLcontent += `<li class="songs_${songTabSection} ${dataset}"><a href="#${dataset}_songs_${songTabSection}">${songTabSection.charAt(0).toUpperCase() + songTabSection.slice(1)}</a></li>`
    })
    HTMLcontent +=
        `</ul>
        <div class="song-tab-content">`
    songTabSections.forEach(songTabSection => {
        HTMLcontent += `<div id="${dataset}_songs_${songTabSection}" class="tab songs_${songTabSection} active"></div>`
    })
    HTMLcontent += `</div>`;
    HTMLcontent += `</div><div id='${dataset}_all' class='medium-tab-content medium-tab all'></div>`
    currentTab.innerHTML = HTMLcontent;
    albumTabSections.forEach(albumTabSection => {
        const tab = document.getElementById(dataset + "_albums_" + albumTabSection)
        tab.innerHTML = `<h2>${label} - ${albumTabSection.charAt(0).toUpperCase() + albumTabSection.slice(1)}</h2>`
    })
    songTabSections.forEach(songTabSection => {
        const tab = document.getElementById(dataset + "_songs_" + songTabSection)
        tab.innerHTML = `<h2>${label} - ${songTabSection.charAt(0).toUpperCase() + songTabSection.slice(1)}</h2>`
    })
    const art = document.getElementById(dataset + "_albums_art")
    art.innerHTML += `<div id="${dataset}_artDiv" class="art2"></div>`
    const stats = document.getElementById(dataset + "_albums_stats")
    albumSubCategories.forEach(subcategory => {
        stats.innerHTML += `
        <div id="${dataset}_stats_${subcategory.suffix}">
            <div id="${dataset}_num_albums_pieChart_${subcategory.suffix}" class='pieChart'></div>
            <div id="${dataset}_stats_stats_${subcategory.suffix}"></div>
            <div id=${dataset}_nationality_chart_${subcategory.suffix} class="stats_chart"></div>
            <div id=${dataset}_vi_chart_${subcategory.suffix} class="stats_chart"></div>
        </div>`
    })
    const era = document.getElementById(dataset + "_albums_era")
    const artists = document.getElementById(dataset + "_albums_artists")
    const list = document.getElementById(dataset + "_albums_list")
    albumSubCategories.forEach(subcategory => {
        era.innerHTML += populateEraTab(dataset, 'album_years', subcategory)
        artists.innerHTML += `<div id=${dataset}_album_artists_chart_${subcategory.suffix} class="artist_chart"></div>`
        list.innerHTML += `<div id=${dataset}_album_list_${subcategory.suffix} class="list container"></div>`
    })
    const durations = document.getElementById(dataset + "_albums_durations")
    albumSubCategories.forEach(subcategory => {
        let durationsHTML = `<div id="${dataset}_durations_${subcategory.suffix}">`
        chartTypes.slice(1).forEach(chartType => {
            durationsHTML += `
            <div id="${dataset}_${chartType.id}_${subcategory.suffix}" class="container">
                <div id="${dataset}_${chartType.id}_chartStats_${subcategory.suffix}" class='chartStats'></div>
                <div id="${dataset}_${chartType.id}_chart_${subcategory.suffix}" class="${chartType.id}_chart ${chartType.id}"></div>
            </div>`
        })
        durationsHTML += `</div>`
        durations.innerHTML += durationsHTML
    })
    // Song tabs
    const songsEra = document.getElementById(dataset + "_songs_era")
    songSubCategories.forEach(subcategory => {
        songsEra.innerHTML += populateEraTab(dataset, 'song_years', subcategory)
    })
    const songStats = document.getElementById(dataset + "_songs_stats")
    songSubCategories.forEach(subcategory => {
        songStats.innerHTML += `
        <div id="${dataset}_songs_stats_${subcategory.suffix}">
            <div id="${dataset}_song_num_songs_pieChart_${subcategory.suffix}" class='pieChart'></div>
            <div id="${dataset}_songs_stats_stats_${subcategory.suffix}" class='songs_stats_stats'></div>
        </div>`
    })
    const songArtists = document.getElementById(dataset + "_songs_artists")
    songSubCategories.forEach(subcategory => {
        songArtists.innerHTML += `<div id=${dataset}_song_artists_chart_${subcategory.suffix} class="artist_chart"></div>`
    })
    const songMedia = document.getElementById(dataset + "_songs_media")
    songSubCategories.forEach(subcategory => {
        songMedia.innerHTML += `
        <div id="${dataset}_song_media_${subcategory.suffix}">
            <div id=${dataset}_song_origin_chart_${subcategory.suffix} class="media_chart"></div>
            <div id=${dataset}_song_platform_chart_${subcategory.suffix} class="media_chart"></div>
        </div>`
    })
    const RSG = document.getElementById(dataset + "_songs_RSG")
    RSG.innerHTML += `
    <div id="${dataset}_songDisplay" class='songDisplay ${dataset}'></div>
    <br>
    <button onclick="displayRandomSong('${dataset}')">Generate Random Song</button>`
    // All tabs
    // const all=document.getElementById(dataset+'_all')
    // all.innerHTML=populateEraTab(dataset,'all_years',songSubCategories[0])
}
function populateEraTab(dataset, chartType, subcategory) {
    let HTMLSection = `
    <div id="${dataset}_${chartType}_${subcategory.suffix}">
        <div id="${dataset}_${chartType}_chart_${subcategory.suffix}" class="years"></div>
        <div id="${dataset}_${chartType}_chartStats_${subcategory.suffix}" class='songChartStats'></div>
    </div>`
    return HTMLSection;
}