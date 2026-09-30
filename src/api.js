// ===== API ROUTES for Cloudflare D1 =====
import { getWeather, getWeatherEmoji, getWeatherLabel } from './weather.js';
import { generateRecommendations, generateExplorationTask, WEATHER_TYPES, MOOD_TYPES, BUDGET_LEVELS, ENERGY_LEVELS } from './recommendation.js';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const jsonResp = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

export async function handleAPI(request, env, path) {
  const url = new URL(request.url);
  const method = request.method;
  if (method === 'OPTIONS') return new Response(null, { headers: CORS });
  const db = env.DB;

  // ===== ACTIVITIES =====
  if (path === '/api/activities' && method === 'GET') {
    const category = url.searchParams.get('category');
    let query = 'SELECT * FROM activities ORDER BY id DESC';
    let params = [];
    if (category && category !== 'all') {
      query = 'SELECT * FROM activities WHERE category = ? OR tags LIKE ? ORDER BY id DESC';
      params = [category, '%"' + category + '"%'];
    }
    const stmt = params.length ? db.prepare(query).bind(...params) : db.prepare(query);
    const { results } = await stmt.all();
    const activities = results.map(a => ({
      ...a,
      tags: typeof a.tags === 'string' ? JSON.parse(a.tags) : (a.tags || []),
      indoor: !!a.indoor,
      price: a.price || 0,
      people: a.people || 0,
    }));
    return jsonResp({ activities });
  }

  if (path === '/api/activities' && method === 'POST') {
    const body = await request.json();
    const { title, category, emoji, color, price, indoor, weather, location, date, desc, people, tags, gradient } = body;
    if (!title || !category || !location) return jsonResp({ error: '标题、分类、地点必填' }, 400);
    const result = await db.prepare(
      'INSERT INTO activities (title,category,emoji,color,price,indoor,weather,location,date,desc,people,tags,gradient) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
    ).bind(
      title, category, emoji || '📍', color || '#6C5CE7', price || 0,
      indoor !== false ? 1 : 0, weather || 'any', location, date || '',
      desc || '', people || 0, JSON.stringify(tags || []),
      gradient || 'linear-gradient(135deg,#6C5CE7,#A29BFE)'
    ).run();
    return jsonResp({ id: result.meta.last_row_id, message: '活动已发布' }, 201);
  }

  const activityMatch = path.match(/^\/api\/activities\/(\d+)$/);
  if (activityMatch) {
    const actId = parseInt(activityMatch[1]);
    if (method === 'GET') {
      const act = await db.prepare('SELECT * FROM activities WHERE id = ?').bind(actId).first();
      if (!act) return jsonResp({ error: '活动不存在' }, 404);
      act.tags = typeof act.tags === 'string' ? JSON.parse(act.tags) : (act.tags || []);
      act.indoor = !!act.indoor;
      return jsonResp({ activity: act });
    }
    if (method === 'PUT') {
      const body = await request.json();
      const { title, category, emoji, color, price, indoor, weather, location, date, desc, people, tags, gradient } = body;
      await db.prepare(
        'UPDATE activities SET title=?,category=?,emoji=?,color=?,price=?,indoor=?,weather=?,location=?,date=?,desc=?,people=?,tags=?,gradient=? WHERE id=?'
      ).bind(title, category, emoji, color, price, indoor ? 1 : 0, weather, location, date, desc, people, JSON.stringify(tags || []), gradient, actId).run();
      return jsonResp({ message: '活动已更新' });
    }
    if (method === 'DELETE') {
      await db.prepare('DELETE FROM activities WHERE id = ?').bind(actId).run();
      return jsonResp({ message: '活动已删除' });
    }
  }

  // ===== TEAMS =====
  if (path === '/api/teams' && method === 'GET') {
    const teams = await db.prepare('SELECT t.*, COUNT(tm.id) as joined FROM teams t LEFT JOIN team_members tm ON t.id = tm.team_id GROUP BY t.id ORDER BY t.created_at DESC').all();
    for (const team of teams.results) {
      const members = await db.prepare('SELECT avatar FROM team_members WHERE team_id = ?').bind(team.id).all();
      team.members = members.results.map(m => m.avatar);
      team.joined = team.joined || 0;
    }
    return jsonResp({ teams: teams.results });
  }

  if (path === '/api/teams' && method === 'POST') {
    const body = await request.json();
    const { creator, avatar, activity, time, place, max_members, desc, user_id } = body;
    if (!activity || !time || !place) return jsonResp({ error: '活动名称、时间、地点必填' }, 400);
    const result = await db.prepare('INSERT INTO teams (creator,avatar,activity,time,place,max_members,desc,user_id) VALUES (?,?,?,?,?,?,?,?)').bind(creator || '匿名', avatar || '🧑', activity, time, place, max_members || 4, desc || '', user_id || '').run();
    await db.prepare('INSERT OR IGNORE INTO team_members (team_id,user_id,avatar) VALUES (?,?,?)').bind(result.meta.last_row_id, user_id || '', avatar || '🧑').run();
    return jsonResp({ id: result.meta.last_row_id, message: '组队已发布' }, 201);
  }

  const teamJoinMatch = path.match(/^\/api\/teams\/(\d+)\/join$/);
  if (teamJoinMatch && method === 'POST') {
    const teamId = parseInt(teamJoinMatch[1]);
    const { user_id, avatar } = await request.json();
    if (!user_id) return jsonResp({ error: '需要用户ID' }, 400);
    const team = await db.prepare('SELECT * FROM teams WHERE id = ?').bind(teamId).first();
    if (!team) return jsonResp({ error: '队伍不存在' }, 404);
    if (team.user_id === user_id) return jsonResp({ error: '不能加入自己创建的队伍' }, 400);
    const memberCount = await db.prepare('SELECT COUNT(*) as c FROM team_members WHERE team_id = ?').bind(teamId).first();
    if (memberCount.c >= team.max_members) return jsonResp({ error: '队伍已满' }, 400);
    try {
      await db.prepare('INSERT INTO team_members (team_id,user_id,avatar) VALUES (?,?,?)').bind(teamId, user_id, avatar || '🧑').run();
      return jsonResp({ message: '成功加入队伍' });
    } catch (e) {
      return jsonResp({ error: '已经在这个队伍里了' }, 400);
    }
  }

  const teamLeaveMatch = path.match(/^\/api\/teams\/(\d+)\/leave$/);
  if (teamLeaveMatch && method === 'POST') {
    const teamId = parseInt(teamLeaveMatch[1]);
    const { user_id } = await request.json();
    await db.prepare('DELETE FROM team_members WHERE team_id = ? AND user_id = ?').bind(teamId, user_id || '').run();
    return jsonResp({ message: '已退出队伍' });
  }

  // ===== GUIDES =====
  if (path === '/api/guides' && method === 'GET') {
    const guides = await db.prepare('SELECT * FROM guides ORDER BY created_at DESC').all();
    return jsonResp({ guides: guides.results });
  }

  if (path === '/api/guides' && method === 'POST') {
    const body = await request.json();
    const { title, body: content, emoji, color, gradient, author, avatar, user_id } = body;
    if (!title || !content) return jsonResp({ error: '标题和内容必填' }, 400);
    const gradients = [
      'linear-gradient(135deg,#6C5CE7,#A29BFE)', 'linear-gradient(135deg,#FF6B6B,#FF8E8E)',
      'linear-gradient(135deg,#00B894,#55EFC4)', 'linear-gradient(135deg,#E17055,#FDCB6E)',
      'linear-gradient(135deg,#0984E3,#74B9FF)', 'linear-gradient(135deg,#E84393,#FD79A8)'
    ];
    const colors = ['#6C5CE7','#FF6B6B','#00B894','#E17055','#0984E3','#E84393'];
    const ri = Math.floor(Math.random() * gradients.length);
    const result = await db.prepare('INSERT INTO guides (title,body,emoji,color,gradient,author,avatar,user_id) VALUES (?,?,?,?,?,?,?,?)').bind(title, content, emoji || '🗺️', color || colors[ri], gradient || gradients[ri], author || '匿名', avatar || '🧑', user_id || '').run();
    return jsonResp({ id: result.meta.last_row_id, message: '攻略已发布' }, 201);
  }

  const guideLikeMatch = path.match(/^\/api\/guides\/(\d+)\/like$/);
  if (guideLikeMatch && method === 'POST') {
    const guideId = parseInt(guideLikeMatch[1]);
    const { user_id } = await request.json();
    try {
      await db.prepare('INSERT INTO guide_likes (guide_id,user_id) VALUES (?,?)').bind(guideId, user_id || '').run();
      await db.prepare('UPDATE guides SET likes = likes + 1 WHERE id = ?').bind(guideId).run();
      return jsonResp({ message: '点赞成功' });
    } catch (e) {
      await db.prepare('DELETE FROM guide_likes WHERE guide_id = ? AND user_id = ?').bind(guideId, user_id || '').run();
      await db.prepare('UPDATE guides SET likes = MAX(0, likes - 1) WHERE id = ?').bind(guideId).run();
      return jsonResp({ message: '取消点赞' });
    }
  }

  // ===== STATS =====
  if (path === '/api/stats' && method === 'GET') {
    const [actCount, teamCount, guideCount] = await Promise.all([
      db.prepare('SELECT COUNT(*) as c FROM activities').first(),
      db.prepare('SELECT COUNT(*) as c FROM teams').first(),
      db.prepare('SELECT COUNT(*) as c FROM guides').first(),
    ]);
    return jsonResp({ activities: actCount.c, teams: teamCount.c, guides: guideCount.c });
  }

  // ===== NEARBY PLACES (Nominatim + OpenStreetMap) =====
  if (path === '/api/nearby' && method === 'GET') {
    const lat = parseFloat(url.searchParams.get('lat'));
    const lon = parseFloat(url.searchParams.get('lon'));
    if (!lat || !lon) return jsonResp({ error: '需要经纬度参数' }, 400);

    const categories = [
      { q: 'restaurant', cat: '美食', emoji: '🍜', color: '#E17055', indoor: true },
      { q: 'cafe', cat: '美食', emoji: '☕', color: '#E17055', indoor: true },
      { q: 'museum', cat: '展览', emoji: '🏛️', color: '#6C5CE7', indoor: true },
      { q: 'park', cat: '徒步', emoji: '🌳', color: '#00B894', indoor: false },
      { q: 'cinema', cat: '演出', emoji: '🎬', color: '#FDCB6E', indoor: true },
      { q: 'shopping', cat: '市集', emoji: '🛍️', color: '#FF6B6B', indoor: true },
      { q: 'bar', cat: '夜生活', emoji: '🍺', color: '#E17055', indoor: true },
      { q: 'gym', cat: '运动', emoji: '💪', color: '#0984E3', indoor: true },
      { q: 'library', cat: '小众', emoji: '📚', color: '#6C5CE7', indoor: true },
      { q: 'attraction', cat: '景点', emoji: '📍', color: '#0984E3', indoor: false },
      { q: 'hospital+pharmacy', cat: '服务', emoji: '🏥', color: '#636E72', indoor: true },
      { q: 'market+bazaar', cat: '市集', emoji: '🏪', color: '#FF6B6B', indoor: false },
    ];

    const gradients = [
      'linear-gradient(135deg,#6C5CE7,#A29BFE)', 'linear-gradient(135deg,#FF6B6B,#FF8E8E)',
      'linear-gradient(135deg,#00B894,#55EFC4)', 'linear-gradient(135deg,#E17055,#FDCB6E)',
      'linear-gradient(135deg,#0984E3,#74B9FF)', 'linear-gradient(135deg,#E84393,#FD79A8)',
    ];

    try {
      const allResults = [];
      // Search a few key categories in parallel
      const searchCats = categories;
      const promises = searchCats.map(cat => {
        const bbox = `${lon-0.02},${lat-0.02},${lon+0.02},${lat+0.02}`;
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${cat.q}&format=json&limit=8&viewbox=${bbox}&bounded=1&accept-language=zh&addressdetails=1`;
        return fetch(nominatimUrl, {
          headers: { 'User-Agent': 'WeekendExplorer/2.0' }
        }).then(r => r.json()).then(results => {
          return results.map(r => ({ ...r, _cat: cat }));
        }).catch(() => []);
      });

      const batchResults = await Promise.all(promises);
      for (const batch of batchResults) {
        for (const r of batch) {
          if (r.display_name && !allResults.some(x => x.place_id === r.place_id)) {
            allResults.push(r);
          }
        }
      }

      function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      }

      const activities = allResults.slice(0, 30).map((r, i) => {
        const cat = r._cat;
        const addr = r.address || {};
        const locationParts = [addr.road, addr.suburb, addr.city_district, addr.city].filter(Boolean);
        const pLat = parseFloat(r.lat) || lat;
        const pLon = parseFloat(r.lon) || lon;
        const dist = haversine(lat, lon, pLat, pLon);
        return {
          id: 20000 + i,
          title: r.display_name.split(',')[0],
          category: cat.cat,
          emoji: cat.emoji,
          color: cat.color,
          price: 0,
          indoor: cat.indoor,
          weather: cat.indoor ? 'any' : 'sunny',
          location: locationParts.length > 0 ? locationParts.slice(0, 2).join(', ') : r.display_name.split(',').slice(1, 3).join(',').trim(),
          date: '附近 ' + (r.type || ''),
          desc: r.display_name.split(',').slice(0, 4).join(', '),
          people: Math.floor(Math.random() * 150) + 20,
          tags: [cat.cat, cat.indoor ? '室内' : '户外'],
          gradient: gradients[i % gradients.length],
          lat: pLat,
          lon: pLon,
          distance: Math.round(dist * 100) / 100,
        };
      }).sort((a, b) => a.distance - b.distance);

      return jsonResp({ activities, count: activities.length, center: { lat, lon } });
    } catch (e) {
      return jsonResp({ error: '获取附近地点失败: ' + e.message, activities: [] }, 500);
    }
  }


  // ===== WEATHER API =====
  if (path === '/api/weather' && method === 'GET') {
    const lat = parseFloat(url.searchParams.get('lat')) || 39.9042;
    const lon = parseFloat(url.searchParams.get('lon')) || 116.4074;
    try {
      const weather = await getWeather(lat, lon);
      return jsonResp({ ...weather, emoji: getWeatherEmoji(weather.current.weatherType), label: getWeatherLabel(weather.current.weatherType) });
    } catch (e) { return jsonResp({ error: '获取天气失败: ' + e.message }, 500); }
  }

  // ===== RECOMMENDATIONS API =====
  if (path === '/api/recommendations' && method === 'GET') {
    const lat = parseFloat(url.searchParams.get('lat')) || 39.9042;
    const lon = parseFloat(url.searchParams.get('lon')) || 116.4074;
    const mood = url.searchParams.get('mood') || 'relax';
    const energy = parseInt(url.searchParams.get('energy')) || 3;
    const budget = url.searchParams.get('budget') || 'low';
    const categories = url.searchParams.get('categories')?.split(',') || [];
    try {
      const weatherData = await getWeather(lat, lon);
      const weatherType = weatherData.current.weatherType;
      // 1. DB activities
      const { results: allActs } = await db.prepare('SELECT * FROM activities').all();
      const dbActivities = allActs.map(a => ({ ...a, tags: typeof a.tags === 'string' ? JSON.parse(a.tags) : (a.tags || []), indoor: !!a.indoor, price: a.price || 0 }));
      // 2. Nearby real places from Nominatim
      const nearbyCats = [
        { q: 'restaurant', cat: '美食', emoji: '🍜', color: '#E17055', indoor: true },
        { q: 'cafe', cat: '美食', emoji: '☕', color: '#E17055', indoor: true },
        { q: 'museum', cat: '展览', emoji: '🏛️', color: '#6C5CE7', indoor: true },
        { q: 'park', cat: '徒步', emoji: '🌳', color: '#00B894', indoor: false },
        { q: 'cinema', cat: '演出', emoji: '🎬', color: '#FDCB6E', indoor: true },
        { q: 'bar', cat: '夜生活', emoji: '🍺', color: '#E17055', indoor: true },
        { q: 'library', cat: '小众', emoji: '📚', color: '#6C5CE7', indoor: true },
        { q: 'attraction', cat: '景点', emoji: '📍', color: '#0984E3', indoor: false },
      ];
      const gradients = ['linear-gradient(135deg,#6C5CE7,#A29BFE)','linear-gradient(135deg,#FF6B6B,#FF8E8E)','linear-gradient(135deg,#00B894,#55EFC4)','linear-gradient(135deg,#E17055,#FDCB6E)','linear-gradient(135deg,#0984E3,#74B9FF)','linear-gradient(135deg,#E84393,#FD79A8)'];
      function haversine(lat1,lon1,lat2,lon2){const R=6371;const dLat=(lat2-lat1)*Math.PI/180;const dLon=(lon2-lon1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
      let nearbyActivities = [];
      try {
        const bbox = (lon-0.015)+','+(lat-0.015)+','+(lon+0.015)+','+(lat+0.015);
        const promises = nearbyCats.map(cat => {
          const url = 'https://nominatim.openstreetmap.org/search?q='+cat.q+'&format=json&limit=5&viewbox='+bbox+'&bounded=1&accept-language=zh&addressdetails=1';
          return fetch(url, {headers:{'User-Agent':'WeekendExplorer/2.0'}}).then(r=>r.json()).then(results=>results.map(r=>({...r,_cat:cat}))).catch(()=>[]);
        });
        const batchResults = await Promise.all(promises);
        const allResults = [];
        for (const batch of batchResults) { for (const r of batch) { if (r.display_name && !allResults.some(x=>x.place_id===r.place_id)) allResults.push(r); } }
        nearbyActivities = allResults.slice(0,20).map((r,i) => {
          const cat = r._cat; const addr = r.address || {};
          const loc = [addr.road, addr.suburb, addr.city].filter(Boolean).slice(0,2).join(', ') || r.display_name.split(',').slice(1,3).join(',').trim();
          const pLat=parseFloat(r.lat)||lat; const pLon=parseFloat(r.lon)||lon;
          return { id:30000+i, title:r.display_name.split(',')[0], category:cat.cat, emoji:cat.emoji, color:cat.color, price:0, indoor:cat.indoor, weather:cat.indoor?'any':'sunny', location:loc, date:'附近'+(r.type||''), desc:r.display_name.split(',').slice(0,4).join(', '), people:Math.floor(Math.random()*150)+20, tags:[cat.cat,cat.indoor?'室内':'户外'], gradient:gradients[i%gradients.length], lat:pLat, lon:pLon, distance:Math.round(haversine(lat,lon,pLat,pLon)*100)/100 };
        });
      } catch(e) { /* nearby fetch failed, use DB only */ }
      // 3. Merge and recommend
      const allActivities = nearbyActivities;
      const recommendations = generateRecommendations(allActivities, { mood, energy, budget, categories }, weatherType);
      const explorationTask = generateExplorationTask(weatherType, mood, energy);
      return jsonResp({ weather: { type: weatherType, temp: weatherData.current.temp, emoji: getWeatherEmoji(weatherType), label: getWeatherLabel(weatherType) }, recommendations, explorationTask, count: recommendations.length });
    } catch (e) { return jsonResp({ error: '获取推荐失败: ' + e.message }, 500); }
  }

  // ===== EXPLORATION TASK API =====
  if (path === '/api/exploration-task' && method === 'GET') {
    const lat = parseFloat(url.searchParams.get('lat')) || 39.9042;
    const lon = parseFloat(url.searchParams.get('lon')) || 116.4074;
    const mood = url.searchParams.get('mood') || 'relax';
    const energy = parseInt(url.searchParams.get('energy')) || 3;
    try {
      const weatherData = await getWeather(lat, lon);
      const weatherType = weatherData.current.weatherType;
      const task = generateExplorationTask(weatherType, mood, energy);
      return jsonResp({ task, weather: { type: weatherType, emoji: getWeatherEmoji(weatherType), label: getWeatherLabel(weatherType) } });
    } catch (e) { return jsonResp({ error: '生成任务失败: ' + e.message }, 500); }
  }

  // ===== RECOMMENDATION CONFIG =====
  if (path === '/api/recommendation-config' && method === 'GET') {
    return jsonResp({ weatherTypes: WEATHER_TYPES, moodTypes: MOOD_TYPES, budgetLevels: BUDGET_LEVELS, energyLevels: ENERGY_LEVELS });
  }


  return null;
}
