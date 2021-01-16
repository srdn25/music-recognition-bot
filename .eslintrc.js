module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "extends": ["eslint:recommended"],
    "rules": {
        "indent": ["error", 2, { "SwitchCase": 1 }],
        "semi": ["error", "always"],
        "quotes": ["error", "single"],
        "no-unused-vars": ["error"],
        "linebreak-style": ["error", "unix"],
        "no-console": "warn",
        "keyword-spacing": ["error", { "after": true }],
        "object-curly-spacing": ["error", "always"],
        "eol-last": ["error", "always"],
        "arrow-parens": ["error", "always"],
        "max-len": [
            "error",
            {
                "tabWidth": 2,
                "comments": 80,
                "code": 120,
                "ignoreStrings": true,
                "ignoreUrls": true,
                "ignoreRegExpLiterals": true
            }
        ]
    }
};
