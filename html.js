function populateHTML(dataset) {
    const fixedDataset = dataset.charAt(0).toUpperCase() + dataset.slice(1);
    let currentTab = document.getElementById(dataset)
    let HTMLcontent = `
        <ul class="album-tabs tabs">`
    albumTabSections.forEach(albumTabSection => {
        HTMLcontent += `<li class="${albumTabSection}"><a href="#${dataset}_${albumTabSection}">${albumTabSection.charAt(0).toUpperCase() + albumTabSection.slice(1)}</a></li>`
    })
    HTMLcontent +=
        `</ul>
        <div class="tab-content">`
    albumTabSections.forEach(albumTabSection => {
        HTMLcontent += `<div id="${dataset}_${albumTabSection}" class="tab ${albumTabSection} active"></div>`
    })
    HTMLcontent += `</div>`;
    currentTab.innerHTML = HTMLcontent;
    albumTabSections.forEach(albumTabSection => {
        const tab = document.getElementById(dataset + "_" + albumTabSection)
        tab.innerHTML = `<h2>${fixedDataset} - ${albumTabSection.charAt(0).toUpperCase() + albumTabSection.slice(1)}</h2>`
    })
    const art = document.getElementById(dataset + "_art")
    art.innerHTML += `<div id="${dataset}_artDiv" class="art2"></div>`
    const stats = document.getElementById(dataset + "_stats")
    subCategories.forEach(subcategory=>{
        stats.innerHTML+=`
        <div id="${dataset}_stats_${subcategory.suffix}">
            <div id="${dataset}_num_albums_pieChart_${subcategory.suffix}"></div>
        </div>`
    })
    const era = document.getElementById(dataset + "_era")
    era.innerHTML += populateHTMLSection(dataset, chartTypes[0].id)
    const durations = document.getElementById(dataset + "_durations")
    chartTypes.slice(1).forEach(chartType => {
        durations.innerHTML += populateHTMLSection(dataset, chartType.id)
    })
    const artists = document.getElementById(dataset + "_artists")
    subCategories.forEach(subcategory => {
        artists.innerHTML += `<div id=${dataset}_artist_chart_${subcategory.suffix} class="artist_chart"></div>`
    })
}
function populateHTMLSection(dataset, cat) {
    let HTMLSection = `
    <div class="container">
        <div id="${dataset}_${cat}_chartStats" class="chartStats">`
    subCategories.forEach(subcategory => {
        HTMLSection += `<div id="${dataset}_${cat}_chartStats_${subcategory.suffix}"></div>`
    })
    HTMLSection += `</div>
    <div class="${cat}_chart">`
    subCategories.forEach(subcategory => {
        HTMLSection += `<div id="${dataset}_${cat}_chart_${subcategory.suffix}" class="${cat}"></div>`
    })
    HTMLSection += `</div>
    </div>`
    return HTMLSection;
}