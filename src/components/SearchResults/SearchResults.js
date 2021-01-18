import React from 'react';
import { Card, Col, Row } from 'antd';
import TMDBService from '../../services/TMDBService';
import TEST from '../../services/test';


const SearchResults = () => {
  const searchResultsList = [
  (<Col span={8} key="m1">
    <Card title="Card title" bordered={false}>
      Card content {TEST}
    </Card>
  </Col>), (<Col span={8} key="m2">
    <Card title="Card title" bordered={false}>
      Card content {TEST}
    </Card>
  </Col>), (<Col span={8} key="m3">
    <Card title="Card title" bordered={false}>
      Card content {TEST}
    </Card>
  </Col>), (<Col span={8} key="m4">
    <Card title="Card title" bordered={false}>
      Card content {TEST}
    </Card>
  </Col>)
  ];

  const mdb = new TMDBService();
  mdb.getMovies('future').then((body) => {
    console.log(body.results);
  });

  return (<Row gutter={16}>
    {searchResultsList}
  </Row>)
}

export default SearchResults;