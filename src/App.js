import React, { Component } from 'react'
import firebase from 'firebase'
import { Tabs, Icon, Button } from 'antd'
import DataForm from './DataForm'
import DataTable from './DataTable'
import DataDistribution from './DataDistribution'
import { saveFile, jsonToCSV } from './shared'

const { TabPane } = Tabs

class App extends Component {
  constructor(props) {
    super(props)
    const config = {
      apiKey: "AIzaSyAeaMv3Y2fp877wzX187ZjT5-7AwxZkU0Y",
      authDomain: "datasetters.firebaseapp.com",
      databaseURL: "https://datasetters.firebaseio.com",
      projectId: "datasetters",
      storageBucket: "datasetters.appspot.com",
      messagingSenderId: "340269058452"
    }
    firebase.initializeApp(config)
    this.db = firebase.firestore()
    this.state = {
      dataset: [],
      loading: true,
      downloading: {
        json: false,
        csv: false
      },
      tempData: {},
    }
  }

  componentDidMount() {
    this.db.collection('dataset').onSnapshot((querySnapshot) => {
      this.setState({ loading: true })
      const dataset = []
      querySnapshot.forEach((doc) => {
        dataset.push({
          ...doc.data(),
          id: doc.id,
        })
      })
      this.setState({ dataset, loading: false })
    })
  }

  setTempData = (tempData) => { this.setState({ tempData }) }

  handleDownload(type) {
    const { downloading, dataset } = this.state
    const isDownloading = downloading[type]
    if (isDownloading) return
    downloading[type] = true
    this.setState({downloading})
    if (type === 'json') {

      let data = JSON.stringify(dataset)
      console.log(data)
      const fileName = "dataset";
      const ext = "json"
      const contentType = "application/json;charset=utf-8;";
      saveFile(data, contentType, fileName, ext)

    } else if (type === 'csv') {

      let data = jsonToCSV(dataset, true)
      console.log(data)
      const fileName = "dataset";
      const ext = "csv"
      const contentType = "text/csv;charset=utf-8;";
      saveFile(data, contentType, fileName, ext)

    }
    downloading[type] = false
    this.setState({downloading})
  }

  render() {
    const { dataset, loading, downloading, tempData } = this.state
    const dataSource = dataset.map((data, index) => ({
      ...data,
      key: index
    }))
    return (
      <div className="App">
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><Icon type="database" />Data Table</span>} key="1">
          <div style={{ padding: '20px 30px' }}>
            <h1>
              Dataset
              <Button type="primary" shape="round" icon="download" size="large" className="download-btn json-btn" onClick={(e) => this.handleDownload('json')} loading={downloading['json']}>JSON</Button>
              <Button type="primary" shape="round" icon="download" size="large" className="download-btn csv-btn" onClick={(e) => this.handleDownload('csv')} loading={downloading['csv']}>CSV</Button>
            </h1>
            <DataTable dataSource={dataSource} loading={loading} db={this.db} />
          </div>
        </TabPane>
        <TabPane tab={<span><Icon type="file-add" />Add Data</span>} key="2">
          <div style={{ padding: '20px 100px' }}>
            <h1>Add Data</h1>
            <DataForm db={this.db} data={tempData} setTempData={this.setTempData} />
          </div>
        </TabPane>
        <TabPane tab={<span><Icon type="bar-chart" />Data Distribution</span>} key="3">
          <div style={{ padding: '20px 100px' }}>
            <h1>Data Distribution</h1>
            <DataDistribution dataset={dataset} />
          </div>
        </TabPane>
      </Tabs>
      </div>
    )
  }
}

export default App
