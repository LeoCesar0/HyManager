import { Form } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { FormFields } from "@/components/FormFields/index";
import { Button } from "@/components/ui/button";
import { useToastPromise } from "@/hooks/useToastPromise";
import { createBankAccount } from "@/server/models/BankAccount/create/createBankAccount";
import {
  CreateBankAccount,
  createBankAccountSchema,
  createBankAccountSchemaPT,
} from "@/server/models/BankAccount/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSelectT from "@/hooks/useSelectT";
import { useGetFormFields } from "./useGetFormFields";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useGlobalAuth } from "../../../contexts/GlobalAuth";
import { FormActions } from "../../../components/ui/form";
import { useGlobalModal } from "../../../contexts/GlobalModal";
import { imagesToFileInfo } from "@/utils/imagesToFileInfo";

export const CreateBankAccountForm = () => {
  const { handleToast, isLoading } = useToastPromise();
  const { currentLanguage } = useGlobalContext();
  const { currentUser } = useGlobalAuth();
  const { setModalProps } = useGlobalModal();

  const validationSchema = useSelectT({
    en: createBankAccountSchema,
    pt: createBankAccountSchemaPT,
  });

  const defaultValues: CreateBankAccount = {
    description: "",
    image: null,
    name: "",
    users: [],
    categories: [],
    userLanguage: currentLanguage,
  };

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues,
    mode: "all",
  });

  const formFields = useGetFormFields(currentLanguage);

  const handleSubmitValues = async (
    values: z.infer<typeof validationSchema>
  ) => {
    // const imageField = formFields.find(
    //   (field) => field.inputType === "imageInput"
    // ) as IImageInput<CreateBankAccount> | undefined;

    // let imageInfo = null;

    // if (imageField) {
    //   const imageData = imageField.tempImages[0];
    //   imageInfo = await uploadSingleFile(imageData.file, currentUser!.id);
    // }

    const values_ = await imagesToFileInfo({
      formFields: formFields,
      bankAccountId: currentUser!.id,
      formValues: values,
      imageFields: [
        {
          multiple: false,
          name: "image",
        },
      ],
    });

    return {
      ...values_,
      users: [{ id: currentUser!.id }],
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
      successMessage: {
        pt: "Banco criado com sucesso",
        en: "Bank created successfully",
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
