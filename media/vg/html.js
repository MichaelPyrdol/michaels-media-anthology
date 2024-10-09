function vgPopulateHTML(dataset, mediaType) {
    mediaType.mediumIDs.forEach((medium, index) => {
        const nominalChartTypes = ['platform', 'publisher', 'franchise']
        nominalChartTypes.forEach(nominalChartType => {
            const tab = document.getElementById(dataset + "_" + medium + "_" + nominalChartType)
            mediaType.subcategories[index].forEach(subcategory => {
                tab.innerHTML += populateNominalChartTab(dataset, medium, nominalChartType, subcategory)
            })
        })
    })
    const developer = document.getElementById(dataset + "_games_developer")
    mediaType.subcategories[0].forEach(subcategory => {
        developer.innerHTML += populateNominalChartTab(dataset, 'games', 'developer', subcategory)
    })
}