const albums = initializeObject(albumCategories,dataTypes[0]);
const albumData = initialization(albumChartTypes, nominalAlbumChartTypes, albumCategories,dataTypes[0]);
const albumCats = albumChartTypes.map(cat => albumData[cat.id]);
const nominalAlbumCats = nominalAlbumChartTypes.map(cat => albumData[cat.id]);
function processAlbumData(data, dataset) {
    albums[dataset].all = convertToObjects(data);
    organizeData(dataset, albums, 'albums', albumCats, nominalAlbumCats, albumChartTypes, nominalAlbumChartTypes, albumCategories, albumSubCategories)
    // Generate album art
    const artDiv = document.getElementById(dataset + '_artDiv')
    albums[dataset].all.forEach(album => {
        artDiv.innerHTML += generateImage(album, 128)
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
                    listHTML += generateImage(album, 128)
                })
                listHTML += `</div></div>`
            }
        })
        const list = document.getElementById(dataset + '_album_list_' + subcategory.suffix)
        list.innerHTML = listHTML
        // Charts
        createCharts(dataset, subcategory, albums, albumChartTypes, nominalAlbumChartTypes, albumPieChartTypes, albumCats, nominalAlbumCats, albums_decades_config)
    })
}
function generateImage(album, size, hover) {
    if (album) {
        let fileName = album.title.replace(/:/g, '-');
        let imgElement = document.createElement('img');
        imgElement.src = `images/albums/${album.dataset.toLowerCase()}/${fileName}.jpeg`;
        let fallbackAttempted = false;
        imgElement.onerror = () => {
            if (!fallbackAttempted) {
                fallbackAttempted = true;
                imgElement.src = `images/${album.dataset.toLowerCase()}/${album.title}.jpeg`;
            } else {
                imgElement.onerror = null;
            }
        };
        let hoverText = `<p>${album.artist}<br>~<br>${album.title}</p>`
        if (hover) {
            hoverText = hover
        }
        const image = `
        <div class="containey" style="width:${size}px">
            <img src="${imgElement.src}" alt="${album.title}" class="image" style="width:${size}px">
            <div class="overlay">${hoverText}</div>
        </div>`
        return image
    }
    return '-'
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
    subcategory.id.forEach((label, index) => {
        rows += `<td style="background-color:${subcategory.colors[index]}">${albums[dataset][label].length}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Songs</td>
        <td>${findSum(albumData['num_songs'][dataset].all)}</td>`
    subcategory.id.forEach((label, index) => {
        rows += `<td style="background-color:${subcategory.colors[index]}">${findSum(albumData['num_songs'][dataset][label])}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Minutes</td>`
    const minutesAll = findSum(albumData['duration'][dataset].all);
    rows += `<td>${minutesAll}</td>`
    subcategory.id.forEach((label, index) => {
        const minutesID = findSum(albumData['duration'][dataset][label]);
        rows += `<td style="background-color:${subcategory.colors[index]}">${minutesID}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Hours</td>
        <td>${Math.floor(minutesAll / 60)}h ${minutesAll % 60}m</td>`
    subcategory.id.forEach((label, index) => {
        const minutesID = findSum(albumData['duration'][dataset][label]);
        rows += `<td style="background-color:${subcategory.colors[index]}">${Math.floor(minutesID / 60)}h ${minutesID % 60}m</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Days</td>
        <td>${(minutesAll / 60 / 24).toFixed(1)}</td>`
    subcategory.id.forEach((label, index) => {
        const minutesID = findSum(albumData['duration'][dataset][label]);
        rows += `<td style="background-color:${subcategory.colors[index]}">${(minutesID / 60 / 24).toFixed(1)}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Artists</td>
        <td>${[...new Set(albumData['albums_artists'][dataset].all)].length}</td>`
    subcategory.id.forEach((label, index) => {
        rows += `<td style="background-color:${subcategory.colors[index]}">${[...new Set(albumData['albums_artists'][dataset][label])].length}</td>`
    })
    rows += `</tr>`;
    rows += `
    <tr>
        <td># of Nationalities</td>
        <td>${[...new Set(albumData['nationality'][dataset].all)].length}</td>`
    subcategory.id.forEach((label, index) => {
        rows += `<td style="background-color:${subcategory.colors[index]}">${[...new Set(albumData['nationality'][dataset][label])].length}</td>`
    })
    rows += `</tr>`;
    HTMLcontent += rows + `</table>`
    const stats = document.getElementById(dataset + "_stats_stats_" + subcategory.suffix)
    stats.innerHTML += HTMLcontent;
    let moreHTMLcontent = `
    <table>
        <tr>
            <th></th>
            <th>All</th>`
    subcategory.abbrev.forEach((label, index) => {
        moreHTMLcontent += '<th>' + label + '</th>'
    })
    let rows2 = ''
    rows2 += `
    <tr>
        <td>Top Artist</td>
        <td>${findMode(albumData['albums_artists'][dataset].all)}</td>`
    subcategory.id.forEach((label, index) => {
        rows2 += `<td style="background-color:${subcategory.colors[index]}">${findMode(albumData['albums_artists'][dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    rows2 += `
    <tr>
        <td>Top Nationality</td>
        <td>${findMode(albumData['nationality'][dataset].all)}</td>`
    subcategory.id.forEach((label, index) => {
        rows2 += `<td style="background-color:${subcategory.colors[index]}">${findMode(albumData['nationality'][dataset][label])}</td>`
    })
    rows2 += `</tr>`;
    moreHTMLcontent += rows2 + `</table>`
    const moreStats = document.getElementById(dataset + "_stats_moreStats_" + subcategory.suffix)
    moreStats.innerHTML += moreHTMLcontent;
}