class ReminderTime {
  constructor(time, offsetMinutes) {
    this.time = time;
    this.offsetMinutes = offsetMinutes;
    Object.freeze(this);
  }
}

module.exports = ReminderTime;