
import { Section, SectionContainer } from "@/components/Section/Section";
import DashboardLayout from '@/layouts/DashboardLayout';
import { ReactElement } from "react";

const Test = () => {
  return (
    <>
      <SectionContainer>
        <Section>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Amount</th>
                  <th>Creditor</th>
                  <th>Created at</th>
                  <th>Updated at</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>id</td>
                  <td>500</td>
                  <td>Fulano</td>
                  <td>today</td>
                  <td>today</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>
      </SectionContainer>
    </>
  );
};

// Test.getLayout = (page: ReactElement) => (
//   <DashboardLayout>{page}</DashboardLayout>
// );

export default Test;



