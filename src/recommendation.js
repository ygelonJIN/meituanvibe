// ===== 情境感知探索引擎 =====
// 核心推荐算法：天气 × 心情 × 预算 × 能量级

// 天气类型映射
const WEATHER_TYPES = {
  sunny: { label: '晴天', emoji: '☀️', indoor: false },
  cloudy: { label: '多云', emoji: '⛅', indoor: false },
  rainy: { label: '雨天', emoji: '🌧️', indoor: true },
  snowy: { label: '雪天', emoji: '❄️', indoor: true },
  foggy: { label: '雾天', emoji: '🌫️', indoor: true },
  default: { label: '未知', emoji: '🌤️', indoor: false }
};

// 心情类型
const MOOD_TYPES = {
  adventure: { label: '想冒险', emoji: '🎯', tags: ['户外', '运动', '探索', '徒步', '骑行'] },
  relax: { label: '想放松', emoji: '😌', tags: ['咖啡', '书店', '公园', '发呆', '散步'] },
  social: { label: '想社交', emoji: '👥', tags: ['聚会', '活动', '市集', '桌游', '派对'] },
  creative: { label: '想创作', emoji: '🎨', tags: ['展览', '艺术', '工作坊', '绘画', '摄影'] },
  foodie: { label: '想觅食', emoji: '🍜', tags: ['美食', '小吃', '餐厅', '咖啡馆', '甜品'] }
};

// 预算级别
const BUDGET_LEVELS = {
  free: { label: '免费', max: 0, emoji: '🆓' },
  low: { label: '0-50元', max: 50, emoji: '💰' },
  medium: { label: '50-150元', max: 150, emoji: '💰💰' },
  high: { label: '150元+', max: Infinity, emoji: '💰💰💰' }
};

// 能量级描述
const ENERGY_LEVELS = {
  1: { label: '躺平模式', emoji: '😴', desc: '只想找个地方发呆' },
  2: { label: '轻松散步', emoji: '🚶', desc: '走走停停就好' },
  3: { label: '正常活动', emoji: '🏃', desc: '正常节奏刚刚好' },
  4: { label: '精力充沛', emoji: '⚡', desc: '想挑战点什么' },
  5: { label: '满血复活', emoji: '🔥', desc: '今天要玩个痛快' }
};

// 探索任务模板
const EXPLORATION_TASKS = {
  sunny: [
    { task: '找一个能看到天空的地方，躺下来看云10分钟', difficulty: 1, emoji: '☁️' },
    { task: '去一个你从未去过的公园，拍3张不同角度的照片', difficulty: 2, emoji: '📸' },
    { task: '骑行探索一条新路线，至少5公里', difficulty: 4, emoji: '🚲' },
    { task: '找一个日落观景点，坐到天黑', difficulty: 3, emoji: '🌅' },
    { task: '在户外找一个安静的地方读完一章书', difficulty: 2, emoji: '📖' }
  ],
  rainy: [
    { task: '找一家有落地窗的咖啡馆，听雨声发呆30分钟', difficulty: 1, emoji: '☕' },
    { task: '去一个美术馆，找一幅最喜欢的画，看5分钟', difficulty: 2, emoji: '🖼️' },
    { task: '找一家书店，买一本封面最好看的书', difficulty: 2, emoji: '📚' },
    { task: '去一个室内市集，和摊主聊聊天', difficulty: 3, emoji: '🏪' },
    { task: '找一个有现场音乐的地方，听3首歌再走', difficulty: 3, emoji: '🎵' }
  ],
  adventure: [
    { task: '去一个你从未去过的街区，探索1小时', difficulty: 3, emoji: '🗺️' },
    { task: '挑战一个你一直想试但没试的活动', difficulty: 4, emoji: '🎯' },
    { task: '和一个陌生人聊5分钟', difficulty: 5, emoji: '💬' },
    { task: '找到城市里的一个隐藏宝藏地点', difficulty: 4, emoji: '💎' },
    { task: '用公共交通随机下车，探索那个地方', difficulty: 5, emoji: '🚌' }
  ],
  relax: [
    { task: '找一个安静的角落，闭眼深呼吸10次', difficulty: 1, emoji: '🧘' },
    { task: '去一个有猫的咖啡馆，撸猫30分钟', difficulty: 2, emoji: '🐱' },
    { task: '找一个书店，买一杯咖啡，坐一下午', difficulty: 2, emoji: '☕' },
    { task: '去一个植物店，买一盆小植物带回家', difficulty: 3, emoji: '🪴' },
    { task: '找一个温泉或SPA，彻底放松', difficulty: 4, emoji: '♨️' }
  ]
};

// 推荐算法核心
export function generateRecommendations(activities, userPrefs, weather) {
  const { mood, energy, budget, categories } = userPrefs;
  
  const scored = activities.map(activity => {
    let score = 0;
    let reasons = [];
    
    // 1. 天气匹配 (权重: 30%)
    if (weather && activity.weather) {
      const weatherType = WEATHER_TYPES[weather] || WEATHER_TYPES.default;
      if (activity.indoor && weatherType.indoor) {
        score += 30;
        reasons.push('天气适合室内');
      } else if (!activity.indoor && !weatherType.indoor) {
        score += 30;
        reasons.push('天气适合户外');
      } else if (activity.weather === 'any') {
        score += 20;
        reasons.push('不限天气');
      } else {
        score -= 10;
      }
    }
    
    // 2. 心情匹配 (权重: 25%)
    if (mood && activity.tags) {
      const moodInfo = MOOD_TYPES[mood];
      if (moodInfo) {
        const matchingTags = activity.tags.filter(t => 
          moodInfo.tags.some(mt => t.includes(mt) || mt.includes(t))
        );
        if (matchingTags.length > 0) {
          score += 25;
          reasons.push(`符合${moodInfo.label}的心情`);
        }
      }
    }
    
    // 3. 预算匹配 (权重: 20%)
    if (budget && activity.price !== undefined) {
      const budgetInfo = BUDGET_LEVELS[budget];
      if (budgetInfo) {
        if (activity.price <= budgetInfo.max) {
          score += 20;
          reasons.push('预算友好');
        } else {
          score -= 15;
        }
      }
    }
    
    // 4. 能量级匹配 (权重: 15%)
    if (energy) {
      const activityEnergy = activity.indoor ? 2 : 4;
      const diff = Math.abs(energy - activityEnergy);
      if (diff <= 1) {
        score += 15;
        reasons.push('体力刚好');
      } else if (diff <= 2) {
        score += 5;
      }
    }
    
    // 5. 类别偏好 (权重: 10%)
    if (categories && categories.length > 0) {
      if (categories.includes(activity.category)) {
        score += 10;
        reasons.push('你感兴趣的类别');
      }
    }
    
    return {
      ...activity,
      score,
      reasons,
      recommendationReason: reasons[0] || '综合推荐'
    };
  });
  
  return scored.sort((a, b) => b.score - a.score).slice(0, 10);
}

// 生成探索任务
export function generateExplorationTask(weather, mood, energy) {
  let tasks = [];
  
  if (weather === 'rainy' || weather === 'snowy' || weather === 'foggy') {
    tasks = [...EXPLORATION_TASKS.rainy];
  } else {
    tasks = [...EXPLORATION_TASKS.sunny];
  }
  
  if (mood === 'adventure') {
    tasks = [...tasks, ...EXPLORATION_TASKS.adventure];
  } else if (mood === 'relax') {
    tasks = [...tasks, ...EXPLORATION_TASKS.relax];
  }
  
  const filtered = tasks.filter(t => t.difficulty <= energy);
  
  if (filtered.length > 0) {
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
  
  return { task: '探索你从未去过的地方，发现新的惊喜', difficulty: 2, emoji: '✨' };
}

// 获取天气描述
export function getWeatherDescription(weatherCode) {
  const weatherMap = {
    0: 'sunny', 1: 'sunny', 2: 'cloudy', 3: 'cloudy',
    45: 'foggy', 48: 'foggy',
    51: 'rainy', 53: 'rainy', 55: 'rainy', 61: 'rainy', 63: 'rainy', 65: 'rainy',
    71: 'snowy', 73: 'snowy', 75: 'snowy', 77: 'snowy',
    80: 'rainy', 81: 'rainy', 82: 'rainy',
    85: 'snowy', 86: 'snowy',
    95: 'rainy', 96: 'rainy', 99: 'rainy'
  };
  return weatherMap[weatherCode] || 'sunny';
}

export { WEATHER_TYPES, MOOD_TYPES, BUDGET_LEVELS, ENERGY_LEVELS, EXPLORATION_TASKS };
