class Log {
    private time: Record<string, any>;
  
    constructor() {
      this.time = {};
    }
  
    timer(tag: string) {
      Object.assign(this.time, {
        [tag]: {
          start: new Date().getTime(),
        },
      });
    }
  
    timerEnd(tag: string) {
      this.time = {
        ...this.time,
        [tag]: { ...this.time[tag], end: new Date().getTime() },
      };
      const diference = this.time[tag].end - this.time[tag].start;
  
      console.log('\x1b[32m', `[${tag}]:`, diference, 'ms');
    }
  }
  
  const log = new Log();
  
  export { log };
  