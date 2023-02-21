import { FormEvent, Suspense, useEffect, useState } from "react";
import Header from "../../components/Header";
import { debugLog } from "../../utils/misc";
import { v4 as uuidv4 } from "uuid";
import {
  CreateAppUserMutationVariables,
  useGetAllAppUsersLazyQuery,
  useGetAllAppUsersQuery,
} from "../../graphql/generated";
import { ShowErrorToast } from "../../utils/app";

const Home = () => {
  const [values, setValues] = useState<CreateAppUserMutationVariables>({
    uid: uuidv4(),
    name: "",
    email: "",
  });
  const { data, loading, error, refetch } = useGetAllAppUsersQuery({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  const test = async () => {
    ShowErrorToast({
      message: "Test message",
    });
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

        <button
          onClick={() => {
            test();
          }}
        >
          Test Button
        </button>
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
                    <p>UId: {user.uid}</p>
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
