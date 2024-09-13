function moviePopulateHTML(dataset,label) {
    let HTMLcontent = mediumTabs('dataset', 'movies', movieTabSections)
    let currentTab = document.getElementById(dataset)
    currentTab.innerHTML = HTMLcontent;
}