const albums = initializeObject(albumCategories);
const album_artist = initializeObject(albumCategories);
const album_title = initializeObject(albumCategories);
const album_years = initializeObject(albumCategories);
const num_songs = initializeObject(albumCategories);
const duration = initializeObject(albumCategories);
const avg_song_duration = initializeObject(albumCategories);
const vi = initializeObject(albumCategories);
const nationality = initializeObject(albumCategories);
function processAlbumData(data, dataset) {
    albums[dataset].all = convertToObjects(data);
    albums[dataset].all.forEach(album => {
        let avg_song_duration = (album.duration / album.num_songs).toFixed(1);
        album.avg_song_duration = avg_song_duration;
    });
    albumSubCategories.forEach(subcategory=>{
        subcategory.id.forEach((id,index)=>{
            albums[dataset][id] = albums[dataset].all.filter(album => album[subcategory.suffix] == subcategory.identifier[index]);
        })
    })
    albumCategories.forEach(category => {
        album_artist[dataset][category] = albums[dataset][category].map(album => album.artist).filter(Boolean);
        album_title[dataset][category] = albums[dataset][category].map(album => album.title).filter(Boolean);
        album_years[dataset][category] = albums[dataset][category].map(album => album.year).filter(Boolean);
        num_songs[dataset][category] = albums[dataset][category].map(album => album.num_songs).filter(Boolean);
        duration[dataset][category] = albums[dataset][category].map(album => album.duration).filter(Boolean);
        avg_song_duration[dataset][category] = albums[dataset][category].map(album => album.avg_song_duration).filter(Boolean);
        vi[dataset][category] = albums[dataset][category].map(album => album.vi).filter(Boolean);
        nationality[dataset][category] = albums[dataset][category].map(album => album.nationality).filter(Boolean);
    });
    const albumCats = [album_years, num_songs, duration, avg_song_duration];
    const nominalAlbumCats = [album_artist, nationality, vi]
    // Generate album art
    const artDiv = document.getElementById(dataset + '_artDiv')
    albums[dataset].all.forEach(album => {
        artDiv.innerHTML += generateImage(album)
    });
    albumSubCategories.forEach(subcategory => {
        // Stats
        statsSection(dataset, subcategory)
        // List
        let listHTML = ''
        subcategory.id.forEach((id, index) => {
            if (albums[dataset][id].length > 0) {
                listHTML += `
                <div class='width' style='background-color:${subcategory.colors[index]}'>
                    <h3>${subcategory.abbrev[index]}</h3>
                    <div class='art2'>`
                albums[dataset][id].forEach(album => {
                    listHTML += generateImage(album)
                })
                listHTML += `</div></div>`
            }
        })
        const list = document.getElementById(dataset + '_album_list_' + subcategory.suffix)
        list.innerHTML = listHTML
        // Charts
        if(charts){
            chartTypes.forEach((chartType, index) => {
                chartStuff(dataset, chartType, albumCats, index, subcategory)
                chartStats(dataset, chartType, albumCats, index, subcategory)
            })
            nominalChartTypes.forEach((chartType, index) => {
                nominalChart(dataset, chartType, nominalAlbumCats, index, subcategory)
            })
            pieChart(dataset, num_albums_config, albums, subcategory)
        }else{
            fixView(dataset)
        }
    })
}
function generateImage(album) {
    let fileName = album.title.replace(/:/g, '-');
    let imgElement = document.createElement('img');
    imgElement.src = `images/${album.dataset}/${fileName}.jpeg`;
    let fallbackAttempted = false;
    imgElement.onerror = () => {
        if (!fallbackAttempted) {
            fallbackAttempted = true;
            imgElement.src = `images/${album.dataset}/${album.title}.jpeg`;
        }else {
            imgElement.onerror = null;
        }
    };
    const image = `
    <div class="containey">
        <img src="${imgElement.src}" alt="${album.title}" class="image">
        <div class="overlay">
            <p>${album.artist}<br>~<br>${album.title}</p>
        </div>
    </div>`
    return image
}
function statsSection(dataset, subcategory) {
    let HTMLcontent = `
    <table>
        <tr>
            <th></th>
            <th>All</th>`
    subcategory.abbrev.forEach(label => {
        HTMLcontent += '<th>' + label + '</th>'
    })
    HTMLcontent += '</tr>'
    let rows = '';
    rows += `
    <tr>
        <td># of Albums</td>
        <td>${albums[dataset].all.length}</td>`
    subcategory.id.forEach(label => {
        rows += `<td>${albums[dataset][label].length}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Songs</td>
        <td>${findSum(num_songs[dataset].all)}</td>`
    subcategory.id.forEach(label => {
        rows += `<td>${findSum(num_songs[dataset][label])}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Minutes</td>`
    const minutesAll = findSum(duration[dataset].all);
    rows += `<td>${minutesAll}</td>`
    subcategory.id.forEach(label => {
        const minutesID = findSum(duration[dataset][label]);
        rows += `<td>${minutesID}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Hours</td>
        <td>${Math.floor(minutesAll / 60)}h ${minutesAll % 60}m</td>`
    subcategory.id.forEach(label => {
        const minutesID = findSum(duration[dataset][label]);
        rows += `<td>${Math.floor(minutesID / 60)}h ${minutesID % 60}m</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Days</td>
        <td>${(minutesAll / 60 / 24).toFixed(1)}</td>`
    subcategory.id.forEach(label => {
        const minutesID = findSum(duration[dataset][label]);
        rows += `<td>${(minutesID / 60 / 24).toFixed(1)}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Artists</td>
        <td>${[...new Set(album_artist[dataset].all)].length}</td>`
    subcategory.id.forEach(label => {
        rows += `<td>${[...new Set(album_artist[dataset][label])].length}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Nationalities</td>
        <td>${[...new Set(nationality[dataset].all)].length}</td>`
    subcategory.id.forEach(label => {
        rows += `<td>${[...new Set(nationality[dataset][label])].length}</td>`
    })
    rows += `</tr>`;
    HTMLcontent += rows + `</table>`
    HTMLcontent += `
    <table>
        <tr>
            <th></th>
            <th>All</th>`
    subcategory.abbrev.forEach(label => {
        HTMLcontent += '<th>' + label + '</th>'
    })
    let rows2 = ''
    rows2 += `
    <tr>
        <td>Top Artist</td>
        <td>${findMode(album_artist[dataset].all)}</td>`
    subcategory.id.forEach(label => {
        rows2 += `<td>${findMode(album_artist[dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    rows2 += `
    <tr>
        <td>Top Nationality</td>
        <td>${findMode(nationality[dataset].all)}</td>`
    subcategory.id.forEach(label => {
        rows2 += `<td>${findMode(nationality[dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    HTMLcontent += rows2 + `</table>`
    const stats = document.getElementById(dataset + "_stats_stats_" + subcategory.suffix)
    stats.innerHTML += HTMLcontent;
}