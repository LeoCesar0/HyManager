import NextAuth from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

// const GetNextAuthUserByEmail = gql`
//   query GetNextAuthUserByEmail($email: String!) {
//     user: nextAuthUser(where: { email: $email }, stage: DRAFT) {
//       id
//       password
//     }
//   }
// `;

// const CreateNextAuthUserByEmail = gql`
//   mutation CreateNextAuthUserByEmail($email: String!, $password: String!) {
//     newUser: createNextAuthUser(data: { email: $email, password: $password }) {
//       id
//     }
//   }
// `;

export default NextAuth({
  secret: process.env.NEXT_AUTH_SECRET,
  jwt: {
    secret: process.env.NEXT_AUTH_SECRET,
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorize: async (props: any) => {
        console.log("auth props -->", props);

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("callbacks <---");
      // console.log('session -->', session)
      // console.log('token -->', token)
      session.userId = token.sub;
      return Promise.resolve(session);
    },
    async signIn({ user, account, profile }) {
      console.log("--> SIGNIN <--");
      console.log("user -->", user);
      console.log("account -->", account);
      console.log("profile -->", profile);

      // const email = user.email || profile?.email || "";

      // if (user.id) {
      //   const createdUser = await createNewUser({
      //     email: email,
      //     name: user.name || "",
      //     bio: "",
      //     imageUrl: user.image || "",
          
      //   });
      // }

      return true;
    },
  },
});
