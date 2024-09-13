function mediumTabs(dataset, medium, tabSections) {
    let HTMLcontent = `
        <div id='${dataset}_${medium}' class='medium-tab-content medium-tab ${medium}'>
        <ul class="${medium}-tabs tabs">`
    tabSections.forEach(tabSection => {
        HTMLcontent += `<li class="${medium}_${tabSection} ${dataset}"><a href="#${dataset}_${medium}_${tabSection}">${tabSection.charAt(0).toUpperCase() + tabSection.slice(1)}</a></li>`
    })
    HTMLcontent +=
        `</ul>
        <div class="${medium}-tab-content">`
    tabSections.forEach(tabSection => {
        HTMLcontent += `<div id="${dataset}_${medium}_${tabSection}" class="tab ${medium}_${tabSection} active"></div>`
    })
    HTMLcontent += `</div></div>`
    return HTMLcontent
}