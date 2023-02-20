import { signIn, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import Header from "../../components/Header";
import { debugLog } from "../../utils/misc";
import { v4 as uuidv4 } from "uuid";
import {
  CreateAppUserMutationVariables,
  useGetAllAppUsersQuery,
} from "../../graphql/generated";
import { createNewUser } from "../../models/Users";

const Home = () => {
  const { data: session } = useSession();
  const { data, loading, error, refetch } = useGetAllAppUsersQuery({});
  const [values, setValues] = useState<CreateAppUserMutationVariables>({
    name: "",
    email: "",
    userId: uuidv4(),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // console.log("values -->", values);
    const results = await createNewUser(values);
    if (results?.id) refetch();
  };

  return (
    <>
      <div className="container max-w-7xl">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex flex-center flex-col gap-4"
        >
          <div>
            <h2>CREATE NEW USER</h2>
          </div>
          <div className="flex gap-2">
            <label>Nome</label>
            <input
              name="name"
              value={values.name}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-2">
            <label>Email</label>
            <input
              name="email"
              type={"email"}
              value={values.email}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div>
            <button type={"submit"}>Submit</button>
          </div>
        </form>
      </div>

      <div>
        {(data?.appUsers || []).length > 0 && (
          <div>
            <h2 className="mb-4">Usuários: </h2>
            <ul>
              {data?.appUsers.map((user) => {
                return (
                  <li key={user.id} className="mb-4">
                    <p>Id: {user.id}</p>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
