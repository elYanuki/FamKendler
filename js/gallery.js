const columnCount = 3
let currentlocation

function generateGalleryHtml(count, location){
    currentlocation = location

    //generate empty collumns array
    let columns = []

    for (let i = 0; i < columnCount; i++) {
        columns[i] = ""
    }

    //fill collumns array with code for images
    for (let i = 0; i < count; i++) {
        columns[i%3] += `<div class="image" onclick="clickImage(${i+1})"><img src="../../img/${location}/small/image (${i+1}).jpg" alt="seise dieses bild wurde net geladen"></div>`
    }

    //transfer code from array into divs and combine
    let html = ""
    for (let i = 0; i < 3; i++) {
        html+= `<div class="column">${columns[i]}</div>`
    }

    return html
}

let lastItemToMove
function flattenLastGalleryItems(container){
    let columnHtml = container.querySelectorAll(".column")

    //create array of data of the columns
    let columns = []

    for (let i = 0; i < columnCount; i++) {
        columns[i] = {
            html: columnHtml[i],
            height: columnHtml[i].getBoundingClientRect().height
        }
    }

    //sort columns by their height
    columns = columns.sort((a,b)=>{return b.height - a.height})

    //if biggest is > 100px taller than smallest
    if(columns[0].height - columns.at(-1).height > 200){
        let itemToMove = columns[0].html.querySelector('.image:last-child')
        columns.at(-1).html.appendChild(itemToMove)

        //call function until bottom is flat
        if(lastItemToMove !== itemToMove){//prevents the same tall image from beeing moved back and forth
            lastItemToMove = itemToMove
            flattenLastGalleryItems(container)
        }
    }
}

function clickImage(id){
    let imageBig = document.querySelector('.imageBig')

    imageBig.style.display = "block"
    setTimeout(function(){
        imageBig.classList.add("active")
    },)

    imageBig.querySelector("img").src = `../../img/${currentlocation}/full/image (${id}).jpg`
}

function closeImage(){
    let imageBig = document.querySelector('.imageBig')

    imageBig.classList.remove("active")
    imageBig.style.display = "none"
}