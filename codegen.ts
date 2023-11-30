import type { CodegenConfig } from '@graphql-codegen/cli'
import { NODE_GRAPHQL_URL } from './utils/config'

const config: CodegenConfig = {
  overwrite: true,
  schema: NODE_GRAPHQL_URL,
  documents: './graphql/*.graphql',
  generates: {
    './graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
        'fragment-matcher'
      ]
    }
  },
  hooks: {
    afterAllFileWrite: ['prettier --write']
  }
}

export default config
