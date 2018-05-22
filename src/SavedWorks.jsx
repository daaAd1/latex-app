import React from 'react';
import * as firebase from 'firebase';
import WorkList from './WorkList';
import { db } from './firebase';

class SavedWorks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      works: null,
      isSignedIn: false,
      userUid: '',
    };

    this.deleteWork = this.deleteWork.bind(this);
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ isSignedIn: !!user, userUid: user.uid }, () => {
        db.onceGetWorks(this.state.userUid).then((snapshot) => {
          this.setState(() => ({ works: snapshot.val() }), () => this.forceUpdate());
        });
      });
    });
  }

  getWorks() {
    db.onceGetWorks(this.state.userUid).then((snapshot) => {
      this.setState(() => ({ works: snapshot.val() }));
    });
  }

  deleteWork(key) {
    if (this.state.isSignedIn) {
      db.deleteWork(this.state.userUid, key, this.getWorks).then(() => {
        this.getWorks();
        this.updateOtherWorkIds(key);
      });
    }
  }

  updateOtherWorkIds(key) {
    db.onceGetWorks(this.state.userUid).then((snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        if (Number(key) === 1 && data.length === undefined) {
          const update = {};
          update[2] = null;
          update[1] = data[2];
          db.updateWorkNode(this.state.userUid, update);
        } else {
          for (let node = Number(key); node < data.length - 1; node += 1) {
            const update = {};
            update[node + 1] = null;
            update[node] = data[node + 1];
            db.updateWorkNode(this.state.userUid, update);
          }
        }
      }
    });
  }

  render() {
    const { works } = this.state;
    return (
      <div>
        <h2> List of your saved works </h2>
        {!!works && (
          <WorkList
            deleteWork={(key) => {
              this.deleteWork(key);
            }}
            works={works}
          />
        )}
      </div>
    );
  }
}

export default SavedWorks;
