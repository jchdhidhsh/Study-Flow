class ApiResponse {
  static success(data, message = '操作成功') {
    return { code: 0, message, data, timestamp: new Date().toISOString() };
  }

  static error(message = '操作失败', code = 1) {
    return { code, message, timestamp: new Date().toISOString() };
  }
}

module.exports = ApiResponse;