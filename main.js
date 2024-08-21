gapi.load("client", loadClient);
google.charts.load('current', { 'packages': ['corechart'] });
document.addEventListener('keydown', function (event) {
    if (event.shiftKey) {
        Object.keys(RANGES).forEach(dataset => {
            const viElementIDs = ["years_vi", "num_songs_vi", "duration_vi", "avg_song_duration_vi"];
            const nonViElementIDs = ["years", "num_songs", "duration", "avg_song_duration"];
            const anyViVisible = viElementIDs.some(id => {
                const element = document.getElementById(dataset + "_" + id);
                return element && (element.style.display !== 'none' && element.style.display !== '');
            });
            viElementIDs.forEach(id => {
                const element = document.getElementById(dataset + "_" + id);
                if (element) {
                    element.style.display = anyViVisible ? 'none' : 'block';
                }
            });
            nonViElementIDs.forEach(id => {
                const element = document.getElementById(dataset + "_" + id);
                if (element) {
                    element.style.display = anyViVisible ? 'block' : 'none';
                }
            });
        });
    }
});
const units = ['years', 'songs', 'minutes', 'minutes']
function fixStats(dataset) {
    const toRound = ['years_mean', 'years_median', 'num_songs_mean', 'num_songs_stdev']
    const cats = ['all', 'fav']
    toRound.forEach(cat => {
        const toRoundy_all = document.getElementById(dataset + "_" + cat + '_all')
        toRoundy_all.innerHTML = Math.round(toRoundy_all.innerHTML);
        const toRoundy_fav = document.getElementById(dataset + "_" + cat + '_fav')
        toRoundy_fav.innerHTML = Math.round(toRoundy_fav.innerHTML);
    })
    cats.forEach(cat => {
        const num_songs_sum = findSum(num_songs[dataset][cat]);
        const duration_sum = findSum(duration[dataset][cat]);
        const avg_song_duration_mean = duration_sum / num_songs_sum;
        const avg_song_duration_mean_elem = document.getElementById(dataset + '_avg_song_duration_mean_' + cat);
        avg_song_duration_mean_elem.innerText = avg_song_duration_mean.toFixed(1);
    })
    for (i = 0; i < catIDs.length; i++) {
        const stdev_all = document.getElementById(dataset + "_" + catIDs[i] + '_stdev_all')
        stdev_all.innerText += ' ' + units[i];
        const stdev_fav = document.getElementById(dataset + "_" + catIDs[i] + '_stdev_fav')
        stdev_fav.innerText += ' ' + units[i];
    }
}