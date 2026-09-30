const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>金费清 - 开发中</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #2d1b4e 100%);
    font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
    color: #fff;
    overflow: hidden;
  }
  .main-name {
    font-size: clamp(80px, 20vw, 200px);
    font-weight: 900;
    letter-spacing: 0.15em;
    background: linear-gradient(135deg, #f5af19, #f12711, #f5af19);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s ease-in-out infinite;
    text-shadow: 0 0 80px rgba(245, 175, 25, 0.3);
    user-select: none;
  }
  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .status {
    margin-top: 40px;
    font-size: clamp(18px, 4vw, 36px);
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.5em;
    font-weight: 300;
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  .dot {
    position: absolute;
    border-radius: 50%;
    background: rgba(245, 175, 25, 0.08);
    animation: float 20s infinite ease-in-out;
  }
  .dot:nth-child(1) { width: 300px; height: 300px; top: -100px; left: -50px; }
  .dot:nth-child(2) { width: 200px; height: 200px; bottom: -50px; right: -30px; animation-delay: -7s; }
  .dot:nth-child(3) { width: 150px; height: 150px; top: 50%; right: 10%; animation-delay: -12s; }
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -30px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }
  .domain {
    position: fixed;
    bottom: 30px;
    font-size: 14px;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.1em;
  }
</style>
</head>
<body>
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="main-name">金费清</div>
  <div class="status">开 发 中</div>
  <div class="domain">meituanvibe.tech</div>
</body>
</html>`;

export default {
  async fetch(request) {
    return new Response(HTML, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
