

export default class HGC {
  acc : number
  pc : number
  code : { op: string, val: number, runs: number }[]

  constructor(code: string[]) {
    this.acc = 0
    this.pc = 0

    this.load(code)
  }

  load (code: string[]) {
    this.code = []

    for (const c of code) {
      const parts = c.split(' ')
      this.code.push({ op: parts[0], val: parseInt(parts[1], 10), runs: 0 })
    }
  }

  step () {
    this.code[this.pc].runs++

    switch(this.code[this.pc].op) {
      case 'jmp': this.pc += this.code[this.pc].val; break
      case 'acc': this.acc += this.code[this.pc].val; this.pc++; break
      case 'nop': this.pc++; break
    }
  }

  run () {
    while (this.code[this.pc].runs === 0) {
      this.step()
      if (this.pc === this.code.length) return true
    }
    return false // loop found
  }

  reset() {
    this.pc = 0
    this.acc = 0

    for (const c of this.code) c.runs = 0
  }
}