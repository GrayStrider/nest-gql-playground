import WrapperLike from '@M/db/utils/wrapper.like'

describe ('likeWrapper', () => {
	it ('should wrap string in like expression', async () => {
		expect.assertions (1)
		expect (WrapperLike ({ foo: 'bar' }, 'foo'))
			.toMatchSnapshot ()
	})
})
