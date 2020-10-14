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

  // async handleSubmit(evt) {
  //   console.log('file submitted');
  //   this.setState({ isParsing: true });
  //   let formData = new FormData();
  //   formData.append('kmlFile', this.state.kmlFile);
  //   const response = await fetch('kmlParser/parseKml', {
  //     method: 'POST',
  //     // headers: {
  //     //   "Content-Type": "application/vnd.google-earth.kml+xml"
  //     // },
  //     body: formData
  //   })
  //   .catch(error => {
  //     console.error(error);
  //     return;
  //   })
  //   const data = await response.json();
  //   this.setState({ isParsing: data, loading: false });
  // }

  async handleSubmit(evt) {
    console.log('file submitted');
    this.setState({ isParsing: true });

    let fr = new FileReader();

    fr.addEventListener("error", function(){
      debugger;
      console.log(this);
    })
    fr.addEventListener("load", function(){

      function reqListener(response) {
        console.log(response);
        debugger;
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(this.response,"text/html");
        console.log(kml(xmlDoc));
      }
  
      function transferFailed(error) {
        console.log(error);
        debugger;
      }
  
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", reqListener);
      oReq.addEventListener("error", transferFailed);

      // var url = URL.createObjectURL(this.result);
      oReq.open('GET', this.result, true);
      oReq.send('');
    });
    fr.readAsDataURL(this.state.kmlFile);

    // xhr.open('GET', this.state.kmlFile, true);
    // xhr.send(null);


    // await console.log(kml(this.state.kmlFile));
    // var oReq = new XMLHttpRequest();

    // async function reqListener(response) {
    //   console.log(response);
    //   debugger;
    //   await console.log(kml(response));
    // }

    // function transferFailed(error) {
    //   console.log(error);
    //   debugger;
    // }

    // oReq.addEventListener("load", reqListener);
    // oReq.addEventListener("error", transferFailed);
    // oReq.open("GET", this.state.kmlFile);
    // oReq.send();
    // fetch(this.state.kmlFile)
    //   .then(function(response){
    //     return response.text();
    //   })
    //   .then(function(xml){
    //     console.log(kml(this.state.kmlFile));
    //     // console.log(kml(new DOMParser().parseFromString(xml, "text/xml")));
    //   })
    // let DOMParser = require('xmldom').DOMParser;
    // let kml = new DOMParser().parseFromString(fs.readFileSync(this.state.kmlFile, 'utf8'));
    // let myGeoJson = toGeoJSON.kml(this.state.kmlFile);
    // var convertedWithStyles = togeojson.kml(kml, { styles: true });
    debugger;
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
