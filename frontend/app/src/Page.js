
import React from "react";
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const qs = require('qs');



export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      k: '1',
      model: 'roberta.base',
      predicted: [],
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const message = this.state.message + ' <mask>';
    console.log(message);

    const config = {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }

    const data = {
      'message': message,
      'k': this.state.k,
      'model': this.state.model
    };

    axios.post('http://localhost:5000/', data).then((res) => {
      console.log(res);

      const result = res.data.result;

      let predicted = [];
      result.forEach(arr => {
        predicted.push(arr[0] + ' (with confidence ' + arr[1] + ')\n');
      });

      this.setState({ predicted });
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    let predictedParagraphs = [];
    this.state.predicted.forEach(string => {
      predictedParagraphs.push(<p>{string}</p>);
    });
    return (
      <Card>
        <Card.Header>Predicitive Autocomplete</Card.Header>
        <Card.Body>
          <p>Begin typing your message below. Submit to see your prediction.</p>

          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="formGroupMessage">
              <Form.Label>Input</Form.Label>
              <Form.Control
                placeholder="Your text here"
                value={this.state.message}
                onChange={(e) => this.setState({ message: e.target.value })} />
            </Form.Group>

            <Form.Group controlId="formGroupK">
              <Form.Label>k</Form.Label>
              <Form.Control
                as="select"
                defaultValue="1"
                value={this.state.k}
                onChange={(e) => this.setState({ k: e.target.value })}
              >

                <option>1</option>
                <option>2</option>
                <option>3</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="forGroupModel">
              <Form.Label>Model</Form.Label>
              <Form.Control
                as="select"
                defaultValue="roberta.base"
                value={this.state.model}
                onChange={(e) => this.setState({ model: e.target.value })}
              >

                <option>roberta.base</option>
                <option>roberta.large</option>
                <option>roberta.large.mnli</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">Submit</Button>
          </Form>

          <p>Predicted text:</p>
          <p>{predictedParagraphs}</p>
        </Card.Body>
      </Card >
    );
  }
}