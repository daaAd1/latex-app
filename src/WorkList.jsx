import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from 'react-simple-card';

class WorkList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      works: props.works,
    };
  }

  deleteWork(key) {
    const newState = this.state;
    newState.works.splice(key, 1);
    this.setState(newState);
    this.props.deleteWork(key);
  }

  render() {
    const { works } = this.state;
    return (
      <div>
        {Object.keys(works).map((key) => (
          <div key={key}>
            {' '}
            <Card>
              <CardHeader>
                <h2>{works[key].name}</h2>
              </CardHeader>
              <CardBody>{works[key].type}</CardBody>
              <CardFooter>
                <button
                  type="button"
                  onClick={() => {
                    this.deleteWork(key);
                  }}
                >
                  Delete
                </button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    );
  }
}

export default WorkList;
