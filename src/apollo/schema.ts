import { Neo4jGraphQL } from "@neo4j/graphql";
import typeDefs from './type-defs'
import driver from './driver'

export default new Neo4jGraphQL({
  typeDefs,
  driver,
});
