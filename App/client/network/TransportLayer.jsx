import axios from 'axios'

class TransportLayer {
    getTestData() {
        return axios.get('/api/test/').then(result => {
            return result.data
        })
    }
}

const transportLayer = new TransportLayer()
export default transportLayer