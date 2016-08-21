export { CantoDict, Jyutping, NotedChar }

class Jyutping {
  constructor(pinyin) {
    this.pinyin = pinyin
    let {ping, tone} = function(pinyin) {
      let match = content.match(/([a-zA-Z]+)(\d)/)
      let ping = null
      let tone = null
      if (match) {
        ping = match[1]
        tone = match[2]
      }
      return {
        ping: ping,
        tone: tone
      }
    } (this.pinyin)

    this.ping = ping
    this.tone = tone
  }
}

class NotedChar {
  constructor(charObj) {
    let {char, pinyin, use_cases, explanations, is_variant,
    is_cantonese, is_proper, is_borrwed} = charObj
    this.char = char
    // 拼音
    this.jyutping = new Jyutping(pinyin)
    // 用例
    this.use_cases = use_cases
    this.explanations = explanations
    // 异读字
    this.is_variant = is_variant
    // 粤语用词
    this.is_cantonese = is_cantonese
    // 专有名词
    this.is_proper = is_proper
    // 通假字
    this.is_borrwed = is_borrwed
  }
}

class CantoDict {
  constructor(f) {
    this.dict = {}
    lines = f.split("\n")
    for (let line of lines) {
      let notedChar = parse_line(line)
      if (notedChar) {
        // check if
        let char = notedChar.char
        if (char in this.dict) {
          this.dict[char].add(notedChar)
        } else {
          this.dict[char] = new Zi(notedChar)
        }
      }
    }
  }
  lookupZi(char) {
    return this.dict[char] || null
  }

  getJyutping(char) {
    zi = lookupZi(char)
    if (zi) {
      return zi.pronounce()
    }
  }
}

class Zi(object){
  constructor(notedChar) {
    this.char = notedChar.char
    let pinyin = notedChar.jyutping.pinyin
    this.pronunciations[pinyin] = notedChar
  }

  add(notedChar) {
    let pinyin = notedChar.jyutping.pinyin
    this.pronunciations[pinyin] = notedChar
  }

  pronounce() {
    let maxWeight = 0
    let maxWeightP = null
    for (let notedChar in this.pronunciations) {
      
    }
  }
}

let _re_variant = /异读字|異讀字/
let _re_cantonese = /粤语用字|粵語用字/
let _re_proper = /人名|地名|姓氏|复姓|複姓|县名|縣名|国名|國名/
let _re_borrowed = /同「.」字|通「.」字/
let _re_other = /助词|助詞/

function parse_line(line) {
  let line = line.trim()
  let splitedLine = line.split("\t")
  if (splitedLine.length == 3) {
    let [char, pinyin, extra] = splitedLine
    let notedChar = new NotedChar({char: char, pinyin: pinyin})
    let use_cases = null
    let explanations = null
    if (extra) {
      let flag = false
      if (_re_variant.exec(extra) {
        notedChar.is_variant = true
        flag = true
      }
      if (_re_cantonese.exec(extra) {
        notedChar.is_cantonese = true
        flag = true
      }
      if (_re_proper.exec(extra) {
        notedChar.is_proper = true
        flag = true
      }
      if (_re_borrowed.exec(extra) {
        notedChar.is_borrowed = true
        flag = true
      }
      if (_re_other.exec(extra) {
        flag = true
      }
      splitedExtra = extra.split("；")
      if splitedExtra.length > 1 && !(splitedExtra[0].startsWith("(")){
        use_cases = splitedExtra[0].split("，")
        explanations = splitedExtra.slice(1)
      } else {
        if (flag) {
          explanations = splitedExtra
        } else {
          use_cases = extra.split("，")
        }
      }
    }
    return notedChar
  }
  return null
}
