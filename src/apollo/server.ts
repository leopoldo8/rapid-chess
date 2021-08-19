import { ApolloServer } from 'apollo-server-micro';
import neoSchema from './schema';

const apolloServer = new ApolloServer({
  schema: neoSchema.schema,
  context: ({ req }) => ({ req }),
});

export default apolloServer;
