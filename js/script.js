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

let phoneNavHtml = ""
for (let key in visitlist) {
    let country = visitlist[key]
    phoneNavHtml += `<h2>${key}</h2>`

    country.forEach((visit)=>{
        phoneNavHtml += `<a href="./html/${visit.location}/index.html">${visit.HRname}</a>`
    })
}
document.querySelector('#phone-nav').innerHTML = phoneNavHtml

document.querySelectorAll('.visited').forEach((elem)=>{
    elem.addEventListener("click", openCountryMenue)
})

const linkOverlay = document.querySelector('.linkoverlay')
function openCountryMenue(click){
    let country = click.target.dataset.country

    let html = ""
    visitlist[country]?.forEach((visit) => {
        html += `<a href="./html/${visit.location}/index.html">${visit.HRname}</a>`
    })

    linkOverlay.innerHTML = html

    linkOverlay.style.top = click.clientY + "px"
    linkOverlay.style.left = click.clientX + "px"

    linkOverlay.style.display = "flex"

    setTimeout(function(){
        document.addEventListener("click",closeCountryMenue)
    },)
}

function closeCountryMenue(click){
    if(!click.target.classList.contains("visited"))
        linkOverlay.style.display = "none"
    document.removeEventListener("click",closeCountryMenue)
}