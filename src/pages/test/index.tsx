import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalAuth } from "@/contexts/GlobalAuth";
import {
  listBankAccountByUserId,
  ListBankAccountByUserIdReturnType,
} from "@/server/models/BankAccount/read/listBankAccountByUserId";
import Link from "next/link";
import useSwr from "swr";
import { FirebaseCollection } from "../../server/firebase/index";
import { Button } from "@/components/ui/button";

const Test = () => {
  const { currentUser } = useGlobalAuth();

  const { data, error, isLoading, isValidating, mutate } = useSwr<
    ListBankAccountByUserIdReturnType,
    any,
    string[] | null
  >(
    currentUser?.id ? [FirebaseCollection.bankAccounts, currentUser.id] : null,
    ([_, id]) => listBankAccountByUserId({ id: id })
  );

  return (
    <>
      <Link href="/">Home</Link>
      <h1>Test Page</h1>
      <p>Current User: {currentUser?.name}</p>
      <p>Current User id: {currentUser?.id}</p>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Bank accounts by user</CardTitle>
        </CardHeader>
        <CardContent>
          <pre>data: {JSON.stringify(data, null, 2)}</pre>
          <pre>loading: {isLoading}</pre>
          <pre>error: {JSON.stringify(error, null, 2)}</pre>
          <div>
            <Button
              onClick={() => {
                mutate();
              }}
            >
              Mutate
            </Button>
            <Button onClick={() => {}}>Test</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Test;
