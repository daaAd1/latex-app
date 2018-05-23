import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from 'react-simple-card';
import { withRouter } from 'react-router-dom';
import * as routes from './constants/routes';

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

  onClick(key) {
    const { history } = this.props;
    const { type } = this.props.works[key];
    if (type === 'table') {
      this.props.history.push({
        pathname: routes.TABLE,
        state: { key },
      });
    } else if (type === 'math') {
      this.props.history.push({
        pathname: routes.MATH,
        state: { key },
      });
    } else if (type === 'taylor') {
      this.props.history.push({
        pathname: routes.TAYLOR,
        state: { key },
      });
    }
  }

  render() {
    const { works } = this.state;
    return (
      <div>
        {Object.keys(works).map((key) => (
          <div key={key}>
            {' '}
            <div onClick={() => this.onClick(key)}>
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
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(WorkList);
