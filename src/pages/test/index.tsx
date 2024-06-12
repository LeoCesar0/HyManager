import { Section, SectionContainer } from "@/components/Section/Section";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import { FirebaseCollection } from "@/server/firebase";
import { firebaseList } from "@/server/firebase/firebaseList";
import { Transaction } from "@/server/models/Transaction/schema";
import { createDocRef } from "@/server/utils/createDocRef";
import { firebaseDB } from "@/services/firebase";
import { writeBatch } from "firebase/firestore";
import { ReactElement } from "react";

const Test = () => {
  const run = async () => {
    // const result = await firebaseList<Transaction>({
    //   collection: FirebaseCollection.transactions,
    // });
    // const newData = result.map((item) => ({
    //   ...item,
    //   absAmount: Math.abs(item.amount),
    // }));
    // console.log("newData.length", newData.length);
    // const batch = writeBatch(firebaseDB);
    // newData.forEach((item) => {
    //   const docRef = createDocRef({
    //     collection: FirebaseCollection.transactions,
    //     id: item.id,
    //   });
    //   batch.set(docRef, item, { merge: true });
    // });
    // await batch.commit();
    // console.log("Success");
  };

  return (
    <>
      <SectionContainer>
        <Section>
          <Button onClick={() => run()}>Run</Button>
        </Section>
      </SectionContainer>
    </>
  );
};

export default Test;
