function processvgData(dataset, mediaType, mediumIndex) {
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        generateMoreStats(dataset, subcategory, mediaType, mediumIndex)
    })
}
function processnswData(dataset, mediaType, mediumIndex) {
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        generateMoreStats(dataset, subcategory, mediaType, mediumIndex)
    })
}