import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import Link from 'next/link'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { getPageData } from 'lib/utils'
import { setupSupabase } from 'lib/auth-utils'

export function LinkButton({ active, href, className, cta, ...props }) {
  className = clsx(
    'whitespace-pre inline-flex justify-center ml-2 py-1.5 px-3.5 rounded-md text-base uppercase font-medium tracking-wide focus:outline-none',
    cta
      ? 'bg-gray-800 text-gray-100 hover:text-gray-100 hover:bg-gray-900'
      : active
      ? 'bg-gray-100 text-gray-700'
      : 'text-gray-500 hover:text-gray-700',
    className
  )

  return href ? (
    <Link href={href} className={className} {...props} />
  ) : (
    <button className={className} {...props} />
  )
}
export function Header() {
  const [signedIn, setSignedIn] = useState(false)
  const [authToken, setAuthToken] = useState(null)
  const [activeLabel, setActiveLabel] = useState(null)

  const { nav, ctaKey } = getPageData(signedIn)
  const keys = Object.keys(nav)
  const pathKeysMap = {
    '/': keys[0],
    '/login': 'Login',
    '/community': 'Community',
    '/apply': 'Apply',
    '/refer': 'Refer',
    '/logout': 'Logout',
  }

  useEffect(() => {
    const supabase = setupSupabase()
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token) {
        setSignedIn(true)
        setAuthToken(session?.access_token)
      }
    })
  }, [setSignedIn, setAuthToken])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // add in active label for hash
    for (const key of keys) {
      const hash = window.location.hash.slice(1).toLowerCase()
      const keyFirstWord = key.split(' ')[0].toLowerCase()
      if (hash === keyFirstWord) {
        if (activeLabel !== key) setActiveLabel(key)
        return
      }
    }

    // add in active label for pathname
    const path =
      '/' +
      window.location.pathname.split('/').join(' ').trim().split(' ').join('/')
    const pathKey = pathKeysMap[path]
    if (pathKey) {
      if (activeLabel !== pathKey) setActiveLabel(pathKey)
      return
    }
  }, [setActiveLabel, activeLabel])

  return (
    <header
      className="relative sticky top-0 z-50 border-b py-6"
      style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container className="flex flex-wrap items-center justify-center sm:justify-between lg:flex-nowrap">
        <div className="lg:grow lg:basis-0">
          <Logo className="h-10 w-auto text-slate-900 sm:h-12" />
        </div>
        <div className="hidden sm:mt-10 sm:flex lg:mt-0 lg:grow lg:basis-0 lg:justify-end">
          {keys.map((label, labelIdx) => (
            <LinkButton
              href={nav[label]}
              onClick={() => setTimeout(() => setActiveLabel(label), 200)}
              active={activeLabel === label}
              cta={label === ctaKey}
            >
              {label}
            </LinkButton>
          ))}
        </div>
      </Container>
    </header>
  )
}
