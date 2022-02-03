/* eslint-disable */
module.exports = {
    root: true,
    env: {
     node: true
    },
    plugins: [ "@typescript-eslint"],
    extends: ["plugin:vue/essential", "@vue/typescript"],
    parserOptions: {
     parser: "@typescript-eslint/parser"
    },
    rules: {
        // we only want single quotes
        'quotes': ['error', 'single'],
        // we want to force semicolons
        'semi': ['error', 'always'],
        // we use 2 spaces to indent our code
        'indent': ['error', 2],
        // we want to avoid useless spaces
        'no-multi-spaces': ['error'],
        "vue/html-indent": "off",
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
     "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
     "comma-dangle": ["error", "never"],
     "linebreak-style": "off"
    }
};
