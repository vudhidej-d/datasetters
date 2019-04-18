import React, { Component } from 'react'
import firebase from 'firebase'
import DataCreateForm from './DataCreateForm'

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
      dataset: []
    }
  }

  componentDidMount() {
    this.db.collection('dataset').get().then((querySnapshot) => {
      const dataset = []
      querySnapshot.forEach((doc) => { dataset.push(doc.data()) })
      this.setState({ dataset })
    })
  }

  render() {
    const { dataset } = this.state
    return (
      <div className="App">
        {dataset.map((data) => JSON.stringify(data))}
        <div style={{ padding: 50 }}>
          <DataCreateForm />
        </div>
      </div>
    )
  }
}

export default App
