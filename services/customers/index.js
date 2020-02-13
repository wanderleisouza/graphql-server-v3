const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    me: Customer
  }

  type Customer @key(fields: "id") {
    id: ID!
    name: String
    email: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return customers[0];
    }
  },
  Customer: {
    __resolveReference(object) {
      return customers.find(customer => customer.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const customers = [
  {
    id: "1",
    name: "Wanderlei Souza",
    email: "wanderlei_souza@fakedomain.com"
  },
  {
    id: "2",
    name: "Camila Nunes",
    email: "camila_nunes@fakedomain.com"
  },
  {
    id: "3",
    name: "João Ramos",
    email: "joao_ramos@fakedomain.com"    	
  }
];
