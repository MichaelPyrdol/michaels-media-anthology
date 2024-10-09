function processMoviesData(dataset, mediaType, mediumIndex) {
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        generateMoreStats(dataset, subcategory, mediaType, mediumIndex)
    })
}