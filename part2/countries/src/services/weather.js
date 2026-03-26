import axios from 'axios'
const api_key = import.meta.env.VITE_OPEN_WEATHER_API_KEY

const getWeather = (city) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`)
    return request.then(response => response.data)
}

export default { getWeather }