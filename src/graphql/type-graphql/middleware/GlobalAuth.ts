import { MiddlewareFn } from 'type-graphql'
import { isNotNil } from 'ramda-adjunct'
import { HOST, PORT } from '@config'
import Errors from '@/common/errors'

const publicFields = ['register', 'login']

const globalAuth: MiddlewareFn<any> =
	async function ({ context, args, info, root }, next) {
		
		const { session, request: { headers, host } } = context
		const isAllowedOperation = publicFields.includes (info.fieldName)
		const unathorized = new Errors.Unathorized ('Please log in or register to proceed')
		if (!session) throw unathorized
		const isPresentSessionID = isNotNil (session.userId)
		const isInternalCall = headers.authorization === 'internal_call' && host === `${HOST}:${PORT}`
		
		if (isPresentSessionID || isAllowedOperation || isInternalCall) return next ()
		throw unathorized
		
	}

export default globalAuth
