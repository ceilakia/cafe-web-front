import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import cafeLogo from '../assets/images/cafe_chuchu_logo.png';
import naverLogo from '../assets/images/naver_icon.png';
import kakaoLogo from '../assets/images/kakao_icon.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 백엔드 없이 로그인 버튼 클릭 시 바로 로그인 처리
  const handleLogin = () => {
    if (userid && password) {
      // 임의로 localStorage에 토큰 저장 (로그인된 것으로 간주)
      localStorage.setItem('token', 'dummyAccessToken');
      navigate('/home');
    } else {
      setError('아이디와 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="login-container">
      <img src={cafeLogo} alt="Cafe ChuChu" className="loginpage-logo" />
      <h2 className="login-title">로그인</h2>
      <input
        type="text"
        className="input-label_1"
        placeholder="아이디 입력"
        value={userid}
        onChange={(e) => setUserid(e.target.value)}
      />
      <input
        type="password"
        className="input-label_2"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button className="login-button login" onClick={handleLogin}>
        로그인
      </button>

      <Link to="/signup" className="link_3">회원가입</Link>
    </div>
  );
};

export default LoginPage;
