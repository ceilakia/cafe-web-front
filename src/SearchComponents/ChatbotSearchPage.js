import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotSearchPage.css';
import starIcon from '../assets/images/cafe_chuchu_star.png';
import searchIcon from '../assets/images/cafe_chuchu_search.png';
import filledHeartIcon from '../assets/images/filled_heart_icon.png';
import emptyHeartIcon from '../assets/images/empty_heart_icon.png';

const ChatbotSearchPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [cafeList, setCafeList] = useState([]);
  const [replyCount, setReplyCount] = useState(0);
  const [likedItems, setLikedItems] = useState({});

  const handleBack = () => {
    navigate('/home');
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessages = [...messages, { text: inputText, isUser: true }];
      setMessages(newMessages);
      setInputText('');

      if ((newMessages.filter(msg => msg.isUser).length - replyCount) % 3 === 1) {
        setTimeout(() => {
          fetchCafeRecommendations();
          setReplyCount(replyCount + 1);
        }, 500);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const fetchCafeRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:5003/chatbot');
      const data = await response.json();
      setCafeList(data.slice(0, 5));

      setMessages(prevMessages => [
        ...prevMessages,
        { text: '아래 카페를 추천드려요!', isUser: false, isCafeList: true }
      ]);
      
      const initialLikes = data.reduce((acc, item) => {
        acc[item.id] = item.liked;
        return acc;
      }, {});
      setLikedItems(initialLikes);

    } catch (error) {
      console.error('카페 추천을 불러오는 중 오류 발생:', error);
    }
  };

  const toggleLike = (id) => {
    setLikedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    const updatedLikedStatus = !likedItems[id];
    fetch(`http://localhost:5003/chatbot/${id}`, {
      method: updatedLikedStatus ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer <JWT token>`
      }
    }).catch(error => console.error('찜 상태 업데이트 중 오류 발생:', error));
  };

  const goToSearchResults = () => {
    navigate('/search-results');
  };

  const goToCafeDetail = (id) => {
    navigate(`/cafe-detail/${id}`);
  };

  return (
    <div className="chatbot-container">
      <span className="back-button" onClick={handleBack}>&lt;</span>
      <p className="chatbot-instruction">어떤 카페를 찾고 싶은지 알려주세요!</p>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chatbot-message-bubble ${message.isUser ? 'user-message' : 'reply-message'}`}>
            {message.text}
            {message.isCafeList && (
              <>
                <div className="chatbotlist-items">
                  {cafeList.map((cafe) => (
                    <div
                      key={cafe.id}
                      className="chatbotlist-box"
                      onClick={(e) => {
                        if (!e.target.closest('.chatbotlist-icon-heart')) {
                          goToCafeDetail(cafe.id);
                        }
                      }}
                    >
                      <div className="chatbotlist-image-container">
                        {cafe.image && <img src={cafe.image} className="chatbotlist-cafe-image" />}
                      </div>

                      <div className="chatbotlist-info">
                        <div className="chatbotlist-info-name">
                          <span className={cafe.name.length > 12 ? 'long-text' : ''}>{cafe.name}</span>
                        </div>
                        <div>
                          <img src={starIcon} alt="Star" className="chatbotlist-star-icon" />
                          <div className="chatbotlist-info-rating">{cafe.rating.toFixed(1)}</div>
                          <div className="chatbotlist-info-review">리뷰 {cafe.reviews > 999 ? '999+' : cafe.reviews}개</div>
                        </div>
                        <div className={cafe.status === '영업 중' ? 'chatbotlist-info-status_open' : 'chatbotlist-info-status_close'}>
                          {cafe.status}
                        </div>
                        <div className="chatbotlist-info-location">{cafe.location}</div>
                      </div>
                      <img
                        src={likedItems[cafe.id] ? filledHeartIcon : emptyHeartIcon}
                        alt="Heart"
                        className="chatbotlist-icon-heart"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(cafe.id);
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatbot-next-icon" onClick={goToSearchResults}>더보기 &gt;</div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="chatbot-input-container">
        <input
          type="text"
          className="chatbot-input"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요"
        />
        <img src={searchIcon} alt="Send" className="chatbot-send-icon" onClick={handleSendMessage} />
      </div>
      
    </div>
  );
};

export default ChatbotSearchPage;