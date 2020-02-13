const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int = 5): [Product]
  }

  type Product @key(fields: "sku") {
    sku: String!
    name: String
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.sku === object.sku);
    }
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
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

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const products = [
  {
    sku: "1",
    name: "Ibuprofeno",
  },
  {
    sku: "2",
    name: "Paracetamol",
  },
  {
    sku: "3",
    name: "Dipirona",
  }
];
