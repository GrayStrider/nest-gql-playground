import { GraphQLError } from 'graphql'
import { AnyObject } from 'tsdef'
import { ErrorCodes2, IExpectedError } from '@/common/errors'

const isExpectedError = (err: AnyObject) =>
	Object.keys (ErrorCodes2).includes (err.extensions?.code)

export default function ExpectedError (err: GraphQLError<IExpectedError>) {
	
	if (isExpectedError (err)) {
		
		const { details } = err.extensions?.exception
		const res: AnyObject = { message: err.message }
		
		if (Boolean (details)) res.details = details
		return res as GraphQLError
		
	}
	return err
	
}

