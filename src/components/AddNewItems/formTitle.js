import React, { PureComponent } from 'react';
import styles from './formTitle.less';

class Title extends PureComponent {

  render() {
    return (
      <div style={{'margin-bottom': '20px'}}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>
            { this.props.title }
          </div>
          <div className={styles.triangle} />
        </div>
        <div className={styles.underline} />
      </div>
    )
  }
}

export default Title;
