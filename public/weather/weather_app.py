"""

Weather App - Mason Clarke
Web port of my original Python/Tkinter desktop app:
https://github.com/Masons-coding/WeatherAPI-APP

This file is real Python running in your browser on Pyodide (CPython compiled to WebAssembly).
What changed from the desktop version:
  - Tkinter window        -> an HTML front-end that calls search() below
  - requests              -> pyodide.http.pyfetch (the browser's fetch)
  - OpenWeatherMap + key  -> Open-Meteo (free, no API key), reshaped into the same
                             JSON layout so parse_weather() keeps the original logic.
Nothing secret ships to the browser and there is no server to pay for.

"""

#Imports for the application
import json
from urllib.parse import quote
from pyodide.http import pyfetch

#Free, keyless endpoints (weather data by Open-Meteo.com, CC BY 4.0)
GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search?name={}&count=10&language=en&format=json'
FORECAST_URL = ('https://api.open-meteo.com/v1/forecast?latitude={}&longitude={}'
                '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day'
                '&wind_speed_unit=ms')

#Icon file for each weather condition - same mapping as image_funtion() in the original app
ICONS = {
    'Clear': '01', 'Clouds': '02', 'Snow': '13', 'Rain': '10', 'Drizzle': '09', 'Thunderstorm': '11',
    'Mist': '50', 'Smoke': '50', 'Haze': '50', 'Dust': '50', 'Fog': '50', 'Sand': '50',
    'Ash': '50', 'Squall': '50', 'Tornado': '50',
}


#Convert Open-Meteo's WMO weather codes into the OpenWeatherMap names the original app understood
def wmo_to_main(code):
    if code == 0:
        return 'Clear'
    if code in (1, 2, 3):
        return 'Clouds'
    if code in (45, 48):
        return 'Fog'
    if 51 <= code <= 57:
        return 'Drizzle'
    if 61 <= code <= 67 or 80 <= code <= 82:
        return 'Rain'
    if 71 <= code <= 77 or code in (85, 86):
        return 'Snow'
    if code >= 95:
        return 'Thunderstorm'
    return 'Clouds'


#Pick the best geocoding match - supports "City" or "City, Country/Province" (e.g. "London, CA")
def pick_place(results, hint):
    if not hint:
        return results[0]
    hint = hint.lower()
    for place in results:
        fields = (place.get('country_code', ''), place.get('country', ''), place.get('admin1', ''))
        if any(f and f.lower().startswith(hint) for f in fields):
            return place
    return results[0]


#Get the weather data as OpenWeatherMap-shaped JSON (or None if the city can't be found)
async def fetch_weather_json(city):
    name, _, hint = city.partition(',')
    geo_response = await pyfetch(GEOCODE_URL.format(quote(name.strip())))
    if not geo_response.ok:
        return None
    geo = await geo_response.json()
    if not geo.get('results'):
        return None
    place = pick_place(geo['results'], hint.strip())

    result = await pyfetch(FORECAST_URL.format(place['latitude'], place['longitude']))
    if not result.ok:
        return None
    current = (await result.json())['current']
    return {
        'name': place['name'],
        'sys': {'country': place.get('country_code', '')},
        'main': {'temp': current['temperature_2m'] + 273.15, 'humidity': current['relative_humidity_2m']},
        'weather': [{'main': wmo_to_main(current['weather_code'])}],
        'wind': {'speed': current['wind_speed_10m']},
        'is_day': current.get('is_day', 1),
    }


#Same parsing and unit conversions as get_weather() in the original app
def parse_weather(data):
    city = data['name']
    country = data['sys']['country']
    temp_kelvin = data['main']['temp']
    temp_celsius = temp_kelvin - 273.15
    temp_fahrenheit = (temp_kelvin - 273.15) * 9 / 5 + 32
    weather = data['weather'][0]['main']
    wind = data['wind']['speed']
    wind_speeds = wind * 3.6
    humidity = data['main']['humidity']
    final = (city, country, temp_celsius, temp_fahrenheit, weather, wind_speeds, humidity)
    return final


#Get the icon for the weather description (day or night version)
def image_function(description, is_day=True):
    code = ICONS.get(description)
    if not code:
        return 'iconPlaceHolder.png'
    return '{}{}.png'.format(code, 'd' if is_day else 'n')


#What happens when "Click for weather" is pressed - returns JSON for the page to display
async def search(city):
    city = city.strip()[:100]
    if not city:
        return json.dumps({'error': 'Please type a city name'})
    data = await fetch_weather_json(city)
    if not data:
        return json.dumps({'error': 'Cannot find city {}'.format(city)})
    results = parse_weather(data)
    return json.dumps({
        'location': '{}, {}'.format(results[0], results[1]),
        'temp': '{:.0f}°C, {:.0f}°F'.format(results[2], results[3]),
        'description': results[4],
        'icon': image_function(results[4], data['is_day']),
        'wind': '{:.2f} KM/H'.format(results[5]),
        'humidity': '{}%'.format(results[6]),
        'tuple': repr(tuple(round(r, 2) if isinstance(r, float) else r for r in results)),
    })
