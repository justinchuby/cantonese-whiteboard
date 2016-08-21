export { CantoDict, Jyutping, NotedChar }

class Jyutping {
  constructor(pinyin) {
    this.pinyin = pinyin
    let {ping, tone} = function(pinyin) {
      let match = pinyin.match(/([a-zA-Z]+)(\d)/)
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
    this.char = charObj.char
    // 拼音
    this.jyutping = new Jyutping(charObj.pinyin)
    // 用例
    this.use_cases = charObj.use_cases || null
    this.explanations = charObj.explanations || null
    // 异读字
    this.is_variant = charObj.is_variant || null
    // 粤语用词
    this.is_cantonese = charObj.is_cantonese || null
    // 专有名词
    this.is_proper = charObj.is_proper || null
    // 通假字
    this.is_borrwed = charObj.is_borrwed || null
  }
}

class CantoDict {
  constructor(f) {
    this.dict = {}
    let lines = f.split("\n")
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

  getNotedChar(char, in_str="") {
    let zi = this.lookupZi(char)
    if (zi) {
      return zi.chooseOne(in_str)
    }
    return null
  }
}

class Zi {
  constructor(notedChar) {
    this.char = notedChar.char
    this.pronunciations = {}
    let pinyin = notedChar.jyutping.pinyin
    this.pronunciations[pinyin] = notedChar
  }

  add(notedChar) {
    let pinyin = notedChar.jyutping.pinyin
    this.pronunciations[pinyin] = notedChar
  }

  pronounce(in_str) {
    return chooseOne(in_str).jyutping
  }

  chooseOne(in_str) {
    let maxWeight = 0
    let maxWeightChar = null
    for (let key in this.pronunciations) {
      let notedChar = this.pronunciations[key]
      let currentWeight = 1
      if (notedChar.use_cases) {
        currentWeight += notedChar.use_cases.length
        for (let use_case of notedChar.use_cases) {
          if (use_case.includes("(")) {
            use_case = use_case.slice(0, use_case.indexOf("("))
          }
          if (in_str.includes(use_case)) {
            return notedChar
          }
        }
      }
      if (notedChar.explanations) {
        currentWeight += notedChar.explanations.length
      }
      if (notedChar.is_variant) {
        currentWeight *= 0.05
      }
      if (notedChar.is_cantonese) {
        currentWeight *= 2
      }
      if (notedChar.is_proper) {
        currentWeight *= 0.6
      }
      if (currentWeight > maxWeight) {
        maxWeight = currentWeight
        maxWeightChar = notedChar
      }
    }
    return maxWeightChar
  }
}

let _re_variant = /异读字|異讀字/
let _re_cantonese = /粤语用字|粵語用字/
let _re_proper = /人名|地名|姓氏|复姓|複姓|县名|縣名|国名|國名/
let _re_borrowed = /同「.」字|通「.」字/
let _re_other = /助词|助詞/

function parse_line(line) {
  line = line.trim()
  let splitedLine = line.split("\t")
  if (splitedLine.length == 3) {
    let [char, pinyin, extra] = splitedLine
    let notedChar = new NotedChar({char: char, pinyin: pinyin})
    let use_cases = null
    let explanations = null
    if (extra) {
      let flag = false
      if (_re_variant.exec(extra)) {
        notedChar.is_variant = true
        flag = true
      }
      if (_re_cantonese.exec(extra)) {
        notedChar.is_cantonese = true
        flag = true
      }
      if (_re_proper.exec(extra)) {
        notedChar.is_proper = true
        flag = true
      }
      if (_re_borrowed.exec(extra)) {
        notedChar.is_borrowed = true
        flag = true
      }
      if (_re_other.exec(extra)) {
        flag = true
      }
      let splitedExtra = extra.split("；")
      if (splitedExtra.length > 1 && !(splitedExtra[0].startsWith("("))) {
        use_cases = splitedExtra[0].split("，")
        explanations = splitedExtra.slice(1)
      } else {
        if (flag || splitedExtra[0].startsWith("(")) {
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
