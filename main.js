const datasets = Object.keys(RANGES);
datasets.push('combined');
const albums = initializeObject();
const album_artist = initializeObject();
const album_title = initializeObject();
const album_years = initializeObject();
const num_songs = initializeObject();
const duration = initializeObject();
const avg_song_duration = initializeObject();
const nationality = initializeObject();
datasets.forEach(dataset => {
    populateHTML(dataset);
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
        document.querySelector(activeTab).style.display = 'block';
    });
});
const albumTabs = document.querySelectorAll('.album-tabs li');
const albumTabContents = document.querySelectorAll('.tab-content .tab');
albumTabs.forEach(tab => {
    tab.addEventListener('click', function (event) {
        event.preventDefault();
        albumTabContents.forEach(tabContent => {
            tabContent.style.display = 'none';
            tabContent.classList.remove('active')
        })
        albumTabs.forEach(item => item.classList.remove('active'));
        tab.classList.add("active")
        const activeTab = tab.querySelector('a').getAttribute('href');
        const tabSection = document.querySelectorAll("." + activeTab.split("_")[1])
        document.querySelector(activeTab).style.display = 'block';
        tabSection.forEach(section => {
            section.style.display = 'block'
            section.classList.add('active')
        })
    });
});
const keyMap = {
    '1': "isFav",
    '2': "vi",
    '3': "sg",
    '4': "mf"
};
document.addEventListener('keydown', function (event) {
    if (event.key in keyMap) {
        datasets.forEach(dataset => {
            const suffix = keyMap[event.key];
            const elementIDs = ["album_years", "num_songs", "duration", "avg_song_duration", "artist"];
            elementIDs.forEach(id => {
                subCategories.forEach(subcategory => {
                    const chart = document.getElementById(dataset + "_" + id + "_chart_" + subcategory.suffix);
                    chart.style.display = 'none';
                });
            });
            chartTypes.forEach(chartType => {
                subCategories.forEach(subcategory => {
                    const stats = document.getElementById(dataset + "_" + chartType.id + "_chartStats_" + subcategory.suffix);
                    stats.style.display = 'none';
                });
            })
            subCategories.forEach(subcategory => {
                const stats = document.getElementById(dataset + "_stats_" + subcategory.suffix);
                stats.style.display = 'none';
            })
            elementIDs.forEach(id => {
                const chart = document.getElementById(dataset + "_" + id + "_chart_" + suffix);
                chart.style.display = 'block';
            });
            chartTypes.forEach(chartType => {
                const stats = document.getElementById(dataset + "_" + chartType.id + "_chartStats_" + suffix);
                stats.style.display = 'block';
            });
            subCategories.forEach(subcategory => {
                const stats = document.getElementById(dataset + "_stats_" + suffix);
                stats.style.display = 'block';
            })
        });
    }
});
function fixStats(dataset) {
    const elemsToRound = ['album_years_mean', 'album_years_median', 'num_songs_mean', 'num_songs_stdev']
    subCategories.forEach(subcategory => {
        subcategory.id.forEach(ide => {
            elemsToRound.forEach(elem => {
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
}