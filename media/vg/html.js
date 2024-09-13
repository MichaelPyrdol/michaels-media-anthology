function VGpopulateHTML(dataset, label) {
    let HTMLcontent = mediumTabs(dataset, 'vg', vgTabSections)
    let currentTab = document.getElementById(dataset)
    currentTab.innerHTML = HTMLcontent;
}