import { render, screen, } from "@testing-library/react"
import { mocked } from "ts-jest/utils"
import { getSession } from "next-auth/client"

import Post, { getServerSideProps } from "../../pages/posts/[slug]"
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: 'May, 10',
}

jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)
  
    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
  })

  it('redirects user to preview post if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/my-new-post'
        })
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription:  'fake-active-subscription'
    } as any)

    const getPrismicClientMocked = mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My New Post' }],
          content: [{ type: 'paragraph', text: 'Post content' }]
        },
        last_publication_date: '04-01-2021'
      })
    } as any)

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)
  
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post content</p>',
            updatedAt: '01 de abril de 2021',
          }
        }
      })
    )
  })
})