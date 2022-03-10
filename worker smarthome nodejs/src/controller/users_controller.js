const format = require("date-fns/format");
const { requestResponse } = require("../utils");
const logger = require('../utils/logger')
const { db } = require("../databases/sqlite")

let response

const getUsers = async (req, res) => {
  try {
    const users = await db.all("SELECT * FROM rfid_activity")
    response = { ...requestResponse.success, data: users }
  } catch (error) {
    logger.error(error);
    response = { ...requestResponse.server_error };
  }
  res.status(response.code).json(response);
}

module.exports = {
  getUsers
}
