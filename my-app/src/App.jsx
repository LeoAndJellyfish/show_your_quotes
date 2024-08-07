import React, { useEffect, useRef, useState } from 'react';
import './App.css'; // 引入自定义 CSS
import quotes from './quotes.json';

const App = () => {
  // 定义名言、淡入淡出状态和自动播放状态
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [autoPlayInterval, setAutoPlayInterval] = useState(10); // 新增状态来存储自动播放间隔
  const [showSettings, setShowSettings] = useState(false); // 新增状态来控制设置面板显示

  const timerRef = useRef(null);
  const quoteCount = quotes.length; // 直接使用常量，减少不必要的状态

  // 获取随机名言的函数
  const getRandomQuote = () => {
    setFade(false); // 触发淡出动画
    setLoading(true);

    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setFade(true); // 触发淡入动画
      setLoading(false);
      setCountdown(autoPlayInterval); // 重置倒计时
    }, 500); // 500ms 与 CSS 动画时间一致
  };

  // 开启/关闭自动播放的函数
  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // 倒计时逻辑
  useEffect(() => {
    if (isAutoPlay) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : autoPlayInterval));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isAutoPlay, autoPlayInterval]);

  // 自动播放逻辑
  useEffect(() => {
    if (isAutoPlay && countdown === 1) {
      getRandomQuote();
    }
  }, [countdown, isAutoPlay]);

  // 组件挂载时获取初始名言
  useEffect(() => {
    getRandomQuote();
  }, []);

  // 更新时间和日期的逻辑
  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    };

    updateTimeAndDate(); // 初始更新
    const intervalId = setInterval(updateTimeAndDate, 60000); // 每分钟更新一次

    return () => clearInterval(intervalId); // 清理定时器
  }, []);

  // 点击空白处关闭设置面板
  const handleClickOutside = (event) => {
    if (!event.target.closest('.settings-panel') && !event.target.closest('.settings-btn')) {
      setShowSettings(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      <div className="time-date">
        <div className="current-time">北京时间: {currentTime}</div>
        <div className="current-date">{currentDate}</div>
      </div>
      <div className="quote-count">格言总数: {quoteCount}</div> {/* 显示格言数量 */}
      <div className={`quote-box ${fade ? 'visible' : 'hidden'}`}>
        <p className="quote-text">{quote.text}</p>
        {quote.author && <p className="author">— {quote.author}</p>}
      </div>
      <button className="change-quote-btn" onClick={getRandomQuote} disabled={loading}>
        {loading ? '加载中...' : '换一句'}
      </button>
      <button className="auto-play-btn" onClick={toggleAutoPlay}>
        {isAutoPlay ? '停止自动播放' : '开启自动播放'}
      </button>
      {isAutoPlay && <p className="countdown">下一句将在 {countdown} 秒后切换</p>}
      <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>设置</button>
      <div className={`settings-panel ${showSettings ? 'visible' : 'hidden'}`}>
        <div className="auto-play-interval">
          <label>自动播放间隔: </label>
          <input
            type="range"
            min="5"
            max="60"
            value={autoPlayInterval}
            onChange={(e) => setAutoPlayInterval(parseInt(e.target.value))}
          />
          <input
            type="number"
            min="5"
            max="60"
            value={autoPlayInterval}
            onChange={(e) => setAutoPlayInterval(parseInt(e.target.value))}
          />
          <span>秒</span>
        </div>
      </div>
    </div>
  );
};

export default App;
