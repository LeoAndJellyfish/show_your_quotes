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
  const [quoteCount, setQuoteCount] = useState(0); // 新增状态来存储格言数量
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const timerRef = useRef(null);

  // 获取随机名言的函数
  const getRandomQuote = () => {
    setFade(false); // 触发淡出动画
    setLoading(true);

    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setFade(true); // 触发淡入动画
      setLoading(false);
      setCountdown(10); // 重置倒计时
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
        setCountdown((prev) => (prev > 1 ? prev - 1 : 10));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isAutoPlay]);

  // 自动播放逻辑
  useEffect(() => {
    if (isAutoPlay && countdown === 1) {
      getRandomQuote();
    }
  }, [countdown, isAutoPlay]);

  // 组件挂载时获取初始名言和格言数量
  useEffect(() => {
    getRandomQuote();
    setQuoteCount(quotes.length); // 设置格言数量
  }, []);

  // 更新时间和日期的逻辑
  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateTimeAndDate(); // 初始更新
    const intervalId = setInterval(updateTimeAndDate, 60000); // 每分钟更新一次

    return () => clearInterval(intervalId); // 清理定时器
  }, []);

  return (
    <div className="container">
      <div className="time-date">
        <div className="current-time">北京时间: {currentTime}</div>
        <div className="current-date">日期: {currentDate}</div>
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
    </div>
  );
};

export default App;
