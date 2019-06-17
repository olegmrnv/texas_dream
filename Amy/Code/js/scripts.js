const app = document.getElementById('root')

const logo = document.createElement('img')
logo.src = 'https://raw.githubusercontent.com/taniarascia/sandbox/master/ghibli/logo.png'

const container = document.createElement('div')
container.setAttribute('class', 'container')

app.appendChild(logo)
app.appendChild(container)

var request = new XMLHttpRequest()
request.open('GET', 'http://www.airnowapi.org/aq/forecast/latLong/?format=text/csv&latitude=29.7522&longitude=-95.4033&date=2019-06-12&distance=25&API_KEY=9EFBDC3F-9727-474B-8AC4-B950F718C9C7', true)
request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
        data.forEach(movie => {
            const card = document.createElement('div')
            card.setAttribute('class', 'card')

            const h1 = document.createElement('h1')
            h1.textContent = movie.title

            const p = document.createElement('p')
            movie.description = movie.description.substring(0, 300)
            p.textContent = `${movie.description}...`

            container.appendChild(card)
            card.appendChild(h1)
            card.appendChild(p)
        })
    } else {
        const errorMessage = document.createElement('marquee')
        errorMessage.textContent = `Gah, it's not working!`
        app.appendChild(errorMessage)
    }
}

request.send()