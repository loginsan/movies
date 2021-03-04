import React from 'react';
import { Alert, Spin, Pagination } from 'antd';
import { PropTypes } from 'prop-types';
import { appTabs } from './helpers';


const Message = ({ title, text, type }) => (
  <Alert className="alert-box" message={title} description={text} type={type} showIcon />
);

export const ratedMessage = () => (
  <Message
    title="Фильмы, которые вы оценили"
    text="Нажав на карточку фильма можно удалить оценку и сам фильм из списка оцененных"
    type="info"
  />
);

export const renderError = (error) => error && (
  <Message title="Что-то пошло не так…" text={error} type="error" />
);

export const renderLoad = (isLoading, tip = 'Загружаем…') => isLoading && <Spin size="large" tip={tip} />;

export const renderInfo = (flag, tab) => {
  if (!flag) return null;
  const title = { [appTabs.Search]: 'Приложение Movies', [appTabs.Rated]: 'Фильмы, которые вы оценили' };
  const info = { 
    [appTabs.Search]: 'Введите что-нибудь в поле ввода и мы попробуем найти подходящие фильмы (минимум 2 символа)',
    [appTabs.Rated]: 'Пока у вас нет оценённых фильмов. Бегом на вкладку Search искать и ставить оценки фильмам!'
  };
  return <Message title={ title[tab] } text={ info[tab] } type="info" />;
};

export const renderPager = (curPage, totalResults, handleChange) => (
  <Pagination
    onChange={handleChange}
    current={curPage}
    defaultPageSize={20}
    showTitle={false}
    showSizeChanger={false}
    total={totalResults}
    showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} найденых`}
  />
);

Message.defaultProps = {
  title: 'Приложение Movies',
  text: 'Что-то пошло не так…',
  type: 'error',
};

Message.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
};