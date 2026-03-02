import { HeaderPage } from '@/app/(components)/template/HeaderPage'
import { getTranslations } from 'next-intl/server'; 
import MyBookingsCard from '../components/MyBookingsCard';
import ReferralCard from '../components/ReferralCard'; 
import PersonalInformation from '../components/PersonalInformation';
import SettingsCard from '../components/SettingsCard';
import ProfileHeader from '../components/ProfileHeader';
import ProfileActionCards from '../components/ProfileActionCards';


const page = async ({ params }: { params: { locale: string } }) => {
    const { locale } = await params;
    const tCommon = await getTranslations('common');

    return (
        <div>
            <HeaderPage
                imageSrc="/shared/bgHeader.png"
                imageAlt="profile"
                backButtonHref="/"
                breadcrumbItems={[
                    {
                        label: tCommon('home'),
                        href: '/',
                    },
                    {
                        label: tCommon('profile'),
                        href: '/profile',
                        isCurrentPage: true,
                    },
                ]}
                locale={locale}
            />
     
            <div className="container-custom mt-4 md:mt-[60px] px-4 md:px-0">
                <div className="grid grid-cols-12 gap-4 md:gap-[40px]">
                    {/* Left Column - Profile Header & Action Cards */}
                    <div className="col-span-12 md:col-span-4 md:col-start-2 md:sticky md:top-[100px] md:self-start">
                        <div className="space-y-4 md:space-y-0">
                            <ProfileHeader />
                            <div className="mt-4 md:mt-4">
                                <ProfileActionCards />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Information Cards */}
                    <div className="col-span-12 md:col-span-6">
                        <div className="space-y-4 md:space-y-[24px]">
                            <ReferralCard />
                            <MyBookingsCard />  
                            <PersonalInformation />
                            <SettingsCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page