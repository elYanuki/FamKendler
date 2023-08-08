const visitlist = {
    norway: {
        HRname: "Norwegen",
        visits: [
            {HRname: "Norwegen 2022", location: "norway2022"}
        ]
    },
    uk: {
        HRname: "England",
        visits: [
            {HRname: "England 2023", location: "uk2023"}
        ]
    },
}

generatePhoneNav()

for (let key in visitlist){
    document.querySelectorAll(`svg *[data-country='${key}']`).forEach((elem)=>{
        elem.addEventListener("click", openCountryMenue)
        elem.classList.add("visited")
        elem.onmouseenter = function () {
            handelHover(key)
        }
        elem.onmouseleave = endHover
    })
}

const linkOverlay = document.querySelector('.linkoverlay')
function openCountryMenue(click){
    let country = click.target.dataset.country

    let html = ""

    if(!visitlist[country] || visitlist[country].visits.length === 0){
        html = "<p>no recordet visists</p>"
    }
    else {
        visitlist[country]?.visits?.forEach((visit) => {
            html += `<a href="./html/${visit.location}/index.html">${visit.HRname}</a>`
        })
    }


    document.querySelectorAll("svg .active").forEach((elem) => {
        elem.classList.remove("active")
    })

    linkOverlay.innerHTML = html

    linkOverlay.style.top = click.clientY - 20 + "px"
    linkOverlay.style.left = click.clientX + "px"

    linkOverlay.style.display = "flex"

    document.querySelectorAll(`svg *[data-country='${country}']`).forEach((elem)=>{
        elem.classList.add("active")
    })

    setTimeout(function(){
        document.addEventListener("click",closeCountryMenue)
    },)
}

function closeCountryMenue(click){
    if(!click.target.classList.contains("visited")) {
        linkOverlay.style.display = "none"

        document.querySelectorAll("svg .active").forEach((elem) => {
            elem.classList.remove("active")
        })
    }
    document.removeEventListener("click",closeCountryMenue)
}

function generatePhoneNav(){
    let phoneNavHtml = ""
    for (let key in visitlist){
        let country = visitlist[key]
        phoneNavHtml += `<h2>${country.HRname}</h2>`

        country.visits.forEach((visit)=>{
            phoneNavHtml += `<a href="./html/${visit.location}/">${visit.HRname}</a>`
        })
    }

    document.querySelector('#phone-nav').innerHTML = phoneNavHtml
}

function handelHover(country){
    document.querySelectorAll(`svg *[data-country='${country}']`).forEach((elem)=>{
        elem.classList.add("hovered")
    })
}

function endHover(){
    document.querySelectorAll(`svg .hovered`).forEach((elem)=>{
        elem.classList.remove("hovered")
    })
}