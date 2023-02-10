import {httpRequest} from '@/api/apiHelper';

export const getWeatherData = async <T = {q: string}>(queryParams: T) => await httpRequest('/data/2.5/weather', 'get', {}, {units: 'metric', ...queryParams});
