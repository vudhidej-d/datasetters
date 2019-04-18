import React, { Component } from 'react'
import firebase from 'firebase'
import { Tabs, Icon } from 'antd'
import DataCreateForm from './DataCreateForm'
import DataTable from './DataTable'

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
    }
  }

  componentDidMount() {
    this.db.collection('dataset').onSnapshot((querySnapshot) => {
      this.setState({ loading: true })
      const dataset = []
      querySnapshot.forEach((doc) => { dataset.push(doc.data()) })
      this.setState({ dataset, loading: false })
    })
  }

  render() {
    const { dataset, loading } = this.state
    const dataSource = dataset.map((data, index) => ({
      ...data,
      key: index
    }))
    return (
      <div className="App">
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><Icon type="database" />Data Table</span>} key="1">
          <div style={{ padding: '20px 30px' }}>
            <h1>Dataset</h1>
            <DataTable dataSource={dataSource} loading={loading} />
          </div>
        </TabPane>
        <TabPane tab={<span><Icon type="file-add" />Add Data</span>} key="2">
          <div style={{ padding: '20px 100px' }}>
            <h1>Add Data</h1>
            <DataCreateForm db={this.db} />
          </div>
        </TabPane>
      </Tabs>
      </div>
    )
  }
}

export default App
