let windowSize = "du pisser"

let info = getInfo()

let imageLocation = info.location
let imageCount = info.count
let galleryContainer = document.querySelector('main')

let layout = 1
let editing = enterEditmode()

document.querySelector('header h1').innerText = info.heading

if(editing === false){
    document.querySelector('header p').innerHTML = info.description
    window.fitText(document.querySelector('h1'))
}
else{
    document.querySelector('header p').innerText = info.description
}

function enterEditmode(){
    let url = window.location.search
    let getQuery = url.split('?')[1]
    let params = getQuery?.split('&')
    if (!params?.includes("edit")) return false

    document.querySelector(".edit-output").style.display = "block"

    document.querySelectorAll('header *').forEach((elem)=>{
        elem.style.outline = `.1rem solid hsl(0,0%,70%)`
        elem.setAttribute("contentEditable", true)
        elem.onblur = function () {confirmEdit(elem)}
    })
    document.querySelector('header p').style.marginTop = "2rem";

    confirmEdit() //to display info in code section

    return true
}

function confirmEdit(elem){
    if(elem?.dataset.imageid && !info.image[elem.dataset.imageid]){
        info.image[elem.dataset.imageid] = {heading:"", description: ""}
    }

    switch (elem?.dataset.prop) {
        case "heading":
            info.heading = elem.innerText
            break
        case "description":
            info.description = elem.innerText
            break
        case "image-heading":
            info.image[elem.dataset.imageid].heading = elem.innerText
            break
        case "image-description":
            info.image[elem.dataset.imageid].description = elem.innerText
            break
    }

    document.querySelector('.edit-output .code').innerText = JSON.stringify(info)
}

function copycode(elem){
    navigator.clipboard.writeText(JSON.stringify(info))

    elem.animate([{backgroundColor:"transparent"}, {backgroundColor:"green"}], {duration: 300, fill: "forwards"})

    setTimeout(function(){
        elem.animate([{backgroundColor:"green"}, {backgroundColor:"transparent"}], {duration: 300, fill: "forwards"})

    },1000)
}

function generateGalleryHtml(columnCount = 3, shownumbers = false){
    //generate empty collumns array
    let columns = []

    for (let i = 0; i < columnCount; i++) {
        columns[i] = ""
    }

    //fill collumns array with code for images
    for (let i = 0; i < imageCount; i++) {
        //todo read date from metadata?

        //description
        let infoHTML = ""
        if(info.image[i]?.heading && editing === false){
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

        //editor
        let editor = ""
        if(editing === true){
            editor = `
                <div class="editor">
                    <label>titel</label>
                    <p data-prop="image-heading" data-imageID="${i}" onblur="confirmEdit(this)" contenteditable="true">${info?.image[i]?.heading || ""}</p>
                    <label>beschreibung</label>
                    <p data-prop="image-description" data-imageID="${i}" onblur="confirmEdit(this)" contenteditable="true">${info?.image[i]?.description || ""}</p>
                </div>`
        }

        columns[i%columnCount] += `
        <div class="image" ${editing === true ? "style='outline-color: hsla(0,0%,60%,100%)'" : ""}>
            <img onclick="clickImage(${i})" src="../../img/${imageLocation}/small/image (${i+1}).jpg" alt="seise dieses bild wurde net geladen">
            ${infoHTML}
            ${editor}
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

if(editing === true) {
    window.addEventListener("beforeunload", function (e) {
        (e || window.event).preventDefault()
        var confirmationMessage = 'Bist du sicher das du die Seite verlassen willst?'
            + 'Kopiere und sende den code an Yanik sonst wird keien änderung gespeichert.';

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE

        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    });
}