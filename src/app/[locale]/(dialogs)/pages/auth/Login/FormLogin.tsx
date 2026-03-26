import { Input } from "@/app/(components)/ui/input";
import { Checkbox } from "@/app/(components)/ui/checkbox";
import { useTranslations } from "next-intl";

const FormLogin = ({
  email,
  password,
  rememberMe,
  setEmail,
  setPassword,
  setRememberMe,
  handleForgotPassword,
  error,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
  setEmail: (e: string) => void;
  setPassword: (e: string) => void;
  setRememberMe: (e: boolean) => void;
  handleForgotPassword: () => void;
  error?: string | null;
}) => {
  const t = useTranslations("auth.login.form");
  return (
    <div>
      {/* Input Fields */}
      <div className="grid gap-2">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          label={t("emailLabel")}
        />
      </div>
      <div className="grid gap-2 mt-4">
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
          label={t("passwordLabel")}
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <label
            htmlFor="rememberMe"
            className="text-[13px] text-[#1A1A1A] font-regular leading-[130%] cursor-pointer"
          >
            {t("rememberMe")}
          </label>
        </div>
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-[13px] text-[#1A1A1A] font-regular leading-[130%] text-right underline underline-offset-[20%]   "
          style={{
            textDecorationStyle: "solid",
            textDecorationThickness: "0%",
          }}
        >
          {t("forgotPassword")}
        </button>
      </div>
      {error && (
        <div className="w-full text-center mt-4">
          <p className="text-sm text-StatusRed">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FormLogin;
