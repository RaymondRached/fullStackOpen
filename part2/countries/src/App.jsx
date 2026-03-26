import { useState } from 'react'
import countriesService from './services/countries'
import weatherService from './services/weather'
import { useEffect } from 'react'

const App = () => {
  const [displayedCountries,setDisplayedCountries] = useState([])
  const [listOfCountries,setListOfCountries] = useState([])
  const [countryInfo,setCountryInfo] = useState(null)
  const [capitalWeather,setCapitalWeather] = useState(null)

  useEffect(() => {
    countriesService.getAll().then(c => {
      setListOfCountries(c.map(el => el.name.common))
    })
  },[])

  const inputChange = (userInput) => {
    setCountryInfo(null)
    setCapitalWeather(null)
    const filterResult = listOfCountries.filter(country => country.toLowerCase().includes(userInput))
    const matchCount = filterResult.length
    if (matchCount > 10){
      setDisplayedCountries(['Too many matches, specify another filter'])
    } else if (matchCount > 1){
      setDisplayedCountries(filterResult)
    } else if (matchCount === 1){
      setDisplayedCountries([])
      showCountry(filterResult[0])
    } else {
      setDisplayedCountries(['No matches found'])
    }
  }

  const showCountry = (country) => {
    setCountryInfo(null)
    setCapitalWeather(null)
    countriesService
    .getCountry(country)
    .then(countryData => {setCountryInfo(countryData); return countryData.capital[0]})
    .then(capital => weatherService.getWeather(capital))
    .then(weather => setCapitalWeather(weather))
    setDisplayedCountries([])
  }

  return(
    <div>
      <label>find countries </label>
      <input type='text' onChange={e => inputChange(e.target.value)}/>
      <div>
        {displayedCountries.length === 1 ? (
          <div>{displayedCountries[0]}</div>
        ) : (
          displayedCountries.map((country, index) => (
            <div key={index}>
              {country} <button type="button" onClick={() => showCountry(country)}>show</button>
            </div>
          ))
        )}
      </div>
      <CountryData countryData={countryInfo} weatherData={capitalWeather}/>
    </div>
  )
}

const CountryData = ({countryData,weatherData}) => {
  console.log('countryData',countryData,'weatherData',weatherData)
  if (countryData == null || weatherData == null){
    return null
  }
  const capital = countryData.capital[0]
  console.log(weatherData)
  return (
    <>
      <h1>{countryData.name.common}</h1>
      <li>Capital {capital}</li>
      <li>Area {countryData.area}</li>
      <h2>Languages</h2>
      <ul>
        {Object.values(countryData.languages).map((language,index) => <li key={index}>{language}</li>)}
      </ul>
      <img src={countryData.flags.png} alt={countryData.flags.alt}></img>
      <h2>Weather in {capital}</h2>
      <p>Temperature {(weatherData.main.temp - 273.15).toFixed(2)} Celsius</p>
      <img src={`https://openweathermap.org/payload/api/media/file/${weatherData.weather[0].icon}.png`}></img>
      <p>Wind {weatherData.wind.speed} m/s</p>
    </>
  )
}

export default App
