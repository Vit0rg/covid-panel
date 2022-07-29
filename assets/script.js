const cardContainer = document.querySelector('[data-card-container]');

//async function to get countries:
const pathCovidData = 'https://coronavirus-19-api.herokuapp.com/countries'
const pathFlagsData = 'https://countryflagsapi.com/svg'
const headers =
{
  method: 'get',
  mode: 'cors',
  cache: 'default',
  acceptEncoding: "gzip, compress, br"
}

function getCountryFlag(country)
{
  switch(country)
  {
    case 'World': return "./assets/img/globe.svg"
    case 'UK': return `${pathFlagsData}/GBR`
    case 'Russia': return `${pathFlagsData}/RUS`
    case 'S. Korea': return `${pathFlagsData}/KOR`
    case 'DPRK': return `${pathFlagsData}/PRK`
    case 'UAE': return `${pathFlagsData}/ARE`
    case 'North Macedonia': return `${pathFlagsData}/MKD`
    case 'Brunei': return `${pathFlagsData}/BRN`
    case 'DRC': return `${pathFlagsData}/COD`
    case 'Ivory Coast': return `${pathFlagsData}/CIV`
    case 'Syria': return `${pathFlagsData}/SYR`
    case 'Bahamas': return `${pathFlagsData}/BHS`
    case 'Faeroe Islands': return `${pathFlagsData}/FRO`
    case 'Cayman Islands': return `${pathFlagsData}/CYM`
    case 'Comoros': return `${pathFlagsData}/COM`
    case 'St. Vincent Grenadines': return `${pathFlagsData}/VCT`
    case 'Turks and Caicos': return `${pathFlagsData}/TCA`
    case 'Cook Islands': return `${pathFlagsData}/COK`
    case 'St. Barth': return `${pathFlagsData}/BLM`
    case 'Saint Pierre Miquelon': return `${pathFlagsData}/SPM`
    case 'Falkland Islands': return `${pathFlagsData}/FLK`
    case 'Vatican City': return `${pathFlagsData}/VAT`
    case 'Marshall Islands': return `${pathFlagsData}/MHL`
    case 'Channel Islands': return `${pathFlagsData}/GGY`
    case 'Diamond Princess': return "./assets/img/flag.svg"
    case 'MS Zaandam': return "./assets/img/flag.svg"
    case 'CAR': return `${pathFlagsData}/CAF`
    case 'Caribbean Netherlands': return `${pathFlagsData}/BES`
    default: return `${pathFlagsData}/${country}`
  }  
      
}

function getCountriesCovidData()
{
  try 
  {
    fetch(`${pathCovidData}`, headers)
    .then((response) => 
    {
      updateContent(response)
    })
  } catch (err) 
  {
    console.error("Failed retrieving info", err)
  } 
}

if ("serviceWorker" in navigator) 
{
  navigator.serviceWorker.register("../../serviceworker.js")
}

let dataRetrieved;

function updateContent(response)
{
  //console.log('response status', response.status)
  try
  {
    response = response.json()
    .then( (json) => 
    {
      //console.log(json) >ALL the data
      dataRetrieved = json
      let i = 0;
      const objectData = Object.entries(dataRetrieved)
      for (i = 0; i<7; i++)
      {
        cardContainer.appendChild(generateCard(objectData[i][1]))
      }
    })
    
  }
  catch (err) 
  {
    console.error("Failed retrieving info", err)
  }   
}

function generateCard(objectData)
{
  let li = document.createElement('li');

  li.innerHTML =
  `
    <img src="./assets/img/coronavirus192.svg" alt="${objectData.country}" loading="lazy"</img>
    <h2>${objectData.country}</h2>
    <section>
      <span class="info">
        <h3>Cases:</h3>
        <span class="data">${validateData(objectData.cases)}</span>
      </span>
      </span>
      <span class="info">
        <h3>Today:</h3>
        <span class="data">${validateData(objectData.todayCases)}</span>
      </span>
      <span class="info">
        <h3>Active:</h3>
        <span class="data">${validateData(objectData.active)}</span>
      </span>
      <span class="info">
        <h3>Deaths:</h3>
        <span class="data">${validateData(objectData.deaths)}</span>
      </span>
      <span class="info">
        <h3>Healed:</h3>
        <span class="data">${validateData(objectData.recovered)}</span>
      </span>
      <span class="info">
        <h3>Critical:</h3>
        <span class="data">${validateData(objectData.critical)}</span>
      </span>
    </section>
  `

  if(navigator.onLine)
  {
    li.children[0].src = `${getCountryFlag(`${objectData.country}`)}`
  }

  return li
  
}

function validateData(rawData)
{
  if (!rawData)
    return "Unknown"
  
  return rawData.toLocaleString('en-US')
}

getCountriesCovidData();

const leftButton = document.querySelector("#scroll_left")
const rightButton = document.querySelector("#scroll_right")
const buttons = document.querySelectorAll('[data-buttons]')

function isMobile() 
{
  return (navigator.userAgent.match(/iPad|iPhone|Android|BlackBerry|Windows Phone|webOS/i));
}

if(isMobile())
{
  buttons.forEach(element => 
  {
    element.remove();  
  });
}

leftButton.addEventListener('click', () =>
{
  scrollController("left")
})

rightButton.addEventListener('click', () =>
{
  scrollController("right")
})

function scrollController(scrollType)
{
  if (scrollType === "left")
  {
    cardContainer.scrollLeft -= (window.innerWidth / 2)
  }
  if (scrollType === "right")
  {
    cardContainer.scrollLeft += (window.innerWidth / 2);
  }  
}

const searchInput = document.querySelector("[data-search]");

searchInput.addEventListener("input", (e) =>
{
  const value = e.target.value.toLowerCase();
  Array.from(cardContainer.childNodes).forEach(item => {item.remove()})

  
    if (value)
    {
      setTimeout(() =>
      {
        Array.from(Object.entries(dataRetrieved)).forEach(index =>
          {
            if(index[1].country.toLowerCase().includes(value))
            {
              cardContainer.appendChild(generateCard(index[1]))
            }
            scrollController("left")
          })
      }, 500
      )
    }
    else
    {
      cardContainer.appendChild(generateCard(dataRetrieved[0]))
    }
 
})