const { format } = require('date-fns')
const id = require('date-fns/locale/id')
const mqtt_connect = require("../consumer")
const { requestResponse } = require("../utils");
const { db } = require("../databases/sqlite")
const logger = require('../utils/logger')

let response

const handleToDB = async (content) => {
  const now = new Date()
  const timeStamp = format(now, 'dd/LL/yyyy hh:mm aaaaa', { locale: id })

  const dataParsing = content.toString().split("#")
  let InputGuid = dataParsing[0]
  let ValueInput = dataParsing[1]
  // Get Rules
  db.serialize(() => {
    db.all("SELECT * FROM activityiot WHERE input_guid = ? AND input_value = ?", [InputGuid, ValueInput], async (err, selectRules) => {
     
      if (err) throw err;

      // console.log(selectRules)
      selectRules.forEach(async rules => {
        const OutputGuid = rules.output_guid
        const OutputValue = rules.output_value

        const outputMessage = OutputGuid + '#' + OutputValue
        await mqtt_connect.publish('Aktuator', outputMessage)

        db.all("SELECT * FROM registeriot  WHERE serial_number = ?", [InputGuid], async (err, registration) => {
          // const deviceName = registration[0].name
          db.run(`insert INTO logsiot (output_guid,output_value,time_device)VALUES(?, ?, ?)`, [OutputGuid, OutputValue, timeStamp], function (err, response) {
            if (err) throw err;
          })
        })
      })
    })
  })
}

const getLogsLimit = async (req, res) => {
  try {
    const logs = await db.all("SELECT * FROM logsiot LIMIT 3 ORDER BY time_device DESC")
    response = { ...requestResponse.success, data: logs }
  } catch (error) {
    logger.error(error);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
}


const getLogs = async (req, res) => {
  try {
    const logs = await db.all("SELECT * FROM logsiot ORDER BY time_device ASC LIMIT 10")
    response = { ...requestResponse.success, data: logs }
  } catch (error) {
    logger.error(error);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
}

module.exports = {
  handleToDB,
  getLogs,
  getLogsLimit
}
