import { Button } from '@/app/(components)';
import CountryPhone from '@/app/(components)/template/phone/CountryPhone';
import { Input } from '@/app/(components)/ui/input'
import { UserRound } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';



const BussinessAccountForm = () => {
    return (
        <form className='mt-8 flex flex-col gap-4'>
            <Input
                id="name"
                type="text"
                placeholder="ادخل الاسم"
                label="اسم المسئول:"
                className='bg-white! border-2! border-Grey400! rounded-xl!'
                labelClassName='text-base text-primary'
                startIcon={<UserRound className='text-primary' />}
            />
            <CountryPhone
                inputClassName='bg-white!'
                labelClassName='text-base! text-primary!'
                placeholder={"رقم الجوال:"}
                defaultCountry="sa"
                showValidation={true}
                label={"رقم الجوال:"}
                className=' border-2! border-Grey400! rounded-xl!'
            />

            <div className='flex justify-end'>
                <Button className='border border-Grey600 text-primary bg-white! hover:bg-none text-base! hover:bg-Grey200! transition-all duration-300' icon={<ChevronLeft />}>الخطوة التالية</Button>
            </div>
        </form>
    )
}

export default BussinessAccountForm