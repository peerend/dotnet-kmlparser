import React, { Component } from 'react';
import { kml } from "@tmcw/togeojson";

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
    this.setState({ isParsing: true });

    let fr = new FileReader();

    fr.addEventListener("error", function(){
      console.log(this);
    })
    fr.addEventListener("load", function(){

      async function reqListener() {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(this.response,"text/html");
        let features = kml(xmlDoc);
        var result = await fetch('geojson/features', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(features)
        })
        .catch(error => {
          console.error(error);
          return;
        })
      }
  
      function transferFailed(error) {
        console.log(error);
      }
  
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", reqListener);
      oReq.addEventListener("error", transferFailed);

      oReq.open('GET', this.result, true);
      oReq.send('');
    });
    fr.readAsDataURL(this.state.kmlFile);
    this.setState({ isParsing: false, loading: false });
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
