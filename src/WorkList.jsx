import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from 'react-simple-card';
import { withRouter } from 'react-router-dom';
import * as routes from './constants/routes';
import deleteIcon from './delete-coral.svg';

class WorkList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      works: props.works,
    };
  }

  deleteWork(event, key) {
    event.stopPropagation();
    const newState = this.state;
    const type = this.state.works[key].type;
    newState.works.splice(key, 1);
    this.setState(newState);
    this.props.deleteWork(key, type);
  }

  onClick(key) {
    console.log('hello?');
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
            <Card>
              <div onClick={() => this.onClick(key)}>
                <CardHeader>
                  <div>
                    <h2>
                      {key}.
                      {works[key].projectName} - {works[key].type}
                    </h2>
                  </div>
                  <div>
                    <button
                      className="delete-work-button"
                      type="button"
                      onClick={(event) => {
                        this.deleteWork(event, key);
                      }}
                    >
                      <img src={deleteIcon} alt="delete-arrow" />
                    </button>
                  </div>
                </CardHeader>
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(WorkList);
