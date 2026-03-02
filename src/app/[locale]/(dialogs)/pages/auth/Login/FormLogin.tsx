import React from 'react';
import { Input } from '@/app/(components)/ui/input'
import { Checkbox } from '@/app/(components)/ui/checkbox'
import CountryPhone from '@/app/(components)/template/phone/CountryPhone'
import { useTranslations } from 'next-intl';

const FormLogin = (
    { loginType, email, mobile, password, rememberMe, setEmail, setMobile, setPassword, setRememberMe, handleForgotPassword }:
        { loginType: string, email: string, mobile: string, password: string, rememberMe: boolean, setEmail: (e: string) => void, setMobile: (e: string) => void, setPassword: (e: string) => void, setRememberMe: (e: boolean) => void, handleForgotPassword: () => void }) => {
    const t = useTranslations('auth.login.form');
    const [isPhoneValid, setIsPhoneValid] = React.useState(false);
    return (
        <div>
            {/* Input Fields */}
            <div className="grid gap-2 mt-4">
                {loginType === "email" ? (
                    <>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('emailPlaceholder')}
                            label={t('emailLabel')}
                        />
                    </>
                ) : (
                    <>
                        <CountryPhone
                            value={mobile}
                            onChange={setMobile}
                            placeholder={t('mobilePlaceholder')}
                            defaultCountry="sa"
                            showValidation={true}
                            onValidationChange={setIsPhoneValid}
                            label={t('mobileLabel')}
                        />
                    </>
                )}
            </div>
            <div className="grid gap-2 mt-4">
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    label={t('passwordLabel')}
                />
            </div>
            <div className="flex items-center justify-between mt-4">

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <label htmlFor="rememberMe" className="text-[13px] text-[#1A1A1A] font-regular leading-[130%] cursor-pointer">
                        {t('rememberMe')}
                    </label>
                </div>
                <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[13px] text-[#1A1A1A] font-regular leading-[130%] text-right underline underline-offset-[20%]   "
                    style={{
                        textDecorationStyle: 'solid',
                        textDecorationThickness: '0%'
                    }}
                >
                    {t('forgotPassword')}
                </button>
            </div>
        </div>
    )
}

export default FormLogin