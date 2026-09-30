-- 活动表
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT DEFAULT '📍',
  color TEXT DEFAULT '#6C5CE7',
  price INTEGER DEFAULT 0,
  indoor INTEGER DEFAULT 1,
  weather TEXT DEFAULT 'any',
  location TEXT NOT NULL,
  date TEXT DEFAULT '',
  desc TEXT DEFAULT '',
  people INTEGER DEFAULT 0,
  tags TEXT DEFAULT '[]',
  gradient TEXT DEFAULT 'linear-gradient(135deg,#6C5CE7,#A29BFE)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 队伍表
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator TEXT NOT NULL,
  avatar TEXT DEFAULT '🧑',
  activity TEXT NOT NULL,
  time TEXT NOT NULL,
  place TEXT NOT NULL,
  max_members INTEGER DEFAULT 4,
  desc TEXT DEFAULT '',
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 队伍成员表
CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  avatar TEXT DEFAULT '🧑',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);

-- 攻略表
CREATE TABLE IF NOT EXISTS guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  emoji TEXT DEFAULT '🗺️',
  color TEXT DEFAULT '#6C5CE7',
  gradient TEXT DEFAULT 'linear-gradient(135deg,#6C5CE7,#A29BFE)',
  author TEXT NOT NULL,
  avatar TEXT DEFAULT '🧑',
  user_id TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 攻略点赞表
CREATE TABLE IF NOT EXISTS guide_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guide_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  UNIQUE(guide_id, user_id)
);

-- 探索记录表
CREATE TABLE IF NOT EXISTS explorations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  activity_id INTEGER,
  task TEXT,
  mood TEXT,
  energy INTEGER,
  rating INTEGER,
  photo_url TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 探索成就表
CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_type)
);

-- 探索愿望清单
CREATE TABLE IF NOT EXISTS wishlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  activity_id INTEGER,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, activity_id)
);
