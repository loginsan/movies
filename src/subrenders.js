import React from 'react';
import { Alert, Spin, Pagination } from 'antd';


export const renderError = (error) => error ? (
  <Alert className="alert-box" message="Что-то пошло не так…" description={error} type="error" showIcon />
) : null;

export const renderLoad = (isLoading, tip = 'Загружаем…') => isLoading? <Spin size="large" tip={tip} /> : null;

export const renderInfo = (flag, mode) => {
  if (!flag) return null;
  const tt = mode === 1 ? 'Приложение Movies' : 'Фильмы, которые вы оценили';
  const info = mode === 1
    ? 'Введите что-нибудь в поле ввода и мы попробуем найти подходящие фильмы (минимум 2 символа)'
    : `Пока у вас нет оценённых фильмов. Бегом на вкладку Search искать и ставить оценки фильмам!`;
  return <Alert className="alert-box" message={tt} description={info} type="info" showIcon />
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
