// ===== 天气 API 集成 =====
// 使用 Open-Meteo 免费 API (无需 API Key)

const CACHE_DURATION = 30 * 60 * 1000; // 30分钟缓存
const weatherCache = new Map();

// 获取天气数据
export async function getWeather(lat, lon) {
  const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=3`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'WeekendExplorer/2.0' }
    });
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const result = {
      current: {
        temp: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherType: getWeatherType(data.current.weather_code)
      },
      forecast: data.daily.time.map((date, i) => ({
        date,
        weatherCode: data.daily.weather_code[i],
        maxTemp: Math.round(data.daily.temperature_2m_max[i]),
        minTemp: Math.round(data.daily.temperature_2m_min[i]),
        precipitation: data.daily.precipitation_sum[i],
        weatherType: getWeatherType(data.daily.weather_code[i])
      }))
    };
    
    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('Weather fetch error:', error);
    // 返回默认天气
    return {
      current: {
        temp: 25,
        weatherCode: 0,
        humidity: 50,
        windSpeed: 10,
        weatherType: 'sunny'
      },
      forecast: []
    };
  }
}

// 天气代码转类型
function getWeatherType(code) {
  if (code <= 1) return 'sunny';
  if (code <= 3) return 'cloudy';
  if (code <= 48) return 'foggy';
  if (code <= 67) return 'rainy';
  if (code <= 77) return 'snowy';
  if (code <= 82) return 'rainy';
  if (code <= 86) return 'snowy';
  if (code <= 99) return 'rainy';
  return 'sunny';
}

// 获取天气 emoji
export function getWeatherEmoji(weatherType) {
  const emojiMap = {
    sunny: '☀️',
    cloudy: '⛅',
    rainy: '🌧️',
    snowy: '❄️',
    foggy: '🌫️'
  };
  return emojiMap[weatherType] || '🌤️';
}

// 获取天气标签
export function getWeatherLabel(weatherType) {
  const labelMap = {
    sunny: '晴天',
    cloudy: '多云',
    rainy: '雨天',
    snowy: '雪天',
    foggy: '雾天'
  };
  return labelMap[weatherType] || '未知';
}
