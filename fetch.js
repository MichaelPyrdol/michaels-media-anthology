function loadClient() {
    gapi.client.setApiKey(API_KEY);
    gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4')
        .then(() => {
            console.log("GAPI client loaded for API");
            const mediaTabs = document.querySelectorAll('.media-tabs li');
            const mediaTab = document.querySelector('li.' + media[0].id+'_tab')
            const mediaTabContentSelector = '.media-tab'
            const mediaTabContents = document.querySelectorAll(mediaTabContentSelector);
            simulateTab(mediaTabs, mediaTab, mediaTabContents, mediaTabContentSelector)
        })
        .catch(error => {
            console.error("Error loading GAPI client: ", error);
        });
}
function loadDataType(dataType) {
    return Promise.all(
        dataType.datasets.map(dataset => fetchData(dataType.sheetID, dataset, dataType.range))
    )
        .then(dataArray => {
            const dataLocation = dataType.dataStore;
            dataType.datasets.forEach((dataset, index) => {
                dataLocation.push(dataArray[index]);
            });
            if (dataArray.length > 1) {
                dataLocation.push(removeHeadersFromData(dataArray));
            }
        })
        .catch(error => {
            // location.reload()
            console.error("Error loading dataType or processing data: ", error);
        });
}
function fetchData(sheetID, dataset, range) {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetID,
        range: dataset + range,
    })
        .then((response) => {
            const values = response.result.values;
            if (values && values.length > 0) {
                const datasetColIndex = values[0].length;
                values[0].push("dataset");
                values.forEach((row, index) => {
                    if (index > 0) {
                        row[datasetColIndex] = dataset;
                    }
                });
            }
            return values;
        })
        .catch((error) => {
            console.error("Error fetching data: ", error.result.error.message);
            throw error;
        });
}
function removeHeadersFromData(dataArrays) {
    const combinedData = [];
    let isFirstRange = true;
    dataArrays.forEach(data => {
        const dataCopy = [...data];
        if (!isFirstRange) {
            dataCopy.shift();
        }
        combinedData.push(...dataCopy);
        isFirstRange = false;
    });
    return combinedData;
}