import { truncate } from 'lodash'
import { AnyObject } from 'tsdef'
import { ApolloError } from 'apollo-server-errors'
import { ErrorCodes2 } from '@M/KBF/resolvers/task.resolver'
import { toUpper } from 'ramda'


interface IExpectedError {
	details?: AnyObject | string
}

function makeCustomError (
	code: ErrorCodes, defaultMessage: string, defaultDetails?: AnyObject | string
) {
	
	return class ExpectedError extends ApolloError implements IExpectedError {
		
		public details?: AnyObject | string
		
		constructor (message?: string, details?: AnyObject | string) {
			
			super (message ?? defaultMessage, code)
			this.details = details ?? defaultDetails
			
		}
		
	}
	
}

enum ErrorCodes {
	'VALIDATION_ERROR' = 'VALIDATION_ERROR',
	'NOT_FOUND' = 'NOT_FOUND',
	'UNATHORIZED' = 'UNATHORIZED'
}

const Errors = {
	Validation: makeCustomError (ErrorCodes.VALIDATION_ERROR, 'Unspecified validation error'),
	NotFound: makeCustomError (ErrorCodes.NOT_FOUND, 'Object not found'),
	Unathorized: makeCustomError (ErrorCodes.UNATHORIZED, 'Unathorized to perform requested action'),
	InvalidCredentials: makeCustomError (ErrorCodes.UNATHORIZED, 'Invalid credentials provided')
}

const userNotFoundError = (id: string) =>
	new Errors.NotFound (`User ${truncate (id, { length: 10 })} not found`)

export default Errors
export { ErrorCodes2, userNotFoundError, makeCustomError, IExpectedError }
export const NotFoundByIDError = (name: string, id: string) => new ApolloError (`${toUpper(name)} ${truncate (id, {
		length: 10
	})} was not found`,
	ErrorCodes2.NOT_FOUND, {
		providedID: id
	})
