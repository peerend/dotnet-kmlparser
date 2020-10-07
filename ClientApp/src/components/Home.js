import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);

    this.state = {
      kmlFile: undefined,
      allowUpload: false,
      uploadResult: undefined,
      isParsing: false,
    }

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileChange(evt){
    //validate file
    let file = evt.target.files[0];
    let extension = file.name.split('.').pop();
    if(extension != 'kml') {
      this.setState({'allowUpload': false});
      alert('wrong file extension');
    } else {
      this.setState({'allowUpload': true});
      this.setState({'kmlFile': file})
    }
  }

  async handleSubmit(evt) {
    console.log('file submitted');
    this.setState({ isParsing: true });
    let formData = new FormData();
    formData.append('kmlFile', this.state.kmlFile);
    const response = await fetch('kmlParser/parseKml', {
      method: 'POST',
      // headers: {
      //   "Content-Type": "application/vnd.google-earth.kml+xml"
      // },
      body: formData
    })
    .catch(error => {
      console.error(error);
      return;
    })
    const data = await response.json();
    this.setState({ isParsing: data, loading: false });
  }

  render () {
    return (
      <div>
        <h1>Hello, world!</h1>
        <input type="file" id="fileInput" onChange={this.handleFileChange}></input>
        <button onClick={this.handleSubmit}>Submit</button><br/>
        <span hidden={!this.state.isParsing}>Parsing File</span>
      </div>
    );
  }
}
