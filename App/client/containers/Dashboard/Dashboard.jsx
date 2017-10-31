import React from 'react'
import PropTypes from 'prop-types'
import styles from './Dashboard.css'

class Dashboard extends React.Component {
    render() {
        return (
            <main className={styles.main}>
                <div className={styles.content}>
                    {this.props.children}
                </div>
            </main>
        )
    }
}

Dashboard.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Dashboard