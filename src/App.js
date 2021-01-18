import React, {Component} from 'react';
import { Tabs, Input } from 'antd';
import SearchResults from './components/SearchResults';
import 'antd/dist/antd.css';
import './App.css';


function callback(key) {
  console.log(key);
}

class App extends Component {
  state = {
    activeTab: 'Search',
  }

  render() {
    const { TabPane } = Tabs;
    const { activeTab } = this.state;

    return (
      <div className="App">
        <p className="attribution">
          About Movies App: &quot;This product uses the <a href="https://www.themoviedb.org/">TMDb</a> API but is not
          endorsed or certified by TMDb.&quot;
        </p>
        <Tabs defaultActiveKey="1" onChange={callback} className="Tabs">
          <TabPane tab="Search" key="1">
            <Input placeholder="Type to search…" />
            <SearchResults />
          </TabPane>
          <TabPane tab="Rated" key="2">
            Rated Pane (2) {activeTab === 'Search' ? null : '(active)'}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default App;
