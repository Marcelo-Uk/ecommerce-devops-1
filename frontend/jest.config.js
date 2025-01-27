export default {
    testEnvironment: "jest-environment-jsdom", // Define o ambiente DOM
    transform: {
      "^.+\\.js$": "babel-jest", // Usa o Babel para transformar arquivos JS
    },
  };
  