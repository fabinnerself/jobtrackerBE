const sendResponse = (res, success, data = null, message = null, status = 200, meta = null) => {
  const response = { success };

  if (data !== null) response.data = data;
  if (message !== null) response.message = message;
  if (meta !== null) response.meta = meta;

  return res.status(status).json(response);
};

module.exports = { sendResponse };