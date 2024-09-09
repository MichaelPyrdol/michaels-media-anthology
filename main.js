let chartsReadyCount = 0;
const datasetTabs = document.getElementById('datasetTabs')
const datasetTabContent = document.getElementById('datasetTabContent')
datasetIDs.forEach((dataset, index) => {
    datasetTabs.innerHTML += `<li class="${dataset}"><a href="#${dataset}">${datasets[index]}</a></li>`
    datasetTabContent.innerHTML += `<div id="${dataset}" class="tab main active"></div>`
    populateHTML(dataset, datasets[index]);
})
gapi.load("client", loadClient);
google.charts.load('current', { 'packages': ['corechart'] });
const tabs = document.querySelectorAll('.dataset-tabs li');
const tabContents = document.querySelectorAll('.main-tab-content .main');
tabs.forEach(tab => {
    tab.addEventListener('click', function (event) {
        event.preventDefault();
        tabContents.forEach(tabContent => {
            tabContent.style.display = 'none';
        })
        tabs.forEach(item => item.classList.remove('active'));
        tab.classList.add("active")
        const activeTab = tab.querySelector('a').getAttribute('href');
        document.querySelector(activeTab).style.display = '';
    });
});
setupTabs('.medium-tabs li', '.medium-tab');
setupTabs('.album-tabs li', '.album-tab-content .tab');
setupTabs('.song-tabs li', '.song-tab-content .tab');
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
const keyMap = {};
for (let i = 0; i < albumSubCategories.length; i++) {
    keyMap[(i + 1).toString()] = albumSubCategories[i].suffix;
}
document.addEventListener('keydown', function (event) {
    if (event.key in keyMap) {
        datasetIDs.forEach(dataset => {
            const suffix = keyMap[event.key];
            albumElementIDs.forEach(id => {
                albumSubCategories.forEach(subcategory => {
                    const section = document.getElementById(dataset + "_" + id + "_" + subcategory.suffix);
                    section.style.display = 'none';
                });
            });
            albumElementIDs.forEach(id => {
                const chart = document.getElementById(dataset + "_" + id + "_" + suffix);
                chart.style.display = '';
            });
        });
    }
});
const songKeyMap = {};
for (let i = 0; i < songSubCategories.length; i++) {
    songKeyMap[(i + 1).toString()] = songSubCategories[i].suffix;
}
document.addEventListener('keydown', function (event) {
    if (event.key in songKeyMap) {
        datasetIDs.forEach(dataset => {
            const suffix = songKeyMap[event.key];
            songElementIDs.forEach(id => {
                songSubCategories.forEach(subcategory => {
                    const chart = document.getElementById(dataset + "_" + id + "_" + subcategory.suffix);
                    chart.style.display = 'none';
                });
            });
            songElementIDs.forEach(id => {
                const chart = document.getElementById(dataset + "_" + id + "_" + suffix);
                chart.style.display = '';
            });
        });
    }
});
function fixStats(dataset) {
    const elemsToRound = ['album_years_mean', 'album_years_median', 'num_songs_mean', 'num_songs_stdev']
    albumSubCategories.forEach(subcategory => {
        subcategory.id.forEach(ide => {
            elemsToRound.forEach(elem => {
                const roundAll = document.getElementById(dataset + "_" + elem + "_" + subcategory.suffix + '_all')
                if (roundAll.innerHTML != '-') {
                    roundAll.innerHTML = Math.round(roundAll.innerHTML);
                }
                const toRound = document.getElementById(dataset + "_" + elem + '_' + ide)
                if (toRound.innerHTML != '-') {
                    toRound.innerHTML = Math.round(toRound.innerHTML);
                }
            })
            const num_songs_sum = findSum(num_songs[dataset][ide]);
            const duration_sum = findSum(duration[dataset][ide]);
            const avg_song_duration_mean = duration_sum / num_songs_sum;
            const avg_song_duration_mean_elem = document.getElementById(dataset + '_avg_song_duration_mean_' + ide);
            if (avg_song_duration_mean_elem.innerHTML != '-') {
                avg_song_duration_mean_elem.innerText = avg_song_duration_mean.toFixed(1);
            }
            chartTypes.forEach(chartType => {
                const stdev_all = document.getElementById(dataset + "_" + chartType.id + '_stdev_' + ide)
                if (stdev_all.innerHTML != "-") {
                    stdev_all.innerText += ' ' + chartType.units;
                }
            })
        })
    })
    const songElems = ['song_years_mean', 'song_years_median']
    songSubCategories.forEach(subcategory => {
        songElems.forEach(elem => {
            const roundAll = document.getElementById(dataset + "_" + elem + "_" + subcategory.suffix + '_all')
            if (roundAll.innerHTML != '-') {
                roundAll.innerHTML = Math.round(roundAll.innerHTML);
            }
            subcategory.id.forEach(ide => {
                const toRound = document.getElementById(dataset + "_" + elem + '_' + ide)
                if (toRound.innerHTML != '-') {
                    toRound.innerHTML = Math.round(toRound.innerHTML);
                }
            })
        })
    })
}