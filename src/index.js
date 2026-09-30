const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>周末城市探索指南 | Weekend Explorer</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<style>
:root {
  --primary: #6C5CE7;
  --primary-light: #A29BFE;
  --primary-dark: #5A4BD1;
  --accent: #FF6B6B;
  --accent-light: #FF8E8E;
  --success: #00B894;
  --warning: #FDCB6E;
  --bg: #F8F9FE;
  --card: #FFFFFF;
  --text: #2D3436;
  --text-light: #636E72;
  --text-muted: #B2BEC3;
  --border: #E8ECF1;
  --shadow: 0 2px 16px rgba(108,92,231,0.08);
  --shadow-lg: 0 8px 32px rgba(108,92,231,0.12);
  --radius: 16px;
  --radius-sm: 10px;
  --radius-xs: 6px;
  --nav-height: 64px;
  --bottom-nav: 70px;
}

* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ===== NAVIGATION ===== */
.top-nav {
  position: fixed; top: 0; left: 0; right: 0;
  height: var(--nav-height);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
}
.nav-logo {
  display: flex; align-items: center; gap: 10px;
  font-size: 20px; font-weight: 700;
  color: var(--primary);
}
.nav-logo svg { width: 32px; height: 32px; }
.nav-city {
  display: flex; align-items: center; gap: 4px;
  font-size: 14px; color: var(--text-light);
  cursor: pointer;
}
.nav-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 14px; font-weight: 600;
  cursor: pointer;
}

/* ===== BOTTOM TAB BAR ===== */
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: var(--bottom-nav);
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-around;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}
.tab-item {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  cursor: pointer; padding: 8px 12px;
  border-radius: 12px; transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.tab-item svg { width: 24px; height: 24px; color: var(--text-muted); transition: all 0.2s; }
.tab-item span { font-size: 10px; color: var(--text-muted); font-weight: 500; transition: all 0.2s; }
.tab-item.active svg { color: var(--primary); }
.tab-item.active span { color: var(--primary); font-weight: 600; }
.tab-item:active { transform: scale(0.92); }

/* ===== PAGE CONTAINER ===== */
.page-container {
  padding-top: var(--nav-height);
  padding-bottom: calc(var(--bottom-nav) + 16px);
  min-height: 100vh;
}
.page { display: none; }
.page.active { display: block; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ===== HOME PAGE ===== */
.home-hero {
  background: linear-gradient(135deg, var(--primary) 0%, #8B5CF6 50%, var(--accent) 100%);
  margin: 16px; border-radius: var(--radius);
  padding: 28px 24px; color: #fff;
  position: relative; overflow: hidden;
}
.home-hero::after {
  content: ''; position: absolute; top: -30%; right: -10%;
  width: 200px; height: 200px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
}
.home-hero::before {
  content: ''; position: absolute; bottom: -20%; left: 20%;
  width: 120px; height: 120px;
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
}
.hero-greeting { font-size: 15px; opacity: 0.9; margin-bottom: 6px; }
.hero-title { font-size: 26px; font-weight: 800; margin-bottom: 4px; line-height: 1.3; }
.hero-subtitle { font-size: 14px; opacity: 0.8; margin-bottom: 20px; }
.hero-weather {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  padding: 8px 16px; border-radius: 20px;
  font-size: 14px; font-weight: 500;
}

/* Search Bar */
.search-bar {
  margin: 0 16px; position: relative; z-index: 10;
  margin-top: -22px;
}
.search-input-wrap {
  background: var(--card);
  border-radius: 14px;
  box-shadow: var(--shadow-lg);
  display: flex; align-items: center;
  padding: 0 16px; height: 52px;
}
.search-input-wrap svg { width: 20px; height: 20px; color: var(--text-muted); flex-shrink: 0; }
.search-input-wrap input {
  flex: 1; border: none; outline: none;
  font-size: 15px; padding: 0 12px;
  background: transparent; color: var(--text);
}
.search-input-wrap input::placeholder { color: var(--text-muted); }

/* Quick Categories */
.quick-cats {
  display: flex; gap: 12px; padding: 20px 16px 8px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.quick-cats::-webkit-scrollbar { display: none; }
.quick-cat {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  min-width: 72px; cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.quick-cat:active { transform: scale(0.92); }
.quick-cat-icon {
  width: 56px; height: 56px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.quick-cat span { font-size: 12px; color: var(--text-light); font-weight: 500; white-space: nowrap; }

/* Section Header */
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 16px 12px;
}
.section-title { font-size: 20px; font-weight: 700; }
.section-more { font-size: 13px; color: var(--primary); cursor: pointer; font-weight: 500; }

/* Activity Cards */
.card-scroll {
  display: flex; gap: 14px; padding: 0 16px 8px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
}
.card-scroll::-webkit-scrollbar { display: none; }
.activity-card {
  min-width: 280px; max-width: 280px;
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
  transition: transform 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}
.activity-card:active { transform: scale(0.97); }
.card-img {
  width: 100%; height: 160px;
  object-fit: cover;
  background: linear-gradient(135deg, #ddd, #eee);
  display: flex; align-items: center; justify-content: center;
  font-size: 48px;
  position: relative;
}
.card-badge {
  position: absolute; top: 12px; left: 12px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  color: #fff; font-size: 11px; font-weight: 600;
  padding: 4px 10px; border-radius: 8px;
}
.card-weather-badge {
  position: absolute; top: 12px; right: 12px;
  background: rgba(255,255,255,0.9);
  padding: 4px 8px; border-radius: 8px;
  font-size: 12px;
}
.card-body { padding: 14px 16px 16px; }
.card-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; line-height: 1.3; }
.card-info { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-light); margin-bottom: 4px; }
.card-info svg { width: 14px; height: 14px; }
.card-tags { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
.card-tag {
  font-size: 11px; padding: 3px 8px; border-radius: 6px;
  background: #F0EDFF; color: var(--primary); font-weight: 500;
}
.card-tag.free { background: #E8FFF5; color: #00B894; }

/* ===== DISCOVER PAGE ===== */
.filter-bar {
  display: flex; gap: 8px; padding: 12px 16px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.filter-bar::-webkit-scrollbar { display: none; }
.filter-chip {
  display: flex; align-items: center; gap: 4px;
  padding: 8px 16px; border-radius: 20px;
  font-size: 13px; font-weight: 500;
  border: 1.5px solid var(--border);
  background: var(--card);
  color: var(--text-light);
  cursor: pointer; white-space: nowrap;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.filter-chip.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.filter-chip:active { transform: scale(0.95); }

/* Activity List */
.activity-list { padding: 0 16px; display: flex; flex-direction: column; gap: 12px; }
.activity-list-item {
  display: flex; gap: 14px;
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 14px;
  cursor: pointer;
  transition: transform 0.2s;
}
.activity-list-item:active { transform: scale(0.98); }
.list-item-img {
  width: 100px; height: 100px; border-radius: var(--radius-sm);
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 36px;
}
.list-item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; }
.list-item-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.list-item-desc { font-size: 12px; color: var(--text-light); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.list-item-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
.list-item-price { font-size: 14px; font-weight: 700; color: var(--accent); }
.list-item-people { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 3px; }

/* ===== TEAM PAGE ===== */
.team-tabs {
  display: flex; padding: 12px 16px; gap: 0;
  background: var(--card); margin: 12px 16px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
}
.team-tab {
  flex: 1; text-align: center; padding: 10px;
  font-size: 14px; font-weight: 600;
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer; transition: all 0.2s;
}
.team-tab.active {
  background: var(--primary);
  color: #fff;
}

.team-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin: 0 16px 12px;
  padding: 18px;
}
.team-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.team-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.team-creator-name { font-size: 14px; font-weight: 600; }
.team-creator-tag { font-size: 11px; color: var(--text-muted); }
.team-title { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
.team-meta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
.team-meta-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; color: var(--text-light);
}
.team-meta-item svg { width: 14px; height: 14px; }
.team-members-row { display: flex; align-items: center; gap: 0; margin-bottom: 14px; }
.team-member-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px;
  margin-left: -8px;
}
.team-member-avatar:first-child { margin-left: 0; }
.team-member-more {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--border); margin-left: -8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: var(--text-light); font-weight: 600;
  border: 2px solid #fff;
}
.team-join-btn {
  width: 100%; padding: 11px;
  background: linear-gradient(135deg, var(--primary), #8B5CF6);
  color: #fff; border: none; border-radius: var(--radius-sm);
  font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.team-join-btn:active { transform: scale(0.97); opacity: 0.9; }
.team-join-btn.joined {
  background: var(--success);
}

/* ===== CHECKIN PAGE ===== */
.checkin-banner {
  margin: 16px; padding: 24px;
  background: linear-gradient(135deg, #00B894, #00CEC9);
  border-radius: var(--radius);
  color: #fff; text-align: center;
}
.checkin-banner h2 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.checkin-banner p { font-size: 14px; opacity: 0.85; margin-bottom: 16px; }
.checkin-stats { display: flex; justify-content: center; gap: 32px; margin-bottom: 18px; }
.checkin-stat-num { font-size: 28px; font-weight: 800; }
.checkin-stat-label { font-size: 11px; opacity: 0.8; }
.checkin-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 32px; background: rgba(255,255,255,0.25);
  backdrop-filter: blur(8px);
  border: none; border-radius: 24px;
  color: #fff; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.checkin-btn:active { transform: scale(0.95); }

.badges-section { padding: 0 16px; }
.badge-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.badge-item {
  background: var(--card);
  border-radius: var(--radius-sm);
  padding: 18px 12px;
  text-align: center;
  box-shadow: var(--shadow);
}
.badge-icon { font-size: 36px; margin-bottom: 8px; }
.badge-name { font-size: 12px; font-weight: 600; margin-bottom: 2px; }
.badge-desc { font-size: 10px; color: var(--text-muted); }
.badge-item.locked { opacity: 0.45; }

.footprint-list { padding: 0 16px; display: flex; flex-direction: column; gap: 10px; }
.footprint-item {
  display: flex; align-items: center; gap: 14px;
  background: var(--card);
  border-radius: var(--radius-sm);
  padding: 14px; box-shadow: var(--shadow);
}
.footprint-emoji { font-size: 32px; }
.footprint-info { flex: 1; }
.footprint-title { font-size: 14px; font-weight: 600; }
.footprint-date { font-size: 11px; color: var(--text-muted); }
.footprint-rating { font-size: 14px; }

/* ===== GUIDE PAGE ===== */
.guide-tabs {
  display: flex; gap: 0; padding: 4px;
  background: var(--card); margin: 12px 16px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
}
.guide-tab {
  flex: 1; text-align: center; padding: 10px;
  font-size: 13px; font-weight: 600;
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer; transition: all 0.2s;
}
.guide-tab.active { background: var(--primary); color: #fff; }

.guide-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin: 0 16px 14px;
  overflow: hidden;
  cursor: pointer;
}
.guide-card-img {
  width: 100%; height: 180px;
  display: flex; align-items: center; justify-content: center;
  font-size: 64px;
  position: relative;
}
.guide-card-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  color: #fff;
}
.guide-card-overlay h3 { font-size: 18px; font-weight: 700; }
.guide-card-body { padding: 14px 16px; }
.guide-card-desc { font-size: 13px; color: var(--text-light); line-height: 1.6; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.guide-card-footer { display: flex; align-items: center; justify-content: space-between; }
.guide-author { display: flex; align-items: center; gap: 8px; }
.guide-author-avatar { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.guide-author-name { font-size: 12px; color: var(--text-light); }
.guide-stats { display: flex; gap: 12px; }
.guide-stat { display: flex; align-items: center; gap: 3px; font-size: 12px; color: var(--text-muted); }
.guide-stat svg { width: 14px; height: 14px; }

/* ===== PROFILE PAGE ===== */
.profile-header {
  text-align: center; padding: 32px 16px 24px;
  background: linear-gradient(135deg, var(--primary), #8B5CF6);
  color: #fff;
}
.profile-avatar-big {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; margin: 0 auto 12px;
  border: 3px solid rgba(255,255,255,0.4);
}
.profile-name { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
.profile-bio { font-size: 13px; opacity: 0.8; }
.profile-stats-row {
  display: flex; justify-content: center; gap: 40px;
  margin-top: 20px;
}
.profile-stat { text-align: center; }
.profile-stat-num { font-size: 22px; font-weight: 800; }
.profile-stat-label { font-size: 11px; opacity: 0.75; }

.profile-menu { padding: 16px; display: flex; flex-direction: column; gap: 2px; }
.profile-menu-item {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px;
  background: var(--card);
  border-radius: var(--radius-sm);
  cursor: pointer; transition: background 0.15s;
}
.profile-menu-item:active { background: #F0EDFF; }
.profile-menu-item:first-child { border-radius: var(--radius-sm) var(--radius-sm) 4px 4px; }
.profile-menu-item:last-child { border-radius: 4px 4px var(--radius-sm) var(--radius-sm); }
.profile-menu-icon { font-size: 20px; width: 28px; text-align: center; }
.profile-menu-text { flex: 1; font-size: 15px; font-weight: 500; }
.profile-menu-arrow { color: var(--text-muted); font-size: 18px; }

/* ===== MODALS ===== */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: none; align-items: flex-end; justify-content: center;
}
.modal-overlay.show { display: flex; animation: fadeIn 0.2s ease; }
.modal-content {
  background: var(--card);
  border-radius: 20px 20px 0 0;
  width: 100%; max-width: 480px;
  max-height: 85vh; overflow-y: auto;
  padding: 24px 20px;
  animation: slideUp 0.3s ease;
}
@keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
.modal-handle {
  width: 36px; height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin: 0 auto 20px;
}
.modal-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; text-align: center; }

/* ===== FILTER MODAL ===== */
.filter-group { margin-bottom: 20px; }
.filter-group-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: var(--text-light); }
.filter-options { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-opt {
  padding: 8px 16px; border-radius: 20px;
  font-size: 13px; font-weight: 500;
  border: 1.5px solid var(--border);
  background: var(--card);
  color: var(--text-light);
  cursor: pointer; transition: all 0.2s;
}
.filter-opt.selected {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.filter-apply-btn {
  width: 100%; padding: 14px;
  background: var(--primary);
  color: #fff; border: none; border-radius: var(--radius-sm);
  font-size: 16px; font-weight: 600;
  cursor: pointer; margin-top: 8px;
}

/* ===== CHECKIN MODAL ===== */
.checkin-form-group { margin-bottom: 18px; }
.checkin-form-label { font-size: 13px; font-weight: 600; color: var(--text-light); margin-bottom: 8px; display: block; }
.checkin-form-input {
  width: 100%; padding: 12px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px; outline: none;
  transition: border-color 0.2s;
}
.checkin-form-input:focus { border-color: var(--primary); }
.checkin-form-textarea {
  width: 100%; padding: 12px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px; outline: none;
  resize: vertical; min-height: 80px;
  font-family: inherit;
}
.checkin-form-textarea:focus { border-color: var(--primary); }
.rating-stars { display: flex; gap: 8px; }
.rating-star { font-size: 28px; cursor: pointer; transition: transform 0.15s; filter: grayscale(1); opacity: 0.3; }
.rating-star.active { filter: grayscale(0); opacity: 1; }
.rating-star:active { transform: scale(1.2); }
.checkin-submit-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, var(--primary), #8B5CF6);
  color: #fff; border: none; border-radius: var(--radius-sm);
  font-size: 16px; font-weight: 600;
  cursor: pointer;
}

/* ===== TOAST ===== */
.toast {
  position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  color: #fff; padding: 12px 24px;
  border-radius: 24px; font-size: 14px; font-weight: 500;
  z-index: 300; opacity: 0; transition: opacity 0.3s;
  pointer-events: none;
}
.toast.show { opacity: 1; }

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center; padding: 60px 32px;
  color: var(--text-muted);
}
.empty-state-icon { font-size: 48px; margin-bottom: 12px; }
.empty-state-text { font-size: 14px; }

/* ===== RESPONSIVE ===== */
@media (min-width: 768px) {
  .page-container { max-width: 480px; margin: 0 auto; }
  .top-nav { max-width: 480px; margin: 0 auto; left: 50%; transform: translateX(-50%); }
  .bottom-nav { max-width: 480px; margin: 0 auto; left: 50%; transform: translateX(-50%); }
}

/* ===== PULL TO REFRESH ===== */
.ptr-text { text-align: center; padding: 12px; font-size: 12px; color: var(--text-muted); }

/* ===== LOADING SKELETON ===== */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
</style>
</head>
<body>

<!-- Top Navigation -->
<nav class="top-nav">
  <div class="nav-logo">
    <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="url(#g1)"/><path d="M10 16l4 4 8-8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="g1" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#6C5CE7"/><stop offset="1" stop-color="#FF6B6B"/></linearGradient></defs></svg>
    探索指南
  </div>
  <div class="nav-city" onclick="showToast('📍 已定位到：北京')">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    北京
  </div>
  <div class="nav-avatar" onclick="switchTab('profile')">清</div>
</nav>

<!-- Page Container -->
<div class="page-container">

  <!-- ===== HOME PAGE ===== -->
  <div class="page active" id="page-home">
    <div class="home-hero">
      <div class="hero-greeting" id="greeting">☀️ 下午好</div>
      <div class="hero-title">这个周末<br>去哪里探索？</div>
      <div class="hero-subtitle">为你推荐最适合的周末活动</div>
      <div class="hero-weather">
        <span id="weather-icon">🌤</span>
        <span id="weather-text">晴 25°C · 适合户外</span>
      </div>
    </div>

    <div class="search-bar">
      <div class="search-input-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="搜索活动、地点、攻略..." id="searchInput" oninput="handleSearch(this.value)">
      </div>
    </div>

    <div class="quick-cats">
      <div class="quick-cat" onclick="filterByCategory('展览')">
        <div class="quick-cat-icon" style="background:linear-gradient(135deg,#6C5CE7,#A29BFE)">🎨</div>
        <span>展览</span>
      </div>
      <div class="quick-cat" onclick="filterByCategory('市集')">
        <div class="quick-cat-icon" style="background:linear-gradient(135deg,#FF6B6B,#FF8E8E)">🛍️</div>
        <span>市集</span>
      </div>
      <div class="quick-cat" onclick="filterByCategory('演出')">
        <div class="quick-cat-icon" style="background:linear-gradient(135deg,#FDCB6E,#F9A825)">🎵</div>
        <span>演出</span>
      </div>
      <div class="quick-cat" onclick="filterByCategory('徒步')">
        <div class="quick-cat-icon" style="background:linear-gradient(135deg,#00B894,#00CEC9)">🥾</div>
        <span>徒步</span>
      </div>
      <div class="quick-cat" onclick="filterByCategory('美食')">
        <div class="quick-cat-icon" style="background:linear-gradient(135deg,#E17055,#FDCB6E)">🍜</div>
        <span>美食</span>
      </div>
      <div class="quick-cat" onclick="filterByCategory('运动')">
        <div class="quick-cat-icon" style="background:linear-gradient(135deg,#0984E3,#74B9FF)">⚽</div>
        <span>运动</span>
      </div>
      <div class="quick-cat" onclick="filterByCategory('小众')">
        <div class="quick-cat-icon" style="background:linear-gradient(135deg,#E84393,#FD79A8)">🔮</div>
        <span>小众</span>
      </div>
    </div>

    <div class="section-header">
      <div class="section-title">🔥 本周热门</div>
      <div class="section-more" onclick="switchTab('discover')">查看更多 →</div>
    </div>
    <div class="card-scroll" id="hotCards"></div>

    <div class="section-header">
      <div class="section-title">🤖 AI 为你推荐</div>
      <div class="section-more" onclick="showToast('🔄 已刷新推荐')">换一批</div>
    </div>
    <div class="card-scroll" id="aiCards"></div>

    <div class="section-header">
      <div class="section-title">🌧️ 雨天备选方案</div>
      <div class="section-more">室内精选</div>
    </div>
    <div class="card-scroll" id="rainCards"></div>
  </div>

  <!-- ===== DISCOVER PAGE ===== -->
  <div class="page" id="page-discover">
    <div class="filter-bar">
      <div class="filter-chip active" onclick="setFilter(this,'all')">全部</div>
      <div class="filter-chip" onclick="setFilter(this,'免费')">🆓 免费</div>
      <div class="filter-chip" onclick="setFilter(this,'室内')">🏠 室内</div>
      <div class="filter-chip" onclick="setFilter(this,'户外')">🌳 户外</div>
      <div class="filter-chip" onclick="setFilter(this,'今天')">📅 今天</div>
      <div class="filter-chip" onclick="openFilterModal()">⚙️ 更多筛选</div>
    </div>
    <div class="activity-list" id="activityList"></div>
  </div>

  <!-- ===== TEAM PAGE ===== -->
  <div class="page" id="page-team">
    <div class="team-tabs">
      <div class="team-tab active" onclick="switchTeamTab(this,'all')">发现队伍</div>
      <div class="team-tab" onclick="switchTeamTab(this,'my')">我的队伍</div>
      <div class="team-tab" onclick="switchTeamTab(this,'create')">发起组队</div>
    </div>
    <div id="teamContent"></div>
  </div>

  <!-- ===== CHECKIN PAGE ===== -->
  <div class="page" id="page-checkin">
    <div class="checkin-banner">
      <h2>📍 我的探索足迹</h2>
      <p>记录每一次精彩探索</p>
      <div class="checkin-stats">
        <div><div class="checkin-stat-num" id="checkinCount">12</div><div class="checkin-stat-label">打卡次数</div></div>
        <div><div class="checkin-stat-num" id="badgeCount">5</div><div class="checkin-stat-label">获得徽章</div></div>
        <div><div class="checkin-stat-num">3</div><div class="checkin-stat-label">攻略发布</div></div>
      </div>
      <button class="checkin-btn" onclick="openCheckinModal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        立即打卡
      </button>
    </div>

    <div class="section-header"><div class="section-title">🏆 成就徽章</div></div>
    <div class="badges-section">
      <div class="badge-grid" id="badgeGrid"></div>
    </div>

    <div class="section-header"><div class="section-title">📝 最近足迹</div></div>
    <div class="footprint-list" id="footprintList"></div>
  </div>

  <!-- ===== GUIDE PAGE ===== -->
  <div class="page" id="page-guide">
    <div class="guide-tabs">
      <div class="guide-tab active" onclick="switchGuideTab(this,'recommend')">推荐</div>
      <div class="guide-tab" onclick="switchGuideTab(this,'follow')">关注</div>
      <div class="guide-tab" onclick="switchGuideTab(this,'mine')">我的</div>
    </div>
    <div id="guideContent"></div>
  </div>

  <!-- ===== PROFILE PAGE ===== -->
  <div class="page" id="page-profile">
    <div class="profile-header">
      <div class="profile-avatar-big">🧑‍🎓</div>
      <div class="profile-name">探索新手</div>
      <div class="profile-bio">周末不想宅在家 🌟</div>
      <div class="profile-stats-row">
        <div class="profile-stat"><div class="profile-stat-num">12</div><div class="profile-stat-label">打卡</div></div>
        <div class="profile-stat"><div class="profile-stat-num">5</div><div class="profile-stat-label">徽章</div></div>
        <div class="profile-stat"><div class="profile-stat-num">3</div><div class="profile-stat-label">攻略</div></div>
        <div class="profile-stat"><div class="profile-stat-num">8</div><div class="profile-stat-label">队友</div></div>
      </div>
    </div>
    <div class="profile-menu">
      <div class="profile-menu-item"><span class="profile-menu-icon">❤️</span><span class="profile-menu-text">我的收藏</span><span class="profile-menu-arrow">›</span></div>
      <div class="profile-menu-item"><span class="profile-menu-icon">📋</span><span class="profile-menu-text">浏览历史</span><span class="profile-menu-arrow">›</span></div>
      <div class="profile-menu-item"><span class="profile-menu-icon">👥</span><span class="profile-menu-text">我的队伍</span><span class="profile-menu-arrow">›</span></div>
      <div class="profile-menu-item"><span class="profile-menu-icon">📝</span><span class="profile-menu-text">我的攻略</span><span class="profile-menu-arrow">›</span></div>
      <div class="profile-menu-item"><span class="profile-menu-icon">⚙️</span><span class="profile-menu-text">偏好设置</span><span class="profile-menu-arrow">›</span></div>
      <div class="profile-menu-item"><span class="profile-menu-icon">🔔</span><span class="profile-menu-text">消息通知</span><span class="profile-menu-arrow">›</span></div>
      <div class="profile-menu-item"><span class="profile-menu-icon">❓</span><span class="profile-menu-text">帮助与反馈</span><span class="profile-menu-arrow">›</span></div>
    </div>
  </div>
</div>

<!-- Bottom Navigation -->
<nav class="bottom-nav">
  <div class="tab-item active" onclick="switchTab('home')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span>首页</span>
  </div>
  <div class="tab-item" onclick="switchTab('discover')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
    <span>发现</span>
  </div>
  <div class="tab-item" onclick="switchTab('team')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    <span>组队</span>
  </div>
  <div class="tab-item" onclick="switchTab('checkin')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    <span>打卡</span>
  </div>
  <div class="tab-item" onclick="switchTab('profile')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span>我的</span>
  </div>
</nav>

<!-- Filter Modal -->
<div class="modal-overlay" id="filterModal">
  <div class="modal-content">
    <div class="modal-handle"></div>
    <div class="modal-title">筛选条件</div>
    <div class="filter-group">
      <div class="filter-group-title">🏷️ 分类</div>
      <div class="filter-options">
        <div class="filter-opt selected" onclick="toggleFilterOpt(this)">全部</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">展览</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">市集</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">演出</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">徒步</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">美食</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">运动</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">小众</div>
      </div>
    </div>
    <div class="filter-group">
      <div class="filter-group-title">💰 预算</div>
      <div class="filter-options">
        <div class="filter-opt selected" onclick="toggleFilterOpt(this)">不限</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">免费</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">50元以内</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">100元以内</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">200元以内</div>
      </div>
    </div>
    <div class="filter-group">
      <div class="filter-group-title">🌤️ 天气适配</div>
      <div class="filter-options">
        <div class="filter-opt selected" onclick="toggleFilterOpt(this)">不限</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">☀️ 晴天推荐</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">🌧️ 雨天可用</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">❄️ 冬季友好</div>
      </div>
    </div>
    <div class="filter-group">
      <div class="filter-group-title">👥 同行人数</div>
      <div class="filter-options">
        <div class="filter-opt selected" onclick="toggleFilterOpt(this)">不限</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">一个人</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">2-4人</div>
        <div class="filter-opt" onclick="toggleFilterOpt(this)">5人以上</div>
      </div>
    </div>
    <button class="filter-apply-btn" onclick="applyFilter()">应用筛选</button>
  </div>
</div>

<!-- Checkin Modal -->
<div class="modal-overlay" id="checkinModal">
  <div class="modal-content">
    <div class="modal-handle"></div>
    <div class="modal-title">📍 打卡记录</div>
    <div class="checkin-form-group">
      <label class="checkin-form-label">活动/地点名称</label>
      <input class="checkin-form-input" id="checkinPlace" placeholder="例如：798艺术区">
    </div>
    <div class="checkin-form-group">
      <label class="checkin-form-label">体验评分</label>
      <div class="rating-stars" id="ratingStars">
        <span class="rating-star" onclick="setRating(1)">⭐</span>
        <span class="rating-star" onclick="setRating(2)">⭐</span>
        <span class="rating-star" onclick="setRating(3)">⭐</span>
        <span class="rating-star" onclick="setRating(4)">⭐</span>
        <span class="rating-star" onclick="setRating(5)">⭐</span>
      </div>
    </div>
    <div class="checkin-form-group">
      <label class="checkin-form-label">探索感受</label>
      <textarea class="checkin-form-textarea" id="checkinNote" placeholder="分享你的探索体验..."></textarea>
    </div>
    <button class="checkin-submit-btn" onclick="submitCheckin()">✨ 完成打卡</button>
  </div>
</div>

<!-- Create Team Modal -->
<div class="modal-overlay" id="createTeamModal">
  <div class="modal-content">
    <div class="modal-handle"></div>
    <div class="modal-title">👥 发起组队</div>
    <div class="checkin-form-group">
      <label class="checkin-form-label">活动名称</label>
      <input class="checkin-form-input" id="teamActivity" placeholder="例如：周末故宫博物院">
    </div>
    <div class="checkin-form-group">
      <label class="checkin-form-label">集合时间</label>
      <input class="checkin-form-input" id="teamTime" type="datetime-local">
    </div>
    <div class="checkin-form-group">
      <label class="checkin-form-label">集合地点</label>
      <input class="checkin-form-input" id="teamPlace" placeholder="例如：故宫午门">
    </div>
    <div class="checkin-form-group">
      <label class="checkin-form-label">招募人数</label>
      <input class="checkin-form-input" id="teamCount" type="number" min="2" max="20" value="4">
    </div>
    <div class="checkin-form-group">
      <label class="checkin-form-label">队伍描述</label>
      <textarea class="checkin-form-textarea" id="teamDesc" placeholder="简单介绍一下这次活动和对队友的期望..."></textarea>
    </div>
    <button class="checkin-submit-btn" onclick="submitTeam()">🚀 发布组队</button>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
// ===== DATA =====
const ACTIVITIES = [
  {id:1, title:"故宫博物院·午门特展", category:"展览", emoji:"🏛️", color:"#6C5CE7", price:60, indoor:true, weather:"any", location:"东城区景山前街4号", date:"周六-周日", desc:"「紫禁城与凡尔赛」中法文化交流大展，150+件珍贵文物跨时空对话", people:234, tags:["展览","文化","室内"], gradient:"linear-gradient(135deg,#6C5CE7,#A29BFE)"},
  {id:2, title:"朝阳大悦城市集", category:"市集", emoji:"🛍️", color:"#FF6B6B", price:0, indoor:true, weather:"any", location:"朝阳区朝阳北路101号", date:"周六 10:00-20:00", desc:"手作、vintage、独立设计品牌汇集，周末淘宝好去处", people:156, tags:["免费","市集","购物"], gradient:"linear-gradient(135deg,#FF6B6B,#FF8E8E)"},
  {id:3, title:"LiveHouse·独立音乐之夜", category:"演出", emoji:"🎸", color:"#FDCB6E", price:120, indoor:true, weather:"any", location:"疆进酒OMNI SPACE", date:"周六 20:00", desc:"新生代独立乐队联合演出，用音乐点燃周末夜晚", people:89, tags:["演出","音乐","夜生活"], gradient:"linear-gradient(135deg,#FDCB6E,#F9A825)"},
  {id:4, title:"香山公园徒步", category:"徒步", emoji:"🥾", color:"#00B894", price:10, indoor:false, weather:"sunny", location:"海淀区买卖街40号", date:"周日 8:00", desc:"秋日登高赏红叶，经典路线约3小时，适合新手", people:312, tags:["户外","徒步","自然"], gradient:"linear-gradient(135deg,#00B894,#00CEC9)"},
  {id:5, title:"簋街美食探店", category:"美食", emoji:"🍜", color:"#E17055", price:80, indoor:true, weather:"any", location:"东城区东直门内大街", date:"周六 17:00", desc:"京城最有名的美食街，小龙虾、烧烤、火锅一站吃遍", people:178, tags:["美食","聚餐","夜生活"], gradient:"linear-gradient(135deg,#E17055,#FDCB6E)"},
  {id:6, title:"798艺术区漫步", category:"展览", emoji:"🎨", color:"#E84393", price:0, indoor:false, weather:"sunny", location:"朝阳区酒仙桥路2号", date:"周六-周日", desc:"当代艺术殿堂，免费逛画廊、看装置、拍大片", people:456, tags:["免费","艺术","拍照"], gradient:"linear-gradient(135deg,#E84393,#FD79A8)"},
  {id:7, title:"五棵松篮球公园", category:"运动", emoji:"🏀", color:"#0984E3", price:30, indoor:false, weather:"sunny", location:"海淀区复兴路69号", date:"周日 14:00", desc:"3v3篮球友谊赛，以球会友，强身健体", people:24, tags:["运动","社交","户外"], gradient:"linear-gradient(135deg,#0984E3,#74B9FF)"},
  {id:8, title:"密室逃脱·恐怖主题", category:"小众", emoji:"🔮", color:"#636E72", price:150, indoor:true, weather:"any", location:"海淀区中关村大街", date:"周六 15:00", desc:"超沉浸恐怖密室体验，4-6人最佳，胆小慎入", people:18, tags:["密室","刺激","室内"], gradient:"linear-gradient(135deg,#636E72,#B2BEC3)"},
  {id:9, title:"国家图书馆·周末读书会", category:"小众", emoji:"📚", color:"#6C5CE7", price:0, indoor:true, weather:"any", location:"海淀区中关村南大街33号", date:"周日 10:00", desc:"共读一本好书，交流思想，遇见志同道合的书友", people:32, tags:["免费","读书","文化"], gradient:"linear-gradient(135deg,#A29BFE,#6C5CE7)"},
  {id:10, title:"三里屯太古里探店", category:"美食", emoji:"☕", color:"#E17055", price:60, indoor:true, weather:"any", location:"朝阳区三里屯路19号", date:"周六-周日", desc:"网红咖啡、甜品、买手店一站式潮流体验", people:267, tags:["潮流","咖啡","购物"], gradient:"linear-gradient(135deg,#E17055,#FDCB6E)"},
  {id:11, title:"颐和园日落骑行", category:"徒步", emoji:"🚲", color:"#00B894", price:20, indoor:false, weather:"sunny", location:"海淀区新建宫门路19号", date:"周六 16:00", desc:"沿昆明湖骑行，追逐最美日落，约2小时轻松线路", people:67, tags:["骑行","日落","浪漫"], gradient:"linear-gradient(135deg,#00B894,#55EFC4)"},
  {id:12, title:"桌游吧·周末社交局", category:"小众", emoji:"🎲", color:"#636E72", price:50, indoor:true, weather:"any", location:"海淀区五道口", date:"周六 14:00", desc:"狼人杀、剧本杀、德式策略桌游，认识新朋友", people:16, tags:["桌游","社交","室内"], gradient:"linear-gradient(135deg,#636E72,#DFE6E9)"},
];

const TEAMS = [
  {id:1, creator:"小明", avatar:"🧑", activity:"故宫博物院·午门特展", time:"周六 9:00", place:"故宫午门集合", max:6, joined:3, members:["🧑","👩","👨"], desc:"慢逛故宫，拍照打卡，中午一起吃饭～欢迎摄影爱好者"},
  {id:2, creator:"阿花", avatar:"👩", activity:"香山公园徒步", time:"周日 8:00", place:"香山公园东门", max:8, joined:5, members:["👩","🧑","👨","👩‍🦱","🧑‍🦱"], desc:"香山赏红叶徒步，新手友好，全程约3小时"},
  {id:3, creator:"大雄", avatar:"👨", activity:"LiveHouse音乐之夜", time:"周六 19:30", place:"疆进酒门口", max:4, joined:2, members:["👨","👩"], desc:"一起去看独立乐队演出！可以提前聚餐"},
  {id:4, creator:"小红", avatar:"👩‍🦱", activity:"簋街美食探店", time:"周六 17:00", place:"簋街西口", max:6, joined:4, members:["👩‍🦱","🧑","👩","👨"], desc:"簋街小龙虾局！AA制，人均80左右"},
  {id:5, creator:"阿杰", avatar:"🧑‍🦱", activity:"798艺术区漫步", time:"周日 14:00", place:"798正门", max:10, joined:6, members:["🧑‍🦱","👩","👨","🧑","👩‍🦰","👩"], desc:"逛画廊、看展览、拍美照，文艺青年集合！"},
];

const BADGES = [
  {icon:"🌟", name:"初来乍到", desc:"首次打卡", unlocked:true},
  {icon:"🎯", name:"精准探索", desc:"打卡5个地点", unlocked:true},
  {icon:"🏔️", name:"徒步达人", desc:"完成3次徒步", unlocked:true},
  {icon:"🍜", name:"美食猎人", desc:"打卡5家餐厅", unlocked:true},
  {icon:"🎨", name:"文艺青年", desc:"看3场展览", unlocked:true},
  {icon:"👥", name:"社交达人", desc:"组队出行5次", unlocked:false},
  {icon:"📸", name:"摄影大师", desc:"发布10张照片", unlocked:false},
  {icon:"📝", name:"攻略达人", desc:"发布5篇攻略", unlocked:false},
  {icon:"🏆", name:"城市探索家", desc:"解锁全部徽章", unlocked:false},
];

const FOOTPRINTS = [
  {emoji:"🏛️", title:"故宫博物院", date:"2025-09-20", rating:"⭐⭐⭐⭐⭐"},
  {emoji:"🎨", title:"798艺术区", date:"2025-09-14", rating:"⭐⭐⭐⭐"},
  {emoji:"🥾", title:"香山公园", date:"2025-09-07", rating:"⭐⭐⭐⭐⭐"},
  {emoji:"🍜", title:"簋街美食", date:"2025-08-31", rating:"⭐⭐⭐⭐"},
  {emoji:"📚", title:"国家图书馆", date:"2025-08-24", rating:"⭐⭐⭐⭐⭐"},
];

const GUIDES = [
  {id:1, title:"北京周末48小时文艺探索路线", desc:"从798到草场地，从独立书店到地下音乐现场，带你体验最地道的北京文艺生活。包含交通、美食、住宿全攻略。", emoji:"🗺️", color:"#6C5CE7", author:"小红书旅行家", avatar:"🧑", likes:2341, comments:189, gradient:"linear-gradient(135deg,#6C5CE7,#A29BFE)"},
  {id:2, title:"学生党100元玩转北京一天", desc:"预算有限也能玩得开心！精选8个免费/低价景点+平价美食推荐，人均不到100元的完美周末。", emoji:"💰", color:"#00B894", author:"省钱达人", avatar:"👩", likes:3567, comments:234, gradient:"linear-gradient(135deg,#00B894,#55EFC4)"},
  {id:3, title:"北京秋天最美徒步路线TOP5", desc:"香山红叶、百望山日落、慕田峪长城...五条绝美秋日徒步路线，难度从新手到进阶全覆盖。", emoji:"🍂", color:"#E17055", author:"户外探险家", avatar:"👨", likes:1892, comments:156, gradient:"linear-gradient(135deg,#E17055,#FDCB6E)"},
  {id:4, title:"雨天不无聊！北京室内好去处合集", desc:"下雨天也能玩得嗨！密室逃脱、室内攀岩、博物馆、咖啡馆...20个室内活动推荐。", emoji:"🌧️", color:"#0984E3", author:"晴天娃娃", avatar:"👩‍🦱", likes:2156, comments:178, gradient:"linear-gradient(135deg,#0984E3,#74B9FF)"},
];

let currentRating = 0;
let checkinData = JSON.parse(localStorage.getItem('checkins') || '[]');

// ===== INIT =====
function init() {
  updateGreeting();
  renderHotCards();
  renderAiCards();
  renderRainCards();
  renderActivityList();
  renderTeams('all');
  renderBadges();
  renderFootprints();
  renderGuides('recommend');
}

function updateGreeting() {
  const h = new Date().getHours();
  let g = '🌙 晚上好';
  if (h >= 5 && h < 12) g = '🌅 早上好';
  else if (h >= 12 && h < 14) g = '☀️ 中午好';
  else if (h >= 14 && h < 18) g = '🌤️ 下午好';
  document.getElementById('greeting').textContent = g;
}

// ===== RENDER FUNCTIONS =====
function renderCard(a) {
  return '<div class="activity-card" onclick="showActivityDetail('+a.id+')">' +
    '<div class="card-img" style="background:'+a.gradient+'">' +
      '<span style="font-size:48px">'+a.emoji+'</span>' +
      '<span class="card-badge">'+a.category+'</span>' +
      (a.indoor ? '<span class="card-weather-badge">🏠 室内</span>' : '<span class="card-weather-badge">🌳 户外</span>') +
    '</div>' +
    '<div class="card-body">' +
      '<div class="card-title">'+a.title+'</div>' +
      '<div class="card-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'+a.location+'</div>' +
      '<div class="card-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'+a.date+'</div>' +
      '<div class="card-tags">' +
        (a.price === 0 ? '<span class="card-tag free">免费</span>' : '<span class="card-tag">¥'+a.price+'</span>') +
        a.tags.slice(0,2).map(function(t){return '<span class="card-tag">'+t+'</span>'}).join('') +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderHotCards() {
  var sorted = ACTIVITIES.slice().sort(function(a,b){return b.people-a.people});
  document.getElementById('hotCards').innerHTML = sorted.slice(0,5).map(renderCard).join('');
}

function renderAiCards() {
  var shuffled = ACTIVITIES.slice().sort(function(){return Math.random()-0.5});
  document.getElementById('aiCards').innerHTML = shuffled.slice(0,5).map(renderCard).join('');
}

function renderRainCards() {
  var indoor = ACTIVITIES.filter(function(a){return a.indoor});
  document.getElementById('rainCards').innerHTML = indoor.slice(0,5).map(renderCard).join('');
}

function renderActivityList(filter) {
  var list = ACTIVITIES;
  if (filter && filter !== 'all') {
    list = ACTIVITIES.filter(function(a){
      if (filter === '免费') return a.price === 0;
      if (filter === '室内') return a.indoor;
      if (filter === '户外') return !a.indoor;
      if (filter === '今天') return true;
      return a.category === filter || a.tags.indexOf(filter) >= 0;
    });
  }
  if (list.length === 0) {
    document.getElementById('activityList').innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">暂无匹配的活动</div></div>';
    return;
  }
  document.getElementById('activityList').innerHTML = list.map(function(a){
    return '<div class="activity-list-item" onclick="showActivityDetail('+a.id+')">' +
      '<div class="list-item-img" style="background:'+a.gradient+'">'+a.emoji+'</div>' +
      '<div class="list-item-body">' +
        '<div class="list-item-title">'+a.title+'</div>' +
        '<div class="list-item-desc">'+a.desc+'</div>' +
        '<div class="list-item-footer">' +
          '<span class="list-item-price">'+(a.price===0?'免费':'¥'+a.price)+'</span>' +
          '<span class="list-item-people"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>'+a.people+'人感兴趣</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderTeams(tab) {
  var html = '';
  if (tab === 'create') {
    openCreateTeamModal();
    return;
  }
  if (tab === 'my') {
    html = '<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">还没有加入任何队伍<br>快去发现队伍看看吧</div></div>';
  } else {
    html = TEAMS.map(function(t){
      var memberAvatars = t.members.map(function(m){return '<div class="team-member-avatar" style="background:linear-gradient(135deg,#A29BFE,#6C5CE7)">'+m+'</div>'}).join('');
      if (t.joined > 3) memberAvatars += '<div class="team-member-more">+'+(t.joined-3)+'</div>';
      return '<div class="team-card">' +
        '<div class="team-card-header">' +
          '<div class="team-avatar" style="background:linear-gradient(135deg,#6C5CE7,#A29BFE)">'+t.avatar+'</div>' +
          '<div><div class="team-creator-name">'+t.creator+'</div><div class="team-creator-tag">队长</div></div>' +
        '</div>' +
        '<div class="team-title">'+t.activity+'</div>' +
        '<div class="team-meta">' +
          '<div class="team-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'+t.time+'</div>' +
          '<div class="team-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'+t.place+'</div>' +
          '<div class="team-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>'+t.joined+'/'+t.max+'人</div>' +
        '</div>' +
        '<div style="font-size:13px;color:var(--text-light);margin-bottom:12px;line-height:1.5">'+t.desc+'</div>' +
        '<div class="team-members-row">'+memberAvatars+'</div>' +
        '<button class="team-join-btn" onclick="joinTeam(this,'+t.id+')">加入队伍</button>' +
      '</div>';
    }).join('');
  }
  document.getElementById('teamContent').innerHTML = html;
}

function renderBadges() {
  document.getElementById('badgeGrid').innerHTML = BADGES.map(function(b){
    return '<div class="badge-item'+(b.unlocked?'':' locked')+'">' +
      '<div class="badge-icon">'+b.icon+'</div>' +
      '<div class="badge-name">'+b.name+'</div>' +
      '<div class="badge-desc">'+b.desc+'</div>' +
    '</div>';
  }).join('');
}

function renderFootprints() {
  var fps = FOOTPRINTS;
  if (checkinData.length > 0) {
    fps = checkinData.map(function(c){
      return {emoji:'📍', title:c.place, date:c.date, rating: new Array(c.rating).fill('⭐').join('')};
    }).concat(FOOTPRINTS);
  }
  document.getElementById('footprintList').innerHTML = fps.map(function(f){
    return '<div class="footprint-item">' +
      '<div class="footprint-emoji">'+f.emoji+'</div>' +
      '<div class="footprint-info">' +
        '<div class="footprint-title">'+f.title+'</div>' +
        '<div class="footprint-date">'+f.date+'</div>' +
      '</div>' +
      '<div class="footprint-rating">'+f.rating+'</div>' +
    '</div>';
  }).join('');
}

function renderGuides(tab) {
  var html = '';
  if (tab === 'mine') {
    html = '<div class="empty-state"><div class="empty-state-icon">📝</div><div class="empty-state-text">还没有发布攻略<br>分享你的探索经验吧</div></div>';
  } else {
    html = GUIDES.map(function(g){
      return '<div class="guide-card">' +
        '<div class="guide-card-img" style="background:'+g.gradient+'">' +
          '<span style="font-size:64px">'+g.emoji+'</span>' +
          '<div class="guide-card-overlay"><h3>'+g.title+'</h3></div>' +
        '</div>' +
        '<div class="guide-card-body">' +
          '<div class="guide-card-desc">'+g.desc+'</div>' +
          '<div class="guide-card-footer">' +
            '<div class="guide-author">' +
              '<div class="guide-author-avatar" style="background:linear-gradient(135deg,#6C5CE7,#A29BFE)">'+g.avatar+'</div>' +
              '<span class="guide-author-name">'+g.author+'</span>' +
            '</div>' +
            '<div class="guide-stats">' +
              '<div class="guide-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'+formatNum(g.likes)+'</div>' +
              '<div class="guide-stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'+g.comments+'</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }
  document.getElementById('guideContent').innerHTML = html;
}

// ===== INTERACTIONS =====
function switchTab(tab) {
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});
  document.querySelectorAll('.tab-item').forEach(function(t){t.classList.remove('active')});
  document.getElementById('page-'+tab).classList.add('active');
  var tabs = document.querySelectorAll('.tab-item');
  var idx = {home:0,discover:1,team:2,checkin:3,profile:4}[tab];
  if (tabs[idx]) tabs[idx].classList.add('active');
}

function switchTeamTab(el, tab) {
  document.querySelectorAll('.team-tab').forEach(function(t){t.classList.remove('active')});
  el.classList.add('active');
  renderTeams(tab);
}

function switchGuideTab(el, tab) {
  document.querySelectorAll('.guide-tab').forEach(function(t){t.classList.remove('active')});
  el.classList.add('active');
  renderGuides(tab);
}

function setFilter(el, filter) {
  document.querySelectorAll('.filter-chip').forEach(function(c){c.classList.remove('active')});
  el.classList.add('active');
  renderActivityList(filter);
}

function toggleFilterOpt(el) {
  var siblings = el.parentElement.querySelectorAll('.filter-opt');
  siblings.forEach(function(s){s.classList.remove('selected')});
  el.classList.add('selected');
}

function openFilterModal() {
  document.getElementById('filterModal').classList.add('show');
}

function applyFilter() {
  document.getElementById('filterModal').classList.remove('show');
  showToast('✅ 筛选已应用');
  renderActivityList('all');
}

function openCheckinModal() {
  document.getElementById('checkinModal').classList.add('show');
}

function openCreateTeamModal() {
  document.getElementById('createTeamModal').classList.add('show');
}

function setRating(n) {
  currentRating = n;
  var stars = document.querySelectorAll('.rating-star');
  stars.forEach(function(s,i){
    s.classList.toggle('active', i < n);
  });
}

function submitCheckin() {
  var place = document.getElementById('checkinPlace').value;
  if (!place) { showToast('请输入活动/地点名称'); return; }
  var now = new Date();
  var dateStr = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  checkinData.unshift({place:place, rating:currentRating||3, note:document.getElementById('checkinNote').value, date:dateStr});
  localStorage.setItem('checkins', JSON.stringify(checkinData));
  document.getElementById('checkinCount').textContent = parseInt(document.getElementById('checkinCount').textContent) + 1;
  document.getElementById('checkinModal').classList.remove('show');
  document.getElementById('checkinPlace').value = '';
  document.getElementById('checkinNote').value = '';
  currentRating = 0;
  document.querySelectorAll('.rating-star').forEach(function(s){s.classList.remove('active')});
  renderFootprints();
  showToast('🎉 打卡成功！');
}

function submitTeam() {
  var activity = document.getElementById('teamActivity').value;
  if (!activity) { showToast('请输入活动名称'); return; }
  document.getElementById('createTeamModal').classList.remove('show');
  showToast('🚀 组队已发布！');
  document.getElementById('teamActivity').value = '';
  document.getElementById('teamDesc').value = '';
  switchTeamTab(document.querySelector('.team-tab'), 'all');
}

function joinTeam(btn, id) {
  if (btn.classList.contains('joined')) {
    btn.classList.remove('joined');
    btn.textContent = '加入队伍';
    showToast('已退出队伍');
  } else {
    btn.classList.add('joined');
    btn.textContent = '✓ 已加入';
    showToast('🎉 成功加入队伍！');
  }
}

function showActivityDetail(id) {
  var a = ACTIVITIES.find(function(x){return x.id===id});
  if (!a) return;
  showToast('📍 '+a.title+' · '+a.location);
}

function filterByCategory(cat) {
  switchTab('discover');
  var chips = document.querySelectorAll('.filter-chip');
  chips.forEach(function(c){
    c.classList.remove('active');
    if (c.textContent.includes(cat)) c.classList.add('active');
  });
  renderActivityList(cat);
}

function handleSearch(val) {
  if (!val.trim()) {
    renderHotCards();
    return;
  }
  var results = ACTIVITIES.filter(function(a){
    return a.title.includes(val) || a.desc.includes(val) || a.category.includes(val) || a.tags.some(function(t){return t.includes(val)});
  });
  if (results.length > 0) {
    document.getElementById('hotCards').innerHTML = results.map(renderCard).join('');
  } else {
    document.getElementById('hotCards').innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">没有找到相关活动</div></div>';
  }
}

function formatNum(n) {
  if (n >= 10000) return (n/10000).toFixed(1)+'万';
  if (n >= 1000) return (n/1000).toFixed(1)+'k';
  return n;
}

// Toast
var toastTimer;
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){t.classList.remove('show')}, 2000);
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(function(m){
  m.addEventListener('click', function(e){
    if (e.target === m) m.classList.remove('show');
  });
});

// Init
init();
</script>
</body>
</html>`;

export default {
  async fetch(request) {
    return new Response(HTML, {
      headers: { 
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      },
    });
  },
};
