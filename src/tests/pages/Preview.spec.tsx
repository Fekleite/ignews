import { render, screen, fireEvent } from "@testing-library/react"
import { mocked } from "ts-jest/utils"
import { getSession, useSession } from "next-auth/client"
import { useRouter } from "next/router"

import Post, { getStaticProps } from "../../pages/posts/preview/[slug]"
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: 'May, 10',
}

jest.mock("next-auth/client");
jest.mock("../../services/prismic");
jest.mock("next/router");

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])
    
    render(<Post post={post} />)
  
    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([{
      activeSubscription: 'fake-subscription',
    } as any, false])

    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()
    useRouterMocked.mockReturnValueOnce({ push: pushMock } as any)

    render(<Post post={post} />)
  
    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('loads initial data', async () => {
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

    const response = await getStaticProps({ params: { slug: 'my-new-post' } })
  
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