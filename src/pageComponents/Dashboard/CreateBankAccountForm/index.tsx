import { Form } from "@/components/ui/form";
import { cx } from "@/utils/misc";
import { FormProvider, useForm } from "react-hook-form";
import { FormFields } from "@/components/FormFields/index";
import { Button } from "@/components/ui/button";
import { useToastPromise } from "@/hooks/useToastPromise";
import { createBankAccount } from "@/server/models/BankAccount/create/createBankAccount";
import {
  createBankAccountSchema,
  createBankAccountSchemaPT,
} from "@/server/models/BankAccount/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSelectT from "@/hooks/useSelectT";
import { useGetFormFields } from "./useGetFormFields";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { IImageInput } from "../../../components/FormFields/@types";
import { uploadSingleFile } from "@/components/TransactionsFileInput/uploadFilesToStorage";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";
import { FormActions } from "../../../components/ui/form";
import { useGlobalModal } from "../../../contexts/GlobalModal";

export const CreateBankAccountForm = () => {
  const { handleToast, isLoading } = useToastPromise();
  const { currentLanguage } = useGlobalContext();
  const { currentUser } = useGlobalAuth();
  const { setModalProps } = useGlobalModal();

  const validationSchema = useSelectT({
    en: createBankAccountSchema,
    pt: createBankAccountSchemaPT,
  });

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      image: null,
      description: "",
      name: "",
      users: [],
    },
    mode: "all",
  });

  const formFields = useGetFormFields(currentLanguage);

  const handleSubmitValues = async (
    values: z.infer<typeof validationSchema>
  ) => {
    const imageField = formFields.find(
      (field) => field.name === "image" && field.inputType === "imageInput"
    ) as IImageInput | undefined;

    let imageInfo = null;

    if (imageField) {
      const imageData = imageField.tempImages[0];
      imageInfo = await uploadSingleFile(imageData.file, currentUser!.id);
    }

    return {
      ...values,
      image: imageInfo,
    };
  };

  async function onSubmit(values: z.infer<typeof validationSchema>) {
    const promise = async () => {
      const readyValues = await handleSubmitValues(values);

      return await createBankAccount({
        values: readyValues,
      });
    };

    await handleToast(promise(), {
      defaultErrorMessage: {
        pt: "Erro ao criar banco",
        en: "Error creating bank",
      },
      loadingMessage: {
        pt: "Criando banco",
        en: "Creating bank",
      },
    });

    setModalProps({
      children: null,
      isOpen: false,
    });
  }

  return (
    <>
      <>
        <FormProvider {...form}>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <FormFields form={form} fields={formFields} />
            <FormActions>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
              >
                Submit
              </Button>
            </FormActions>
          </Form>
        </FormProvider>
      </>
    </>
  );
};
