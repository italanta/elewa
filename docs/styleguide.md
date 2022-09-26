# iTalanta Opensource coding style guide

Looking for an opinionated guide to syntax, conventions, and application structure? Step right in. This style guide presents preferred conventions and, as importantly, explains why.

## Project Structure

Before we get started you need to understand how this project is structured.

```markdown
.
└── italanta-apps/
    ├── .github
    ├── apps/
    │   ├── conv-learning-manager/
    │   └── conv-Im-backend/
    ├── docs/
    ├── libs/
    │   ├── elements/
    │   ├── features/
    │   ├── model/
    │   ├── state/
    │   ├── util/
    │   └── README.md
    ├── public/
    ├── tools/
    │   ├── generators/
    │   └── scripts/
    ├── .editorconfig
    ├── .eslintrc.json
    ├── .firebaserc
    ├── .gitignore
    ├── .prettierignore
    ├── .prettierrc
    ├── angular.json
    ├── CODE_OF_CONDUCT.md
    ├── CONTRIBUTING.md
    ├── decorate-angular-cli.js
    ├── firebase.json
    ├── jest.config.ts
    ├── jest.preset.js 
    ├── LICENSE.md 
    ├── nx.json
    ├── package-lock.json
    ├── package.json 
    ├── README.md 
    └── tsconfig.base.json 
```

## Ordering of Imports in an [Angular](https://angular.io/) application

The following is the convention we use when ordering Imports:

```typescript

// Angular core imports

// Third party imports e.g RXJS

// Model imports  (They are located in italanta-apps/libs/model)

// State imports (They are located in italanta-apps/libs/state)

// Elements imports (They are located in italanta-apps/libs/elements)

// Features imports (They are located in italanta-apps/libs/features)

// local imports (e.g. ../../…) to this file e.g components, services, )

```
## Coding Style 
The project folows coding convetions adopted form the following: 

1. [Angular style guide](https://angular.io/guide/styleguide)

2. [TypeScript StyleGuide](tsguide.md)
