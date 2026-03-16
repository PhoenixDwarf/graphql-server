import { ApolloServer, gql, UserInputError } from "apollo-server";
import { v1 as uuid } from "uuid";

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
// The `gql` function is a template literal tag that parses the GraphQL schema language and returns an abstract syntax tree (AST)
// that can be used by the Apollo Server to understand the structure of the API.

const typeDefs = gql`
  type Person {
    name: String!
    phone: String
    address: Address!
    age: Int!
    canDrink: Boolean!
    id: ID!
  }

  type Address {
    street: String!
    city: String!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    peopleCount: Int!
    allPeople(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  # The 'Mutation' type defines the operations that can modify the data. In this case, we have a mutation for adding a new person to the list.

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
      age: Int!
    ): Person
  }
`;

// Resolvers define how to fetch the data for each type and query defined in the schema.
// In this case, we have two resolvers: one for counting the number of people and another for fetching all people.
// For now, the data is hardcoded in the `people` array, but in a real application, this could be fetched from a database or another data source.

const resolvers = {
  Query: {
    peopleCount: () => people.length,
    allPeople: (root, args) => {
      if (!args.phone) return people;

      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;

      return people.filter(byPhone);
    },
    findPerson: (root, args) => {
      const { name } = args;
      return people.find((person) => person.name === name);
    },
  },

  Mutation: {
    addPerson: (root, args) => {
      // Before adding a new person, we check if a person with the same name already exists in the `people` array. (Just for demonstration purposes, in a real application you would typically check for uniqueness based on a unique identifier rather than the name, as multiple people can have the same name.)
      // If it does, we throw a `UserInputError` to indicate that the input is invalid.
      // Built-in error codes can be found here: https://www.apollographql.com/docs/apollo-server/data/errors#built-in-error-codes

      // VALIDATION

      if (people.find((person) => person.name === args.name)) {
        throw new UserInputError("Person with this name already exists", {
          invalidArgs: args.name,
        });
      }

      // If the input is valid, we create a new person object with the provided arguments and a unique ID generated using the `uuid` function.

      // const { name, phone, street, city, age } = args;
      const person = { ...args, id: uuid() };
      people.push(person); // In a real application, you would typically save the new person to a database instead of pushing it to an array.
      return person;
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

    // address: (root) => `${root.street}, ${root.city}`,

    address: (root) => ({ street: root.street, city: root.city }),
    canDrink: (root) => root.age >= 18, // If this calculation is required in  many places, it is better to define it as a field in the schema and resolver, rather than calculating it in each resolver that needs it.
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

// Query examples:

// query {
//   peopleCount
//   allPeople {
//     name
//     phone
//     address {
//       street
//       city
//     }
//     age
//     canDrink
//   }
// }

// ----------------------------

// query {
//   allPeople {
//     name
//     id
//     phone
//     age
//     canDrink
//   }

//   findPerson(name: "Zed") {
//     name
//     canDrink
//   }
// }

// ----------------------------

// mutation Mutation {
//   addPerson(name: "Edwin", street: "Calle 70", city: "Bogotá", age: 28) {
//     id
//     address {
//       city
//       street
//     }
//   }
// }

// ----------------------------

// query AllPeople {
//   allPeople(phone: NO) {
//     name
//     phone
//   }
// }

// ----------------------------
