import type { CodegenConfig } from '@graphql-codegen/cli'
import { LOCAL_NODE_API_URL } from './utils/config'

const config: CodegenConfig = {
  overwrite: true,
  schema: `${LOCAL_NODE_API_URL}/graphql`,
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
