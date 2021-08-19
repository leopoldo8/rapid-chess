import neo4j from 'neo4j-driver'

const defaultOptions = {
  uri: process.env.NEO4J_URI,
  username: process.env.NEO4J_USER,
  password: process.env.NEO4J_PASSWORD,
}

export default neo4j.driver(
  defaultOptions.uri,
  neo4j.auth.basic(
    defaultOptions.username,
    defaultOptions.password
  )
);
