import {httpRequest} from '@/api/apiHelper';

export const getWeatherDataByCoordinates = async (queryParams: Object) => await httpRequest('/data/2.5/weather', 'get', {}, {units: 'metric', ...queryParams});

export const getWeatherDataByCity = async <T = {q: string}>(queryParams: T) => await httpRequest('/data/2.5/weather', 'get', {}, {units: 'metric', ...queryParams});
// https://api.openweathermap.org/data/2.5/weather?q=minsk&appid=2b8f210860bec311df59ef91d687b6d3
