import ClubLogo from '@/images/club-logo.png'
import FundLogo from '@/images/fund-logo.png'
import { FundHero, ClubHero } from '@/components/Hero'
import { Newsletter } from '@/components/Newsletter'
import { Pitch } from '@/components/Pitch'
import { Team } from '@/components/Team'
import { Links } from '@/components/Links'
import { CommunityHero } from '@/components/CommunityHero'

const dropoutfundDomain = 'dropoutfund.vc'
export const getFundURL = () => `https://${dropoutfundDomain}/`
export const pagesData = {
  fund: {
    title: 'DropoutFund – An Early-Stage VC Fund for Dropouts',
    logo: FundLogo,
    nav: {
      About: '#about',
      Team: '#team',
      Blog: '#blog',
      'Pitch To Us': '#pitch',
    },
    content: (
      <>
        <FundHero />
        <Team fund={true} />
        <Newsletter />
        <Pitch />
      </>
    ),
  },
  club: {
    title: "DropoutClub – The World's Community of Dropouts",
    logo: ClubLogo,
    nav: {
      Home: '/',
      Community: '/community',
      Fund: getFundURL(),
      Blog: '/#blog',
      Login: '/login',
      Apply: '/apply',
    },
    ctaKey: 'Apply',
    content: (
      <>
        <ClubHero />
        <Links />
        <Newsletter />
      </>
    ),
    signedIn: {
      nav: {
        Community: '/',
        Explore: '/#explore',
        Blog: '/#blog',
        Refer: '/refer',
        Logout: '/logout',
        'Your Profile': '/profile/me',
      },
      ctaKey: 'Your Profile',
      content: (
        <>
          <Links signedIn={true} />
          <Team signedIn={true} />
          <Newsletter />
        </>
      ),
    },
  },
}

export const getPageData = (signedIn = false) => {
  let pageId = process.env.PAGE_ID || 'club'
  if (typeof document === 'object') {
    if (document.domain !== 'localhost') {
      pageId = document.domain === dropoutfundDomain ? 'fund' : 'club'
    }
  }
  const pageData = pagesData[pageId]
  if (pageData.signedIn && signedIn) {
    pageData = { ...pageData, ...pageData.signedIn }
  }
  return { id: pageId, ...pageData }
}

export const colors = [
  'text-blue-700',
  'text-green-600',
  'text-purple-700',
  'text-orange-700',
  'text-red-700',
  'text-teal-700',
]
export const hoverColors = [
  'hover:bg-blue-100',
  'hover:bg-green-100',
  'hover:bg-purple-100',
  'hover:bg-orange-100',
  'hover:bg-red-100',
  'hover:bg-teal-100',
]

export const getTimeOfDay = () => {
  const hour = new Date().getHours() + 1
  if (hour > 4 && hour < 14) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}
export const getBucketBaseURL = () => {
  return 'https://nmyejppykabwavyvvpxe.supabase.co/storage/v1/object/public/main'
}
