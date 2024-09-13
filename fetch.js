const dataStore = {};
dataTypes.forEach(category => {
    dataStore[category.id.toLowerCase() + 'Data'] = [];
});
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4')
        .then(() => {
            console.log("GAPI client loaded for API");
            let allPromises = dataTypes.map(dataType => {
                return Promise.all(
                    dataType.datasets.map(range => fetchData(dataType.sheetID, range, dataType.range))
                );
            });
            return Promise.all(allPromises);
        })
        .then(dataArrays => {
            dataArrays.forEach((dataArray,index)=>{
                const dataLocation=dataStore[dataTypes[index].id+'Data']
                dataTypes[index].datasets.forEach((dataset,index1)=>{
                    dataLocation.push(dataArray[index1]);
                })
                dataLocation.push(removeHeadersFromData(dataArray))
            })
            // Temporary
            // dataTypes[2].datasetIDs.forEach((dataset, index) => {
            //     processvgData(dataStore.vgData[index], dataset)
            // })
        })
        .catch((error) => {
            console.error("Error loading GAPI client or processing data", error);
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