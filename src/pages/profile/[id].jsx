import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Team } from '@/components/Team'
import { setupSupabase } from 'lib/auth-utils'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getBucketBaseURL, getPageData } from '../../../lib/utils'
import Select from 'react-select'

export default function Profile({ initialProfile, redirectToUserProfile }) {
  const { title } = getPageData()
  const [profile, setProfile] = useState(null)
  const [signedInEmail, setSignedInEmail] = useState(null)
  const [editing, setEditing] = useState(false)

  const loading = redirectToUserProfile || !profile

  const profileRoles =
    profile?.roles.trim().length > 0 ? profile?.roles.split(',') : []
  const roleOptions = Array.from(
    new Set([
      'Club Member',
      'Dropout',
      'To-Be Dropout',
      'Club Director',
      'Fund Director',
      'Fund General Partner',
      ...profileRoles,
    ])
  ).map((e) => ({ value: e, label: e }))

  if (redirectToUserProfile && signedInEmail) {
    window.open('/profile/' + signedInEmail, '_self')
  }

  useEffect(() => {
    const updateProfile = async () => {
      const newProfile = await (
        await fetch(
          `https://dropout.club/api/profile?email=${id}&signedIn=${
            id === signedInEmail ? 'true' : 'false'
          }`
        )
      ).json()
      setProfile(newProfile)
    }
    updateProfile()
  }, [setProfile, signedInEmail])
  useEffect(() => {
    const updateSignedInEmail = async () => {
      const supabase = setupSupabase()
      const { data } = await supabase.auth.getSession()
      const { session } = data
      const email = session?.user?.email
      setSignedInEmail(email)
    }
    updateSignedInEmail()
  }, [setSignedInEmail])
  const inputAdditionalClassName =
    ' block w-full ' +
    (editing ? 'border rounded-md px-3 py-1.5' : 'border-none bg-transparent')
  const inputOnChange = (key) => (e) => {
    setProfile({ ...profile, [key]: e.target.value })
  }
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <Container className="relative">
        {profile && (
          <div className="relative mt-12 flex min-h-full w-full justify-between rounded-2xl border py-8 shadow-md sm:px-6 lg:px-8">
            <div className="mr-8">
              <div className="relative h-64 w-64 overflow-hidden rounded-full">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              {editing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    id="photo"
                    name="photo"
                    className="hidden"
                    onChange={async (e) => {
                      const supabase = setupSupabase()
                      const file = e.target.files[0]
                      const ext = e.target.value.split('.').pop()
                      const filePath = `public/profiles/${btoa(
                        profile.email
                      )}-${new Date().getTime()}.${ext}`
                      await supabase.storage
                        .from('main')
                        .upload(filePath, file, {
                          cacheControl: 3600,
                          upsert: true,
                        })
                      setProfile({
                        ...profile,
                        photo: `${getBucketBaseURL()}/${filePath}`,
                      })
                    }}
                  />
                  <Button className="mt-6 w-full" small labelFor={'photo'}>
                    Upload New Photo
                  </Button>
                </>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                value={profile.name}
                disabled={!editing}
                className={`font-display text-3xl font-medium ${inputAdditionalClassName}`}
                onChange={inputOnChange('name')}
              />
              <div>
                {editing ? (
                  <Select
                    className="mt-3"
                    value={roleOptions.filter((e) =>
                      profileRoles.includes(e.value)
                    )}
                    isMulti
                    placeholder="Select Your Roles"
                    onChange={(e) => {
                      const newRoles = e
                      setProfile({
                        ...profile,
                        roles: newRoles.map((e) => e.value).join(','),
                      })
                    }}
                    options={roleOptions}
                  />
                ) : (
                  profileRoles.map((role) => (
                    <p
                      className={`mr-1.5 mt-1.5 inline-block rounded-md bg-gray-200 py-1 px-2.5 font-medium text-gray-800`}
                    >
                      {role}
                    </p>
                  ))
                )}
              </div>
              <div className="my-3 border-t border-b pb-3 pt-2.5">
                {[
                  {
                    label: 'Website',
                    id: 'website',
                    value: profile.website,
                    placeholder: 'https://example.com/',
                    href: profile.website,
                  },
                  {
                    label: 'LinkedIn URL',
                    id: 'linkedin',
                    value: profile.linkedin,
                    placeholder: 'https://linkedin.com/in/example',
                    href: profile.linkedin,
                  },
                  {
                    label: 'Twitter URL',
                    id: 'twitter',
                    value: profile.twitter,
                    placeholder: 'https://twitter.com/@example',
                    href: profile.twitter,
                  },
                ]
                  .filter((e) => (editing ? true : e.href.trim().length > 0))
                  .map((link, linkIx) => (
                    <div
                      key={linkIx}
                      className="mt-1 flex w-full items-center space-x-1 text-lg"
                    >
                      <p>{link.label}:</p>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={link.value}
                          placeholder={link.placeholder}
                          onClick={() => {
                            if (!editing && link.href.trim().length > 0) {
                              let href = link.href
                              if (
                                link.id === 'twitter' &&
                                !href.includes('twitter.com')
                              ) {
                                href = 'https://twitter.com/' + href
                              }
                              if (
                                link.id === 'linkedin' &&
                                !href.includes('linkedin.com')
                              ) {
                                href = 'https://linkedin.com/in/' + href
                              }
                              if (
                                !(
                                  href.startsWith('http://') ||
                                  href.startsWith('https://')
                                )
                              ) {
                                href = `https://${href}`
                              }
                              window.open(href, '_blank')
                            }
                          }}
                          onChange={inputOnChange(link.id)}
                          onFocus={(e) => {
                            if (!editing) e.target.blur()
                          }}
                          className={`${
                            link.href.trim().length > 0 && !editing
                              ? 'cursor-pointer text-blue-600 hover:text-blue-700 hover:underline focus:outline-none'
                              : ''
                          } font-medium ${inputAdditionalClassName}`}
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex w-full flex-col space-y-1 text-lg">
                <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                  A SHORT BIO:
                </p>
                {editing ? (
                  <textarea
                    type="text"
                    style={{
                      resize: editing ? 'vertical' : 'none',
                    }}
                    value={profile.bio}
                    onChange={inputOnChange('bio')}
                    placeholder={'(bio here)'}
                    onFocus={(e) => {
                      if (!editing) e.target.blur()
                    }}
                    className={inputAdditionalClassName}
                  />
                ) : (
                  <p className={inputAdditionalClassName}>{profile.bio}</p>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              {profile?.email === signedInEmail && (
                <Button
                  onClick={async () => {
                    if (editing) {
                      try {
                        await fetch('/api/profile?email=' + profile.email, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(profile),
                        })
                      } catch (err) {
                        alert(
                          'An error occurred updating your profile. Please reach out to team@dropout.club for support.'
                        )
                      }
                    }
                    setEditing(!editing)
                  }}
                  small
                >
                  {editing ? 'Save Edits' : 'Edit Profile'}
                </Button>
              )}
            </div>
          </div>
        )}
        {redirectToUserProfile && (
          <div>
            <h1 className="w-full py-24 text-center font-display text-3xl font-medium">
              Loading...
            </h1>
          </div>
        )}
      </Container>
      <Footer />
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { id } = params
  if (id === 'me')
    return {
      props: {
        redirectToUserProfile: true,
      },
    }
  const profile = await (
    await fetch('https://dropout.club/api/profile?email=' + id)
  ).json()
  if (!profile) {
    return {
      notFound: true,
    }
  } else {
    return {
      props: {
        initialProfile: profile,
        redirectToUserProfile: false,
      },
    }
  }
}
