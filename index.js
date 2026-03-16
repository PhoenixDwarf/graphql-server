import { ApolloServer, gql } from "apollo-server";

const people = [
  {
    name: "Zed",
    phone: "123-456-7890",
    street: "Main Street",
    city: "New York",
    id: "cd1cfed8-f775-4cda-ae67-4925d211173e",
  },
  {
    name: "Alice",
    phone: "987-654-3210",
    street: "Second Street",
    city: "Los Angeles",
    id: "c1d2a219-6b18-4375-884b-10d2ceb2a22e",
  },
  {
    name: "Bob",
    street: "Third Street",
    city: "Chicago",
    id: "4df3f5be-52ec-4caf-9480-adf34025a0f4",
  },
];

// Following code describes the schema of the GraphQL API. It defines the types and queries that can be made to the API.

const typeDefs = gql`
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    peopleCount: Int!
    allPeople: [Person]!
  }
`;

// Resolvers define how to fetch the data for each type and query defined in the schema.
// In this case, we have two resolvers: one for counting the number of people and another for fetching all people.
// For now, the data is hardcoded in the `people` array, but in a real application, this could be fetched from a database or another data source.

const resolvers = {
  Query: {
    peopleCount: () => people.length,
    allPeople: () => people,
  },
};

// Finally, we create an instance of the ApolloServer class, passing in the type definitions and resolvers.
// This sets up the GraphQL server with the defined schema and resolvers.

const server = new ApolloServer({
  typeDefs, // typeDefs: customNameForDefinitions
  resolvers, // resolvers: customNameForResolvers
});

// The `listen` method starts the server and logs the URL where the server is running.

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
