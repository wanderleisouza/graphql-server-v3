const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
    body: String
    author: Customer @provides(fields: "email")
    product: Product
  }

  extend type Customer @key(fields: "id") {
    id: ID! @external
    email: String @external
    reviews: [Review]
  }

  extend type Product @key(fields: "sku") {
    sku: String! @external
    reviews: [Review]
  }
`;

const resolvers = {
  Review: {
    author(review) {
      return { __typename: "Customer", id: review.authorID };
    }
  },
  Customer: {
    reviews(customer) {
      return reviews.filter(review => review.authorID === customer.id);
    }
  },
  Product: {
    reviews(product) {
      return reviews.filter(review => review.product.sku === product.sku);
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

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const reviews = [
  {
    id: "1",
    authorID: "1",
    product: { sku: "1" },
    body: "Passou a dor na hora!"
  },
  {
    id: "2",
    authorID: "1",
    product: { sku: "2" },
    body: "Muito caro na loja."
  },
  {
    id: "3",
    authorID: "2",
    product: { sku: "3" },
    body: "Ainda fiquei com dor."
  },
  {
    id: "4",
    authorID: "2",
    product: { sku: "1" },
    body: "Melhor ir tomar injeção no posto."
  }
];
