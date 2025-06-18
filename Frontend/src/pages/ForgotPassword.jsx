import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, Loader } from "lucide-react";
import toast from "react-hot-toast";
import useForgotPassword from "../hooks/useForgotPassword";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { forgotPasswordMutation, isPending, error } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    forgotPasswordMutation(email, {
      onSuccess: (data) => {
        if (data.success) {
          setIsEmailSent(true);
          toast.success("Password reset instructions sent to your email!");
        } else {
          toast.error(data.message || "Something went wrong");
        }
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      },
    });
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="max-w-md w-full mx-4">
          <div className="bg-base-100 rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-base-content mb-2">
                Check Your Email
              </h1>
              <p className="text-base-content/70">
                We've sent password reset instructions to{" "}
                <span className="font-semibold text-primary">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-base-content/60">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail("");
                }}
                className="btn btn-outline btn-sm"
              >
                Try Different Email
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-base-300">
              <Link to="/login" className="btn btn-ghost btn-sm gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-base-200" data-theme="forest">
      <div className="max-w-md w-full mx-4">
        <div className="bg-base-100 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Forgot Password?
            </h1>
            <p className="text-base-content/70">
              No worries! Enter your email address and we'll send you
              instructions to reset your password.
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error?.response?.data?.message || "Something went wrong"}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending Instructions...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-primary/25">
            <Link
              to="/login"
              className="btn btn-ghost btn-sm gap-2 text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
