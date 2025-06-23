import React, { useState, useEffect } from "react"
import axios from "axios"
import 'moment-timezone';
import moment from "moment";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=d250b8196d065f5f4a7898f6d17bb238`

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data)
        setLocation('')
        getTime(response.data.timezone);
        successNotify();
      })
        .catch(function (error) {
          setData("");
          setLocation("");
          failedNotify();
        });
    }
  }

  function getTime(timeZone) {
    const targetTimeZoneOffset = timeZone; 
    const targetTime = moment().utcOffset(targetTimeZoneOffset / 60).format('MMM Do hh:mm:ss a');
    setTime(targetTime);
  }

  useEffect(() => {
    const timer = setInterval(()=>{
      setTime(prevTime => {
        const formattedTime = moment(prevTime, 'MMM Do hh:mm:ss a').add(1, 'seconds').format('MMM Do hh:mm:ss a');
        return formattedTime;
      });
    } , 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [time]);


  const failedNotify = () => toast.error("Sorry, No city found!!", { autoClose : 1000});
  const successNotify = () => toast.success("City found!!", { autoClose : 1000});


  return (
    <div className="app">
      <div className="search">
        <p><strong>Weather App</strong></p>
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <ToastContainer />
      {data.name !== undefined &&
        <div className="container">
          <div className="top">
            <div className="location">
              <p className="time">{time}</p>
              <p className="city">{data.name} , {data.sys.country}</p>
            </div>
            <div className="temp">
              <div>
                <h1>{data.main.temp}°C</h1>
              </div>
              <div>
                <img className="icon" src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="weather condition img" />
                <p className="description" >{data.weather[0].main}</p>
              </div>
            </div>
          </div>

          <div className="bottom">
            <div className="feels">
              <p className="bold">{data.main.feels_like.toFixed()}°C</p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className="bold">{data.main.humidity}%</p>
              <p>Humidity</p>

            </div>
            <div className="wind">
              <p className="bold">{data.wind.speed}MPH</p>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      }


    </div>

  );
}

export default App;