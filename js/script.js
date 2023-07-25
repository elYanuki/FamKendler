const visitlist = {
    norway: [
        {HRname: "Norwegen 2022", location: "norway2022"}
    ],
    sweden: [
        {HRname: "Schweden 2021", location: "sweden2021"}
    ],
    uk: [
        {HRname: "England 2023", location: "uk2023"}
    ],
    spain: [
        {HRname: "Barcelona 2022", location: "barcelona2022"}
    ]
}

let HRCountryNames = {
    uk: "England",
    norway: "Norwegen",
    sweden: "Schweden",
    spain: "Spanien",
    italy: "Italien"
}

generatePhoneNav()

document.querySelectorAll('.visited').forEach((elem)=>{
    elem.addEventListener("click", openCountryMenue)
})

const linkOverlay = document.querySelector('.linkoverlay')
function openCountryMenue(click){
    let country = click.target.dataset.country

    let html = ""

    if(!visitlist[country] || visitlist[country].length === 0){
        html = "<p>no visits yet</p>"
    }
    else {
        visitlist[country]?.forEach((visit) => {
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

    click.target.classList.add("active")

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
    for (let key in visitlist) {
        let country = visitlist[key]
        phoneNavHtml += `<h2>${HRCountryNames[key]}</h2>`

        country.forEach((visit)=>{
            phoneNavHtml += `<a href="./html/${visit.location}/index.html">${visit.HRname}</a>`
        })
    }
    document.querySelector('#phone-nav').innerHTML = phoneNavHtml
}