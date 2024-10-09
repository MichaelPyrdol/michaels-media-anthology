function moviesPopulateHTML(dataset, mediaType) {
    mediaType.mediumIDs.forEach((medium, index) => {
        const director = document.getElementById(dataset + "_" + medium + "_director")
        const studio = document.getElementById(dataset + "_" + medium + "_studio")
        mediaType.subcategories[index].forEach(subcategory => {
            director.innerHTML += populateNominalChartTab(dataset, medium, 'director', subcategory)
            studio.innerHTML += populateNominalChartTab(dataset, medium, 'studio', subcategory)
        })
    })
}