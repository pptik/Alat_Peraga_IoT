const logController = require("./controller/log_controller");
const logger = require("./utils/logger");
const mqtt = require('mqtt')

const rmq = mqtt.connect('ws://192.168.0.2:15675/ws', {
  username: '/smarthome:smarthome',
  password: 'smarthome12345!',
  clientId: 'Sensor-' + Math.random().toString(16).substr(2, 8) + '-punclut-',
  protocolId: 'MQTT',
  keepalive: 1
})


exports.publish = async (topic, message) => {
  logger.info(topic, message)
  rmq.publish(topic, message , () => {})
}

exports.consume = async () => {
  rmq.on('connect', () => {
    rmq.subscribe('Sensor', () => { console.log("Sensor Connected") })
  })

  rmq.on('message', (topic, payload) => {
    logger.info(topic, payload.toString())
    logController.handleToDB(payload.toString())
  })
}
