windowSize = "du pisser"

window.fitText(document.querySelector('h1'))

let info = getInfo()

let imageLocation = info.location
let imageCount = info.count
let galleryContainer = document.querySelector('main')

let layout = 1

document.querySelector('header h1').innerText = info.heading
document.querySelector('header p').innerHTML = info.description

function generateGalleryHtml(columnCount = 3, shownumbers = false){
    //generate empty collumns array
    let columns = []

    for (let i = 0; i < columnCount; i++) {
        columns[i] = ""
    }

    //fill collumns array with code for images
    for (let i = 0; i < imageCount; i++) {
        //todo read date from metadata?
        let infoHTML = ""
        if(info.image[i]?.heading){
            let phonedesc = ""
            if(info.image[i]?.description && windowSize === "small"){
                phonedesc = `
                <div class="phoneDesc">
                    <br>
                    <p>${info.image[i].description}</p>
                </div>`
            }

            infoHTML = `
            <div class="info">
                <h3>${info.image[i].heading}</h3>
                ${phonedesc}
            </div>`
        }

        let number = ""
        if(shownumbers === true){
            number = `<p class="number">${i}</p>`
        }

        columns[i%columnCount] += `
        <div class="image" onclick="clickImage(${i})">
            <img src="../../img/${imageLocation}/small/image (${i+1}).jpg" alt="seise dieses bild wurde net geladen">
            ${infoHTML}
            ${number}
        </div>`
    }

    //transfer code from array into divs and combine
    let html = ""
    for (let i = 0; i < columnCount; i++) {
        html+= `<div class="column">${columns[i]}</div>`
    }

    galleryContainer.innerHTML = html
    galleryContainer.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`

    flattenLastGalleryItems(columnCount)
}

let lastItemToMove
function flattenLastGalleryItems(columnCount){
    if(document.readyState !== "complete"){
        setTimeout(function (){flattenLastGalleryItems(columnCount)}, 50)
        return
    }
    let columnHtml = galleryContainer.querySelectorAll(".column")

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

    //if biggest is taller than smallest
    if(columns[0].height > columns.at(-1).height){
        let itemToMove = columns[0].html.querySelector('.image:last-child')
        columns.at(-1).html.appendChild(itemToMove)

        //call function until bottom is flat
        if(lastItemToMove !== itemToMove){//prevents the same tall image from beeing moved back and forth
            lastItemToMove = itemToMove
            flattenLastGalleryItems(columnCount)
        }
    }
}

function clickImage(id){
    if(layout === 1 && windowSize === "small") return

    let imageBig = document.querySelector('.imageBig')

    imageBig.style.display = "grid"
    setTimeout(function(){
        imageBig.classList.add("active")
    },)

    imageBig.querySelector("img").src = `../../img/${imageLocation}/full/image (${id+1}).jpg`
    if(info.image[id]?.heading){
        imageBig.querySelector("h2").innerText = info.image[id].heading
    }
    else{
        imageBig.querySelector("h2").innerText = ""
    }

    let descriptionElem = imageBig.querySelector(".description")
    if(info.image[id]?.description){
        descriptionElem.innerText = info.image[id].description
        descriptionElem.style.display = "block"
    }
    else{
        descriptionElem.style.display = "none"
    }
}

function closeImage(){
    let imageBig = document.querySelector('.imageBig')

    imageBig.classList.remove("active")
    imageBig.style.display = "none"
}

window.addEventListener("resize", ()=>{
    checkScreensize()
})

let header = document.querySelector('header')
checkScreensize()
function checkScreensize(){
    if(window.innerWidth <= 750 && windowSize !== "small"){
        windowSize = "small"
        generateGalleryHtml(layout)
    }
    else if(window.innerWidth > 750 && windowSize !== "normal"){
        windowSize = "normal"
        generateGalleryHtml(3)
    }
}

function toggleLayout(button){
    layout++
    if(layout>3) layout = 1
    generateGalleryHtml(layout)
    button.innerText = layout
}

function imageNumbers(){
    generateGalleryHtml(3, true)
}