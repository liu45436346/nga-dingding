module.exports = {
  "extends": "eslint:recommended",
  "env":{
    "node":true,
    "es6":true
  },
  "rules": {
    "quotes": [1, "single"],//引号类型 `` "" ''
    "semi": ["error", "always"],
    "no-console":"off",
    "no-unused-vars":"off",
    "no-unreachable":"off",
    "no-redeclare":"warn"
  }
}
