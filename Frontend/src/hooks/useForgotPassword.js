import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../lib/api";

const useForgotPassword = () => {
  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: forgotPassword,
  });

  return { forgotPasswordMutation: mutate, isPending, error, isSuccess };
};

export default useForgotPassword;
