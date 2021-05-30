# Testes unitários no React

Testes garantem confiança em manutenções futuras.

- Teste unitário (teste de unidade): testa uma funcionalidade específica de forma isolada, fora do contexto da aplicação
- Teste de integração: testa como 2 ou mais funcionalidades funcionam juntas
- Teste E2E (ponta a ponta): testa a aplicação da mesma forma como um usuário utilizaria, testa um fluxo

## Configurações

```bash
yarn add jest jest-dom @testing-library/jest-dom @testing-library/dom @testing-library/react babel-jest -D
```

Arquivo jest.config.js
```js
module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  testeEnvironment: "jsdom"
};
```

Arquivo babel.config.js
```js
module.exports = {
  presets: ["next/babel"]
}
```

Arquivo setupTests.ts
```ts
import "@testing-library/jest-dom/extend-expect"
```