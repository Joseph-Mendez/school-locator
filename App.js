import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { API, graphqlOperation } from 'aws-amplify'
import { listSchools } from './graphql/queries'
import { createSchool } from './graphql/mutations'

class App extends Component {
  state = { name: '', description: '', schools: [] }
  async componentDidMount() {
    try {
      const apiData = await API.graphql(graphqlOperation(listSchools))
      const schools = apiData.data.listSchools.items
      this.setState({ schools })
    } catch (err) {
      console.log('error: ', err)
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  createSchool = async () => {
    const { name, description } = this.state
    if (name === '' || description === '') return
    try {
      const school = { name, description }
      const schools = [...this.state.schools, school]
      this.setState({ schools, name: '', description: '' })
      await API.graphql(graphqlOperation(createSchool, {input: school}))
      console.log('school successfully created!')
    } catch (err) {
      console.log('error: ', err)
    }
  }
  render() {
    return (
      <div className="App">
        <div style={styles.inputContainer}>
          <input
            name='name'
            placeholder='school name'
            onChange={this.onChange}
            value={this.state.name}
            style={styles.input}
          />
          <input
            name='description'
            placeholder='school description'
            onChange={this.onChange}
            value={this.state.description}
            style={styles.input}
          />
        </div>
        <button
          style={styles.button}
          onClick={this.createSchool}
        >Create School</button>
        {
          this.state.schools.map((rest, i) => (
            <div key={i} style={styles.item}>
              <p style={styles.name}>{rest.name}</p>
              <p style={styles.description}>{rest.description}</p>
            </div>
          ))
        }
      </div>
    );
  }
}

const styles = {
  inputContainer: {
    margin: '0 auto', display: 'flex', flexDirection: 'column', width: 300
  },
  button: {
    border: 'none', backgroundColor: '#ddd', padding: '10px 30px'
  },
  input: {
    fontSize: 18,
    border: 'none',
    margin: 10,
    height: 35,
    backgroundColor: "#ddd",
    padding: 8
  },
  item: {
    padding: 10,
    borderBottom: '2px solid #ddd'
  },
  name: { fontSize: 22 },
  description: { color: 'rgba(0, 0, 0, .45)' }
}

export default App