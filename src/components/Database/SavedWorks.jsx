import React from 'react';
import firebase from 'firebase/app';
import WorkList from './WorkList';
import { db } from '../../firebase';

/*  global localStorage: false, console: false */

class SavedWorks extends React.Component {
  static setWorkId(key) {
    const storage = localStorage;
    for (let k = 0; k < storage.length; k += 1) {
      if (storage.key(k).includes('work-id')) {
        if (Number(storage.getItem(storage.key(k))) === Number(key)) {
          localStorage.removeItem(storage.key(k));
        }
        if (storage.getItem(storage.key(k)) > key) {
          localStorage.setItem(storage.key(k), storage.getItem(storage.key(k)) - 1);
        }
      }
    }
  }

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
      if (user) {
        this.setState({ isSignedIn: !!user, userUid: user.uid }, () => {
          db.onceGetWorks(this.state.userUid).then((snapshot) => {
            this.setState(() => ({ works: snapshot.val() }), () => this.forceUpdate());
          });
        });
      }
    });
  }

  getWorks() {
    db.onceGetWorks(this.state.userUid).then((snapshot) => {
      this.setState(() => ({ works: snapshot.val() }));
    });
  }

  deleteWork(key, type) {
    if (this.state.isSignedIn) {
      db.deleteWork(this.state.userUid, key, this.getWorks).then(() => {
        this.getWorks();
        this.updateOtherWorkIds(key);
        this.updateWorkCount();
        SavedWorks.setWorkId(key, type);
      });
    }
  }

  updateWorkCount() {
    db.onceGetWorkCount(this.state.userUid).then((snapshot) => {
      const workCount = snapshot.val().newWorkCount;
      if (workCount === 1) {
        db.writeToWorkCount(this.state.userUid, null);
      } else {
        db.writeToWorkCount(this.state.userUid, workCount - 1);
      }
    });
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
        <h2 className="saved-works-header"> List of your saved works </h2>
        {works === null && <div className="no-works-saved-container">No works saved</div>}
        {!!works && (
          <WorkList
            deleteWork={(key, type) => {
              this.deleteWork(key, type);
            }}
            works={works}
          />
        )}
      </div>
    );
  }
}

export default SavedWorks;
