import { ApolloServer, gql } from "apollo-server";

const people = [
  {
    name: "Zed",
    phone: "123-456-7890",
    street: "Main Street",
    city: "New York",
    age: 30,
    id: "cd1cfed8-f775-4cda-ae67-4925d211173e",
  },
  {
    name: "Alice",
    phone: "987-654-3210",
    street: "Second Street",
    city: "Los Angeles",
    age: 17,
    id: "c1d2a219-6b18-4375-884b-10d2ceb2a22e",
  },
  {
    name: "Bob",
    street: "Third Street",
    city: "Chicago",
    age: 25,
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
    address: String!
    check: String!
    age: Int!
    canDrink: Boolean!
    id: ID!
  }

  type Query {
    peopleCount: Int!
    allPeople: [Person]!
    findPerson(name: String!): Person
  }
`;

// Resolvers define how to fetch the data for each type and query defined in the schema.
// In this case, we have two resolvers: one for counting the number of people and another for fetching all people.
// For now, the data is hardcoded in the `people` array, but in a real application, this could be fetched from a database or another data source.

const resolvers = {
  Query: {
    peopleCount: () => people.length,
    allPeople: () => people,
    findPerson: (root, args) => {
      const { name } = args;
      return people.find((person) => person.name === name);
    },
  },

  // The `Person` resolver defines how to resolve the fields of the `Person` type.
  // It is not strictly necessary in this case, as the default resolver (created by Apollo Server) would work for these fields, but it is included here for demonstration purposes.

  Person: {
    // The default resolver for a field simply looks for a property with the same name on the parent object (in this case, the `Person` object) and returns its value.
    // For example, the default resolver for the `name` field would look for a `name` property on the `Person` object and return its value.

    // name: (root) => 'Jose', ---> We could override the default resolver for the `name` field. In this case it would always return 'Jose' regardless of the actual name in the data.
    // phone: (root) => root.phone,
    // street: (root) => root.street,
    // city: (root) => root.city,
    // id: (root) => root.id,

    // We can also define custom resolvers for fields that are not directly present in the data.
    // For example, we could define an `address` field that combines the `street` and `city` fields.

    address: (root) => `${root.street}, ${root.city}`,
    canDrink: (root) => root.age >= 18, // If this calculation is required in  many places, it is better to define it as a field in the schema and resolver, rather than calculating it in each resolver that needs it.
    check: () => "This is a check field",
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
