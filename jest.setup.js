// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import "isomorphic-fetch";
import "isomorphic-form-data";
import "dotenv/config";

global.console = require("console");
console.warn = () => {};
