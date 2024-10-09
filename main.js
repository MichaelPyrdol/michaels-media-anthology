const mediaTabs = document.getElementById('mediaTabs')
const mediaTabContent = document.getElementById('mediaTabContent')
media.forEach((mediaType, mediaIndex) => {
    mediaTabs.innerHTML += `<li class="${mediaType.id}_tab"><a href="#_${mediaType.id}-tab">${mediaType.label}</a></li>`
    mediaTabContent.innerHTML +=
        `<div id="_${mediaType.id}-tab" class='media-tab' data-mediaIndex='${mediaIndex}'>
            <ul id='${mediaType.id}Tabs' class="${mediaType.id}-tabs dataset tabs"></ul>
            <div id='${mediaType.id}TabContent' class="${mediaType.id}-tab-content"></div>
        </div>`
})
let chartsReadyCount = 0;
let numCharts = 0;
if (data) {
    gapi.load("client", loadClient);
    google.charts.load('current', { 'packages': ['corechart'] });
}
media.forEach((mediaType, mediaIndex) => {
    const datasetTabs = document.getElementById(mediaType.id + 'Tabs')
    const datasetTabContent = document.getElementById(mediaType.id + 'TabContent')
    mediaType.dataTypes[0].datasetIDs.forEach((dataset, datasetIndex) => {
        datasetTabs.innerHTML += `<li class="${dataset}"><a href="${mediaType.id}_${dataset}">${mediaType.dataTypes[0].combined[datasetIndex]}</a></li>`
        datasetTabContent.innerHTML += `<div id="${mediaType.id}_${dataset}" class="tab main" data-index='${datasetIndex}' style='display:none'></div>`
        setupMediumTabs(dataset, mediaType.dataTypes[0].combined[datasetIndex], mediaType, mediaIndex)
        mediaType.populateHTML(dataset, mediaType);
        mediaType.mediums.forEach((medium, mediumIndex) => {
            fixView(dataset, mediaType, mediumIndex, 'none')
        })
    })
    document.getElementById('_' + mediaType.id + '-tab').style.display = 'none'
})
let visitedMediaTabs = new Set()
let visitedMediumTabs = new Set()
media.forEach(mediaType => {
    mediaType.visitedTabs = new Set()
    const tabs = document.querySelectorAll('.' + mediaType.id + '-tabs.dataset li');
    const tabContents = document.querySelectorAll('.' + mediaType.id + '-tab-content .main');
    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            const activeTab = tab.querySelector('a').getAttribute('href');
            const tabContent = document.getElementById(activeTab);
            const dataset = tabContent.id.split('_')[1]
            const activeSection = document.querySelector('#' + mediaType.id + '_' + dataset + ' div.active[data-mediumIndex]')
            let mediumIndex = 0
            if (activeSection) {
                mediumIndex = activeSection.getAttribute('data-mediumIndex')
            }
            const mediumID = mediaType.mediumIDs[mediumIndex]
            if (!mediaType.visitedTabs.has(activeTab)) {
                const dataIndex = tabContent.getAttribute('data-index')
                organization(dataset, dataIndex, mediaType)
                if (activeSection || mediaType.visitedTabs.size == 0) {
                    process(dataset, mediaType, mediumIndex)
                    visitedMediumTabs.add(dataset + '_' + mediumID);
                    if (mediaType.visitedTabs.size == 0) {
                        const mediumTabs = document.querySelectorAll('.medium-tabs li');
                        const mediumTab = document.querySelector('li.' + mediumID + '.' + dataset)
                        const mediumTabContentSelector = '.medium-tab-content'
                        const mediumTabContents = document.querySelectorAll(mediumTabContentSelector);
                        simulateTab(mediumTabs, mediumTab, mediumTabContents, mediumTabContentSelector)
                        const tabSectionTabs = document.querySelectorAll('.tabSection-tabs.medium li');
                        const tabSectionTab = document.querySelector('li.' + mediumID + '_' + mediaType.tabSections[mediumIndex][0] + '.' + dataset)
                        const tabSectionTabContentSelector = '.tabSection-tab-content.medium .tab'
                        const tabSectionTabContents = document.querySelectorAll(tabSectionTabContentSelector);
                        simulateTab(tabSectionTabs, tabSectionTab, tabSectionTabContents, tabSectionTabContentSelector)
                        mediaType.dataTypes[0].datasetIDs.forEach(datase => {
                            mediaType.mediums.forEach((medium, medIndex) => {
                                const suffix = mediaType.subcategories[medIndex][0].suffix;
                                simulateKey(mediaType, medIndex, datase, suffix)
                            })
                        })
                    }
                }
                mediaType.visitedTabs.add(activeTab);
            } else if (!visitedMediumTabs.has(dataset + '_' + mediumID)) {
                process(dataset, mediaType, mediumIndex)
                visitedMediumTabs.add(dataset + '_' + mediumID);
            }
            tabContents.forEach(tabContent => {
                tabContent.style.display = 'none';
            });
            tabs.forEach(item => item.classList.remove('active'));
            tab.classList.add("active");
            tabContent.style.display = '';
        });
    });
    prepareKeyBinds(mediaType)
    mediaType.mediums.forEach((medium, mediumIndex) => {
        mediaType.mediumData[mediumIndex] = initializeObject(mediaType.categories[mediumIndex], mediaType.dataTypes[0].datasetIDs);
        mediaType.categoryData[mediumIndex] = initialization(mediaType.chartTypes[mediumIndex], mediaType.nominalChartTypes[mediumIndex], mediaType.categories[mediumIndex], mediaType.dataTypes[0].datasetIDs);
        mediaType.mediumCats[mediumIndex] = mediaType.chartTypes[mediumIndex].map(cat => mediaType.categoryData[mediumIndex][cat.id]);
        mediaType.mediumNominalCats[mediumIndex] = mediaType.nominalChartTypes[mediumIndex].map(cat => mediaType.categoryData[mediumIndex][cat.id]);
    })
})
function organization(dataset, dataIndex, mediaType) {
    mediaType.mediumIDs.forEach((mediumID, mediumIndex) => {
        if (mediumID == 'all') {
            prepareAllMusic(dataset, mediaType, mediumIndex)
        } else {
            mediaType.mediumData[mediumIndex][dataset].all = convertToObjects(mediaType.dataTypes[mediumIndex].dataStore[dataIndex]);
        }
        organizeData(dataset, mediaType, mediumIndex)
    })
}
function process(dataset, mediaType, mediumIndex) {
    const mediumID = mediaType.mediumIDs[mediumIndex]
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        numCharts +=
            mediaType.chartTypes[mediumIndex].length +
            1 + // Decade
            mediaType.nominalChartTypes[mediumIndex].length +
            mediaType.pieChartTypes[mediumIndex].length
    })
    fixView(dataset, mediaType, mediumIndex, '')
    mediaType.subcategories[mediumIndex].forEach(subcategory => {
        createCharts(dataset, subcategory, mediaType, mediumIndex)
        if (mediumID != 'all') {
            generateList(dataset, subcategory, mediaType, mediumIndex)
        }
    })
    mediaType.processData[mediumIndex](dataset, mediaType, mediumIndex)
    fixStats(dataset, mediaType, mediumIndex)
}
setupTabs('.media-tabs li', '.media-tab')
setupTabs('.medium-tabs li', '.medium-tab-content');
setupTabs('.tabSection-tabs.medium li', '.tabSection-tab-content.medium .tab');
function setupTabs(tabsSelector, tabContentSelector) {
    const tabs = document.querySelectorAll(tabsSelector);
    const tabContents = document.querySelectorAll(tabContentSelector);
    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            simulateTab(tabs, tab, tabContents, tabContentSelector)
        });
    });
}
function simulateTab(tabs, tab, tabContents, tabContentSelector) {
    const activeTab = tab.querySelector('a').getAttribute('href');
    const tabContent = document.getElementById(activeTab.slice(1));
    if (tabContentSelector == '.medium-tab-content') {
        const mediumIndex = tabContent.getAttribute('data-mediumIndex')
        const mediaIndex = tabContent.getAttribute('data-mediaIndex')
        const dataset = tabContent.id.split('_')[0]
        if (!visitedMediumTabs.has(dataset + '_' + media[mediaIndex].mediumIDs[mediumIndex])) {
            process(dataset, media[mediaIndex], mediumIndex)
            visitedMediumTabs.add(dataset + '_' + media[mediaIndex].mediumIDs[mediumIndex]);
        }
    } else if (tabContentSelector == '.media-tab') {
        const mediaTab = tabContent.id.split('-')[0]
        const mediaIndex = tabContent.getAttribute('data-mediaIndex')
        backgroundColor = media[mediaIndex].backgroundColor
        const root = document.documentElement;
        root.style.setProperty('--background', backgroundColor);
        if (!visitedMediaTabs.has(mediaTab)) {
            media[mediaIndex].dataTypes.forEach(dataType => {
                loadDataType(dataType)
            })
            visitedMediaTabs.add(mediaTab)
        }
    }
    tabContents.forEach(tabContent => {
        tabContent.style.display = 'none';
        tabContent.classList.remove('active');
    });
    tabs.forEach(item => item.classList.remove('active'));
    tab.classList.add("active");
    let tabSection = document.querySelectorAll("." + activeTab.split('_')[activeTab.split('_').length - 1]);
    tabSection = [...tabSection, ...document.querySelectorAll("." + activeTab.split('_')[1])]
    document.querySelector(activeTab).style.display = '';
    tabSection.forEach(section => {
        section.style.display = '';
        section.classList.add('active');
    });
}
function prepareKeyBinds(mediaType) {
    mediaType.subcategories.forEach((subcategoryGroup, mediumIndex) => {
        const keyMap = {};
        for (let i = 0; i < subcategoryGroup.length; i++) {
            keyMap[(i + 1).toString()] = subcategoryGroup[i].suffix;
        }
        document.addEventListener('keydown', function (event) {
            if (event.key in keyMap) {
                mediaType.dataTypes[0].datasetIDs.forEach(dataset => {
                    const suffix = keyMap[event.key];
                    simulateKey(mediaType, mediumIndex, dataset, suffix)
                });
            }
        });
    })
}
function simulateKey(mediaType, mediumIndex, dataset, suffix) {
    const mediumName = mediaType.mediumIDs[mediumIndex]
    mediaType.tabSections[mediumIndex].forEach(id => {
        mediaType.subcategories[mediumIndex].forEach(subcategory => {
            const section = document.getElementById(dataset + "_" + mediumName + '_' + id + "_" + subcategory.suffix);
            section.style.display = 'none';
            section.classList.remove('active')
        });
    });
    mediaType.tabSections[mediumIndex].forEach(id => {
        const chart = document.getElementById(dataset + "_" + mediumName + '_' + id + "_" + suffix);
        chart.style.display = '';
        chart.classList.add('active')
    });
}
function fixView(dataset, mediaType, mediumIndex, expandCollapse) {
    const mediumID = mediaType.mediumIDs[mediumIndex]
    mediaType.tabSections[mediumIndex].forEach(tabSection => {
        mediaType.subcategories[mediumIndex].forEach(subcategory => {
            const subcat = document.getElementById(dataset + "_" + mediumID + '_' + tabSection + "_" + subcategory.suffix)
            fixElement(subcat, expandCollapse)
        })
        const tabSect = document.getElementById(dataset + "_" + mediumID + "_" + tabSection)
        fixElement(tabSect, expandCollapse)
    })
    const mediumTab = document.getElementById(dataset + '_' + mediumID)
    fixElement(mediumTab, expandCollapse)
    if (expandCollapse == '') {
        const datasetTab = document.getElementById(mediaType.id + '_' + dataset)
        fixElement(datasetTab, expandCollapse)
    }
}
function fixElement(elem, expandCollapse) {
    if (expandCollapse == 'none') {
        if (!elem.classList.contains('active')) {
            elem.style.display = expandCollapse
        }
    } else {
        elem.style.display = expandCollapse
    }
}