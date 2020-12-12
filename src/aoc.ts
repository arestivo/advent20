import { runProblem } from "./problems"

const problem = process.argv[2]

if (/\d{1,2}(a|b)/.test(problem)) runProblem(problem)
else console.log('Invalid problem number!')