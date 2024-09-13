let chartsReadyCount = 0;
gapi.load("client", loadClient);
google.charts.load('current', { 'packages': ['corechart'] });
const mediaTabs=document.getElementById('mediaTabs')
const mediaTabContent=document.getElementById('mediaTabContent')
// media.forEach((type, index) => {
//     mediaTabs.innerHTML += `<li class="${type.toLowerCase}"><a href="#${type.toLowerCase()}">${type}</a></li>`
//     // mediaTabContent.innerHTML += `<div id="${type.toLowerCase}" class="tab main active" data-index='${index}'></div>`
// })
const datasetTabs = document.getElementById('musicTabs')
const datasetTabContent = document.getElementById('musicTabContent')
dataTypes[0].datasetIDs.forEach((dataset, index) => {
    datasetTabs.innerHTML += `<li class="${dataset}"><a href="#${dataset}">${dataTypes[0].combined[index]}</a></li>`
    datasetTabContent.innerHTML += `<div id="${dataset}" class="tab main active" data-index='${index}'></div>`
    populateHTML(dataset, dataTypes[0].combined[index]);
    fixView(dataset, 'none')
})
// const vgTabs = document.getElementById('vgTabs')
// const vgTabContent = document.getElementById('vgTabContent')
// dataTypes[2].datasetIDs.forEach((dataset, index) => {
//     vgTabs.innerHTML += `<li class="${dataset}"><a href="#${dataset}">${dataTypes[2].combined[index]}</a></li>`
//     vgTabContent.innerHTML += `<div id="${dataset}" class="tab main active" data-index='${index}'></div>`
//     VGpopulateHTML(dataset, dataTypes[2].combined[index]);
//     // fixView(dataset, 'none')
// })
// dataTypes[2].datasetIDs.forEach((dataset, index) => {
//     VGpopulateHTML(dataset, dataTypes[2].datasets[index])
//     console.log(dataStore.vgData[index])
//     processvgData(dataStore.vgData[index], dataset)
// })
const tabs = document.querySelectorAll('.dataset-tabs li');
const tabContents = document.querySelectorAll('.main-tab-content .main');
const visitedTabs = new Set();
tabs.forEach(tab => {
    tab.addEventListener('click', function (event) {
        event.preventDefault();
        const activeTab = tab.querySelector('a').getAttribute('href');
        const tabContent = document.querySelector(activeTab);
        if (!visitedTabs.has(activeTab)) {
            // document.getElementById('loadingOverlay').style.display = 'flex';
            const index = tabContent.getAttribute('data-index')
            const range = tabContent.id
            fixView(range, '')
            processAlbumData(dataStore.albumsData[index], range);
            processSongData(dataStore.songsData[index], range);
            processAllData(range)
            visitedTabs.add(activeTab);
        }
        tabContents.forEach(tabContent => {
            tabContent.style.display = 'none';
        });
        tabs.forEach(item => item.classList.remove('active'));
        tab.classList.add("active");

        tabContent.style.display = '';
    });
});
setupTabs('.media-tabs li', '.media-tab')
setupTabs('.medium-tabs li', '.medium-tab');
musicMediums.forEach(medium => {
    setupTabs('.' + medium + '-tabs li', '.' + medium + '-tab-content .tab');
})
function setupTabs(tabsSelector, tabContentSelector) {
    const tabs = document.querySelectorAll(tabsSelector);
    const tabContents = document.querySelectorAll(tabContentSelector);
    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            tabContents.forEach(tabContent => {
                tabContent.style.display = 'none';
                tabContent.classList.remove('active');
            });
            tabs.forEach(item => item.classList.remove('active'));

            tab.classList.add("active");
            const activeTab = tab.querySelector('a').getAttribute('href');
            const tabSection = document.querySelectorAll("." + activeTab.slice(activeTab.indexOf('_') + 1));
            document.querySelector(activeTab).style.display = '';
            tabSection.forEach(section => {
                section.style.display = '';
                section.classList.add('active');
            });
        });
    });
}
musicMediums.forEach((medium, index) => {
    const keyMap = {};
    for (let i = 0; i < subcategories[index].length; i++) {
        keyMap[(i + 1).toString()] = subcategories[index][i].suffix;
    }
    document.addEventListener('keydown', function (event) {
        if (event.key in keyMap) {
            dataTypes[0].datasetIDs.forEach(dataset => {
                const suffix = keyMap[event.key];
                elementIDs[index].forEach(id => {
                    subcategories[index].forEach(subcategory => {
                        const section = document.getElementById(dataset + "_" + id + "_" + subcategory.suffix);
                        section.style.display = 'none';
                    });
                });
                elementIDs[index].forEach(id => {
                    const chart = document.getElementById(dataset + "_" + id + "_" + suffix);
                    chart.style.display = '';
                });
            });
        }
    });
})