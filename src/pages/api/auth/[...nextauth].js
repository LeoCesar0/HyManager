import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";


const GetNextAuthUserByEmail = gql`
  query GetNextAuthUserByEmail($email: String!) {
    user: nextAuthUser(where: { email: $email }, stage: DRAFT) {
      id
      password
    }
  }
`;

const CreateNextAuthUserByEmail = gql`
  mutation CreateNextAuthUserByEmail($email: String!, $password: String!) {
    newUser: createNextAuthUser(data: { email: $email, password: $password }) {
      id
    }
  }
`;

export default NextAuth({
  // secret: process.env.NEXTAUTH_SECRET,
  // jwt: {
  //   secret: process.env.NEXTAUTH_SECRET,
  // },
  // session: {
  //   strategy: 'jwt',
  // },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorize: async (props) => {
   
        console.log('auth props -->', props)
    
        return null
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.userId = token.sub;
      return Promise.resolve(session);
    },
  },
});
