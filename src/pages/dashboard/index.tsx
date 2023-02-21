import { getSession } from "next-auth/react";
import { GetAppUserByIdDocument, GetAppUserByIdQuery } from "../../graphql/generated";
import { apolloClient } from "../../lib/apollo";

const Dashboard = () => {
  return (
    <>
      <h2>Dashboard</h2>
    </>
  );
};

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   console.log('getServerSideProps session -->', session)

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }


// //   const { user } = await apolloClient.query<GetAppUserByIdQuery>({
// //     query: GetAppUserByIdDocument,
// //     variables: {id: }
// //   })

//   return {
//     props: {
//       user,
//     },
//   };
// }

export default Dashboard;
