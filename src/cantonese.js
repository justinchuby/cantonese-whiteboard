class Jyutping {
  constructor(jyutString) {
    this.content = jyutString;
    let {ping, tone} = function(content) {
      let match = content.match(/([a-zA-Z]+)(\d)/);
      let ping = null;
      let tone = null;
      if (match) {
        ping = match[1];
        tone = match[2];
      }
      return {
        ping: ping,
        tone: tone
      }
    } (this.content);

    this.ping = ping;
    this.tone = tone;
  }
}
